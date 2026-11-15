/* Distinct English and Argentine-Spanish voices for the Human Rounds public site. */
(function () {
  var LANGS = [['en', 'English'], ['es', 'Español'], ['pt', 'Português'], ['fr', 'Français'], ['it', 'Italiano'], ['de', 'Deutsch'], ['ru', 'Русский'], ['uk', 'Українська'], ['ja', '日本語'], ['zh', '中文']];
  var copy = {
    en: {
      navHow: 'How it works',
      navRoadmap: 'Roadmap',
      navDocs: 'Docs',
      navGithub: 'GitHub',
      navDemo: 'Live demo',
      navContact: 'Contact',
      language: 'Español',

      heroTitle: 'The AI-native medical platform for public health',
      heroTagline: 'Humans do the rounds. AI does the rest.',
      heroLead: 'AI <a href="/docs/referral-orders">reads handwritten referral orders from a photo</a> and staff approve them in one click. Patients book online and on WhatsApp, and every approved visit <a href="/docs/health-record-handoff">goes to the public health record</a>. Live today in a public hospital in Argentina. The <a href="/docs/pre-consult-interview">AI interview before the visit</a> is a prototype. No licence fee.',
      heroLinkDemo: 'Live demo',
      heroLinkOpenSource: 'GitHub',
      heroLinkDocs: 'Documentation',

      connTitle: 'Connects to the systems your country already runs',
      connTabsLabel: 'Connectors, desk and doctor, AI',
      connTabConnectors: 'Connectors',
      connTabDesk: 'Desk and doctor',
      connTabAi: 'AI',
      connCountry: 'Country',
      connCountryOther: 'Other country',
      connColName: 'Name',
      connColWhat: 'What it does',
      connColStatus: 'Status',
      connStatusLive: 'Live',
      connStatusProgress: 'Prototyped',
      connStatusPlanned: 'Planned',
      connRoleIdentity: 'Verifies who the patient is',
      connRoleCoverage: 'Checks the patient’s health coverage',
      connRoleLicenses: 'Confirms the doctor’s licence',
      connRoleEmr: 'Shares the visit with the public health record',
      connRoleRegional: 'Reads open appointment slots from the regional system',
      connRoleBilling: 'Prepares visits for billing',
      connWhatsappWhat: 'Patients book and sign in by message',
      connEmailWhat: 'Sends confirmations and reminders',
      connDeskRequests: 'Requests and approval',
      connDeskRequestsWhat: 'Staff approve or decline each appointment request in one queue',
      connDeskDirectory: 'Directory',
      connDeskDirectoryWhat: 'Centres, services and doctors in one searchable list',
      connDeskCenters: 'Several centres',
      connDeskCentersWhat: 'One installation for a hospital and its health posts',
      connDeskAgenda: 'Doctor’s agenda',
      connDeskAgendaWhat: 'Each doctor sees their day and their patients',
      connDeskWaitlist: 'Waiting list and reminders',
      connDeskWaitlistWhat: 'Offers freed slots and reminds patients before the visit',
      connDeskReports: 'Reports',
      connDeskReportsWhat: 'Cost recovery, statistics and a no-show ranking',
      connDeskAudit: 'Access log',
      connDeskAuditWhat: 'Records every read of clinical data by staff',
      connAiReferral: 'Referral reading',
      connAiReferralWhat: 'Reads the referral photo and proposes the service',
      connAiInterview: 'Pre-visit interview',
      connAiInterviewWhat: 'Asks follow-up questions and proposes an urgency that staff confirm',
      connAiSummary: 'Chart summary',
      connAiSummaryWhat: 'Summarises the health record before the visit',
      connAiLabs: 'Lab results',
      connAiLabsWhat: 'Explains each report to the patient in plain words',
      connAiDni: 'Sign-up from a DNI photo',
      connAiDniWhat: 'Fills in the registration from a photo of the document',

      flowTitle: 'What it does around each visit',
      flowIntro: 'Your existing health record stays the source of truth, and staff confirm every AI proposal.',
      flowPatientTitle: 'Pre-visit interview',
      flowPatientText: 'The patient describes the problem in their own words; the AI asks follow-up questions and proposes an urgency for staff to confirm. Prototype.',
      flowOpsTitle: 'One queue for the desk',
      flowOpsText: 'Requests arrive with the AI’s reading of the referral order, staff approve or reject them, and freed slots go to the waitlist. Live in Pinamar.',
      flowClinicianTitle: 'Today’s list for each doctor',
      flowClinicianText: 'Each doctor sees the day’s patients and their referral orders. Live in Pinamar. The AI summary on that list is a prototype.',
      flowRecordTitle: 'Each visit reaches the health record',
      flowRecordText: 'Approved appointments are written to the national health record and retried on their own while it is down. Live in Pinamar.',
      roadmapTitle: 'Roadmap',
      roadmapLiveTitle: 'Live',
      roadmapPrototypedTitle: 'Prototyped',
      roadmapPlannedTitle: 'Planned',
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

      story2Title: 'The doctor already knows the case',
      story2Para1: 'Dr. Nguyen opens today\'s list before the first patient arrives. In the prototype, each row already carries a triage colour and a one-line summary.',

      story3Title: 'A queue that reads itself',
      story3Para1: 'Sonia starts her morning with a queue of referral orders — some handwritten, some photos taken in a hurry.',

      blogPost1Title: 'Three letters to a cardiologist',
      blogPost1Body:
        '<p>Grace needs to see a cardiologist. She doesn’t know which health centre has one, or when.</p>' +
        '<p>She opens the search box and types <strong>“car.”</strong> Three letters. The results already show <em>Cardiology</em>, at the hospital and at the health centre 10 minutes closer to her house.</p>' +
        '<p>She picks the <strong>nearest appointment</strong>. Two clicks and it’s booked, no phone call, no waiting room, no callback.</p>' +
        '<p><strong>Before the visit, she talks instead of typing.</strong> Grace dictates her symptoms by voice, answers a few follow-up questions, and the system organises what she said into something a doctor can use.</p>' +
        '<p>A week before the appointment, an <strong>order for blood work arrives</strong>. There’s still time to get it done before the visit, not after.</p>' +
        '<p>She walks into the consultation with results already in hand. The cardiologist reads them during the visit, not two weeks later in a second appointment.</p>' +
        '<p>The difference isn’t a new test or a new specialist: the paperwork happens in the background while Grace gets on with her week.</p>' +
        '<p>That’s the idea behind Human Rounds: the system does the searching, the booking, the ordering and the reminding. The people — the doctor, the phlebotomist, the receptionist — do the parts that need a person.</p>' +
        '<p><b>Where this stands.</b> Search and two-click booking are live at the Pinamar installation. The voice interview and the order sent ahead of the visit are prototypes.</p>',

      blogPost2Title: 'The doctor walks in prepared',
      blogPost2Body:
        '<p>Dr. Nguyen opens today’s list before the first patient arrives.</p>' +
        '<p>Each row shows a name, a <strong>triage colour</strong>, and a one-line summary. No file to dig through, no chart to reconstruct from memory.</p>' +
        '<p>A new patient comes in, someone he hasn’t met before. Her intake already sits on the screen: <strong>her own words</strong>, captured when she booked. Below that, a <strong>SOAP summary</strong> the system built from her account, and a <strong>differential with probabilities</strong> ranked by likelihood.</p>' +
        '<p>Suggested orders sit at the bottom, tests and medication, proposed, not decided.</p>' +
        '<p>He examines her. He talks to her. That part is his, and no software touches it: reading a person, noticing what they don’t say, deciding what matters. That’s the part machines don’t do.</p>' +
        '<p>When he’s done, he <strong>checks the boxes</strong> on the orders he agrees with. Some go straight to the electronic system. Others print, for the patient to carry. He doesn’t retype a single result, a single vital, a single medication name.</p>' +
        '<p><strong>No typing.</strong> The screen work happened before he walked in, and it stops the moment he starts talking to the patient.</p>' +
        '<p>That’s the trade Human Rounds makes: AI reads, organises and suggests. The doctor decides. The visit stays what it always was — one person examining another.</p>' +
        '<p><b>Where this stands.</b> Today’s list is live at the Pinamar installation. The triage colour, the SOAP summary, the differential and the orders by checkbox are prototypes.</p>',

      blogPost3Title: 'A queue that reads itself',
      blogPost3Body:
        '<p>Sonia starts her morning with a queue of appointment requests, each one carrying a referral order a patient uploaded, a photo, sometimes handwritten.</p>' +
        '<p>She doesn’t read them cold. <strong>The AI has already read every order</strong> overnight: is the date valid, is the doctor’s licence current, does the name on the order match the patient’s account. Handwriting included.</p>' +
        '<p>For each request, the AI proposes an action, <strong>accept or reject</strong>, with the reason attached. Sonia reviews the proposals, not the raw images.</p>' +
        '<p>She <strong>rejects two</strong>. One order is expired; one name doesn’t match. She <strong>approves the rest</strong>.</p>' +
        '<p>The rejected patients don’t hit a dead end. They get a notification with <strong>the next step already attached</strong>, a link to re-upload a corrected order, or the right service with its next free slots.</p>' +
        '<p>The approved patients get a reminder the day before their visit. They <strong>answer YES or NO</strong>, confirming or freeing the slot for someone else on the waitlist.</p>' +
        '<p>Nothing here replaces Sonia’s judgment; she still makes the final call on every request. What changed is what she spends her morning on: not deciphering handwriting and checking licence numbers, but deciding.</p>' +
        '<p>A freed slot is <strong>offered to the next patient on the waitlist</strong>, and every rejection tells the patient exactly what to do next.</p>' +
        '<p><b>Where this stands.</b> All of this is live at the Pinamar installation.</p>',

      updatesTitle: 'Latest updates',
      update1Text: '<b><a href="/docs/pre-consult-interview">QR pre-consult interview</a>, prototype.</b> Scan the code at the consulting-room door and the AI interview starts on the patient’s own phone, ready for the doctor before the encounter.',
      update2Text: '<b><a href="/docs/scan-to-register">Scan-to-register</a>, prototype.</b> A document camera reads an ID and insurance credential, fills the health record, and learns unfamiliar QR formats for the next patient.',
      update3Text: '<b><a href="/docs/health-record-handoff">Resilient EHR handoff</a>.</b> Registration work stays queued locally and retries automatically when the clinical record comes back online.',
      update6Text: '<b>Identity claims.</b> Signing up with an ID number that already has an account opens a claim the front desk confirms or rejects, and an unverified account sees no clinical data (appointments, calendar, lab results) until it is confirmed.',
      update4Text: '<b>Clinical summary concept.</b> A new homepage section compares today’s note-heavy AI clinical notes with our design direction for a clearer summary — icons, flags, and combined trend charts — a concept built on fictional data, not yet in the product.',

      invitationsTitle: 'Who this is for',
      inviteOrgRole: 'Health organisations',
      inviteOrgText: 'Booking, referral review and the health-record handoff stop being manual work. No licence fee. The installation runs on your own server, so the data stays with you.',
      inviteOrgFact2: 'Running today at the Pinamar installation',
      inviteDevRole: 'Developers',
      inviteDevText: 'Identity, coverage and health-record connectors are pluggable, so your region’s integration is a pull request instead of a rewrite.',
      inviteDevFact2: 'Application code published module by module, after review',
      inviteFundRole: 'Donors and grant organisations',
      inviteFundText: 'Funding goes to hardening, independent clinical validation and the next public pilots. With no licence fee, the same grant reaches more clinics; each clinic pays only for its own server.',
      inviteContact: 'Contact',
      contactTitle: 'Contact',
      contactText: 'For an installation, a pilot or funding, write to the project lead on WhatsApp or by email. Bugs and code questions go to GitHub.',
      inviteGithub: 'GitHub'
    },
    es: {
      navHow: 'Cómo funciona',
      navRoadmap: 'Hoja de ruta',
      navDocs: 'Documentación',
      navGithub: 'GitHub',
      navDemo: 'Demo en vivo',
      navContact: 'Contacto',
      language: 'English',

      heroTitle: 'La plataforma médica de IA nativa para la salud pública',
      heroTagline: 'La ronda la hacen las personas. El resto lo hace la IA.',
      heroLead: 'La IA <a href="/docs/referral-orders">lee órdenes manuscritas desde una foto</a> y el equipo las aprueba en un clic. Los pacientes sacan turno por el sitio y por WhatsApp, y cada turno aprobado <a href="/docs/health-record-handoff">llega a la historia clínica pública</a>. Hoy funciona en un hospital público de Argentina. La <a href="/docs/pre-consult-interview">entrevista con IA antes de la consulta</a> es un prototipo. Sin costo de licencia.',
      heroLinkDemo: 'Demo en vivo',
      heroLinkOpenSource: 'GitHub',
      heroLinkDocs: 'Documentación',

      connTitle: 'Se conecta con los sistemas que tu país ya usa',
      connTabsLabel: 'Conectores, mostrador y médico, IA',
      connTabConnectors: 'Conectores',
      connTabDesk: 'Mostrador y médico',
      connTabAi: 'IA',
      connCountry: 'País',
      connCountryOther: 'Otro país',
      connColName: 'Nombre',
      connColWhat: 'Qué hace',
      connColStatus: 'Estado',
      connStatusLive: 'En uso',
      connStatusProgress: 'Prototipado',
      connStatusPlanned: 'Planificado',
      connRoleIdentity: 'Verifica quién es el paciente',
      connRoleCoverage: 'Consulta la cobertura de salud del paciente',
      connRoleLicenses: 'Confirma la matrícula del médico',
      connRoleEmr: 'Comparte la consulta con la historia clínica pública',
      connRoleRegional: 'Lee los turnos libres del sistema regional',
      connRoleBilling: 'Prepara las consultas para facturar',
      connWhatsappWhat: 'Los pacientes sacan turno e ingresan por mensaje',
      connEmailWhat: 'Envía confirmaciones y recordatorios',
      connDeskRequests: 'Solicitudes y aprobación',
      connDeskRequestsWhat: 'El personal aprueba o rechaza cada solicitud de turno en una sola cola',
      connDeskDirectory: 'Directorio',
      connDeskDirectoryWhat: 'Centros, servicios y médicos en una sola lista con buscador',
      connDeskCenters: 'Varios centros',
      connDeskCentersWhat: 'Una instalación para un hospital y sus centros de salud',
      connDeskAgenda: 'Agenda del médico',
      connDeskAgendaWhat: 'Cada médico ve su día y a sus pacientes',
      connDeskWaitlist: 'Lista de espera y recordatorios',
      connDeskWaitlistWhat: 'Ofrece los turnos liberados y avisa al paciente antes de la consulta',
      connDeskReports: 'Reportes',
      connDeskReportsWhat: 'Recupero de costos, estadística y ranking de ausentes',
      connDeskAudit: 'Registro de accesos',
      connDeskAuditWhat: 'Anota cada lectura de datos clínicos que hace el personal',
      connAiReferral: 'Lectura de órdenes',
      connAiReferralWhat: 'Lee la foto de la orden y propone el servicio',
      connAiInterview: 'Entrevista previa',
      connAiInterviewWhat: 'Hace preguntas de seguimiento y propone una urgencia que el personal confirma',
      connAiSummary: 'Resumen de la historia',
      connAiSummaryWhat: 'Resume la historia clínica antes de la consulta',
      connAiLabs: 'Resultados de laboratorio',
      connAiLabsWhat: 'Explica cada informe al paciente en palabras simples',
      connAiDni: 'Registro con foto del DNI',
      connAiDniWhat: 'Completa el registro a partir de la foto del documento',

      flowTitle: 'Qué hace alrededor de cada consulta',
      flowIntro: 'La historia clínica que ya usás sigue siendo la fuente oficial, y el equipo confirma cada propuesta de la IA.',
      flowPatientTitle: 'Entrevista antes de la consulta',
      flowPatientText: 'El paciente cuenta el problema con sus palabras; la IA repregunta y propone una urgencia que el equipo confirma. Prototipo.',
      flowOpsTitle: 'Una sola cola para la ventanilla',
      flowOpsText: 'Los pedidos llegan con la lectura de la orden hecha por la IA, el equipo los aprueba o rechaza, y los turnos liberados pasan a la lista de espera. Funciona en Pinamar.',
      flowClinicianTitle: 'La lista del día de cada médico',
      flowClinicianText: 'Cada médico ve los pacientes del día y sus órdenes. Funciona en Pinamar. El resumen con IA en esa lista es un prototipo.',
      flowRecordTitle: 'Cada turno llega a la historia clínica',
      flowRecordText: 'Los turnos aprobados se escriben en la historia clínica nacional y se reintentan solos mientras está caída. Funciona en Pinamar.',
      roadmapTitle: 'Hoja de ruta',
      roadmapLiveTitle: 'En uso',
      roadmapPrototypedTitle: 'Prototipado',
      roadmapPlannedTitle: 'Planificado',
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

      story2Title: 'El médico ya conoce el caso',
      story2Para1: 'El Dr. Nguyen abre la lista del día antes de que llegue el primer paciente. En el prototipo, cada fila ya trae un color de triage y un resumen de una línea.',

      story3Title: 'Una cola que se lee sola',
      story3Para1: 'Sonia empieza la mañana con una cola de órdenes de derivación — algunas manuscritas, algunas fotos sacadas apurada.',

      blogPost1Title: 'Tres letras hasta un cardiólogo',
      blogPost1Body:
        '<p>Grace necesita ver a un cardiólogo. No sabe en qué centro de salud atienden, ni cuándo.</p>' +
        '<p>Abre el buscador y escribe <strong>“car.”</strong> Tres letras. Los resultados ya muestran <em>Cardiología</em>, en el hospital y en el centro de salud que le queda 10 minutos más cerca de su casa.</p>' +
        '<p>Elige el <strong>turno más cercano</strong>. Dos clics y queda reservado, sin llamado, sin sala de espera, sin que la vuelvan a llamar.</p>' +
        '<p><strong>Antes de la consulta, habla en vez de tipear.</strong> Grace dicta sus síntomas por voz, responde algunas preguntas de seguimiento, y el sistema ordena lo que contó en algo que el médico puede usar.</p>' +
        '<p>Una semana antes del turno, llega una <strong>orden para análisis de sangre</strong>. Todavía hay tiempo de hacérselos antes de la consulta, no después.</p>' +
        '<p>Llega a la consulta con los resultados en mano. El cardiólogo los lee en el momento, no dos semanas después en un segundo turno.</p>' +
        '<p>La diferencia no es un estudio nuevo ni un especialista nuevo: el trámite pasa mientras Grace sigue con su semana.</p>' +
        '<p>Esa es la idea de Human Rounds: el sistema busca, reserva, pide los estudios y recuerda. Las personas (el médico, quien saca la sangre, la recepcionista) hacen la parte que necesita una persona.</p>' +
        '<p><b>Dónde está esto.</b> La búsqueda y el turno en dos clics funcionan en la instalación de Pinamar. La entrevista por voz y la orden enviada antes de la consulta son prototipos.</p>',

      blogPost2Title: 'El médico entra preparado',
      blogPost2Body:
        '<p>El Dr. Nguyen abre la lista del día antes de que llegue el primer paciente.</p>' +
        '<p>Cada fila muestra un nombre, un <strong>color de triage</strong> y un resumen de una línea. Sin carpeta para revisar, sin historia para reconstruir de memoria.</p>' +
        '<p>Entra una paciente nueva, alguien que no conoce. Su admisión ya está en la pantalla: <strong>sus propias palabras</strong>, registradas cuando sacó el turno. Debajo, un <strong>resumen SOAP</strong> que el sistema armó a partir de su relato, y un <strong>diferencial con probabilidades</strong> ordenado por probabilidad.</p>' +
        '<p>Al final hay órdenes sugeridas, estudios y medicación, propuestas, no decididas.</p>' +
        '<p>La examina. Habla con ella. Esa parte es suya, y ningún software la toca: leer a una persona, notar lo que no dice, decidir qué importa. Eso no lo hace ninguna máquina.</p>' +
        '<p>Cuando termina, <strong>tilda</strong> las órdenes con las que está de acuerdo. Algunas van directo al sistema electrónico. Otras se imprimen, para que la paciente se las lleve. No vuelve a tipear ni un resultado, ni un signo vital, ni el nombre de un medicamento.</p>' +
        '<p><strong>Sin tipear nada.</strong> El trabajo de pantalla ya pasó antes de que él entrara, y se detiene en el momento en que empieza a hablar con la paciente.</p>' +
        '<p>Esa es la apuesta de Human Rounds: la IA lee, ordena y sugiere. El médico decide. La consulta sigue siendo lo que siempre fue: una persona examinando a otra.</p>' +
        '<p><b>Dónde está esto.</b> La lista del día funciona en la instalación de Pinamar. El color de triage, el resumen SOAP, el diferencial y las órdenes con un tilde son prototipos.</p>',

      blogPost3Title: 'Una cola que se lee sola',
      blogPost3Body:
        '<p>Sonia empieza la mañana con una cola de solicitudes de turno, cada una con una orden médica que subió el paciente, a veces una foto, a veces manuscrita.</p>' +
        '<p>No las lee en frío. <strong>La IA ya leyó cada orden</strong> durante la noche: si la fecha es válida, si la matrícula del médico está vigente, si el nombre de la orden coincide con la cuenta del paciente. Manuscritas incluidas.</p>' +
        '<p>Para cada solicitud, la IA propone una acción, <strong>aceptar o rechazar</strong>, con el motivo. Sonia revisa las propuestas, no las imágenes crudas.</p>' +
        '<p><strong>Rechaza dos.</strong> Una orden está vencida, un nombre no coincide. <strong>Aprueba el resto.</strong></p>' +
        '<p>Los pacientes rechazados no llegan a un callejón sin salida. Reciben una notificación con <strong>el próximo paso ya incluido</strong>: un link para resubir la orden corregida, o el servicio correcto con sus próximos turnos disponibles.</p>' +
        '<p>Los pacientes aprobados reciben un recordatorio el día anterior a la consulta. <strong>Responden SÍ o NO</strong>, confirmando o liberando el turno para el siguiente de la lista de espera.</p>' +
        '<p>Nada de esto reemplaza el criterio de Sonia: la decisión final de cada solicitud sigue siendo suya. Lo que cambió es en qué se le va la mañana: no en descifrar letra manuscrita ni verificar matrículas, sino en decidir.</p>' +
        '<p>Un turno liberado <strong>se le ofrece al siguiente de la lista de espera</strong>, y cada rechazo le dice al paciente exactamente qué hacer.</p>' +
        '<p><b>Dónde está esto.</b> Todo esto funciona en la instalación de Pinamar.</p>',

      updatesTitle: 'Últimas novedades',
      update1Text: '<b><a href="/docs/pre-consult-interview">Entrevista previa por QR</a>, prototipo.</b> Escaneá el código en la puerta del consultorio y la entrevista con IA empieza en el celular del paciente, lista para el médico antes de la consulta.',
      update2Text: '<b><a href="/docs/scan-to-register">Alta por escaneo</a>, prototipo.</b> Una cámara lee el DNI y la credencial de cobertura, completa HSI y aprende formatos de QR desconocidos para el próximo paciente.',
      update3Text: '<b><a href="/docs/health-record-handoff">Envío resiliente a HSI</a>.</b> El alta queda en cola local y se reintenta automáticamente cuando vuelve la historia clínica.',
      update6Text: '<b>Reclamos de identidad.</b> Registrarse con un DNI que ya tiene cuenta abre un reclamo que la mesa de entradas confirma o rechaza, y una cuenta sin verificar no ve datos clínicos (turnos, calendario, laboratorio) hasta que se confirme.',
      update4Text: '<b>Concepto de resumen clínico.</b> Una nueva sección de la portada compara las notas clínicas de otras IA, cargadas de texto, con nuestra dirección de diseño para un resumen más claro — íconos, alertas destacadas y gráficos de tendencia combinados —, un concepto con datos ficticios que todavía no está en el producto.',

      invitationsTitle: 'Para quién es',
      inviteOrgRole: 'Instituciones de salud',
      inviteOrgText: 'Turnos, revisión de órdenes y envío a la historia clínica dejan de ser trabajo manual. Sin costo de licencia. La instalación corre en tu propio servidor, así que los datos quedan con vos.',
      inviteOrgFact2: 'Hoy funcionando en la instalación de Pinamar',
      inviteDevRole: 'Desarrolladores',
      inviteDevText: 'Los conectores de identidad, cobertura e historia clínica son enchufables: la integración de tu región es un pull request y no una reescritura.',
      inviteDevFact2: 'El código de la aplicación se publica módulo por módulo, después de una revisión',
      inviteFundRole: 'Donantes y organizaciones de subsidios',
      inviteFundText: 'El dinero va a robustecer el sistema, a la validación clínica independiente y a los próximos pilotos públicos. Sin costo de licencia, el mismo subsidio llega a más centros; cada centro paga sólo su servidor.',
      inviteContact: 'Contacto',
      contactTitle: 'Contacto',
      contactText: 'Para una instalación, un piloto o financiamiento, escribile al responsable del proyecto por WhatsApp o por email. Los errores y las preguntas sobre el código van a GitHub.',
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
    syncDemoLinks(lang);
    window.dispatchEvent(new CustomEvent('human-rounds:language', { detail: { lang: lang } }));
  }

  /* The demo (demo.humanrounds.org) opens in the language the visitor is
     reading here: every demo link carries `?lang=`, which the demo turns
     into its own language cookie. Rewritten on every switch. */
  function syncDemoLinks(lang) {
    var links = document.querySelectorAll('a[href^="https://demo.humanrounds.org"]');
    for (var i = 0; i < links.length; i++) {
      var url = new URL(links[i].getAttribute('href'));
      url.searchParams.set('lang', lang);
      links[i].setAttribute('href', url.toString());
    }
  }

  function initialLanguage() {
    // Check path /<code> for any of the 10 codes
    var pathMatch = window.location.pathname.match(/^\/([a-z]{2})(?:\/|$)/);
    if (pathMatch) {
      var code = pathMatch[1];
      if (LANGS.some(function(l) { return l[0] === code; })) {
        return code;
      }
    }

    // Check ?lang=<code>
    var params = new URLSearchParams(window.location.search);
    var langParam = params.get('lang');
    if (langParam && LANGS.some(function(l) { return l[0] === langParam; })) {
      return langParam;
    }

    // Check localStorage
    var stored = localStorage.getItem('human-rounds-language');
    if (stored && LANGS.some(function(l) { return l[0] === stored; })) {
      return stored;
    }

    // Browser language detection: check navigator.languages for primary subtag match
    if (navigator.languages) {
      for (var i = 0; i < navigator.languages.length; i++) {
        var browserlang = navigator.languages[i].toLowerCase().split('-')[0];
        if (LANGS.some(function(l) { return l[0] === browserlang; })) {
          return browserlang;
        }
      }
    }

    return 'en'; // fallback
  }

  function setLanguage(lang) {
    // Merge translations from HR_COPY if available
    if (window.HR_COPY && window.HR_COPY[lang] && window.HR_COPY[lang].landing) {
      copy[lang] = HR_COPY[lang].landing;
    }
    if (!copy[lang]) lang = 'en';
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
    syncDemoLinks(lang);
    window.dispatchEvent(new CustomEvent('human-rounds:language', { detail: { lang: lang } }));
  }

  /* The demo (demo.humanrounds.org) opens in the language the visitor is
     reading here: every demo link carries `?lang=`, which the demo turns
     into its own language cookie. Rewritten on every switch. */
  function syncDemoLinks(lang) {
    var links = document.querySelectorAll('a[href^="https://demo.humanrounds.org"]');
    for (var i = 0; i < links.length; i++) {
      var url = new URL(links[i].getAttribute('href'));
      url.searchParams.set('lang', lang);
      links[i].setAttribute('href', url.toString());
    }
  }

  function init() {
    var lang = initialLanguage();
    setLanguage(lang);
    var toggle = document.querySelector('[data-language-toggle]');
    if (toggle) toggle.addEventListener('click', function () {
      setLanguage(document.documentElement.lang === 'en' ? 'es' : 'en');
    });
    var langSelect = document.querySelector('[data-language-select]');
    if (langSelect) {
      langSelect.value = lang;
      langSelect.addEventListener('change', function () { setLanguage(langSelect.value); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();


  // Export for use in other scripts
  window.HumanRoundsI18n = {
    LANGS: LANGS,
    current: function() {
      return document.documentElement.lang || 'en';
    },
    set: function(lang) {
      setLanguage(lang);
    },
    // Text for a copy key in the current language, English when the key is missing.
    t: function(key) {
      var current = copy[document.documentElement.lang] || copy.en;
      return current[key] != null ? current[key] : copy.en[key];
    },
    decorateDemoLinks: function(root) {
      var currentLang = document.documentElement.lang || 'en';
      var links = (root || document).querySelectorAll('a[href^="https://demo.humanrounds.org"]');
      for (var i = 0; i < links.length; i++) {
        var href = links[i].href;
        var url = new URL(href);
        url.searchParams.set('lang', currentLang);
        links[i].href = url.toString();
      }
    }
  };})();
