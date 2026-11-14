/* Connectors section on the landing page (#network).
 *
 * Three tabs, one table engine: the systems Human Rounds talks to (filtered by
 * country), the desk and doctor functions, and the AI functions. Everything
 * below the DATA marker is plain data — a new country or a new row never
 * touches the render code. Texts come from the landing copy (data-i18n keys
 * in landing.js / i18n/<lang>.json); names of institutions stay as they are.
 *
 * Country: body[data-cf-country] from the server, else a client-side IP lookup
 * (ipwho.is), else AR. A visitor's own pick wins over both. A country we have
 * no row for shows the global connectors only, with a neutral globe.
 */
(function () {
  'use strict';

  var LOGO_DIR = '/web/connector-logos/';
  var ICON_DIR = '/web/icons/';
  var ICON_V = '?v=1';
  var DEFAULT_COUNTRY = 'AR';

  /* ---------------------------------------------------------------- DATA */

  // role -> icon (Icons8 ios11) and the i18n key of the one-line description.
  var ROLES = {
    identity: { icon: 'id-card', what: 'connRoleIdentity' },
    coverage: { icon: 'shield', what: 'connRoleCoverage' },
    licenses: { icon: 'certificate', what: 'connRoleLicenses' },
    emr: { icon: 'soap-note', what: 'connRoleEmr' },
    regional: { icon: 'health-calendar', what: 'connRoleRegional' },
    billing: { icon: 'cash-in-hand', what: 'connRoleBilling' }
  };
  var ROLE_ORDER = ['identity', 'coverage', 'licenses', 'emr', 'regional', 'billing'];

  // Connectors every installation has, whatever the country.
  var GLOBAL = [
    { name: 'WhatsApp', what: 'connWhatsappWhat', icon: 'conversation', logo: 'whatsapp.svg', status: 'live' },
    { name: 'Email · Mailgun, Mailjet', what: 'connEmailWhat', icon: 'new-post', status: 'live' }
  ];

  // [role, name, status, logo file or null]. live | progress | planned.
  var COUNTRIES = {
    AR: [
      ['identity', 'RENAPER · Mi Argentina', 'progress', 'renaper.png'],
      ['coverage', 'PUCO · SISA', 'live'],
      ['licenses', 'REFEPS', 'live'],
      ['emr', 'HSI', 'live', 'hsi.png'],
      ['regional', 'Mi Salud Digital', 'progress'],
      ['billing', 'SUMAR+', 'live', 'sumar.png']
    ],
    BO: [['identity', 'SEGIP', 'planned'], ['coverage', 'SUS Bolivia', 'planned']],
    BR: [
      ['identity', 'gov.br', 'planned', 'govbr.svg'],
      ['coverage', 'Meu SUS Digital', 'planned', 'sus.svg'],
      ['licenses', 'CFM / CRM', 'planned', 'cfm.png'],
      ['emr', 'RNDS', 'planned', 'rnds.png']
    ],
    CA: [['emr', 'Canada Health Infoway', 'planned']],
    CL: [['identity', 'ClaveÚnica', 'planned'], ['coverage', 'FONASA', 'planned'], ['licenses', 'RNPI', 'planned']],
    CO: [
      ['identity', 'Registraduría', 'planned'], ['coverage', 'ADRES', 'planned'],
      ['licenses', 'ReTHUS', 'planned'], ['emr', 'SISPRO', 'planned']
    ],
    DE: [['identity', 'BundID', 'planned'], ['coverage', 'eGK / GKV', 'planned'], ['emr', 'ePA', 'planned']],
    EC: [['identity', 'Registro Civil', 'planned'], ['coverage', 'IESS', 'planned'], ['licenses', 'SENESCYT', 'planned']],
    ES: [
      ['identity', 'Cl@ve', 'planned'], ['coverage', 'TSI', 'planned'],
      ['licenses', 'REPS', 'planned'], ['emr', 'HCDSNS', 'planned']
    ],
    FR: [
      ['identity', 'France Identité', 'planned'], ['coverage', 'Carte Vitale', 'planned'],
      ['licenses', 'RPPS', 'planned'], ['emr', 'Mon espace santé', 'planned']
    ],
    GB: [
      ['identity', 'NHS Number', 'planned', 'nhs.svg'], ['coverage', 'NHS', 'planned', 'nhs.svg'],
      ['licenses', 'GMC', 'planned', 'gmc.svg'], ['emr', 'NHS Spine · HL7 FHIR', 'planned', 'hl7fhir.png']
    ],
    ID: [
      ['identity', 'NIK', 'planned'], ['coverage', 'BPJS Kesehatan', 'planned'],
      ['licenses', 'STR / KKI', 'planned'], ['emr', 'SATUSEHAT', 'planned']
    ],
    IN: [
      ['identity', 'Aadhaar', 'planned', 'aadhaar.svg'], ['coverage', 'PM-JAY', 'planned', 'ayushmanbharat.png'],
      ['licenses', 'NMC', 'planned', 'nmc.png'], ['emr', 'ABDM', 'planned', 'abdm.png']
    ],
    IT: [
      ['identity', 'SPID / CIE', 'planned'], ['coverage', 'Tessera Sanitaria', 'planned'],
      ['licenses', 'FNOMCeO', 'planned'], ['emr', 'FSE', 'planned']
    ],
    KE: [
      ['identity', 'Huduma Namba', 'planned'], ['coverage', 'SHA', 'planned'],
      ['licenses', 'KMPDC', 'planned'], ['emr', 'KHIS', 'planned']
    ],
    MX: [
      ['identity', 'CURP', 'planned'], ['coverage', 'IMSS-Bienestar', 'planned'],
      ['licenses', 'Cédula Profesional', 'planned'], ['emr', 'CENETEC', 'planned']
    ],
    NG: [['identity', 'NIN', 'planned'], ['coverage', 'NHIA', 'planned'], ['licenses', 'MDCN', 'planned']],
    PE: [
      ['identity', 'RENIEC', 'planned'], ['coverage', 'SIS', 'planned'],
      ['licenses', 'Colegio Médico', 'planned'], ['emr', 'RENHICE', 'planned']
    ],
    PH: [
      ['identity', 'PhilSys', 'planned'], ['coverage', 'PhilHealth', 'planned'],
      ['licenses', 'PRC', 'planned'], ['emr', 'PHIE', 'planned']
    ],
    PT: [
      ['identity', 'Cartão de Cidadão', 'planned'], ['coverage', 'SNS', 'planned'],
      ['licenses', 'Ordem dos Médicos', 'planned'], ['emr', 'RSE', 'planned']
    ],
    PY: [['identity', 'Registro Civil', 'planned'], ['coverage', 'IPS', 'planned']],
    US: [['identity', 'SSA (SSN)', 'planned'], ['coverage', 'CMS', 'planned'], ['emr', 'ONC / TEFCA', 'planned']],
    UY: [['identity', 'DNIC', 'planned'], ['coverage', 'FONASA / JUNASA', 'planned'], ['emr', 'HCEN', 'planned']]
  };

  // Desk and doctor functions, then the AI ones: [name key, what key, icon].
  var DESK = [
    ['connDeskRequests', 'connDeskRequestsWhat', 'checklist'],
    ['connDeskDirectory', 'connDeskDirectoryWhat', 'search'],
    ['connDeskCenters', 'connDeskCentersWhat', 'invite-hospital'],
    ['connDeskAgenda', 'connDeskAgendaWhat', 'calendar'],
    ['connDeskWaitlist', 'connDeskWaitlistWhat', 'bell'],
    ['connDeskReports', 'connDeskReportsWhat', 'line-chart'],
    ['connDeskAudit', 'connDeskAuditWhat', 'shield']
  ];
  var AI = [
    ['connAiReferral', 'connAiReferralWhat', 'document'],
    ['connAiInterview', 'connAiInterviewWhat', 'conversation'],
    ['connAiSummary', 'connAiSummaryWhat', 'soap-note'],
    ['connAiLabs', 'connAiLabsWhat', 'test-tube'],
    ['connAiDni', 'connAiDniWhat', 'id-card']
  ];

  var TABS = ['connectors', 'desk', 'ai'];
  var TAB_KEYS = { connectors: 'connTabConnectors', desk: 'connTabDesk', ai: 'connTabAi' };
  var STATUS_KEYS = { live: 'connStatusLive', progress: 'connStatusProgress', planned: 'connStatusPlanned' };

  /* -------------------------------------------------------------- engine */

  var root, tabEls, panelEl, countryWrap, selectEl, flagEl;
  var state = { tab: 'connectors', country: DEFAULT_COUNTRY, picked: false };

  function t(key) {
    var i18n = window.HumanRoundsI18n;
    var text = i18n && i18n.t ? i18n.t(key) : null;
    return text == null ? key : text;
  }

  function lang() { return document.documentElement.lang || 'en'; }

  var namesFor = {};
  function countryName(code) {
    try {
      var l = lang();
      namesFor[l] = namesFor[l] || new Intl.DisplayNames([l], { type: 'region' });
      return namesFor[l].of(code) || code;
    } catch (e) { return code; }
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function img(src, cls) {
    var node = document.createElement('img');
    node.className = cls;
    node.src = src;
    node.alt = '';
    node.width = 32;
    node.height = 32;
    node.loading = 'lazy';
    return node;
  }

  function iconSrc(name) { return ICON_DIR + name + '.svg' + ICON_V; }

  function row(opts) {
    var tr = el('tr');
    tr.setAttribute('role', 'row');
    var nameCell = el('th', 'conn-name');
    nameCell.scope = 'row';
    nameCell.setAttribute('role', 'rowheader');
    var wrap = el('span', 'conn-name-wrap');
    if (opts.logo) wrap.appendChild(img(LOGO_DIR + opts.logo, 'conn-logo'));
    else wrap.appendChild(img(iconSrc(opts.icon), 'conn-icon'));
    wrap.appendChild(el('span', 'conn-name-text', opts.name));
    nameCell.appendChild(wrap);
    tr.appendChild(nameCell);
    var what = el('td', 'conn-what', opts.what);
    what.setAttribute('role', 'cell');
    tr.appendChild(what);
    var status = el('td', 'conn-status');
    status.setAttribute('role', 'cell');
    var badge = el('span', 'conn-badge conn-badge--' + opts.status);
    badge.appendChild(el('span', 'conn-dot'));
    badge.appendChild(document.createTextNode(t(STATUS_KEYS[opts.status])));
    status.appendChild(badge);
    tr.appendChild(status);
    return tr;
  }

  function rowsFor(tab) {
    var rows = [];
    if (tab === 'connectors') {
      (COUNTRIES[state.country] || []).slice().sort(function (a, b) {
        return ROLE_ORDER.indexOf(a[0]) - ROLE_ORDER.indexOf(b[0]);
      }).forEach(function (c) {
        rows.push({ name: c[1], what: t(ROLES[c[0]].what), icon: ROLES[c[0]].icon, logo: c[3], status: c[2] });
      });
      GLOBAL.forEach(function (g) {
        rows.push({ name: g.name, what: t(g.what), icon: g.icon, logo: g.logo, status: g.status });
      });
    } else {
      (tab === 'desk' ? DESK : AI).forEach(function (d) {
        rows.push({ name: t(d[0]), what: t(d[1]), icon: d[2], status: 'live' });
      });
    }
    return rows;
  }

  function renderTable() {
    var table = el('table', 'conn-table');
    table.setAttribute('role', 'table');
    var head = el('thead');
    head.setAttribute('role', 'rowgroup');
    var hr = el('tr');
    hr.setAttribute('role', 'row');
    ['connColName', 'connColWhat', 'connColStatus'].forEach(function (key) {
      var th = el('th', null, t(key));
      th.scope = 'col';
      th.setAttribute('role', 'columnheader');
      hr.appendChild(th);
    });
    head.appendChild(hr);
    table.appendChild(head);
    var body = el('tbody');
    body.setAttribute('role', 'rowgroup');
    rowsFor(state.tab).forEach(function (r) { body.appendChild(row(r)); });
    table.appendChild(body);
    panelEl.textContent = '';
    panelEl.appendChild(table);
  }

  function renderTabs() {
    TABS.forEach(function (name, i) {
      var tab = tabEls[i];
      tab.textContent = t(TAB_KEYS[name]);
      var on = name === state.tab;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
    });
    tabEls[0].parentNode.setAttribute('aria-label', t('connTabsLabel'));
    panelEl.setAttribute('aria-labelledby', 'connTab-' + state.tab);
    countryWrap.hidden = state.tab !== 'connectors';
  }

  function renderCountry() {
    var names = {};
    Object.keys(COUNTRIES).forEach(function (code) { names[code] = countryName(code); });
    var codes = Object.keys(COUNTRIES).sort(function (a, b) {
      return names[a].localeCompare(names[b], lang());
    });
    selectEl.textContent = '';
    codes.forEach(function (code) {
      var opt = el('option', null, names[code]);
      opt.value = code;
      selectEl.appendChild(opt);
    });
    var other = el('option', null, t('connCountryOther'));
    other.value = '';
    selectEl.appendChild(other);
    selectEl.value = COUNTRIES[state.country] ? state.country : '';
    flagEl.src = COUNTRIES[state.country]
      ? iconSrc('flag-' + state.country.toLowerCase())
      : iconSrc('globe');
    countryWrap.querySelector('.conn-country-label').textContent = t('connCountry');
  }

  function render() {
    renderTabs();
    renderCountry();
    renderTable();
  }

  function setTab(name, focus) {
    state.tab = name;
    render();
    if (focus) tabEls[TABS.indexOf(name)].focus();
  }

  function onTabKey(event) {
    var i = TABS.indexOf(state.tab);
    var next = null;
    if (event.key === 'ArrowRight') next = (i + 1) % TABS.length;
    else if (event.key === 'ArrowLeft') next = (i + TABS.length - 1) % TABS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = TABS.length - 1;
    if (next == null) return;
    event.preventDefault();
    setTab(TABS[next], true);
  }

  /* ------------------------------------------------------------- country */

  function codeOf(value) {
    return value && /^[A-Za-z]{2}$/.test(value) ? value.toUpperCase() : null;
  }

  function applyDetected(code) {
    if (state.picked || document.activeElement === selectEl) return;
    state.country = code || DEFAULT_COUNTRY;
    render();
  }

  function detectByIp() {
    var controller = 'AbortController' in window ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, 4000);
    fetch('https://ipwho.is/', { signal: controller ? controller.signal : undefined })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        clearTimeout(timer);
        if (data && data.success !== false) {
          var code = codeOf(data.country_code);
          if (code) applyDetected(code);
        }
      })
      .catch(function () { clearTimeout(timer); });
  }

  function init() {
    root = document.getElementById('connectors');
    if (!root) return;
    tabEls = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    panelEl = root.querySelector('[role="tabpanel"]');
    countryWrap = root.querySelector('.conn-country');
    selectEl = root.querySelector('.conn-country-select');
    flagEl = root.querySelector('.conn-flag');

    tabEls.forEach(function (tab, i) {
      tab.addEventListener('click', function () { setTab(TABS[i], false); });
      tab.addEventListener('keydown', onTabKey);
    });
    selectEl.addEventListener('change', function () {
      state.picked = true;
      state.country = selectEl.value;
      render();
    });
    window.addEventListener('human-rounds:language', render);

    var cf = codeOf(document.body.getAttribute('data-cf-country'));
    state.country = cf || DEFAULT_COUNTRY;
    render();
    if (!cf) detectByIp();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
