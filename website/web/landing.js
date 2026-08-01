/* Distinct English and Argentine-Spanish voices for the Human Rounds public site. */
(function () {
  var copy = {
    en: {
      navHow: 'How it works',
      navRoadmap: 'Roadmap',
      navBlog: 'Blog',
      navOpenSource: 'Open source ↗',
      navDemo: 'Live demo',
      language: 'Español',

      heroTitle: 'The open-source, AI-native medical platform',
      heroTagline: 'Humans do the rounds. AI does the rest.',
      heroLead: 'AI interviews patients before the visit, reads handwritten referral orders from a photo, judges urgency, and writes to the health record. The care team walks in prepared. Live today in a real public hospital. Free to run, open to inspect.',
      heroLinkDemo: 'Live demo',
      heroLinkOpenSource: 'Open source',
      modulesCaption: 'Human Rounds connects modular workflows around the patient–care-team relationship; every status is explicit.',

      flowTitle: 'Every patient encounter, prepared by AI.',
      flowIntro: 'Human Rounds automates the repetitive work before, during, and after each visit. Your existing medical record remains the source of truth — clinicians review every recommendation.',
      flowBadge1: 'Before the visit',
      flowBadge2: 'During the visit',
      flowBadge3: 'Around the visit',
      flowBadge4: 'After the visit',
      flowPatientTitle: 'AI interviews and prioritizes patients',
      flowPatientText: 'Patients describe their problem in their own words. AI asks follow-up questions, estimates urgency, and places the patient in the right queue.',
      flowClinicianTitle: 'Everything the clinician needs is already prepared',
      flowClinicianText: 'The dashboard surfaces relevant history, medications, past visits, trends, and key findings before the conversation begins.',
      flowOpsTitle: 'One workflow instead of disconnected systems',
      flowOpsText: 'Registration, scheduling, arrivals, waiting-room management, queues, and insurance claims run in one coordinated workflow.',
      flowRecordTitle: 'Documentation completes itself',
      flowRecordText: 'The consultation is summarized automatically. Prescriptions, referrals, lab orders, and follow-up instructions are generated for clinician review.',
      clinicianDecides: 'AI prepares. The professional decides.',

      roadmapTitle: 'Roadmap',
      roadmapLiveTitle: 'Live',
      roadmapLiveSubtitle: 'Running at the Pinamar reference installation',
      roadmapPrototypedTitle: 'Prototyped',
      roadmapPrototypedSubtitle: 'Built in an internal prototype, entering Human Rounds after review',
      roadmapPlannedTitle: 'Planned',
      roadmapPlannedSubtitle: 'Not started yet',

      kbLive1Title: 'Find a service by typing 3 letters', kbLive1Text: 'Search with stemming across the hospital and 7 health centres',
      kbLive2Title: 'Book online in 2 clicks', kbLive2Text: 'Real slots, nearest first, held while you decide',
      kbLive3Title: 'Referral orders read by AI', kbLive3Text: 'Even handwriting; staff approve, the AI proposes',
      kbLive4Title: 'Rejections carry the next step', kbLive4Text: 'Alternative slots or a re-upload link, never a dead end',
      kbLive5Title: 'Patient accounts', kbLive5Text: 'Sign up with a photo of your DNI',
      kbLive6Title: 'Coverage check (PUCO)', kbLive6Text: 'The patient’s insurance is detected automatically from the national registry',
      kbLive7Title: 'Day-before reminders by email and WhatsApp', kbLive7Text: 'Reply YES or NO to confirm or cancel',
      kbLive8Title: 'Cancellation + waitlist', kbLive8Text: 'A freed slot is re-offered automatically to the next patient',
      kbLive9Title: 'Booking chat', kbLive9Text: 'On the site and on WhatsApp',
      kbLive10Title: 'Staff panel', kbLive10Text: 'Request queue, today’s patients, doctor agendas, capacity and billing-recovery reports',
      kbLive11Title: 'Health-record handoff', kbLive11Text: 'Writes to HSI with automatic retry; nothing breaks if the record is down',
      kbLive12Title: 'Multi-site engine', kbLive12Text: 'Data packs, languages, installer wizard, pluggable per-country connectors',

      kbProto1Title: 'Scan-to-register', kbProto1Text: 'DNI + insurance credential scan fills the health-record registration',
      kbProto2Title: 'Voice intake', kbProto2Text: 'The patient dictates symptoms and answers follow-ups',
      kbProto3Title: 'Triage codes', kbProto3Text: 'With deterministic red-flag rules the model can escalate but never downgrade',
      kbProto4Title: 'SOAP summary + differential probabilities', kbProto4Text: 'For the clinician',
      kbProto5Title: 'Orders by checkbox', kbProto5Text: 'To the electronic system or the printer',

      kbPlanned1Title: 'Teleconsultation',
      kbPlanned2Title: 'Clinical-history summary',
      kbPlanned3Title: 'More regional connectors', kbPlanned3Text: 'Identity, coverage and record systems beyond Argentina',

      blogBackLink: 'More stories',

      storiesTitle: 'Use cases',
      storyReadMore: 'Read more →',
      storyClose: 'Close ↑',

      story1Para1: 'Grace needs to see a cardiologist. She doesn\'t know which health centre has one, or when.',
      story1Para2: 'She types three letters into the search box. Two clicks books the nearest opening. Before the visit, she dictates her symptoms by voice instead of filling out a form.',
      story1Fact1: '3 letters → the right service, nearest first',
      story1Fact2: '2 clicks, no phone call',
      story1Fact3: 'Blood-test order arrives a week ahead',
      story1Fact4: 'One visit instead of two',
      story2Para1: 'Dr. Nguyen opens today\'s list before the first patient arrives. Each row shows a triage colour and a one-line summary — no file to dig through.',
      story2Para2: 'A new patient\'s story is already on the screen: her own words, a SOAP summary, a differential ranked by likelihood. He examines her. He talks to her. That part stays his — no software touches it.',
      story2Fact1: 'Triage colour + one-line summary, no digging',
      story2Fact2: 'SOAP note & differential ready before he speaks',
      story2Fact3: 'He checks the boxes on orders he agrees with',
      story2Fact4: 'No typing during the visit',
      story3Para1: 'Sonia starts her morning with a queue of referral orders — some handwritten, some photos taken in a hurry.',
      story3Para2: 'The AI already read every one overnight: date, licence, name match. She reviews the proposals, not the raw images — rejects two, approves the rest. Nobody hits a dead end.',
      story3Fact1: 'AI reads every referral overnight, handwriting included',
      story3Fact2: 'Proposes accept or reject, with the reason attached',
      story3Fact3: 'Rejected patients get the next step, not a dead end',
      story3Fact4: 'Attendance goes up',
      storyPermalink: 'Permalink',
      phoneSearchText: 'car',
      phoneResultTitle: 'Cardiology',
      phoneResultSub: 'Hospital de Pinamar · 10 min',
      phoneResultBtn: 'Book',

      blogPost1Title: 'Three letters to a cardiologist',
      blogPost1Body:
        '<p>Grace needs to see a cardiologist. She doesn’t know which health centre has one, or when.</p>' +
        '<p>She opens the search box and types <strong>“car.”</strong> Three letters. The results already show <em>Cardiology</em>, at the hospital and at the health centre 10 minutes closer to her house.</p>' +
        '<p>She picks the <strong>nearest appointment</strong>. Two clicks and it’s booked, no phone call, no waiting room, no callback.</p>' +
        '<p><strong>Before the visit, she talks instead of typing.</strong> Grace dictates her symptoms by voice, answers a few follow-up questions, and the system organises what she said into something a doctor can use.</p>' +
        '<p>A week before the appointment, an <strong>order for blood work arrives</strong>. There’s still time to get it done before the visit, not after.</p>' +
        '<p>She walks into the consultation with results already in hand. The cardiologist reads them during the visit, not two weeks later in a second appointment.</p>' +
        '<p><strong>One visit instead of two.</strong> One waiting period instead of two. The difference isn’t a new test or a new specialist — it’s that the paperwork happened in the background while Grace kept living her week.</p>' +
        '<p>That’s the idea behind Human Rounds: the system does the searching, the booking, the ordering and the reminding. The people — the doctor, the phlebotomist, the receptionist — do the parts that need a person.</p>',

      blogPost2Title: 'The doctor walks in prepared',
      blogPost2Body:
        '<p>Dr. Nguyen opens today’s list before the first patient arrives.</p>' +
        '<p>Each row shows a name, a <strong>triage colour</strong>, and a one-line summary. No file to dig through, no chart to reconstruct from memory.</p>' +
        '<p>A new patient comes in, someone he hasn’t met before. Her intake already sits on the screen: <strong>her own words</strong>, captured when she booked. Below that, a <strong>SOAP summary</strong> the system built from her account, and a <strong>differential with probabilities</strong> ranked by likelihood.</p>' +
        '<p>Suggested orders sit at the bottom, tests and medication, proposed, not decided.</p>' +
        '<p>He examines her. He talks to her. That part is his, and no software touches it: reading a person, noticing what they don’t say, deciding what matters. That’s the part machines don’t do.</p>' +
        '<p>When he’s done, he <strong>checks the boxes</strong> on the orders he agrees with. Some go straight to the electronic system. Others print, for the patient to carry. He doesn’t retype a single result, a single vital, a single medication name.</p>' +
        '<p><strong>No typing.</strong> The screen work happened before he walked in, and it stops the moment he starts talking to the patient.</p>' +
        '<p>That’s the trade Human Rounds makes: AI reads, organises and suggests. The doctor decides. The visit stays what it always was — one person examining another.</p>',

      blogPost3Title: 'A queue that reads itself',
      blogPost3Body:
        '<p>Sonia starts her morning with a queue of appointment requests, each one carrying a referral order a patient uploaded, a photo, sometimes handwritten.</p>' +
        '<p>She doesn’t read them cold. <strong>The AI has already read every order</strong> overnight: is the date valid, is the doctor’s licence current, does the name on the order match the patient’s account. Handwriting included.</p>' +
        '<p>For each request, the AI proposes an action, <strong>accept or reject</strong>, with the reason attached. Sonia reviews the proposals, not the raw images.</p>' +
        '<p>She <strong>rejects two</strong>. One order is expired; one name doesn’t match. She <strong>approves the rest</strong>.</p>' +
        '<p>The rejected patients don’t hit a dead end. They get a notification with <strong>the next step already attached</strong>, a link to re-upload a corrected order, or the right service with its next free slots.</p>' +
        '<p>The approved patients get a reminder the day before their visit. They <strong>answer YES or NO</strong>, confirming or freeing the slot for someone else on the waitlist.</p>' +
        '<p>Nothing here replaces Sonia’s judgment; she still makes the final call on every request. What changed is what she spends her morning on: not deciphering handwriting and checking licence numbers, but deciding.</p>' +
        '<p><strong>Attendance goes up</strong> when a freed slot doesn’t sit empty, and when every rejection tells the patient exactly what to do next.</p>',

      invitationsTitle: 'Three ways in',
      inviteOrgTitle: 'Health organizations — run it.',
      inviteOrgText: 'Free to deploy, no licence fee; the Pinamar installation is live proof. Grant-funded public pilots can launch without a software licence fee.',
      inviteDevTitle: 'Developers — extend it.',
      inviteDevText: 'Fork the repo and submit a pull request with a local module: your region’s identity, coverage and health-record connectors.',
      inviteFundTitle: 'Investors and grant organizations — fund it.',
      inviteFundText: 'Money goes to hardening, independent validation and the next public pilots.',
      inviteContact: 'Contact',
      inviteGithub: 'GitHub'
    },
    es: {
      navHow: 'Cómo funciona',
      navRoadmap: 'Hoja de ruta',
      navBlog: 'Blog',
      navOpenSource: 'Código abierto ↗',
      navDemo: 'Demo en vivo',
      language: 'English',

      heroTitle: 'La plataforma médica de código abierto e IA nativa',
      heroTagline: 'La ronda la hacen las personas. El resto lo hace la IA.',
      heroLead: 'La IA entrevista al paciente antes de la consulta, lee derivaciones manuscritas desde una foto, estima la urgencia y escribe en la historia clínica. El equipo de salud entra a la consulta ya preparado. Hoy funciona en un hospital público de verdad. Gratis para instalar, abierto para auditar.',
      heroLinkDemo: 'Demo en vivo',
      heroLinkOpenSource: 'Código abierto',
      modulesCaption: 'Human Rounds conecta módulos alrededor del vínculo entre paciente y equipo de salud; el estado de cada uno es explícito.',

      flowTitle: 'Cada consulta, preparada por la IA.',
      flowIntro: 'Human Rounds automatiza el trabajo repetitivo antes, durante y después de cada consulta. Tu historia clínica actual sigue siendo la fuente de verdad: el equipo de salud revisa cada sugerencia.',
      flowBadge1: 'Antes de la consulta',
      flowBadge2: 'Durante la consulta',
      flowBadge3: 'Alrededor de la consulta',
      flowBadge4: 'Después de la consulta',
      flowPatientTitle: 'La IA entrevista y prioriza a los pacientes',
      flowPatientText: 'Los pacientes cuentan lo que les pasa con sus propias palabras. La IA repregunta, estima la urgencia y los ubica en la cola correcta.',
      flowClinicianTitle: 'Todo lo que el profesional necesita ya está preparado',
      flowClinicianText: 'El panel muestra la historia relevante, la medicación, las consultas anteriores, las tendencias y los hallazgos clave antes de que arranque la charla.',
      flowOpsTitle: 'Un solo flujo en vez de sistemas sueltos',
      flowOpsText: 'El alta, el turno, la llegada, la sala de espera, la cola y la cobertura corren en un solo flujo coordinado.',
      flowRecordTitle: 'La documentación se completa sola',
      flowRecordText: 'La consulta se resume sola. Las recetas, derivaciones, órdenes de laboratorio e indicaciones de seguimiento se generan para que el profesional las revise.',
      clinicianDecides: 'La IA prepara. El profesional decide.',

      roadmapTitle: 'Hoja de ruta',
      roadmapLiveTitle: 'En vivo',
      roadmapLiveSubtitle: 'Funcionando en la instalación de referencia de Pinamar',
      roadmapPrototypedTitle: 'Prototipado',
      roadmapPrototypedSubtitle: 'Construido en un prototipo interno, entra a Human Rounds después de revisión',
      roadmapPlannedTitle: 'Planeado',
      roadmapPlannedSubtitle: 'Todavía sin empezar',

      kbLive1Title: 'Encontrá un servicio escribiendo 3 letras', kbLive1Text: 'Búsqueda con stemming en el hospital y los 7 centros de salud',
      kbLive2Title: 'Sacá un turno online en 2 clics', kbLive2Text: 'Turnos reales, el más cercano primero, reservado mientras decidís',
      kbLive3Title: 'Órdenes de derivación leídas por IA', kbLive3Text: 'Incluso manuscritas; el personal aprueba, la IA propone',
      kbLive4Title: 'Los rechazos incluyen el próximo paso', kbLive4Text: 'Turnos alternativos o un link para resubir, nunca un callejón sin salida',
      kbLive5Title: 'Cuentas de paciente', kbLive5Text: 'Alta con una foto del DNI',
      kbLive6Title: 'Verificación de cobertura (PUCO)', kbLive6Text: 'La obra social del paciente se detecta automáticamente desde el padrón nacional',
      kbLive7Title: 'Recordatorios el día anterior por email y WhatsApp', kbLive7Text: 'Respondé SÍ o NO para confirmar o cancelar',
      kbLive8Title: 'Cancelación + lista de espera', kbLive8Text: 'Un turno liberado se reofrece automáticamente al próximo paciente',
      kbLive9Title: 'Chat para sacar turno', kbLive9Text: 'En el sitio y por WhatsApp',
      kbLive10Title: 'Panel de personal', kbLive10Text: 'Cola de solicitudes, pacientes del día, agendas médicas, reportes de capacidad y recupero',
      kbLive11Title: 'Envío a la historia clínica', kbLive11Text: 'Escribe en la HSI con reintento automático; nada se rompe si la historia está caída',
      kbLive12Title: 'Motor multi-sede', kbLive12Text: 'Paquetes de datos, idiomas, asistente de instalación, conectores enchufables por país',

      kbProto1Title: 'Alta por escaneo', kbProto1Text: 'El escaneo del DNI y la credencial de la obra social completa el registro en la historia clínica',
      kbProto2Title: 'Admisión por voz', kbProto2Text: 'El paciente dicta los síntomas y responde preguntas de seguimiento',
      kbProto3Title: 'Códigos de triage', kbProto3Text: 'Con reglas determinísticas de alarma que el modelo puede escalar pero nunca bajar',
      kbProto4Title: 'Resumen SOAP + probabilidades diferenciales', kbProto4Text: 'Para el profesional',
      kbProto5Title: 'Órdenes con un tilde', kbProto5Text: 'Al sistema electrónico o a la impresora',

      kbPlanned1Title: 'Teleconsulta',
      kbPlanned2Title: 'Resumen de historia clínica',
      kbPlanned3Title: 'Más conectores regionales', kbPlanned3Text: 'Sistemas de identidad, cobertura e historia clínica más allá de Argentina',

      blogBackLink: 'Más historias',

      storiesTitle: 'Casos de uso',
      storyReadMore: 'Leer más →',
      storyClose: 'Cerrar ↑',

      story1Para1: 'Grace necesita ver a un cardiólogo. No sabe en qué centro de salud hay uno, ni cuándo.',
      story1Para2: 'Escribe tres letras en el buscador. Dos clics y reserva el turno más cercano. Antes de la consulta, dicta sus síntomas por voz en vez de llenar un formulario.',
      story1Fact1: '3 letras → el servicio correcto, el más cercano primero',
      story1Fact2: '2 clics, sin llamada telefónica',
      story1Fact3: 'La orden de análisis de sangre llega una semana antes',
      story1Fact4: 'Una consulta en vez de dos',
      story2Para1: 'El Dr. Nguyen abre la lista del día antes de que llegue el primer paciente. Cada fila muestra un color de triage y un resumen de una línea, sin carpeta que revolver.',
      story2Para2: 'La historia de una paciente nueva ya está en la pantalla: sus propias palabras, un resumen SOAP, un diferencial ordenado por probabilidad. La examina. Habla con ella. Esa parte sigue siendo suya — ningún software la toca.',
      story2Fact1: 'Color de triage + resumen de una línea, sin buscar',
      story2Fact2: 'Nota SOAP y diferencial listos antes de hablar',
      story2Fact3: 'Tilda las órdenes que aprueba',
      story2Fact4: 'Sin tipear durante la consulta',
      story3Para1: 'Sonia empieza la mañana con una cola de órdenes de derivación — algunas manuscritas, algunas fotos sacadas apurada.',
      story3Para2: 'La IA ya leyó todas durante la noche: fecha, matrícula, coincidencia de nombre. Ella revisa las propuestas, no las imágenes crudas — rechaza dos, aprueba el resto. Nadie llega a un callejón sin salida.',
      story3Fact1: 'La IA lee cada derivación de noche, manuscritas incluidas',
      story3Fact2: 'Propone aceptar o rechazar, con el motivo',
      story3Fact3: 'Los rechazados reciben el siguiente paso, no un cierre',
      story3Fact4: 'Aumenta la asistencia',
      storyPermalink: 'Enlace permanente',
      phoneSearchText: 'car',
      phoneResultTitle: 'Cardiología',
      phoneResultSub: 'Hospital de Pinamar · 10 min',
      phoneResultBtn: 'Reservar',

      blogPost1Title: 'Tres letras hasta un cardiólogo',
      blogPost1Body:
        '<p>Grace necesita ver a un cardiólogo. No sabe en qué centro de salud atienden, ni cuándo.</p>' +
        '<p>Abre el buscador y escribe <strong>“car.”</strong> Tres letras. Los resultados ya muestran <em>Cardiología</em>, en el hospital y en el centro de salud que le queda 10 minutos más cerca de su casa.</p>' +
        '<p>Elige el <strong>turno más cercano</strong>. Dos clics y queda reservado, sin llamado, sin sala de espera, sin que la vuelvan a llamar.</p>' +
        '<p><strong>Antes de la consulta, habla en vez de tipear.</strong> Grace dicta sus síntomas por voz, responde algunas preguntas de seguimiento, y el sistema ordena lo que contó en algo que el médico puede usar.</p>' +
        '<p>Una semana antes del turno, llega una <strong>orden para análisis de sangre</strong>. Todavía hay tiempo de hacérselos antes de la consulta, no después.</p>' +
        '<p>Llega a la consulta con los resultados en mano. El cardiólogo los lee en el momento, no dos semanas después en un segundo turno.</p>' +
        '<p><strong>Una consulta en lugar de dos.</strong> Una espera en lugar de dos. La diferencia no es un estudio nuevo ni un especialista nuevo: es que el trámite pasó mientras Grace seguía con su semana.</p>' +
        '<p>Esa es la idea de Human Rounds: el sistema busca, reserva, pide los estudios y recuerda. Las personas (el médico, quien saca la sangre, la recepcionista) hacen la parte que necesita una persona.</p>',

      blogPost2Title: 'El médico entra preparado',
      blogPost2Body:
        '<p>El Dr. Nguyen abre la lista del día antes de que llegue el primer paciente.</p>' +
        '<p>Cada fila muestra un nombre, un <strong>color de triage</strong> y un resumen de una línea. Sin carpeta para revisar, sin historia para reconstruir de memoria.</p>' +
        '<p>Entra una paciente nueva, alguien que no conoce. Su admisión ya está en la pantalla: <strong>sus propias palabras</strong>, registradas cuando sacó el turno. Debajo, un <strong>resumen SOAP</strong> que el sistema armó a partir de su relato, y un <strong>diferencial con probabilidades</strong> ordenado por probabilidad.</p>' +
        '<p>Al final hay órdenes sugeridas, estudios y medicación, propuestas, no decididas.</p>' +
        '<p>La examina. Habla con ella. Esa parte es suya, y ningún software la toca: leer a una persona, notar lo que no dice, decidir qué importa. Eso no lo hace ninguna máquina.</p>' +
        '<p>Cuando termina, <strong>tilda</strong> las órdenes con las que está de acuerdo. Algunas van directo al sistema electrónico. Otras se imprimen, para que la paciente se las lleve. No vuelve a tipear ni un resultado, ni un signo vital, ni el nombre de un medicamento.</p>' +
        '<p><strong>Sin tipear nada.</strong> El trabajo de pantalla ya pasó antes de que él entrara, y se detiene en el momento en que empieza a hablar con la paciente.</p>' +
        '<p>Esa es la apuesta de Human Rounds: la IA lee, ordena y sugiere. El médico decide. La consulta sigue siendo lo que siempre fue: una persona examinando a otra.</p>',

      blogPost3Title: 'Una cola que se lee sola',
      blogPost3Body:
        '<p>Sonia empieza la mañana con una cola de solicitudes de turno, cada una con una orden médica que subió el paciente, a veces una foto, a veces manuscrita.</p>' +
        '<p>No las lee en frío. <strong>La IA ya leyó cada orden</strong> durante la noche: si la fecha es válida, si la matrícula del médico está vigente, si el nombre de la orden coincide con la cuenta del paciente. Manuscritas incluidas.</p>' +
        '<p>Para cada solicitud, la IA propone una acción, <strong>aceptar o rechazar</strong>, con el motivo. Sonia revisa las propuestas, no las imágenes crudas.</p>' +
        '<p><strong>Rechaza dos.</strong> Una orden está vencida, un nombre no coincide. <strong>Aprueba el resto.</strong></p>' +
        '<p>Los pacientes rechazados no llegan a un callejón sin salida. Reciben una notificación con <strong>el próximo paso ya incluido</strong>: un link para resubir la orden corregida, o el servicio correcto con sus próximos turnos disponibles.</p>' +
        '<p>Los pacientes aprobados reciben un recordatorio el día anterior a la consulta. <strong>Responden SÍ o NO</strong>, confirmando o liberando el turno para el siguiente de la lista de espera.</p>' +
        '<p>Nada de esto reemplaza el criterio de Sonia: la decisión final de cada solicitud sigue siendo suya. Lo que cambió es en qué se le va la mañana: no en descifrar letra manuscrita ni verificar matrículas, sino en decidir.</p>' +
        '<p><strong>La asistencia sube</strong> cuando un turno liberado no queda vacío, y cuando cada rechazo le dice al paciente exactamente qué hacer.</p>',

      invitationsTitle: 'Tres formas de sumarte',
      inviteOrgTitle: 'Instituciones de salud — ponela a andar.',
      inviteOrgText: 'Gratis para instalar, sin costo de licencia; la instalación de Pinamar es la prueba en producción. Los pilotos públicos financiados por subsidios pueden lanzarse sin costo de licencia de software.',
      inviteDevTitle: 'Desarrolladores — extendela.',
      inviteDevText: 'Forkeá el repositorio y mandá un pull request con un módulo local: los conectores de identidad, cobertura e historia clínica de tu región.',
      inviteFundTitle: 'Inversores y organizaciones de subsidios — financiala.',
      inviteFundText: 'El dinero se destina a robustecer el sistema, la validación independiente y los próximos pilotos públicos.',
      inviteContact: 'Contacto',
      inviteGithub: 'GitHub'
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

  function initStoryCards() {
    var toggles = document.querySelectorAll('[data-story-toggle]');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener('click', function () {
        this.closest('.story-card').classList.toggle('is-open');
      });
    }
  }

  function init() {
    var lang = initialLanguage();
    setLanguage(lang);
    var toggle = document.querySelector('[data-language-toggle]');
    if (toggle) toggle.addEventListener('click', function () {
      setLanguage(document.documentElement.lang === 'en' ? 'es' : 'en');
    });
    initStoryCards();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
