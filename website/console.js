// console.js — doctor triage board as a sortable, filterable table.
// Columns: Hora (turno) · Edad · Paciente · Triage · Espera (live) · Estimado
//          (expected attention) · Resumen (one line) · Estado.
// Default sort = appointment time. Attended patients stay on the board (greyed
// "Atendido") so the doctor can reprint after confirming.
import { getJSON, el } from '/web/lib/api.js';

const token = new URLSearchParams(location.search).get('token') || 'cardio01';
const TRIAGE_RANK = { ROJO: 0, NARANJA: 1, AMARILLO: 2, VERDE: 3 };
const TRIAGE_LABEL = { ROJO: 'Rojo', NARANJA: 'Naranja', AMARILLO: 'Amarillo', VERDE: 'Verde' };

let rows = [];
const sort = { col: 'hora', dir: 'asc' };   // default: by appointment time
const filter = { triage: 'all', estado: 'all', q: '' };

// ---- helpers ---------------------------------------------------------------
// sqlite/seed store arrival as "YYYY-MM-DD HH:MM:SS" in UTC (no tz marker).
const arrivalMs = (s) => (s ? Date.parse(s.replace(' ', 'T') + 'Z') : NaN);
function waitMs(it) { const t = arrivalMs(it.submittedAt); return Number.isNaN(t) ? -1 : Date.now() - t; }
function fmtWait(ms) {
  if (ms < 0) return '—';
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'recién';
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// ---- columns ---------------------------------------------------------------
const COLS = [
  { key: 'hora', label: 'Hora', sortable: true, get: (it) => it.appointmentAt || '~' },
  { key: 'edad', label: 'Edad', sortable: true, get: (it) => (it.edad ?? -1) },
  { key: 'paciente', label: 'Paciente', sortable: true, get: (it) => norm(it.nombre) },
  { key: 'triage', label: 'Triage', sortable: true, get: (it) => TRIAGE_RANK[it.triage] ?? 9 },
  { key: 'espera', label: 'Espera', sortable: true, get: (it) => (it.status === 'done' ? -1 : waitMs(it)) },
  { key: 'estimado', label: 'Estimado', sortable: true, get: (it) => it.expectedAt || '~' },
  { key: 'resumen', label: 'Resumen', sortable: false },
  { key: 'estado', label: 'Estado', sortable: true, get: (it) => (it.status === 'done' ? 1 : 0) }
];

function visibleRows() {
  let r = rows.filter((it) => {
    if (filter.triage !== 'all' && it.triage !== filter.triage) return false;
    if (filter.estado === 'waiting' && it.status === 'done') return false;
    if (filter.estado === 'done' && it.status !== 'done') return false;
    if (filter.q) {
      const hay = norm(it.nombre) + ' ' + norm(it.oneLiner);
      if (!hay.includes(norm(filter.q))) return false;
    }
    return true;
  });
  const col = COLS.find((c) => c.key === sort.col) || COLS[0];
  const dir = sort.dir === 'asc' ? 1 : -1;
  r = r.slice().sort((a, b) => {
    const va = col.get(a), vb = col.get(b);
    if (va < vb) return -1 * dir;
    if (va > vb) return 1 * dir;
    return String(a.appointmentAt || '~').localeCompare(String(b.appointmentAt || '~'));
  });
  return r;
}

// ---- render ----------------------------------------------------------------
function renderHead() {
  const tr = el('tr', {});
  for (const c of COLS) {
    const arrow = sort.col === c.key ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : '';
    const th = el('th', { class: c.sortable ? 'sortable' : '', 'data-col': c.key }, c.label + arrow);
    if (c.sortable) th.addEventListener('click', () => {
      if (sort.col === c.key) sort.dir = sort.dir === 'asc' ? 'desc' : 'asc';
      else { sort.col = c.key; sort.dir = c.key === 'espera' ? 'desc' : 'asc'; }
      draw();
    });
    tr.appendChild(th);
  }
  return tr;
}

function renderRow(it) {
  const t = it.triage || 'VERDE';
  const done = it.status === 'done';
  const tr = el('tr', { class: `qrow lt-${t}` + (done ? ' attended' : '') });
  tr.addEventListener('click', () => { location.href = `/console/${it.id}`; });

  // Hora (turno)
  tr.appendChild(el('td', { class: 'c-hora' }, it.appointmentAt || '—'));
  // Edad + subtle sex marker
  const sex = it.sexo === 'F' ? ' ♀' : it.sexo === 'M' ? ' ♂' : '';
  tr.appendChild(el('td', { class: 'c-edad' },
    it.edad != null ? String(it.edad) : '—',
    sex ? el('span', { class: 'sex' }, sex) : null));
  // Paciente (name only — age/sex are their own columns)
  const flag = it.redFlagCount ? el('span', { class: 'rf', title: `${it.redFlagCount} bandera(s) roja(s)` }, ' ⚑') : null;
  tr.appendChild(el('td', {}, el('div', { class: 'p-name' }, it.nombre, flag)));
  // Triage — single dot + plain text (subtle; not a filled pill)
  tr.appendChild(el('td', {}, el('span', { class: 'triage-tag' },
    el('i', { class: `tdot t-${t}` }), TRIAGE_LABEL[t] || t)));
  // Espera (live)
  tr.appendChild(el('td', { class: 'c-wait' }, done ? '—' : fmtWait(waitMs(it))));
  // Estimado (expected attention time)
  tr.appendChild(el('td', { class: 'c-est' }, done ? '—' : (it.expectedAt || '—')));
  // Resumen — single line (ellipsis via CSS), full text in tooltip
  tr.appendChild(el('td', { class: 'c-sum' },
    el('div', { class: 'sum-clip', title: it.oneLiner || '' }, it.oneLiner || '—')));
  // Estado
  tr.appendChild(el('td', {}, el('span', { class: 'state ' + (done ? 'state-done' : 'state-wait') },
    done ? 'Atendido' : 'En espera')));
  return tr;
}

function draw() {
  const table = document.getElementById('qtable');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  thead.innerHTML = ''; thead.appendChild(renderHead());
  tbody.innerHTML = '';
  const vis = visibleRows();
  for (const it of vis) tbody.appendChild(renderRow(it));
  const waiting = rows.filter((r) => r.status !== 'done').length;
  const done = rows.length - waiting;
  document.getElementById('count').textContent =
    `${waiting} en espera${done ? ` · ${done} atendido${done > 1 ? 's' : ''}` : ''}`;
  document.getElementById('empty').style.display = vis.length ? 'none' : 'block';
  table.style.display = vis.length ? '' : 'none';
}

// ---- data + wiring ---------------------------------------------------------
async function tick() {
  let data;
  try { data = await getJSON(`/api/queues/${token}/intakes`); } catch { return; }
  document.getElementById('qlabel').textContent = data.queue.label;
  rows = data.intakes;
  draw();
}

document.getElementById('triageFilter').addEventListener('change', (e) => { filter.triage = e.target.value; draw(); });
document.getElementById('estadoFilter').addEventListener('change', (e) => { filter.estado = e.target.value; draw(); });
document.getElementById('search').addEventListener('input', (e) => { filter.q = e.target.value; draw(); });

tick();
setInterval(tick, 5000);                 // refresh data
setInterval(() => { if (rows.length) draw(); }, 30000);  // keep "espera" fresh
