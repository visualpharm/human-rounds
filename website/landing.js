/* Distinct English and Argentine-Spanish voices for the Human Rounds public site. */
(function () {
  var copy = {
    en: {
      navHow: 'How it works',
      navRoadmap: 'Roadmap',
      navDocs: 'Docs',
      navBlog: 'Blog',
      navGithub: 'GitHub',
      navDemo: 'Live demo',
      navContact: 'Contact',
      language: 'Español',

      heroTitle: 'The open-source, AI-native medical platform',
      heroTagline: 'Humans do the rounds. AI does the rest.',
      heroLead: 'AI <a href="/docs/pre-consult-interview">interviews patients before the visit</a>, <a href="/docs/referral-orders">reads handwritten referral orders from a photo</a>, judges urgency, and <a href="/docs/health-record-handoff">writes to the health record</a>. The care team walks in prepared. Live today in a real public hospital. Free to run, open to inspect.',
      heroLinkDemo: 'Live demo',
      heroLinkOpenSource: 'Open source',
      heroLinkDocs: 'Documentation',

      constHubTitle: 'Your health network',
      constInstitutionsLabel: 'Who it talks to',

      flowTitle: 'Every patient encounter, prepared by AI.',
      flowIntro: 'Human Rounds automates the repetitive work before, during, and after each visit. Your existing medical record remains the source of truth — clinicians review every recommendation.',
      flowBadge1: 'Before the visit',
      flowBadge2: 'During the visit',
      flowBadge3: 'Around the visit',
      flowBadge4: 'After the visit',
      flowPatientTitle: 'AI interviews and prioritizes patients',
      flowPatientText: 'Patients describe their problem in their own words. AI asks follow-up questions, estimates urgency, and places the patient in the right queue.',
      flowOpsTitle: 'One workflow instead of disconnected systems',
      flowOpsText: 'Registration, scheduling, arrivals, waiting-room management, queues, and insurance claims run in one coordinated workflow.',
      flowClinicianTitle: 'Everything the clinician needs is already prepared',
      flowClinicianText: 'The dashboard surfaces relevant history, medications, past visits, trends, and key findings before the conversation begins.',
      flowRecordTitle: 'Documentation completes itself',
      flowRecordText: 'The consultation is summarized automatically. Prescriptions, referrals, lab orders, and follow-up instructions are generated for clinician review.',
      roadmapTitle: 'Roadmap',
      roadmapLiveTitle: 'Live',
      roadmapLiveSubtitle: 'Running at the Pinamar reference installation',
      roadmapPrototypedTitle: 'Prototyped',
      roadmapPrototypedSubtitle: 'Prototype ready, pending Human Rounds review',
      roadmapPlannedTitle: 'Planned',
      roadmapPlannedSubtitle: 'Not started yet',
      kbLive1Title: 'Find a service by typing 3 letters', kbLive1Text: 'Search with stemming across the hospital and 7 health centres',
      kbLive2Title: 'Book online in 2 clicks', kbLive2Text: 'Real slots, nearest first, held while you decide',
      kbLive3Title: 'Referral orders read by AI', kbLive3Text: 'Even handwriting; staff approve, the AI proposes',
      kbLive4Title: 'Rejections carry the next step', kbLive4Text: 'Alternative slots or a re-upload link, never a dead end',
      kbLive5Title: 'Patient accounts', kbLive5Text: 'Sign up with a photo of your DNI',
      kbLive6Title: 'Insurance lookup', kbLive6Text: 'The patient’s insurance is detected automatically from the national registry',
      kbLive7Title: 'Day-before reminders by email and WhatsApp', kbLive7Text: 'Reply YES or NO to confirm or cancel',
      kbLive8Title: 'Cancellation + waitlist', kbLive8Text: 'A freed slot is re-offered automatically to the next patient',
      kbLive9Title: 'Booking chat', kbLive9Text: 'On the site and on WhatsApp',
      kbLive10Title: 'Staff panel', kbLive10Text: 'Request queue, today’s patients, doctor agendas, capacity and billing-recovery reports',
      kbLive11Title: 'Health-record handoff', kbLive11Text: 'Writes to the national EHR with automatic retry; nothing breaks if the record is down',
      kbLive12Title: 'Multi-site engine', kbLive12Text: 'Data packs, languages, installer wizard, pluggable per-country connectors',

      kbProto1Title: 'Scan-to-register', kbProto1Text: 'DNI + insurance credential scan fills the health-record registration',
      kbProto2Title: 'Voice intake', kbProto2Text: 'The patient dictates symptoms and answers follow-ups',
      kbProto3Title: 'Triage codes', kbProto3Text: 'With deterministic red-flag rules the model can escalate but never downgrade',
      kbProto4Title: 'SOAP summary + differential probabilities', kbProto4Text: 'The dictated interview arrives structured: SOAP note, ranked differential, draft orders and prescriptions to review',
      kbProto5Title: 'Orders by checkbox', kbProto5Text: 'To the electronic system or the printer',

      kbPlanned2Title: 'Clinical-history summary', kbPlanned2Text: "Reads today's symptoms, finds what matters in years of history, and charts it as data-dense, Tufte-style graphics.",
      kbPlanned3Title: 'More regional connectors', kbPlanned3Text: 'Identity, coverage and record systems beyond Argentina',

      blogBackLink: 'More stories',

      storiesTitle: 'Use cases',

      story1Title: 'Three letters to a cardiologist',
      story1Para1: 'Grace needs to see a cardiologist. She doesn\'t know which health centre has one, or when.',
      story1More:
        '<p>She types three letters into the search box:</p>' +
        '<div class="ui-frame ui-frame--search" aria-label="Example of doctor search results">' +
          '<div class="ui-field"><span class="ui-search-icon" aria-hidden="true"></span><span class="ui-typed">car<span class="ui-caret"></span></span></div>' +
          '<p class="ui-hint">Doctors</p>' +
          '<div class="ui-results">' +
            '<div class="ui-result"><span class="ui-avatar" aria-hidden="true">MF</span><span class="ui-result-main"><strong>Marcelo Flores</strong><small><mark>Car</mark>diologist</small></span><span class="ui-result-slot"><strong>Tomorrow, 07:00</strong><small>More times</small></span></div>' +
            '<div class="ui-result"><span class="ui-avatar" aria-hidden="true">SR</span><span class="ui-result-main"><strong>Sergio Ruiz</strong><small><mark>Car</mark>diologist</small></span><span class="ui-result-slot"><strong>Aug 4, 08:30</strong><small>More times</small></span></div>' +
            '<div class="ui-result"><span class="ui-avatar" aria-hidden="true">AA</span><span class="ui-result-main"><strong>Adrián Acosta</strong><small><mark>Car</mark>diologist</small></span><span class="ui-result-slot"><strong>Tomorrow, 09:30</strong><small>More times</small></span></div>' +
          '</div>' +
        '</div>' +
        '<p>Two clicks book the nearest opening. Before the visit she dictates her symptoms by voice instead of filling out a form.</p>' +
        '<p>The blood-test order reaches her a week ahead, so the results are already on the screen when she sits down — one visit instead of two.</p>' +
        '<ul class="story-facts">' +
          '<li>3 letters → the right service, nearest first</li>' +
          '<li>2 clicks, no phone call</li>' +
          '<li>Blood-test order arrives a week ahead</li>' +
          '<li>One visit instead of two</li>' +
        '</ul>',

      story2Title: 'The doctor already knows the case',
      story2Para1: 'Dr. Nguyen opens today\'s list before the first patient arrives. Each row shows a triage colour and a one-line summary — no file to dig through.',
      story2More:
        '<div class="ui-frame ui-frame--schedule" aria-label="Example of today’s patients">' +
          '<div class="ui-group-head"><span><strong>Agustina Conti</strong><small>Dermatology · Villa Ejemplo Hospital</small></span><span>8 appointments</span></div>' +
          '<div class="ui-table ui-table--patients">' +
            '<div class="ui-table-head"><span>Time</span><span>Patient</span><span>Service</span><span>Attendance</span></div>' +
            '<div class="ui-table-row"><span class="ui-time">09:00</span><span><strong>Marina Costa</strong><small>32 years</small></span><span>Dermatology</span><span class="ui-status ui-status--done">Seen 09:00</span></div>' +
            '<div class="ui-table-row"><span class="ui-time">09:20</span><span><strong>Camila Fernández</strong><small>41 years</small></span><span>Dermatology</span><span class="ui-status ui-status--waiting">Waiting</span></div>' +
            '<div class="ui-table-row"><span class="ui-time">09:40</span><span><strong>Milagros Vega</strong><small>28 years</small></span><span>Dermatology</span><span class="ui-status ui-status--missed">Did not attend</span></div>' +
          '</div>' +
        '</div>' +
        '<p>A new patient’s story is already on the screen: her own words, a SOAP summary, a differential ranked by likelihood.</p>' +
        '<p>He examines her. He talks to her. That part stays his — no software touches it. Afterwards he ticks the orders he agrees with, and the note writes itself.</p>' +
        '<div class="ui-frame ui-frame--orders" aria-label="Example of proposed orders">' +
          '<div class="ui-panel-head"><strong>Proposed orders</strong><span>Review before signing</span></div>' +
          '<ul class="ui-rows ui-rows--orders">' +
            '<li><span class="ui-check" data-on>✓</span>ECG, 12-lead<span class="ui-meta">today</span></li>' +
            '<li><span class="ui-check" data-on>✓</span>Troponin + lipid panel<span class="ui-meta">today</span></li>' +
            '<li><span class="ui-check"></span>Chest X-ray<span class="ui-meta">declined</span></li>' +
          '</ul>' +
        '</div>' +
        '<ul class="story-facts">' +
          '<li>Triage colour + one-line summary, no digging</li>' +
          '<li>SOAP note &amp; differential ready before he speaks</li>' +
          '<li>He checks the boxes on orders he agrees with</li>' +
          '<li>No typing during the visit</li>' +
        '</ul>',

      story3Title: 'A queue that reads itself',
      story3Para1: 'Sonia starts her morning with a queue of referral orders — some handwritten, some photos taken in a hurry.',
      story3More:
        '<p>The AI already read every one overnight: date, licence, name match. She reviews the proposals, not the raw images — rejects two, approves the rest.</p>' +
        '<div class="ui-frame ui-frame--request" aria-label="Example of a referral request">' +
          '<div class="ui-request-head"><span><strong>Julieta Ruiz</strong><small>DNI 30.001.918 · 79 years</small></span><span class="ui-verdict">Uncertain</span><time>Today, 08:42</time></div>' +
          '<div class="ui-request-service"><strong>Obstetrics and Gynecology</strong><span>Maternal and Child Health Centre</span></div>' +
          '<div class="ui-request-fields"><span><small>Order date</small><strong>Aug 1, 2026</strong></span><span><small>Licence</small><strong>Matched</strong></span><span><small>Name</small><strong>Matched</strong></span></div>' +
          '<div class="ui-request-actions"><span>AI proposal: approve</span><span class="ui-control">Tomorrow, 09:00</span><span class="ui-control ui-control--primary">Approve</span><span class="ui-control">Reject</span></div>' +
        '</div>' +
        '<p>Every rejection leaves with a next step attached: an alternative slot or a re-upload link. Nobody hits a dead end, and attendance goes up.</p>' +
        '<ul class="story-facts">' +
          '<li>AI reads every referral overnight, handwriting included</li>' +
          '<li>Proposes accept or reject, with the reason attached</li>' +
          '<li>Rejected patients get the next step, not a dead end</li>' +
          '<li>No freed slot sits empty</li>' +
        '</ul>',

      storyExpand: 'Read more →',
      storyCollapse: 'Close ↑',

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
        '<p>The waitlist means <strong>no freed slot sits empty</strong>, and every rejection tells the patient exactly what to do next.</p>',

      updatesTitle: 'Latest updates',
      update1Text: '<b><a href="/docs/pre-consult-interview">QR pre-consult interview</a>.</b> Scan the code at the consulting-room door and the AI interview starts on the patient’s own phone, ready for the doctor before the encounter.',
      update2Text: '<b><a href="/docs/scan-to-register">Scan-to-register</a>.</b> A document camera reads an ID and insurance credential, fills the health record, and learns unfamiliar QR formats for the next patient.',
      update3Text: '<b><a href="/docs/health-record-handoff">Resilient EHR handoff</a>.</b> Registration work stays queued locally and retries automatically when the clinical record comes back online.',

      invitationsTitle: 'Who this is for',
      invitationsIntro: 'Three ways into the same platform — run it, extend it, or fund the next deployments.',
      inviteOrgRole: 'Health organizations',
      inviteOrgTitle: 'Get back the hours your staff spend on the screen.',
      inviteOrgText: 'Booking, reminders, coverage checks and documentation stop being manual work. No licence fee, no vendor lock — you host it, you own the data.',
      inviteOrgFact1: 'Self-hosted, your data stays yours',
      inviteOrgFact2: 'Running today at the Pinamar installation',
      inviteDevRole: 'Developers',
      inviteDevTitle: 'Ship a whole country as a module, not a fork.',
      inviteDevText: 'Identity, coverage and health-record connectors are pluggable, so your region’s integration is a pull request instead of a rewrite.',
      inviteDevFact1: 'Pluggable per-country connectors',
      inviteDevFact2: 'A codebase already carrying real clinical traffic',
      inviteFundRole: 'Investors and grant organizations',
      inviteFundTitle: 'Every dollar buys deployments, not licences.',
      inviteFundText: 'Funding goes to hardening, independent clinical validation and the next public pilots. Because the platform is free to run, the same grant reaches more clinics.',
      inviteFundFact1: 'No licence cost between grant and clinic',
      inviteFundFact2: 'Outcomes stay open for anyone to check',
      inviteContact: 'Contact',
      inviteGithub: 'GitHub'
    },
    es: {
      navHow: 'Cómo funciona',
      navRoadmap: 'Hoja de ruta',
      navDocs: 'Documentación',
      navBlog: 'Blog',
      navGithub: 'GitHub',
      navDemo: 'Demo en vivo',
      navContact: 'Contacto',
      language: 'English',

      heroTitle: 'La plataforma médica de código abierto e IA nativa',
      heroTagline: 'La ronda la hacen las personas. El resto lo hace la IA.',
      heroLead: 'La IA <a href="/docs/pre-consult-interview">entrevista al paciente antes de la consulta</a>, <a href="/docs/referral-orders">lee derivaciones manuscritas desde una foto</a>, estima la urgencia y <a href="/docs/health-record-handoff">escribe en la historia clínica</a>. El equipo de salud entra a la consulta ya preparado. Hoy funciona en un hospital público de verdad. Gratis para instalar, abierto para auditar.',
      heroLinkDemo: 'Demo en vivo',
      heroLinkOpenSource: 'Código abierto',
      heroLinkDocs: 'Documentación',

      constHubTitle: 'Tu red de salud',
      constInstitutionsLabel: 'Con quién se conecta',

      flowTitle: 'Cada consulta, preparada por la IA.',
      flowIntro: 'Human Rounds automatiza el trabajo repetitivo antes, durante y después de cada consulta. La historia clínica que ya usás sigue siendo la fuente oficial: el equipo de salud revisa cada sugerencia.',
      flowBadge1: 'Antes de la consulta',
      flowBadge2: 'Durante la consulta',
      flowBadge3: 'Alrededor de la consulta',
      flowBadge4: 'Después de la consulta',
      flowPatientTitle: 'La IA entrevista y prioriza a los pacientes',
      flowPatientText: 'El paciente cuenta su problema con sus propias palabras. La IA repregunta, estima la urgencia y lo ubica en la cola que corresponde.',
      flowOpsTitle: 'Un solo circuito en vez de sistemas sueltos',
      flowOpsText: 'Alta, turnos, llegadas, sala de espera, colas y cobertura funcionan dentro de un mismo circuito coordinado.',
      flowClinicianTitle: 'El médico encuentra todo listo',
      flowClinicianText: 'El panel muestra la historia relevante, la medicación, las consultas previas, las tendencias y los datos clave antes de que empiece la conversación.',
      flowRecordTitle: 'La documentación se completa sola',
      flowRecordText: 'La consulta se resume automáticamente. Recetas, derivaciones, órdenes de laboratorio e indicaciones quedan generadas para que el profesional las revise.',
      roadmapTitle: 'Hoja de ruta',
      roadmapLiveTitle: 'En vivo',
      roadmapLiveSubtitle: 'Funcionando en la instalación de referencia de Pinamar',
      roadmapPrototypedTitle: 'Prototipado',
      roadmapPrototypedSubtitle: 'Prototipo listo, entra a Human Rounds tras revisión',
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
      kbProto4Title: 'Resumen SOAP + probabilidades diferenciales', kbProto4Text: 'La entrevista dictada llega estructurada: nota SOAP, diferenciales ordenados por probabilidad y borradores de órdenes y recetas para revisar',
      kbProto5Title: 'Órdenes con un tilde', kbProto5Text: 'Al sistema electrónico o a la impresora',

      kbPlanned2Title: 'Resumen de historia clínica', kbPlanned2Text: 'Lee los síntomas de hoy, encuentra lo que importa en años de historia clínica y lo grafica en infografías estilo Tufte, densas en datos.',
      kbPlanned3Title: 'Más conectores regionales', kbPlanned3Text: 'Sistemas de identidad, cobertura e historia clínica más allá de Argentina',

      blogBackLink: 'Más historias',

      storiesTitle: 'Casos de uso',

      story1Title: 'Tres letras hasta un cardiólogo',
      story1Para1: 'Grace necesita ver a un cardiólogo. No sabe en qué centro de salud hay uno, ni cuándo.',
      story1More:
        '<p>Escribe tres letras en el buscador:</p>' +
        '<div class="ui-frame ui-frame--search" aria-label="Ejemplo de resultados de búsqueda de médicos">' +
          '<div class="ui-field"><span class="ui-search-icon" aria-hidden="true"></span><span class="ui-typed">car<span class="ui-caret"></span></span></div>' +
          '<p class="ui-hint">Médicos</p>' +
          '<div class="ui-results">' +
            '<div class="ui-result"><span class="ui-avatar" aria-hidden="true">MF</span><span class="ui-result-main"><strong>Marcelo Flores</strong><small><mark>Car</mark>diólogo</small></span><span class="ui-result-slot"><strong>Mañana, 07:00</strong><small>Más horarios</small></span></div>' +
            '<div class="ui-result"><span class="ui-avatar" aria-hidden="true">SR</span><span class="ui-result-main"><strong>Sergio Ruiz</strong><small><mark>Car</mark>diólogo</small></span><span class="ui-result-slot"><strong>4 ago, 08:30</strong><small>Más horarios</small></span></div>' +
            '<div class="ui-result"><span class="ui-avatar" aria-hidden="true">AA</span><span class="ui-result-main"><strong>Adrián Acosta</strong><small><mark>Car</mark>diólogo</small></span><span class="ui-result-slot"><strong>Mañana, 09:30</strong><small>Más horarios</small></span></div>' +
          '</div>' +
        '</div>' +
        '<p>Dos clics y queda reservado el turno más cercano. Antes de la consulta dicta sus síntomas por voz en vez de llenar un formulario.</p>' +
        '<p>La orden de análisis le llega una semana antes, así que los resultados ya están en la pantalla cuando se sienta: una consulta en lugar de dos.</p>' +
        '<ul class="story-facts">' +
          '<li>3 letras → el servicio correcto, el más cercano primero</li>' +
          '<li>2 clics, sin llamada telefónica</li>' +
          '<li>La orden de análisis llega una semana antes</li>' +
          '<li>Una consulta en vez de dos</li>' +
        '</ul>',

      story2Title: 'El médico ya conoce el caso',
      story2Para1: 'El Dr. Nguyen abre la lista del día antes de que llegue el primer paciente. Cada fila muestra un color de triage y un resumen de una línea, sin carpeta que revolver.',
      story2More:
        '<div class="ui-frame ui-frame--schedule" aria-label="Ejemplo de pacientes de hoy">' +
          '<div class="ui-group-head"><span><strong>Agustina Conti</strong><small>Dermatología · Hospital de Villa Ejemplo</small></span><span>8 turnos</span></div>' +
          '<div class="ui-table ui-table--patients">' +
            '<div class="ui-table-head"><span>Hora</span><span>Paciente</span><span>Servicio</span><span>Asistencia</span></div>' +
            '<div class="ui-table-row"><span class="ui-time">09:00</span><span><strong>Marina Costa</strong><small>32 años</small></span><span>Dermatología</span><span class="ui-status ui-status--done">Atendió 09:00</span></div>' +
            '<div class="ui-table-row"><span class="ui-time">09:20</span><span><strong>Camila Fernández</strong><small>41 años</small></span><span>Dermatología</span><span class="ui-status ui-status--waiting">En espera</span></div>' +
            '<div class="ui-table-row"><span class="ui-time">09:40</span><span><strong>Milagros Vega</strong><small>28 años</small></span><span>Dermatología</span><span class="ui-status ui-status--missed">No vino</span></div>' +
          '</div>' +
        '</div>' +
        '<p>La historia de una paciente nueva ya está en la pantalla: sus propias palabras, un resumen SOAP y un diferencial ordenado por probabilidad.</p>' +
        '<p>La examina. Habla con ella. Esa parte sigue siendo suya, ningún software la toca. Después tilda las órdenes con las que está de acuerdo y la nota se escribe sola.</p>' +
        '<div class="ui-frame ui-frame--orders" aria-label="Ejemplo de órdenes propuestas">' +
          '<div class="ui-panel-head"><strong>Órdenes propuestas</strong><span>Revisar antes de firmar</span></div>' +
          '<ul class="ui-rows ui-rows--orders">' +
            '<li><span class="ui-check" data-on>✓</span>ECG de 12 derivaciones<span class="ui-meta">hoy</span></li>' +
            '<li><span class="ui-check" data-on>✓</span>Troponina + perfil lipídico<span class="ui-meta">hoy</span></li>' +
            '<li><span class="ui-check"></span>Radiografía de tórax<span class="ui-meta">descartada</span></li>' +
          '</ul>' +
        '</div>' +
        '<ul class="story-facts">' +
          '<li>Color de triage + resumen de una línea, sin buscar</li>' +
          '<li>Nota SOAP y diferencial listos antes de hablar</li>' +
          '<li>Tilda las órdenes que aprueba</li>' +
          '<li>Sin tipear durante la consulta</li>' +
        '</ul>',

      story3Title: 'Una cola que se lee sola',
      story3Para1: 'Sonia empieza la mañana con una cola de órdenes de derivación — algunas manuscritas, algunas fotos sacadas apurada.',
      story3More:
        '<p>La IA ya leyó todas durante la noche: fecha, matrícula, coincidencia de nombre. Ella revisa las propuestas, no las imágenes crudas: rechaza dos, aprueba el resto.</p>' +
        '<div class="ui-frame ui-frame--request" aria-label="Ejemplo de una solicitud de derivación">' +
          '<div class="ui-request-head"><span><strong>Julieta Ruiz</strong><small>DNI 30.001.918 · 79 años</small></span><span class="ui-verdict">Dudosa</span><time>Hoy, 08:42</time></div>' +
          '<div class="ui-request-service"><strong>Ginecología y Obstetricia</strong><span>Centro Materno Infantil</span></div>' +
          '<div class="ui-request-fields"><span><small>Fecha de la orden</small><strong>1 ago 2026</strong></span><span><small>Matrícula</small><strong>Coincide</strong></span><span><small>Nombre</small><strong>Coincide</strong></span></div>' +
          '<div class="ui-request-actions"><span>Propuesta IA: aprobar</span><span class="ui-control">Mañana, 09:00</span><span class="ui-control ui-control--primary">Aprobar</span><span class="ui-control">Rechazar</span></div>' +
        '</div>' +
        '<p>Cada rechazo sale con el próximo paso incluido: un turno alternativo o un link para resubir la orden. Nadie llega a un callejón sin salida, y la asistencia sube.</p>' +
        '<ul class="story-facts">' +
          '<li>La IA lee cada derivación de noche, manuscritas incluidas</li>' +
          '<li>Propone aceptar o rechazar, con el motivo</li>' +
          '<li>Los rechazados reciben el siguiente paso, no un cierre</li>' +
          '<li>Ningún turno liberado queda vacío</li>' +
        '</ul>',

      storyExpand: 'Leer más →',
      storyCollapse: 'Cerrar ↑',

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
        '<p>La lista de espera hace que <strong>ningún turno liberado quede vacío</strong>, y cada rechazo le dice al paciente exactamente qué hacer.</p>',

      updatesTitle: 'Últimas novedades',
      update1Text: '<b><a href="/docs/pre-consult-interview">Entrevista previa por QR</a>.</b> Escaneá el código en la puerta del consultorio y la entrevista con IA empieza en el celular del paciente, lista para el médico antes de la consulta.',
      update2Text: '<b><a href="/docs/scan-to-register">Alta por escaneo</a>.</b> Una cámara lee el DNI y la credencial de cobertura, completa HSI y aprende formatos de QR desconocidos para el próximo paciente.',
      update3Text: '<b><a href="/docs/health-record-handoff">Envío resiliente a HSI</a>.</b> El alta queda en cola local y se reintenta automáticamente cuando vuelve la historia clínica.',

      invitationsTitle: 'Para quién es',
      invitationsIntro: 'Tres formas de entrar a la misma plataforma: ponerla a andar, extenderla o financiar las próximas instalaciones.',
      inviteOrgRole: 'Instituciones de salud',
      inviteOrgTitle: 'Recuperá las horas que tu equipo pasa frente a la pantalla.',
      inviteOrgText: 'Turnos, recordatorios, verificación de cobertura y documentación dejan de ser trabajo manual. Sin costo de licencia y sin atarte a un proveedor: la instalás vos, los datos son tuyos.',
      inviteOrgFact1: 'Instalación propia, los datos quedan en tu institución',
      inviteOrgFact2: 'Hoy funcionando en la instalación de Pinamar',
      inviteDevRole: 'Desarrolladores',
      inviteDevTitle: 'Sumá todo un país como módulo, no como fork.',
      inviteDevText: 'Los conectores de identidad, cobertura e historia clínica son enchufables: la integración de tu región es un pull request y no una reescritura.',
      inviteDevFact1: 'Conectores enchufables por país',
      inviteDevFact2: 'Un código que ya mueve tráfico clínico real',
      inviteFundRole: 'Inversores y organizaciones de subsidios',
      inviteFundTitle: 'Cada dólar compra instalaciones, no licencias.',
      inviteFundText: 'El dinero se destina a robustecer el sistema, la validación clínica independiente y los próximos pilotos públicos. Como la plataforma es gratis para instalar, el mismo subsidio llega a más centros de salud.',
      inviteFundFact1: 'Sin costo de licencia entre el subsidio y el centro de salud',
      inviteFundFact2: 'Los resultados quedan abiertos para que cualquiera los revise',
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

  /* Both labels live in the DOM and CSS shows the right one, so a language
     switch while a card is open can't leave a stale label behind. */
  function initStoryToggles() {
    var toggles = document.querySelectorAll('.story-toggle');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener('click', function () {
        var card = this.closest('.story-card');
        var open = !card.hasAttribute('data-open');
        if (open) card.setAttribute('data-open', '');
        else card.removeAttribute('data-open');
        this.setAttribute('aria-expanded', String(open));
      });
    }
  }

  /* The column header count is the real number of rows, never a hand-kept number. */
  function initKanbanCounts() {
    var columns = document.querySelectorAll('.kanban-column');
    for (var i = 0; i < columns.length; i++) {
      var slot = columns[i].querySelector('[data-kanban-count]');
      if (slot) slot.textContent = columns[i].querySelectorAll('.kanban-cards > li').length;
    }
  }

  function init() {
    var lang = initialLanguage();
    setLanguage(lang);
    var toggle = document.querySelector('[data-language-toggle]');
    if (toggle) toggle.addEventListener('click', function () {
      setLanguage(document.documentElement.lang === 'en' ? 'es' : 'en');
    });
    initStoryToggles();
    initKanbanCounts();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
