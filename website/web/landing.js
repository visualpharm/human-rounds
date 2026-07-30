/* Distinct English and Argentine-Spanish voices for the Human Rounds public site. */
(function () {
  var copy = {
    en: {
      navPlatform: 'How it works',
      navReference: 'Reference',
      navFunding: 'Funding',
      navRoadmap: 'Roadmap',
      navGithub: 'GitHub',
      navDemo: 'Pinamar Turnos',
      referenceLink: 'Reference installation',
      language: 'Español',
      heroTitle: 'Let AI take the screen work. Keep care human.',
      heroLead: 'Human Rounds is an AI-native, open-source layer for the work around care. It automates access, referrals, scheduling and clinical preparation so patients and care teams can talk to each other again.',
      heroProof: '<strong>AI for everything around the encounter.</strong> Human attention stays between people.',
      screenshotAlt: 'Pinamar Turnos public-health appointment and services interface',
      screenshotCaption: 'Pinamar Turnos, the first Human Rounds reference installation.',
      flowTitle: 'The encounter is the point.',
      flowIntro: 'Human Rounds was rebuilt with artificial intelligence in mind from the start. AI handles the repetitive work before, during and after care while the existing clinical record remains authoritative.',
      flowPatientTitle: 'Listen',
      flowPatientText: 'Capture the patient’s words by voice or text, with self-service or assisted access.',
      flowOpsTitle: 'Coordinate',
      flowOpsText: 'Automate appointments, referrals, arrivals, queues and follow-up.',
      flowClinicianTitle: 'Prepare',
      flowClinicianText: 'Bring forward the facts, alerts and evidence a professional needs to decide.',
      flowRecordTitle: 'Record',
      flowRecordText: 'Write structured outcomes back to the authorised health-information system.',
      clinicianDecides: 'AI prepares. The professional decides.',
      statusTitle: 'One working installation. One careful module at a time.',
      statusIntro: 'Human Rounds starts with Pinamar Turnos. Capabilities built in the earlier Sana work enter the public project only after review, integration and an honest status label.',
      workingTitle: 'Reference installation',
      workingText: 'Pinamar Turnos is the working base: a public-health access layer for a municipal hospital and primary-care network.',
      working1: '<strong>Service discovery</strong> across the hospital and community health centres.',
      working2: '<strong>Appointments and walk-in guidance</strong> that reflect how each service actually attends.',
      working3: '<strong>Referral-first requests</strong> with preparation guidance and professional review.',
      working4: '<strong>Patient accounts and follow-up</strong> without duplicating the official clinical record.',
      working5: '<strong>Institutional administration</strong> for services, centres, schedules and requests.',
      working6: '<strong>Health-record handoff</strong> through the authorised local connector.',
      developmentTitle: 'Entering Human Rounds',
      developmentText: 'These AI-native modules are implemented in earlier Sana prototypes and are now in development for reviewed incorporation. The prototypes themselves are not public product claims.',
      development1: '<strong>Voice-first intake</strong> that structures the patient’s account without replacing it.',
      development2: '<strong>Clinician summaries</strong> that put consequential information first.',
      development3: '<strong>Evidence-backed differential suggestions</strong> with probabilities only after local calibration.',
      development4: '<strong>Deterministic safety rules</strong> that an AI model cannot downgrade.',
      development5: '<strong>Identity and coverage automation</strong> through authorised regional connectors.',
      developmentNote: 'No model diagnoses, prescribes, discharges or changes care without a professional action.',
      openTitle: 'AI-native. Open by design.',
      openIntro: 'The intelligence is built into the workflow, not bolted on as a chatbot. The code, operating model and local adapters are designed to remain inspectable and replaceable.',
      open1Title: 'Open source',
      open1Text: 'The public repository begins with the website, architecture and roadmap. Reviewed modules follow one by one.',
      open2Title: 'Human authority',
      open2Text: 'AI can listen, organise and suggest. People retain clinical judgment, consent and accountability.',
      open3Title: 'Local control',
      open3Text: 'Institutions keep their system of record, policies and deployment choices.',
      open4Title: 'Built for reality',
      open4Text: 'Shared devices, intermittent connectivity and low-bandwidth workflows are first-class conditions.',
      fundingTitle: 'What grant funding unlocks',
      fundingIntro: 'Grant support turns a working municipal reference into audited, reusable public infrastructure.',
      funding1Title: 'Reference deployment',
      funding1Text: 'Harden Pinamar Turnos, train teams and measure access and workload in real operations.',
      funding2Title: 'AI module integration',
      funding2Text: 'Move one reviewed Sana capability at a time into Human Rounds with safety and governance gates.',
      funding3Title: 'Independent validation',
      funding3Text: 'Measure time saved, access, safety, clinician workload and calibrated model performance.',
      funding4Title: 'Open implementation kit',
      funding4Text: 'Publish reviewed modules, adapters, governance templates and findings for the next site.',
      fundingPromise: '<strong>Grant-funded public pilots can launch without a software licence fee.</strong> Funding pays for implementation, integration, validation and support.',
      roadmapTitle: 'Roadmap',
      roadmapNowTitle: 'Now',
      roadmapNowText: 'Human Rounds public project and Pinamar Turnos as the working reference installation.',
      roadmapNextTitle: 'Next',
      roadmapNextText: 'Integrate and publish one reviewed AI-native module at a time.',
      roadmapLaterTitle: 'Then',
      roadmapLaterText: 'Independent evaluation, additional public-health pilots and regional interoperability packs.',
      partnerTitle: 'Fund or implement Human Rounds',
      partnerText: 'We are looking for public-health institutions, universities, foundations and implementation partners that can host, evaluate or fund a real pilot.',
      partnerGithub: 'GitHub repository',
      partnerDemo: 'Pinamar Turnos reference',
      partnerBrief: 'Funding roadmap'
    },
    es: {
      navPlatform: 'Cómo funciona',
      navReference: 'Pinamar',
      navFunding: 'Financiamiento',
      navRoadmap: 'Hoja de ruta',
      navGithub: 'GitHub',
      navDemo: 'Pinamar Turnos',
      referenceLink: 'Instalación de referencia',
      language: 'English',
      heroTitle: 'Que la IA se ocupe del sistema. Que la atención vuelva a ser humana.',
      heroLead: 'Human Rounds nace desde Pinamar Turnos para automatizar el registro, los turnos, las derivaciones, la documentación y la preparación clínica. Menos conversación con la pantalla. Más conversación entre el paciente y el equipo de salud.',
      heroProof: '<strong>IA nativa para todo lo que rodea la consulta.</strong> El vínculo humano no se automatiza.',
      screenshotAlt: 'Pinamar Turnos, interfaz para turnos y servicios del sistema público de salud',
      screenshotCaption: 'Pinamar Turnos, primera instalación de referencia de Human Rounds.',
      flowTitle: 'La consulta es entre personas.',
      flowIntro: 'Human Rounds fue replanteado desde cero con inteligencia artificial. La IA ordena el trabajo antes, durante y después de la atención; la HSI conserva la historia clínica oficial y el profesional conserva la decisión.',
      flowPatientTitle: 'Escuchar',
      flowPatientText: 'Recibir el relato del paciente por voz o texto, desde el celular o con ayuda del equipo.',
      flowOpsTitle: 'Coordinar',
      flowOpsText: 'Automatizar turnos, órdenes, llegadas, colas, derivaciones y seguimiento.',
      flowClinicianTitle: 'Preparar',
      flowClinicianText: 'Presentar hechos, alertas y evidencia para que el profesional decida con menos pantalla.',
      flowRecordTitle: 'Registrar',
      flowRecordText: 'Devolver el resultado estructurado al sistema de salud autorizado.',
      clinicianDecides: 'La IA prepara. El profesional decide.',
      statusTitle: 'Una instalación real. Un módulo por vez.',
      statusIntro: 'Human Rounds empieza con Pinamar Turnos. Las funciones construidas antes en Sana se incorporan una por una, después de revisión, integración y validación. No mostramos prototipos como si fueran producto terminado.',
      workingTitle: 'Pinamar Turnos',
      workingText: 'La base funcional para el Hospital de Pinamar y los CAPS municipales de Pinamar, Ostende y Valeria del Mar.',
      working1: '<strong>Búsqueda de servicios</strong> del hospital y los centros de atención primaria.',
      working2: '<strong>Turnos y atención por orden de llegada</strong> según el funcionamiento real de cada servicio.',
      working3: '<strong>Solicitudes con orden médica</strong> y preparación clara antes de atenderse.',
      working4: '<strong>Cuenta del paciente y seguimiento</strong> sin duplicar la historia clínica oficial.',
      working5: '<strong>Gestión institucional</strong> de servicios, centros, horarios y solicitudes.',
      working6: '<strong>Conexión con HSI</strong> mediante el flujo autorizado de la instalación local.',
      developmentTitle: 'En desarrollo para Human Rounds',
      developmentText: 'Estos módulos de IA ya existen en los prototipos anteriores de Sana. Ahora se preparan para incorporarlos con revisión técnica, clínica e institucional, sin exponer los prototipos.',
      development1: '<strong>Admisión por voz</strong> que estructura el relato sin reemplazar las palabras del paciente.',
      development2: '<strong>Resúmenes para el equipo de salud</strong> con lo importante primero.',
      development3: '<strong>Sugerencias de diagnóstico diferencial</strong> con evidencia y probabilidades, siempre sujetas a calibración y revisión profesional.',
      development4: '<strong>Reglas de seguridad determinísticas</strong> que la IA no puede bajar de prioridad.',
      development5: '<strong>Automatización de identidad y cobertura</strong> mediante conectores institucionales autorizados.',
      developmentNote: 'Ningún modelo diagnostica, receta, da el alta ni cambia la atención sin una acción profesional.',
      openTitle: 'IA nativa. Código abierto.',
      openIntro: 'La inteligencia está dentro del flujo de trabajo, no agregada como un chatbot. El código, los adaptadores y las reglas operativas pueden auditarse, reemplazarse y mejorarse.',
      open1Title: 'Código abierto',
      open1Text: 'El repositorio público empieza con el sitio, la arquitectura y la hoja de ruta. Los módulos revisados se publican uno por uno.',
      open2Title: 'Autoridad humana',
      open2Text: 'La IA escucha, ordena y sugiere. El equipo conserva el criterio clínico, el consentimiento y la responsabilidad.',
      open3Title: 'Control local',
      open3Text: 'Cada institución conserva su historia clínica, sus reglas y la forma de desplegar el sistema.',
      open4Title: 'Hecho para el terreno',
      open4Text: 'Dispositivos compartidos, conectividad intermitente y poco ancho de banda son condiciones centrales.',
      fundingTitle: 'Qué habilita un subsidio',
      fundingIntro: 'El financiamiento convierte una referencia municipal funcional en infraestructura pública auditable y reutilizable.',
      funding1Title: 'Instalación de referencia',
      funding1Text: 'Fortalecer Pinamar Turnos, capacitar equipos y medir acceso y carga de trabajo en la operación real.',
      funding2Title: 'Integración de módulos de IA',
      funding2Text: 'Incorporar una capacidad revisada de Sana por vez, con controles de seguridad y gobernanza.',
      funding3Title: 'Validación independiente',
      funding3Text: 'Medir tiempo ahorrado, acceso, seguridad, carga profesional y calibración de los modelos.',
      funding4Title: 'Kit abierto de implementación',
      funding4Text: 'Publicar módulos, adaptadores, plantillas de gobernanza y resultados para el próximo municipio.',
      fundingPromise: '<strong>Los pilotos públicos financiados pueden comenzar sin costo de licencia de software.</strong> El subsidio paga implementación, integración, validación y soporte.',
      roadmapTitle: 'Hoja de ruta',
      roadmapNowTitle: 'Ahora',
      roadmapNowText: 'Human Rounds como proyecto público y Pinamar Turnos como instalación de referencia funcional.',
      roadmapNextTitle: 'Próximo',
      roadmapNextText: 'Integrar y publicar un módulo de IA nativa por vez, después de revisión.',
      roadmapLaterTitle: 'Después',
      roadmapLaterText: 'Evaluación independiente, nuevos municipios y conectores para provincias y países.',
      partnerTitle: 'Financiar o implementar Human Rounds',
      partnerText: 'Buscamos municipios, provincias, universidades, fundaciones y equipos de implementación que puedan alojar, evaluar o financiar un piloto real.',
      partnerGithub: 'Repositorio en GitHub',
      partnerDemo: 'Referencia de Pinamar Turnos',
      partnerBrief: 'Hoja de ruta de financiamiento'
    }
  };

  function setLanguage(lang) {
    if (!copy[lang]) lang = 'en';
    document.documentElement.lang = lang;
    document.body.setAttribute('data-language', lang);
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      if (copy[lang][key] == null) continue;
      if (nodes[i].hasAttribute('data-i18n-html')) nodes[i].innerHTML = copy[lang][key];
      else nodes[i].textContent = copy[lang][key];
    }
    var alt = document.querySelector('[data-i18n-alt]');
    if (alt) alt.alt = copy[lang][alt.getAttribute('data-i18n-alt')];
    var toggle = document.querySelector('[data-language-toggle]');
    if (toggle) {
      toggle.textContent = copy[lang].language;
      toggle.setAttribute('aria-label', lang === 'en' ? 'Cambiar a español' : 'Switch to English');
    }
    try { localStorage.setItem('human-rounds-language', lang); } catch {}
    window.dispatchEvent(new CustomEvent('human-rounds:language', { detail: { lang: lang } }));
  }

  function initialLanguage() {
    if (location.pathname === '/es') return 'es';
    if (location.pathname === '/en') return 'en';
    var query = new URLSearchParams(location.search).get('lang');
    if (copy[query]) return query;
    try {
      var saved = localStorage.getItem('human-rounds-language');
      if (copy[saved]) return saved;
    } catch {}
    return 'en';
  }

  function init() {
    var lang = initialLanguage();
    setLanguage(lang);
    var toggle = document.querySelector('[data-language-toggle]');
    if (toggle) toggle.addEventListener('click', function () {
      setLanguage(document.documentElement.lang === 'en' ? 'es' : 'en');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
