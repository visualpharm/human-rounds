// consult.js — doctor detail view.
// Layout: LEFT column scrolls (brief + diagnosis/exam/med pickers + confirm),
// RIGHT column is a sticky reference panel (generated PDFs land here on top, then
// the patient's raw answers). Diagnosis/exam pickers are searchable (incl. by
// initials, e.g. "l p l" -> "Laboratorio perfil lipídico") and show AI weights.
import { getJSON, postJSON, el, toast } from '/web/lib/api.js';

const intakeId = Number(location.pathname.split('/').pop());
const app = document.getElementById('app');

const selDx = new Set();          // diagnosis ids
const selExam = new Set();        // exam ids
const selMed = new Map();         // med id -> {name, dose, freq, duration}
const customDx = [], customExam = [], customMed = [];
let customDxList, customMedList;
let intake = null, catalogs = null, dxProb = new Map();
let sideEl = null;                 // right sticky panel (holds #result + answers)

async function boot() {
  intake = await getJSON(`/api/intakes/${intakeId}`);
  catalogs = await getJSON(`/api/specialties/${intake.specialty}/catalogs`);
  (intake.suggestedExams || []).forEach((e) => selExam.add(e));
  dxProb = new Map((intake.differential || []).map((d) => [d.id, d.prob]));
  render();
}

// ---- text matching (substring + initials) ---------------------------------
const deaccent = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
const norm = (s) => deaccent(s).toLowerCase();
function matchText(query, text) {
  const q = norm(query).trim();
  if (!q) return true;
  const t = norm(text);
  if (t.includes(q.replace(/[\s/]+/g, ' '))) return true;          // plain substring
  const qLetters = q.split(/[\s/]+/).filter(Boolean).map((w) => w[0]).join('');
  const tInitials = t.split(/[^a-z0-9]+/).filter(Boolean).map((w) => w[0]).join('');
  return qLetters.length > 0 && tInitials.includes(qLetters);     // initials subsequence
}

function render() {
  app.innerHTML = '';
  app.appendChild(header());
  sideEl = el('div', { class: 'side' }, resultBox(), answersCard());
  const left = el('div', {},
    briefCard(),
    el('h3', { class: 'section-h' }, 'Diagnósticos'),
    diagnosisPicker(),
    el('h3', { class: 'section-h' }, 'Estudios a solicitar'),
    examPicker(),
    el('h3', { class: 'section-h' }, 'Medicación'),
    medPicker(),
    el('h3', { class: 'section-h' }, 'Indicaciones'),
    el('textarea', { id: 'notes', placeholder: 'Indicaciones para la receta (opcional)…' }),
    actions()
  );
  app.appendChild(el('div', { class: 'consult-grid' }, left, sideEl));
}

function header() {
  const p = intake.patient;
  const name = [p.apellido, p.nombres].filter(Boolean).join(', ') || `DNI ${p.dni}`;
  const t = intake.triage || 'VERDE';
  const bits = [el('span', { class: `triage t-${t}` }, t)];
  if (p.dni) bits.push(el('span', { class: 'small muted' }, `DNI ${p.dni}`));
  if (intake.coverage && intake.coverage.obraSocial)
    bits.push(el('span', { class: 'small muted' }, `· ${intake.coverage.obraSocial}`));
  return el('div', { style: 'display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:2px 0 14px' },
    el('h2', { style: 'margin:0' }, `${name}${p.age != null ? ' · ' + p.age + 'a' : ''}`), ...bits);
}

// ---- LEFT: AI brief (bulleted) --------------------------------------------
function briefCard() {
  const card = el('div', { class: 'card' }, el('h3', { style: 'margin-top:0' }, 'Resumen para el médico'));
  card.appendChild(el('p', { class: 'lead' }, intake.oneLiner || '—'));
  (intake.redFlags || []).forEach((f) => card.appendChild(el('div', { class: 'flag' },
    el('span', { class: 'lbl' }, '⚑ ' + f.label), el('div', { class: 'small muted' }, f.because))));
  if ((intake.brief || []).length) {
    const ul = el('ul', { class: 'brief-list' });
    intake.brief.forEach((b) => ul.appendChild(el('li', {}, b.point)));
    card.appendChild(ul);
  }
  if ((intake.differential || []).length) {
    const chips = intake.differential.slice(0, 5).map((d) => {
      const dx = catalogs.diagnosisCatalog.find((x) => x.id === d.id);
      return el('span', { class: 'dx-chip' }, `${dx ? dx.label : d.id} ${pct(d.prob)}`);
    });
    card.appendChild(el('div', { class: 'diff-row' }, el('span', { class: 'small muted' }, 'Diferencial IA:'), ...chips));
  }
  card.appendChild(el('p', { class: 'small muted', style: 'margin:10px 0 0' }, `IA: ${intake.aiModel || '—'}`));
  return card;
}

// ---- RIGHT: raw answers ----------------------------------------------------
function answersCard() {
  const card = el('div', { class: 'card' }, el('h3', { style: 'margin-top:0' }, 'Respuestas del paciente'));
  if (!intake.labeled.length) { card.appendChild(el('p', { class: 'muted' }, 'Sin respuestas.')); return card; }
  for (const line of intake.labeled) {
    const [q, a] = line.split(' → ');
    card.appendChild(el('div', { class: 'raw-item' }, el('div', { class: 'q' }, q), el('div', { class: 'a' }, a || '—')));
  }
  return card;
}

// ---- Diagnosis picker (searchable, weighted, codes in own column) ----------
function diagnosisPicker() {
  const box = el('div', { class: 'card' });
  const list = el('div', { class: 'pick-list' });
  const search = el('input', { type: 'search', class: 'pick-search',
    placeholder: 'Buscar diagnóstico (nombre o iniciales, ej. "a i" → Angina inestable)…' });
  const generals = catalogs.diagnosisCatalog.filter((d) => d.level === 'general' || !d.parent);
  const childrenOf = (id) => catalogs.diagnosisCatalog.filter((d) => d.parent === id);

  const row = (d, child) => {
    const cb = el('input', { type: 'checkbox' });
    cb.checked = selDx.has(d.id);
    cb.addEventListener('change', () => {
      cb.checked ? selDx.add(d.id) : selDx.delete(d.id);
      if (cb.checked) (d.suggestedExams || []).forEach((e) => selExam.add(e));
      refreshExamChecks();
    });
    const prob = dxProb.get(d.id);
    const main = el('div', { class: 'pick-main' }, el('div', {}, d.label));
    if (prob != null) main.appendChild(el('span', { class: 'weight', title: 'Probabilidad estimada (IA)' }, pct(prob)));
    return el('label', { class: 'pick' + (child ? ' child' : '') }, cb, main,
      el('span', { class: 'dx-code' }, `${d.system || 'CIE-10'} ${d.code}`));
  };

  const draw = (q = '') => {
    list.innerHTML = '';
    for (const g of generals) {
      const kids = childrenOf(g.id);
      const gMatch = matchText(q, `${g.label} ${g.code}`);
      const visibleKids = kids.filter((c) => !q || gMatch || matchText(q, `${c.label} ${c.code}`));
      if (q && !gMatch && !visibleKids.length) continue;
      list.appendChild(row(g, false));
      for (const c of visibleKids) list.appendChild(row(c, true));
    }
    if (!list.children.length) list.appendChild(el('div', { class: 'small muted', style: 'padding:8px 0' }, 'Sin coincidencias.'));
  };
  search.addEventListener('input', () => draw(search.value));
  draw('');

  box.appendChild(search);
  box.appendChild(list);
  box.appendChild(freeText('Otro diagnóstico…', (val) => { customDx.push({ label: val, custom: true }); toast('Diagnóstico agregado'); }));
  customDxList = el('div', { class: 'small muted', style: 'margin-top:6px' });
  box.appendChild(customDxList);
  return box;
}

// ---- Exam picker (searchable, weighted) ------------------------------------
function examPicker() {
  const box = el('div', { class: 'card', id: 'exambox' });
  const list = el('div', { class: 'pick-list' });
  const search = el('input', { type: 'search', class: 'pick-search',
    placeholder: 'Buscar estudio (nombre o iniciales, ej. "l p l" → Lab. perfil lipídico)…' });
  const byCat = {};
  for (const e of catalogs.examCatalog) (byCat[e.category] = byCat[e.category] || []).push(e);

  const row = (e) => {
    const cb = el('input', { type: 'checkbox', 'data-exam': e.id });
    cb.checked = selExam.has(e.id);
    cb.addEventListener('change', () => cb.checked ? selExam.add(e.id) : selExam.delete(e.id));
    const main = el('div', { class: 'pick-main' }, el('div', {}, e.label));
    const w = examWeight(e.id);
    if (w > 0) main.appendChild(el('span', { class: 'weight', title: 'Relevancia para este caso (IA)' }, pct(w)));
    return el('label', { class: 'pick' }, cb, main);
  };

  const draw = (q = '') => {
    list.innerHTML = '';
    for (const [cat, exams] of Object.entries(byCat)) {
      const vis = exams.filter((e) => matchText(q, `${e.label} ${cat}`));
      if (!vis.length) continue;
      list.appendChild(el('div', { class: 'group-title' }, cat));
      vis.forEach((e) => list.appendChild(row(e)));
    }
    if (!list.children.length) list.appendChild(el('div', { class: 'small muted', style: 'padding:8px 0' }, 'Sin coincidencias.'));
  };
  search.addEventListener('input', () => draw(search.value));
  draw('');

  box.appendChild(search);
  box.appendChild(list);
  box.appendChild(freeText('Otro estudio…', (val) => { customExam.push({ label: val, custom: true }); toast('Estudio agregado'); }));
  return box;
}
function refreshExamChecks() {
  document.querySelectorAll('#exambox input[data-exam]').forEach((cb) => { cb.checked = selExam.has(cb.getAttribute('data-exam')); });
}
// Study relevance: prob mass of differential dx that suggest it + AI suggestion.
function examWeight(eid) {
  let w = 0;
  for (const d of intake.differential || []) {
    const cat = catalogs.diagnosisCatalog.find((x) => x.id === d.id);
    if (cat && (cat.suggestedExams || []).includes(eid)) w += d.prob;
  }
  if ((intake.suggestedExams || []).includes(eid)) w += 0.4;
  return Math.min(1, w);
}

// ---- Medication picker (3-col table: drug / how to take / dose) -------------
function medPicker() {
  const box = el('div', { class: 'card' });
  const freqList = el('datalist', { id: 'freq-list' },
    ...(catalogs.freqOptions || []).map((f) => el('option', { value: f })));
  box.appendChild(freqList);

  const table = el('table', { class: 'med-table' },
    el('thead', {}, el('tr', {},
      el('th', { style: 'width:34px' }, ''),
      el('th', {}, 'Medicamento'),
      el('th', {}, 'Cómo tomarlo'),
      el('th', {}, 'Dosis'))));
  const tbody = el('tbody', {});
  for (const m of catalogs.medicationFormulary) {
    const cb = el('input', { type: 'checkbox' });
    const freq = el('input', { type: 'text', class: 'cell-input', value: m.freq, list: 'freq-list' });
    const doseListId = `dose-${m.id}`;
    const dose = el('input', { type: 'text', class: 'cell-input dose', value: m.dose, list: doseListId });
    const doseList = el('datalist', { id: doseListId }, ...(m.doseOptions || [m.dose]).map((d) => el('option', { value: d })));
    const sync = () => { if (selMed.has(m.id)) Object.assign(selMed.get(m.id), { dose: dose.value, freq: freq.value }); };
    cb.addEventListener('change', () => {
      cb.checked ? selMed.set(m.id, { name: m.name, dose: dose.value, freq: freq.value, duration: m.duration })
                 : selMed.delete(m.id);
    });
    dose.addEventListener('input', sync);
    freq.addEventListener('input', sync);
    tbody.appendChild(el('tr', { class: 'med-row' },
      el('td', {}, cb),
      el('td', {}, el('div', { class: 'med-name' }, m.name), el('div', { class: 'meta' }, m.class)),
      el('td', {}, freq),
      el('td', {}, dose, doseList)));
  }
  table.appendChild(tbody);
  box.appendChild(table);
  box.appendChild(freeText('Otro medicamento (nombre y dosis)…', (val) => { customMed.push({ name: val, custom: true }); toast('Medicamento agregado'); }));
  customMedList = el('div', { class: 'small muted', style: 'margin-top:6px' });
  box.appendChild(customMedList);
  return box;
}

function freeText(placeholder, onAdd) {
  const inp = el('input', { type: 'text', placeholder });
  const add = () => { const v = inp.value.trim(); if (!v) return; onAdd(v); inp.value = ''; renderCustomLists(); };
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
  return el('div', { class: 'with-mic', style: 'margin-top:10px' }, inp,
    el('button', { class: 'btn secondary', type: 'button', onclick: add }, 'Agregar'));
}
function renderCustomLists() {
  if (customDxList) customDxList.textContent = customDx.length ? 'Agregados: ' + customDx.map((x) => x.label).join('; ') : '';
  if (customMedList) customMedList.textContent = customMed.length ? 'Agregados: ' + customMed.map((x) => x.name).join('; ') : '';
}

const pct = (p) => `${Math.round((Number(p) || 0) * 100)}%`;

function actions() {
  return el('div', { class: 'sticky-actions' },
    el('button', { class: 'btn big', id: 'confirm', onclick: confirm }, 'Confirmar y generar recetas'));
}
function resultBox() { return el('div', { id: 'result' }); }

async function confirm() {
  const btn = document.getElementById('confirm');
  btn.disabled = true; btn.textContent = 'Generando…';
  // Open the print tab now, during the click gesture, so it isn't popup-blocked;
  // we set its URL once the PDFs exist.
  let printWin = null;
  try { printWin = window.open('', '_blank'); } catch { /* blocked — buttons still work */ }

  const diagnoses = [
    ...catalogs.diagnosisCatalog.filter((d) => selDx.has(d.id)).map((d) => ({ code: d.code, system: d.system, label: d.label, custom: false })),
    ...customDx
  ];
  const exams = [
    ...catalogs.examCatalog.filter((e) => selExam.has(e.id)).map((e) => ({ code: e.id, label: e.label, custom: false })),
    ...customExam
  ];
  const meds = [
    ...[...selMed.values()].map((m) => ({ name: m.name, dose: m.dose, freq: m.freq, duration: m.duration, custom: false })),
    ...customMed
  ];
  const notes = document.getElementById('notes').value.trim();
  try {
    const r = await postJSON('/api/consults', { intakeId, diagnoses, exams, meds, notes });
    if (printWin) printWin.location = `/web/print.html?u=${encodeURIComponent(r.recetaUrl)}&t=Receta`;
    showResult(r);
  } catch (e) {
    if (printWin) printWin.close();
    toast('Error: ' + e.message);
    btn.disabled = false; btn.textContent = 'Confirmar y generar recetas';
  }
}

function showResult(r) {
  const box = document.getElementById('result');
  box.innerHTML = '';
  const printLink = (url, label) => el('a', { class: 'btn block', href: `/web/print.html?u=${encodeURIComponent(url)}&t=${encodeURIComponent(label)}`, target: '_blank' }, `🖨 ${label}`);
  box.appendChild(el('div', { class: 'card result-card' },
    el('h3', { style: 'margin-top:0' }, '✅ Consulta confirmada'),
    el('div', { style: 'display:flex;flex-direction:column;gap:8px' },
      printLink(r.recetaUrl, 'Receta (4 copias)'),
      printLink(r.ordenUrl, 'Orden de estudios'),
      el('div', { style: 'display:flex;gap:8px' },
        el('a', { class: 'btn secondary', style: 'flex:1', href: r.recetaUrl, target: '_blank' }, '📄 Ver receta'),
        el('a', { class: 'btn secondary', style: 'flex:1', href: r.ordenUrl, target: '_blank' }, '📄 Ver orden'))),
    el('p', { class: 'small muted', id: 'hsi', style: 'margin-top:12px' }, 'Enviando a HSI…')));
  pollHsi(r.id);
}

async function pollHsi(consultId, tries = 0) {
  try {
    const c = await getJSON(`/api/consults/${consultId}`);
    const span = document.getElementById('hsi');
    if (span && c.hsiPush) {
      if (c.hsiPush.status === 'registered')
        span.textContent = `HSI: paciente registrado${c.hsiPush.patientId ? ' (#' + c.hsiPush.patientId + ')' : ''}. Datos clínicos: ${c.hsiPush.clinical?.status || 'pendiente'}.`;
      else if (c.hsiPush.status === 'error') {
        span.textContent = `HSI: no se pudo registrar (${c.hsiPush.error || 'error'}). `;
        span.appendChild(el('a', { href: '#', onclick: (e) => { e.preventDefault(); retryHsi(consultId); } }, 'Reintentar'));
      } else span.textContent = `HSI: ${c.hsiPush.status}`;
      return;
    }
  } catch {}
  if (tries < 30) setTimeout(() => pollHsi(consultId, tries + 1), 2000);
  else { const s = document.getElementById('hsi'); if (s) s.textContent = 'HSI: sin respuesta (revisar que HSI esté arriba).'; }
}

async function retryHsi(consultId) {
  const s = document.getElementById('hsi'); if (s) s.textContent = 'Reintentando HSI…';
  try { await postJSON(`/api/consults/${consultId}/push-hsi`, {}); } catch {}
  pollHsi(consultId);
}

boot().catch((e) => { app.innerHTML = `<div class="card">Error: ${e.message}</div>`; });
