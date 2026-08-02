// intake.js — patient flow: identify by DNI, then answer the adaptive
// questionnaire (typing or voice), then submit.
import { getJSON, postJSON, el, toast } from '/web/lib/api.js';
import { createMicSession, voiceSupported } from '/web/lib/voice.js';
import { renderDniScanner } from '/web/lib/dni-scan.js';

const token = location.pathname.split('/').pop();
const app = document.getElementById('app');
const answers = {};
let spec = null;
let patient = { dni: '', sexo: null, apellido: '', nombres: '', fechaNacimientoIso: null, cuil: null, raw: null };
let scanWarnings = [];
let intakeId = null;            // set after first submit; a return visit UPDATES it

// The flow has two question phases: symptom questions (asked first, before
// identity) and "profile" / common fields — medication, allergies, family
// history — which are stable across visits and asked AFTER the DNI step so we
// can recall them. `currentSections` is whatever phase the form is drawing now.
let currentSections = [];
let recalledProfile = null;     // common fields fetched from the server for this DNI
let hadRecall = false;          // did we pre-fill any common field from storage?
const symptomSections = () => spec.questionnaire.sections.filter((s) => !s.profile);
const profileSections = () => spec.questionnaire.sections.filter((s) => s.profile);
function profileQuestionIds() {
  const ids = [];
  for (const s of profileSections()) for (const q of s.questions) ids.push(q.id);
  return ids;
}

// ---- debug flag -------------------------------------------------------------
// A plain code variable (not a user-editable setting): flip to true here, or
// append ?debug=1 to the URL, to surface the cost breakdown + console traces.
const DEBUG = false || /[?&]debug=1/.test(location.search);

// ---- voice API cost meter ---------------------------------------------------
// Small grayish status-bar label that tallies what the voice pipeline costs:
// speech-to-text (per second of audio, estimated) + the AI prefill (real cost
// reported by OpenRouter). Prototype estimate — adjust the rate to your provider.
const RATE = { transcribeUsdPerSec: 0.0001 };   // ≈ US$0.006 / min of audio (estimate)
const cost = { usd: 0, items: [] };
function addCost(label, usd) {
  if (!usd || usd < 0) usd = Number(usd) || 0;
  cost.usd += usd;
  cost.items.push({ label, usd });
  if (DEBUG) console.log(`[cost] ${label}: $${usd.toFixed(5)} (total $${cost.usd.toFixed(5)})`);
  renderCost();
}
function fmtUsd(n) { return n >= 0.01 ? `US$${n.toFixed(2)}` : `US$${n.toFixed(4)}`; }
function renderCost() {
  let bar = document.getElementById('costbar');
  if (!bar) { bar = el('div', { id: 'costbar', class: 'costbar' }); document.body.appendChild(bar); }
  const base = `Voz: ${fmtUsd(cost.usd)}`;
  bar.textContent = DEBUG
    ? base + ' · ' + cost.items.map((i) => `${i.label} ${fmtUsd(i.usd)}`).join(' · ')
    : base;
  bar.hidden = cost.usd <= 0 && !DEBUG;
}

// ---- voice -> prefill the rest of the questionnaire -------------------------
let prefillDone = false;   // one paid prefill per visit; manual edits after that
// The "narrative" field is the first open text question that allows voice — the
// patient tells their story there, and we infer the structured answers from it.
function narrativeQuestionId() {
  for (const s of spec.questionnaire.sections)
    for (const q of s.questions)
      if (q.type === 'text' && q.voice) return q.id;
  return null;
}
async function runPrefill(narrative, form) {
  if (!narrative || narrative.trim().length < 8) return;
  let res;
  try { res = await postJSON('/api/prefill', { token, narrative, answers }); }
  catch { return; }
  if (res && typeof res.costUsd === 'number') addCost('Análisis', res.costUsd);
  const proposed = (res && res.answers) || {};
  let filled = 0;
  for (const [id, v] of Object.entries(proposed)) {
    const cur = answers[id];
    const blank = cur == null || cur === '' || (Array.isArray(cur) && cur.length === 0);
    if (blank) { answers[id] = v; filled++; }     // never overwrite a patient's choice
  }
  if (DEBUG) console.log('[prefill] proposed', proposed, '-> filled', filled);
  if (filled) {
    saveDraft();
    if (form && form.isConnected) drawForm(form);
    toast(`Completamos ${filled} respuesta${filled > 1 ? 's' : ''} con lo que contaste — revisalas`);
  }
}

// ---- Draft persistence (localStorage, keyed per QR / doctor) ----------------
// The token in the URL is the consultorio/doctor, so answers are stored per QR.
// Close the browser and come back to the same QR → answers restored, and editing
// + re-sending UPDATES the same intake instead of creating a duplicate.
const DRAFT_KEY = `sana:draft:${token}`;
function saveDraft() {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ patient, answers, intakeId, at: Date.now() })); }
  catch { /* private mode / quota — ignore */ }
}
function loadDraft() {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (!d) return false;
    if (d.answers) Object.assign(answers, d.answers);
    if (d.patient) patient = { ...patient, ...d.patient };
    if (d.intakeId) intakeId = d.intakeId;
    return Object.keys(answers).length > 0;
  } catch { return false; }
}

const arr = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);
const intersect = (a, b) => a.some((x) => b.includes(x));

function condMet(cond) {
  if (!cond) return true;
  const v = answers[cond.q];
  if ('equals' in cond) return v === cond.equals;
  if ('in' in cond) return intersect(arr(v), cond.in);
  if ('truthy' in cond) return !!v;
  return true;
}

async function boot() {
  const meta = await getJSON(`/api/queues/${token}`);
  document.getElementById('qlabel').textContent = meta.label || '';
  spec = await getJSON(`/api/specialties/${meta.specialty}/questionnaire`);
  const restored = loadDraft();
  // Symptoms first — people come to say WHAT happened; identity is the last step.
  renderQuestionnaire();
  if (restored) toast('Recuperamos tus respuestas anteriores');
}

// ---- Phase 1: identity ----------------------------------------------------
// Two ways in: scan the DNI with the phone camera (auto-fills everything), or
// type the number by hand. Both land on the same confirm screen.
function renderIdentity() {
  app.innerHTML = '';
  const dni = el('input', { type: 'text', inputmode: 'numeric', placeholder: 'Ej: 13452513', id: 'dni' });
  const box = el('div', { class: 'card' },
    el('h2', {}, 'Último paso: identificate'),
    el('p', { class: 'muted' }, 'Para que el médico sepa quién sos. Escaneá tu DNI o ingresá el número a mano.'),
    el('button', { class: 'btn block big', id: 'scan-dni', onclick: startScan }, '📷 Escanear mi DNI'),
    el('div', { class: 'or-sep' }, 'o ingresá el número'),
    el('label', { class: 'q' }, 'Número de DNI'),
    dni,
    el('div', { style: 'height:14px' }),
    el('button', { class: 'btn block secondary', onclick: () => lookup(dni.value) }, 'Continuar')
  );
  app.appendChild(box);
}

function startScan() {
  app.innerHTML = '';
  renderDniScanner(app, {
    onManual: renderIdentity,
    onResult: ({ patient: p, coverage, warnings }) => {
      if (p) {
        patient.dni = p.dni;
        patient.sexo = p.sexo || null;
        patient.apellido = p.apellido || '';
        patient.nombres = p.nombres || '';
        patient.fechaNacimientoIso = p.fechaNacimientoIso || null;
        patient.cuil = p.cuil || null;
        patient.raw = p.raw || null;
      }
      if (coverage) patient.coverage = coverage; // optional; receptionist loads it in HSI
      scanWarnings = warnings || [];
      // Always show the confirm screen: barcode names drop accents/ñ, so the
      // patient verifies before continuing. The scan gives sexo + DOB, so this
      // is the full confirm form (not the minimal name+age ask).
      renderIdentityDetails({ minimal: false });
    }
  });
}

async function lookup(value) {
  const dni = String(value || '').replace(/\D/g, '');
  if (dni.length < 6) return toast('Revisá el número de DNI');
  patient.dni = dni;
  let res = { found: false };
  try { res = await postJSON('/api/patients/lookup', { dni }); } catch {}
  recalledProfile = (res && res.profile) || null;   // common fields to pre-fill later
  if (res.found) {
    // Found in the patient DB → carry name/age/details to the doctor and don't
    // ask the patient their identity again. Still show the common fields next.
    Object.assign(patient, {
      sexo: res.patient.sexo, apellido: res.patient.apellido, nombres: res.patient.nombres,
      fechaNacimientoIso: res.patient.fechaNacimientoIso
    });
    if (patient.sexo && patient.fechaNacimientoIso) return afterIdentity();
  }
  // Not on file (or incomplete) → ask only the name and age. Sex is presumed
  // from the name; the date of birth is derived from the age.
  renderIdentityDetails({ minimal: true });
}

function renderIdentityDetails({ minimal = false } = {}) {
  app.innerHTML = '';

  // Minimal ask (typed DNI, not on file): just name + age. Nothing more — sex is
  // presumed from the name, the DOB is derived from the age.
  if (minimal) {
    const fullName = [patient.nombres, patient.apellido].filter(Boolean).join(' ');
    const nameInp = el('input', { type: 'text', placeholder: 'Nombre y apellido', value: fullName });
    const ageInp = el('input', { type: 'number', inputmode: 'numeric', min: '0', max: '120',
      placeholder: 'Edad', value: ageFromIso(patient.fechaNacimientoIso) ?? '' });
    app.appendChild(el('div', { class: 'card' },
      el('h2', {}, 'Tus datos'),
      el('p', { class: 'muted' }, 'Decinos tu nombre y tu edad. Nada más.'),
      el('label', { class: 'q' }, 'Nombre y apellido'), nameInp,
      el('div', { style: 'height:12px' }),
      el('label', { class: 'q' }, 'Edad'), ageInp,
      el('div', { style: 'height:16px' }),
      el('button', { class: 'btn block big', onclick: () => {
        const name = nameInp.value.trim().replace(/\s+/g, ' ');
        const age = Number(ageInp.value);
        if (name.split(' ').length < 1 || !name) return toast('Escribí tu nombre');
        if (!Number.isFinite(age) || age <= 0 || age > 120) return toast('Revisá la edad');
        const parts = name.split(' ');
        // AR convention "Nombre(s) Apellido": last token is the surname.
        patient.apellido = (parts.length > 1 ? parts.pop() : '').toUpperCase();
        patient.nombres = parts.join(' ').toUpperCase();
        patient.sexo = guessSexFromName(patient.nombres);
        patient.fechaNacimientoIso = isoFromAge(age);
        afterIdentity();
      } }, 'Continuar →')
    ));
    return;
  }

  const ape = el('input', { type: 'text', placeholder: 'Apellido', value: patient.apellido || '' });
  const nom = el('input', { type: 'text', placeholder: 'Nombres', value: patient.nombres || '' });
  const dob = el('input', { type: 'text', inputmode: 'numeric', placeholder: 'dd/mm/aaaa',
    value: isoToArg(patient.fechaNacimientoIso) });
  const dobHint = el('p', { class: 'muted small', style: 'margin:4px 0 0' }, DATE_HINT);
  let sexo = patient.sexo;
  const chips = ['F', 'M', 'X'].map((s) =>
    el('button', { class: 'opt' + (sexo === s ? ' sel' : ''), onclick: (e) => {
      sexo = s; document.querySelectorAll('#sexrow .opt').forEach((c) => c.classList.remove('sel'));
      e.target.classList.add('sel');
    } }, s === 'F' ? 'Femenino' : s === 'M' ? 'Masculino' : 'X'));
  const note = scanWarnings.length
    ? el('p', { class: 'muted', style: 'color:var(--amarillo)' },
        '⚠ Revisá nombre y apellido (los acentos no viajan en el código del DNI).')
    : null;
  app.appendChild(el('div', { class: 'card' },
    el('h2', {}, 'Tus datos'),
    el('p', { class: 'muted' }, scanWarnings.length
      ? 'Escaneamos tu DNI. Confirmá que esté todo bien.'
      : 'Completá para que el médico te identifique.'),
    note,
    el('label', { class: 'q' }, 'Apellido'), ape,
    el('div', { style: 'height:10px' }),
    el('label', { class: 'q' }, 'Nombres'), nom,
    el('div', { style: 'height:10px' }),
    el('label', { class: 'q' }, 'Sexo'), el('div', { class: 'opts', id: 'sexrow' }, ...chips),
    el('div', { style: 'height:10px' }),
    el('label', { class: 'q' }, 'Fecha de nacimiento'), dob, dobHint,
    el('div', { style: 'height:16px' }),
    el('button', { class: 'btn block big', onclick: () => {
      patient.apellido = ape.value.trim().toUpperCase();
      patient.nombres = nom.value.trim().toUpperCase();
      patient.sexo = sexo;
      const dobRaw = dob.value.trim();
      if (dobRaw) {
        const iso = argToIso(dobRaw);
        if (!iso) { dob.focus(); return toast('No entendí la fecha. ' + DATE_HINT); }
        patient.fechaNacimientoIso = iso;
        dob.value = isoToArg(iso);
      } else {
        patient.fechaNacimientoIso = null;
      }
      if (!patient.sexo) return toast('Elegí el sexo');
      afterIdentity();
    } }, 'Continuar →')
  ));
}

// ---- Phase 3: common fields (medication + family history) -----------------
// Stable patient background. Shown AFTER identity so we can recall it from the
// patient's stored profile (server + localStorage) and the patient just confirms
// or updates, instead of re-typing it every visit.
const profileKey = (dni) => `sana:profile:${String(dni || '').replace(/\D/g, '')}`;
function loadProfileLocal(dni) {
  try { const d = JSON.parse(localStorage.getItem(profileKey(dni)) || 'null'); return (d && d.profile) || null; }
  catch { return null; }
}
function saveProfileLocal() {
  const profile = {};
  for (const id of profileQuestionIds()) if (answers[id] != null) profile[id] = answers[id];
  try { localStorage.setItem(profileKey(patient.dni), JSON.stringify({ profile, at: Date.now() })); }
  catch { /* private mode / quota — ignore */ }
}
// Merge stored common fields into any blank answer (never overwrite a fresh one).
function recallProfile() {
  const merged = { ...(loadProfileLocal(patient.dni) || {}), ...(recalledProfile || {}) }; // server wins
  hadRecall = false;
  for (const id of profileQuestionIds()) {
    const v = merged[id];
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) continue;
    hadRecall = true;
    const cur = answers[id];
    if (cur == null || cur === '' || (Array.isArray(cur) && cur.length === 0)) answers[id] = v;
  }
}

async function afterIdentity() {
  // Make sure we have the recalled common fields even on the scan path (which
  // doesn't hit /lookup). One cheap call; failures degrade to "ask from blank".
  if (recalledProfile == null && patient.dni) {
    try { const r = await postJSON('/api/patients/lookup', { dni: patient.dni }); recalledProfile = (r && r.profile) || null; }
    catch {}
  }
  recallProfile();
  saveDraft();
  renderCommonFields();
}

function renderCommonFields() {
  app.innerHTML = '';
  currentSections = profileSections();
  app.appendChild(el('h2', { style: 'margin:2px 0 6px' }, 'Datos de salud'));
  app.appendChild(el('p', { class: 'muted' }, hadRecall
    ? 'Esto es lo que recordamos de tu última visita. Revisalo y actualizá si cambió algo.'
    : 'Un par de datos que el médico necesita. La próxima vez los recordamos por vos.'));
  const form = el('div', { id: 'form' });
  app.appendChild(form);
  const actions = el('div', { class: 'form-actions' },
    el('button', { class: 'btn big', id: 'send', onclick: () => { saveProfileLocal(); submit(); } }, 'Enviar al médico'));
  app.appendChild(actions);
  drawForm(form);
}

// ---- Phase 1: questionnaire (symptoms first) ------------------------------
function renderQuestionnaire() {
  app.innerHTML = '';
  currentSections = symptomSections();   // phase 1: symptoms only (common fields come after DNI)
  app.appendChild(el('h2', { style: 'margin:2px 0 6px' }, 'Contanos qué te pasa'));
  if (spec.questionnaire.intro) app.appendChild(el('p', { class: 'muted' }, spec.questionnaire.intro));
  const form = el('div', { id: 'form' });
  app.appendChild(form);
  const actions = el('div', { class: 'form-actions' },
    el('button', { class: 'btn big', id: 'send', onclick: proceedToIdentity }, 'Continuar →'));
  app.appendChild(actions);
  drawForm(form);
}

// Require a chief complaint before moving to identity, then hand off to it.
function proceedToIdentity() {
  const m = answers.motivo_principal;
  const t = answers.motivo_texto;
  const hasComplaint = (Array.isArray(m) ? m.length : !!m) || (t && t.trim());
  if (!hasComplaint) return toast('Contanos primero qué te trae hoy');
  renderIdentity();
}

function drawForm(form) {
  form.innerHTML = '';
  for (const section of currentSections) {
    if (!condMet(section.showIf)) continue;
    const visibleQs = section.questions.filter((q) => condMet(q.showIf));
    if (!visibleQs.length) continue;
    const card = el('div', { class: 'card', style: 'margin-bottom:14px' });
    // One title per card. A single-question section uses the question itself as
    // the heading (no separate category line that just doubles it). A multi-
    // question section keeps the category as a small muted eyebrow, so the bold
    // titles are the actual questions, not a repeated category.
    const single = visibleQs.length === 1;
    if (!single) card.appendChild(el('div', { class: 'section-cat' }, section.title));
    for (const q of visibleQs) card.appendChild(renderQuestion(q, form, { asTitle: single }));
    form.appendChild(card);
  }
}

function renderQuestion(q, form, { asTitle = false } = {}) {
  const wrap = el('div', { style: asTitle ? 'margin:0' : 'margin:6px 0 16px' });
  wrap.appendChild(el('label', { class: asTitle ? 'q q-title' : 'q' }, q.prompt));
  const rerender = () => { saveDraft(); drawForm(form); };

  if (q.type === 'text') {
    const canVoice = q.voice && voiceSupported();
    const ta = el('textarea', { placeholder: 'Escribí tu respuesta…' });
    ta.value = answers[q.id] || '';
    ta.addEventListener('input', () => { answers[q.id] = ta.value; saveDraft(); });
    if (!canVoice) { wrap.appendChild(ta); return wrap; }

    // Two ways to answer, offered side by side: a big "Responder con voz" mic
    // button OR the textarea. Picking one expands it full width and hides the
    // other (mode on the container drives visibility via CSS). Voice transcribes
    // into the same textarea, so the result is reviewable in text mode.
    const choose = el('div', { class: 'answer' });

    const mic = el('button', { class: 'voice-pick', type: 'button' },
      el('span', { class: 'mic-ic', 'aria-hidden': 'true',
        html: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/></svg>' }),
      el('span', {}, 'Responder con voz'));
    const sep = el('div', { class: 'answer-or' }, 'o escribí');
    const taWrap = el('div', { class: 'answer-type' }, ta);
    const switchVoice = el('button', { class: 'answer-switch', type: 'button' }, 'Responder con voz');

    // Recording panel — shown INSTEAD of the options while grabbing. Pulsing dot
    // + live timer.
    const dot = el('span', { class: 'rec-dot' });
    const recLabel = el('div', { class: 'rec-label' }, 'Grabando…');
    const recTimer = el('span', { class: 'rec-timer' }, '0:00');
    const stopBtn = el('button', { class: 'btn secondary', type: 'button' }, 'Listo');
    const recPanel = el('div', { class: 'rec-panel' }, dot, recLabel, recTimer, stopBtn);
    const isNarrative = q.id === narrativeQuestionId();

    const setMode = (m) => { choose.dataset.mode = m; };
    setMode(answers[q.id] ? 'text' : 'choice');

    let tick = null, secs = 0;
    const session = createMicSession({
      onText: (text) => { ta.value = (ta.value ? ta.value + ' ' : '') + text; answers[q.id] = ta.value; saveDraft(); },
      onState: (s) => {
        if (s === 'recording') {
          secs = 0; recTimer.textContent = '0:00'; recLabel.textContent = 'Grabando…';
          dot.style.display = ''; recTimer.style.display = ''; stopBtn.disabled = false;
          setMode('recording');
          tick = setInterval(() => { secs++; recTimer.textContent = `0:${String(secs).padStart(2, '0')}`; }, 1000);
        } else if (s === 'transcribing') {
          clearInterval(tick); recLabel.textContent = 'Transcribiendo…';
          dot.style.display = 'none'; recTimer.style.display = 'none'; stopBtn.disabled = true;
          if (secs > 0) addCost('Transcripción', secs * RATE.transcribeUsdPerSec);
        } else { // idle | error — land in text mode so the transcription is reviewable
          clearInterval(tick); setMode(ta.value ? 'text' : 'choice');
          if (s === 'error') toast('No pudimos acceder al micrófono');
          // After the patient tells their story, infer the rest of the form.
          else if (isNarrative && !prefillDone && ta.value.trim().length >= 8) {
            prefillDone = true; runPrefill(ta.value, form);
          }
        }
      }
    });
    mic.addEventListener('click', () => session.start());
    switchVoice.addEventListener('click', () => session.start());
    stopBtn.addEventListener('click', () => session.stop());
    ta.addEventListener('focus', () => { if (choose.dataset.mode === 'choice') setMode('text'); });

    choose.append(mic, sep, taWrap, recPanel, switchVoice);
    wrap.appendChild(choose);
    return wrap;
  }

  if (q.type === 'number') {
    const inp = el('input', { type: 'number' });
    inp.value = answers[q.id] ?? '';
    inp.addEventListener('input', () => { answers[q.id] = inp.value === '' ? null : Number(inp.value); saveDraft(); });
    wrap.appendChild(inp);
    return wrap;
  }

  if (q.type === 'scale') {
    const row = el('div', { class: 'scale' });
    for (let n = q.min ?? 0; n <= (q.max ?? 10); n++) {
      const chip = el('button', { type: 'button', class: 'opt' + (answers[q.id] === n ? ' sel' : '') }, String(n));
      chip.addEventListener('click', () => { answers[q.id] = n; rerender(); });
      row.appendChild(chip);
    }
    wrap.appendChild(row);
    return wrap;
  }

  if (q.type === 'boolean') {
    const row = el('div', { class: 'opts' });
    [['Sí', true], ['No', false]].forEach(([lbl, val]) => {
      const chip = el('button', { type: 'button', class: 'opt' + (answers[q.id] === val ? ' sel' : '') }, lbl);
      chip.addEventListener('click', () => { answers[q.id] = val; rerender(); });
      row.appendChild(chip);
    });
    wrap.appendChild(row);
    return wrap;
  }

  // single / multi
  const row = el('div', { class: 'opts' });
  for (const o of q.options || []) {
    const selected = q.type === 'multi'
      ? arr(answers[q.id]).includes(o.value)
      : answers[q.id] === o.value;
    const chip = el('button', { type: 'button', class: 'opt' + (selected ? ' sel' : '') }, o.label);
    chip.addEventListener('click', () => {
      if (q.type === 'multi') {
        const cur = new Set(arr(answers[q.id]));
        cur.has(o.value) ? cur.delete(o.value) : cur.add(o.value);
        answers[q.id] = [...cur];
      } else {
        answers[q.id] = o.value;
      }
      rerender();
    });
    row.appendChild(chip);
  }
  wrap.appendChild(row);
  return wrap;
}

async function submit() {
  // submit() is reached from the common-fields step (its button has id 'send');
  // guard the reference since other phases may not have it.
  const btn = document.getElementById('send');
  if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
  try {
    // Send intakeId so a return-visit edit UPDATES the same record (no duplicate).
    const res = await postJSON('/api/intakes', { token, patient, answers, intakeId });
    intakeId = res.id;
    saveDraft();
    renderThanks(res.updated);
  } catch (e) {
    toast('No se pudo enviar: ' + e.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Enviar al médico'; }
  }
}

async function renderThanks(updated) {
  app.innerHTML = '';
  app.appendChild(el('div', { class: 'card center' },
    el('div', { style: 'font-size:54px' }, '✅'),
    el('h2', {}, updated ? 'Actualizado' : 'Listo, gracias'),
    el('p', { class: 'muted' }, 'El cardiólogo ya tiene tu información.'),
    el('p', { class: 'muted small' }, '¿Te olvidaste algo? Editá y reenviá: se actualiza lo que ya mandaste.'),
    el('div', { style: 'height:10px' }),
    el('button', { class: 'btn secondary', onclick: () => renderQuestionnaire() }, '✏️ Editar y reenviar')
  ));
  // Place-in-line estimate (best-effort; the card above already confirmed receipt).
  const slot = el('div', {});
  app.appendChild(slot);
  try {
    const data = await getJSON(`/api/queues/${token}/intakes`);
    const mine = (data.intakes || []).find((r) => r.id === intakeId);
    if (mine && mine.ahead != null) renderEstimate(slot, mine);
  } catch { /* estimate is optional */ }
}

function renderEstimate(slot, mine) {
  const { ahead, waitMin, expectedAt } = mine;
  const line = ahead === 0
    ? 'Sos el próximo. Te llamarán en breve.'
    : `Hay ${ahead} ${ahead === 1 ? 'persona' : 'personas'} antes que vos · espera ~${waitMin} min` +
      (expectedAt ? ` · te atenderían cerca de las ${expectedAt}.` : '.');
  const card = el('div', { class: 'card', style: 'margin-top:12px' },
    el('div', { class: 'est-line' }, line));
  // Long wait → offer to step out + a (simulated) WhatsApp heads-up.
  if (waitMin > 10 || ahead > 2) card.appendChild(waOffer());
  slot.appendChild(card);
}

function waOffer() {
  const wrap = el('div', { class: 'wa-offer' });
  const phone = el('input', { type: 'tel', inputmode: 'tel', placeholder: 'Tu WhatsApp (ej. 11 2345 6789)' });
  const btn = el('button', { class: 'btn block' }, '💬 Avisame por WhatsApp');
  btn.addEventListener('click', async () => {
    const v = phone.value.replace(/\D/g, '');
    if (v.length < 8) { toast('Ingresá un número válido'); return; }
    btn.disabled = true; btn.textContent = 'Guardando…';
    try {
      const r = await postJSON(`/api/intakes/${intakeId}/notify`, { phone: v });
      wrap.innerHTML = '';
      wrap.appendChild(el('p', { class: 'wa-ok' },
        `Listo ✅ Te escribimos por WhatsApp (${r.sender}) al ${r.masked} cuando falten ~10 minutos. Tranqui, podés dar una vuelta.`));
    } catch (e) {
      toast('No se pudo: ' + e.message);
      btn.disabled = false; btn.textContent = '💬 Avisame por WhatsApp';
    }
  });
  wrap.appendChild(el('p', { class: 'muted small', style: 'margin:10px 0' },
    'Tenés un rato. Podés dar una vuelta — te avisamos por WhatsApp cuando falten ~10 minutos para tu turno.'));
  wrap.appendChild(phone);
  wrap.appendChild(el('div', { style: 'height:8px' }));
  wrap.appendChild(btn);
  return wrap;
}

// ---- date helpers (shared flexible parser, loaded as /web/lib/date-parser.js) -
const SanaDates = (typeof window !== 'undefined' && window.SanaDates) || {};
const DATE_HINT = SanaDates.FORMAT_HINT || 'Ej: 09/11/1959 (día/mes/año).';
const isoToArg = SanaDates.isoToArg || ((iso) => {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
});
// In the intake, the typed DOB box uses the same flexible parser as /registro.
const argToIso = SanaDates.parseFlexibleDate || ((s) => {
  const m = String(s || '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null;
});
const ageFromIso = SanaDates.ageFromIso || ((iso) => {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const now = new Date();
  let a = now.getFullYear() - Number(m[1]);
  const md = (now.getMonth() + 1 - Number(m[2])) || (now.getDate() - Number(m[3]));
  if (md < 0) a -= 1;
  return a >= 0 && a < 130 ? a : null;
});
// Age -> an ISO DOB whose computed age equals the entered age (birthday "today").
function isoFromAge(age) {
  const a = Math.floor(Number(age));
  if (!Number.isFinite(a) || a < 0 || a > 120) return null;
  const now = new Date();
  const y = now.getFullYear() - a;
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

// Presume sex from the given name (Argentine convention). Best-effort heuristic;
// the doctor can correct. Returns 'F' | 'M'.
const FEMALE_NAMES = new Set(['belen', 'carmen', 'pilar', 'isabel', 'beatriz', 'ines', 'mercedes',
  'raquel', 'ruth', 'ester', 'esther', 'nair', 'flor', 'azul', 'abril', 'luz', 'soledad', 'rocio',
  'dolores', 'milagros', 'guadalupe', 'noelia', 'maria', 'mar', 'piedad', 'consuelo']);
const MALE_NAMES = new Set(['luca', 'bautista', 'elias', 'tobias', 'matias', 'tomas', 'lucas', 'jonas',
  'jeremias', 'nicolas', 'dimas', 'cosme', 'agustin', 'joaquin', 'ivan', 'noe', 'jose', 'andres', 'dario']);
function guessSexFromName(nombres) {
  const first = String(nombres || '').trim().split(/\s+/)[0] || '';
  const n = (first.normalize ? first.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : first).toLowerCase();
  if (!n) return null;
  if (FEMALE_NAMES.has(n)) return 'F';
  if (MALE_NAMES.has(n)) return 'M';
  if (/a$/.test(n)) return 'F';        // most AR female names end in -a
  if (/[oe]$/.test(n)) return 'M';
  return 'M';                          // consonant-ending fallback; doctor corrects
}

boot().catch((e) => { app.innerHTML = `<div class="card">Error: ${e.message}</div>`; });
