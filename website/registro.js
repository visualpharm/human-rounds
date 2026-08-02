// registro.js — patient SELF-registration. The patient identifies (scan DNI or
// type) and leaves their obra social + optional phone. It goes to a temporary
// store; at the desk the receptionist confirms it and it's created in HSI.
//
// This is registration (identity-first), distinct from the symptoms intake
// (/i/:token, symptoms-first). It reuses the SAME shared scanner (dni-scan.js)
// and the SAME identity fields as the intake's confirm screen.
import { postJSON, el, toast } from '/web/lib/api.js';
import { renderDniScanner } from '/web/lib/dni-scan.js';

const app = document.getElementById('app');
let patient = { dni: '', sexo: null, apellido: '', nombres: '', fechaNacimientoIso: null, cuil: null, raw: null };
let coverage = null;            // { obraSocial, afiliado, plan } once known
let scanWarnings = [];

// ---- Step 1: how do you want to identify? ----------------------------------
function renderStart() {
  app.innerHTML = '';
  app.appendChild(el('div', { class: 'card' },
    el('h2', {}, 'Registrate antes de llegar'),
    el('p', { class: 'muted' }, 'Cargá tus datos desde el celular. Cuando llegues a recepción, confirman ' +
      'tu identidad y quedás registrado, sin papeles ni cola.'),
    el('button', { class: 'btn block big', onclick: startScan }, '📷 Escanear mi DNI'),
    el('div', { class: 'or-sep' }, 'o cargá tus datos'),
    el('button', { class: 'btn block secondary', onclick: () => renderForm() }, 'Ingresar a mano')
  ));
}

function startScan() {
  app.innerHTML = '';
  renderDniScanner(app, {
    onManual: () => renderForm(),
    onResult: ({ patient: p, coverage: cov, warnings }) => {
      if (p) {
        patient.dni = p.dni || '';
        patient.sexo = p.sexo || null;
        patient.apellido = p.apellido || '';
        patient.nombres = p.nombres || '';
        patient.fechaNacimientoIso = p.fechaNacimientoIso || null;
        patient.cuil = p.cuil || null;
        patient.raw = p.raw || null;
      }
      if (cov) coverage = { obraSocial: cov.obraSocial || '', afiliado: cov.afiliado || '', plan: cov.plan || '' };
      scanWarnings = warnings || [];
      renderForm();
    }
  });
}

// ---- Step 2: confirm identity + obra social --------------------------------
function renderForm() {
  app.innerHTML = '';
  const dni = el('input', { type: 'text', inputmode: 'numeric', placeholder: 'Número de DNI', value: patient.dni || '' });
  const ape = el('input', { type: 'text', placeholder: 'Apellido', value: patient.apellido || '' });
  const nom = el('input', { type: 'text', placeholder: 'Nombres', value: patient.nombres || '' });
  const dob = el('input', { type: 'text', inputmode: 'numeric', placeholder: 'dd/mm/aaaa', value: isoToArg(patient.fechaNacimientoIso) });
  const dobHint = el('p', { class: 'muted small', style: 'margin:4px 0 0' }, DATE_HINT);
  let sexo = patient.sexo;
  const chips = ['F', 'M', 'X'].map((s) =>
    el('button', { class: 'opt' + (sexo === s ? ' sel' : ''), onclick: (e) => {
      sexo = s; document.querySelectorAll('#sexrow .opt').forEach((c) => c.classList.remove('sel'));
      e.target.classList.add('sel');
    } }, s === 'F' ? 'Femenino' : s === 'M' ? 'Masculino' : 'X'));

  const os = el('input', { type: 'text', placeholder: 'Obra social / prepaga (ej: Swiss Medical)', value: (coverage && coverage.obraSocial) || '' });
  const afi = el('input', { type: 'text', placeholder: 'N° de afiliado', value: (coverage && coverage.afiliado) || '' });
  const plan = el('input', { type: 'text', placeholder: 'Plan (opcional)', value: (coverage && coverage.plan) || '' });
  const tel = el('input', { type: 'tel', inputmode: 'tel', placeholder: 'Teléfono (opcional)' });

  const note = scanWarnings.length
    ? el('p', { class: 'muted', style: 'color:var(--amarillo)' },
        '⚠ Revisá nombre y apellido (los acentos no viajan en el código del DNI).')
    : null;

  app.appendChild(el('div', { class: 'card' },
    el('h2', {}, 'Tus datos'),
    el('p', { class: 'muted' }, scanWarnings.length
      ? 'Escaneamos tu DNI. Confirmá que esté todo bien.'
      : 'Completá tus datos para registrarte.'),
    note,
    el('label', { class: 'q' }, 'Número de DNI'), dni,
    el('div', { style: 'height:10px' }),
    el('label', { class: 'q' }, 'Apellido'), ape,
    el('div', { style: 'height:10px' }),
    el('label', { class: 'q' }, 'Nombres'), nom,
    el('div', { style: 'height:10px' }),
    el('label', { class: 'q' }, 'Sexo'), el('div', { class: 'opts', id: 'sexrow' }, ...chips),
    el('div', { style: 'height:10px' }),
    el('label', { class: 'q' }, 'Fecha de nacimiento'), dob, dobHint,
    el('div', { style: 'height:18px' }),
    el('h3', { style: 'margin:0 0 8px' }, 'Obra social'),
    el('p', { class: 'muted small', style: 'margin:0 0 8px' }, 'Si tenés, cargala. La confirma recepción en el sistema.'),
    el('label', { class: 'q' }, 'Cobertura'), os,
    el('div', { style: 'height:10px' }),
    el('label', { class: 'q' }, 'N° de afiliado'), afi,
    el('div', { style: 'height:10px' }),
    el('label', { class: 'q' }, 'Plan'), plan,
    el('div', { style: 'height:18px' }),
    el('label', { class: 'q' }, 'Teléfono de contacto'), tel,
    el('div', { style: 'height:16px' }),
    el('button', { class: 'btn block big', onclick: () => {
      patient.dni = String(dni.value || '').replace(/\D/g, '');
      patient.apellido = ape.value.trim().toUpperCase();
      patient.nombres = nom.value.trim().toUpperCase();
      patient.sexo = sexo;
      if (patient.dni.length < 6) return toast('Revisá el número de DNI');
      if (!patient.apellido || !patient.nombres) return toast('Completá nombre y apellido');
      const dobRaw = dob.value.trim();
      if (dobRaw) {
        const iso = parseFlexibleDate(dobRaw);
        if (!iso) { dob.focus(); return toast('No entendí la fecha de nacimiento. ' + DATE_HINT); }
        patient.fechaNacimientoIso = iso;
        dob.value = isoToArg(iso); // echo back what we understood
      } else {
        patient.fechaNacimientoIso = null;
      }
      const cov = os.value.trim()
        ? { obraSocial: os.value.trim(), afiliado: afi.value.trim(), plan: plan.value.trim() }
        : null;
      submit(cov, tel.value.trim());
    } }, 'Registrarme')
  ));
}

async function submit(cov, contacto) {
  const btn = app.querySelector('button.big');
  if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
  try {
    await postJSON('/api/register', { patient, coverage: cov, contacto: contacto || null });
    renderThanks();
  } catch (e) {
    toast('No se pudo registrar: ' + e.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Registrarme'; }
  }
}

function renderThanks() {
  app.innerHTML = '';
  app.appendChild(el('div', { class: 'card center' },
    el('div', { style: 'font-size:54px' }, '✅'),
    el('h2', {}, 'Listo, ' + (patient.nombres ? patient.nombres.split(' ')[0] : 'gracias')),
    el('p', { class: 'muted' }, 'Te registramos. Cuando llegues a recepción, confirman tus datos y ' +
      'quedás cargado en el sistema.'),
    el('div', { style: 'height:10px' }),
    el('button', { class: 'btn secondary', onclick: () => renderForm() }, '✏️ Revisar mis datos')
  ));
}

// ---- date helpers (shared flexible parser, loaded as /web/lib/date-parser.js) -
const SanaDates = (typeof window !== 'undefined' && window.SanaDates) || {};
const parseFlexibleDate = SanaDates.parseFlexibleDate || ((s) => {
  const m = String(s || '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null;
});
const isoToArg = SanaDates.isoToArg || ((iso) => {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
});
const DATE_HINT = SanaDates.FORMAT_HINT || 'Ej: 09/11/1959 (día/mes/año).';

renderStart();
