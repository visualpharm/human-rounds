// dni-scan.js — PHOTO-FIRST DNI (+ obra social) scanner for the patient intake.
//
// Patients fill the waiting-room form on their OWN phone. Live video decoding of
// the dense DNI PDF417 proved unreliable (it can't hold focus on the dense code,
// and on plain-HTTP LAN access getUserMedia is blocked entirely) — so the primary
// path is now: take/upload a STILL PHOTO of the DNI and decode from that. Tiers:
//   Tier 1  PDF417/QR from the photo via zxing-wasm  (deterministic, free)
//   Tier 2  vision LLM OCR via POST /api/ocr-dni      (Gemini Flash; cheap)
// Live camera is still available as an opt-in for users on an https origin.
//
// To avoid forking logic we reuse, byte-for-byte: the SAME parsers the extension
// uses (window.SanaDni / window.SanaOs, /shared/*) and the SAME vendored
// zxing-wasm decoder (/vendor/*). Parsing/decoding here is identical to
// extension/scan.js; only the UI and control flow differ.
import {
  readBarcodes,
  readBarcodesFromImageData,
  setZXingModuleOverrides
} from '/vendor/zxing-wasm/es/reader/index.js';
import { el } from '/web/lib/api.js';

setZXingModuleOverrides({
  locateFile: (path, prefix) =>
    path.endsWith('.wasm') ? '/vendor/zxing-wasm/zxing_reader.wasm' : (prefix || '') + path
});

const DECODE_FPS = 3; // PDF417-from-video is CPU-heavy; multi-pass each tick.
const BINARIZERS = ['LocalAverage', 'GlobalHistogram'];
const OCR_MAX_DIM = 2000; // cap the long edge before sending to the vision model
const decodeOpts = (binarizer) => ({
  formats: ['PDF417', 'QRCode'],
  tryHarder: true,
  tryRotate: true,
  tryInvert: true,
  tryDownscale: true,
  tryDenoise: true,
  binarizer: binarizer || 'LocalAverage',
  maxNumberOfSymbols: 1
});

// Route a decoded string by content: DNI first (primary — only it carries sexo +
// DOB), then obra social. Mirrors extension/scan.js:handleRaw.
function route(raw) {
  const dni = window.SanaDni && window.SanaDni.parseDniPdf417(raw);
  if (dni && dni.valid) return { kind: 'dni', patient: dni.patient, warnings: dni.warnings || [] };
  const os = window.SanaOs && window.SanaOs.parseOsCredential(raw);
  if (os && os.valid) return { kind: 'os', coverage: os.coverage, provider: os.provider, warnings: os.warnings || [] };
  return { kind: null };
}

// Learning corpus: persist EVERY decoded payload — recognized or not — like the
// desk scanner's storeRawCode does. The phone is where the unknown formats
// (digital-DNI QR screenshots, licencia variants) actually show up; without this
// they decoded, failed to parse, and were lost. Best-effort, never blocks a scan.
const postedCodes = new Set();
function postRawCode(raw, r) {
  if (!raw || postedCodes.has(raw)) return;
  postedCodes.add(raw);
  const kind = r.kind === 'dni' ? 'dni' : r.kind === 'os' ? 'obra_social' : 'desconocido';
  const dni = r.kind === 'dni' ? r.patient.dni
    : (r.kind === 'os' && r.coverage ? r.coverage.dni : null);
  try {
    fetch('/api/codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw, kind, dni: dni || null, source: 'phone-web' })
    }).catch(() => {});
  } catch (_) { /* offline / old server — the scan itself must never block */ }
}

/*
 * Render the scanner into `container`.
 * Calls onResult({ patient, coverage, warnings }) once a DNI is captured (photo,
 * live camera, or AI OCR), or onManual() if the patient opts to type instead.
 * Returns { stop } so the caller can tear it down on navigation.
 */
export function renderDniScanner(container, { onResult, onManual }) {
  const video = el('video', { autoplay: '', playsinline: '', class: 'scan-video' });
  video.muted = true; // must be a property for autoplay on mobile
  const canvas = el('canvas', { hidden: '' });
  const status = el('p', { class: 'scan-status muted' }, 'Sacale una foto al frente o al dorso del DNI.');
  const fileInput = el('input', { type: 'file', accept: 'image/*', id: 'dni-file', hidden: '' });

  const record = { patient: null, coverage: null, warnings: [] };
  let stream = null;
  let timer = null;
  let busy = false;
  let done = false;
  const cameraAvailable = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  const stage = el('div', { class: 'scan-stage', hidden: '' }, // hidden until live mode
    video,
    el('div', { class: 'scan-guide' }, el('span', {}, 'Encuadrá el código de barras del dorso')));

  const photoBtn = el('button', { class: 'btn block big', type: 'button', onclick: () => fileInput.click() },
    '📷 Tomar foto del DNI');
  // Live camera is opt-in (only meaningful where getUserMedia is allowed).
  const liveLink = cameraAvailable
    ? el('button', { class: 'btn ghost', type: 'button', onclick: () => startLive() }, 'o escanear en vivo')
    : null;
  const manualBtn = el('button', { class: 'btn secondary', type: 'button', onclick: () => { stop(); onManual(); } },
    'Cargar mis datos a mano');

  const box = el('div', { class: 'card' },
    el('h2', {}, 'Escaneá tu DNI'),
    el('p', { class: 'muted' }, 'Tomá una foto nítida del DNI (con buena luz, sin reflejos). ' +
      'Leemos el código y, si no se ve, los datos impresos.'),
    stage,
    status,
    canvas,
    fileInput,
    el('div', { class: 'scan-actions' }, photoBtn, ...(liveLink ? [liveLink] : []), manualBtn));
  container.appendChild(box);

  function stop() {
    // Every stop() means the scan session is over — also block any late
    // finish(): a Tier-2 OCR response landing after the user moved on (e.g. to
    // manual entry) must not fire onResult and re-render over their typing.
    done = true;
    if (timer) { clearInterval(timer); timer = null; }
    if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
  }

  function finish() {
    if (done) return;
    done = true;
    stop();
    onResult({ patient: record.patient, coverage: record.coverage, warnings: record.warnings });
  }

  // A decoded barcode string -> patient/coverage. Returns true if it advanced us.
  function ingest(raw) {
    const r = route(raw);
    postRawCode(raw, r);
    if (r.kind === 'dni') {
      record.patient = r.patient;
      record.warnings = record.warnings.concat(r.warnings);
      status.textContent = 'DNI leído ✓';
      finish();
      return true;
    }
    if (r.kind === 'os') {
      if (!record.coverage) {
        record.coverage = r.coverage;
        record.warnings = record.warnings.concat(r.warnings);
      }
      if (record.patient) { finish(); return true; }
      status.textContent = 'Credencial leída ✓. Ahora sacale una foto al DNI…';
      return true;
    }
    return false;
  }

  // --- camera frames (live opt-in) ---
  function regionImageData(sx, sy, sw, sh, scale) {
    canvas.width = Math.round(sw * scale);
    canvas.height = Math.round(sh * scale);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  function candidates(vw, vh) {
    const cw = Math.round(vw * 0.86);
    const ch = Math.round(vh * 0.66);
    return [
      regionImageData(0, 0, vw, vh, 1),
      regionImageData(Math.round((vw - cw) / 2), Math.round((vh - ch) / 2), cw, ch, 1.6)
    ];
  }

  let pass = 0;
  async function tick() {
    if (busy || done || !video.videoWidth) return;
    busy = true;
    try {
      const exhaustive = pass++ % 2 === 1;
      const bins = exhaustive ? BINARIZERS : [BINARIZERS[0]];
      for (const img of candidates(video.videoWidth, video.videoHeight)) {
        for (const bin of bins) {
          const res = await readBarcodesFromImageData(img, decodeOpts(bin));
          if (res && res.length && res[0].text && ingest(res[0].text)) return;
        }
      }
    } catch (_) {
      /* transient decode error; keep scanning */
    } finally {
      busy = false;
    }
  }

  async function startLive() {
    if (!cameraAvailable) return;
    stage.hidden = false;
    status.textContent = 'Iniciando cámara…';
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      video.srcObject = stream;
      await video.play();
      const track = stream.getVideoTracks()[0];
      const caps = track.getCapabilities ? track.getCapabilities() : {};
      if (caps.focusMode && caps.focusMode.includes('continuous')) {
        try { await track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] }); } catch (_) {}
      }
      status.textContent = 'Buscando el código del DNI… (si no enfoca, sacale una foto)';
      timer = setInterval(tick, Math.round(1000 / DECODE_FPS));
    } catch (err) {
      stage.hidden = true;
      status.textContent = 'No se pudo abrir la cámara (' + (err && err.name || 'error') +
        '). Mejor sacale una foto al DNI con el botón de arriba.';
    }
  }

  // --- still photo: Tier 1 (zxing) then Tier 2 (vision OCR) ---
  // Downscale a huge phone photo before posting to the model: caps payload/cost
  // while keeping text legible (long edge <= OCR_MAX_DIM).
  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, OCR_MAX_DIM / Math.max(img.width, img.height));
        if (scale >= 1) { // small enough: read the original bytes as-is
          const fr = new FileReader();
          fr.onload = () => resolve(fr.result);
          fr.onerror = reject;
          fr.readAsDataURL(file);
          return;
        }
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad image')); };
      img.src = url;
    });
  }

  async function ocrPhoto(file) {
    status.textContent = 'No leí el código. Probando leer los datos con IA…';
    try {
      const imageDataUrl = await fileToDataUrl(file);
      const res = await fetch('/api/ocr-dni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl })
      });
      const data = await res.json();
      if (data && data.patient && data.patient.dni) {
        record.patient = data.patient;
        record.warnings = record.warnings.concat(data.warnings || []);
        status.textContent = 'Datos leídos con IA ✓ — revisalos.';
        finish();
        return true;
      }
    } catch (_) { /* fall through to manual */ }
    return false;
  }

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    status.textContent = 'Leyendo la foto…';
    photoBtn.disabled = true;
    try {
      // Tier 1: barcode from the still.
      for (const bin of BINARIZERS) {
        const res = await readBarcodes(file, decodeOpts(bin));
        if (res && res.length && res[0].text && ingest(res[0].text)) return;
      }
      // Tier 2: vision OCR of the printed fields.
      if (await ocrPhoto(file)) return;
      status.textContent = 'No pude leer el DNI de la foto. Probá con más luz y sin reflejos, ' +
        'o cargá tus datos a mano.';
    } catch (e) {
      status.textContent = 'No se pudo leer la foto: ' + e.message;
    } finally {
      photoBtn.disabled = false;
      fileInput.value = '';
    }
  });

  return { stop };
}
