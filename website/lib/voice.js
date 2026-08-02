// voice.js — push-to-talk recording -> server ASR (wizper/Groq).
// Works cross-platform (incl. iOS Safari) over HTTPS, because transcription is
// server-side. getUserMedia requires a secure context — over plain http it's
// unavailable, so voiceSupported() returns false and the UI hides the mic.

const supported = typeof MediaRecorder !== 'undefined' &&
  !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

export function voiceSupported() { return supported; }

function pickMime() {
  const cands = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  for (const c of cands) if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c)) return c;
  return '';
}

/**
 * A microphone session with explicit state so the UI can show a recording
 * indicator and swap the textarea out while grabbing.
 * @param {object} opts
 *   onState(state): 'recording' | 'transcribing' | 'idle' | 'error'
 *   onText(text):   final transcript
 *   maxMs:          auto-stop after this long
 * @returns {{ start: ()=>void, stop: ()=>void, recording: ()=>boolean }}
 */
export function createMicSession({ onState = () => {}, onText = () => {}, maxMs = 300000 } = {}) {
  let rec = null, stream = null, chunks = [], timer = null, state = 'idle';
  const set = (s) => { state = s; onState(s); };

  async function start() {
    if (state === 'recording') return;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      set('error');
      return;
    }
    const mime = pickMime();
    rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    chunks = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = finish;
    rec.start();
    set('recording');
    timer = setTimeout(stop, maxMs);
  }

  function stop() {
    if (state !== 'recording') return;
    clearTimeout(timer);
    set('transcribing');
    if (rec && rec.state !== 'inactive') rec.stop();
    if (stream) stream.getTracks().forEach((t) => t.stop());
  }

  async function finish() {
    const blob = new Blob(chunks, { type: chunks[0]?.type || 'audio/webm' });
    try {
      const r = await fetch('/api/transcribe?lang=es', {
        method: 'POST', headers: { 'Content-Type': blob.type || 'audio/webm' }, body: blob
      });
      const data = await r.json();
      if (data.text) onText(data.text);
    } catch { /* ignore — patient can type */ }
    set('idle');
  }

  return { start, stop, recording: () => state === 'recording' };
}
