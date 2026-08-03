/* humanrounds.org/docs — sidebar, page bodies and the two languages.

   Same shape as landing.js: one dictionary, one render pass, `data-i18n`-style
   keys. landing.js still owns the header, the footer and the language toggle —
   this file only owns what is inside .docs-shell, and re-renders when landing.js
   dispatches `human-rounds:language`.

   A page is a thin HTML shell carrying `data-docs-page="<id>"`; its whole body
   lives here as one HTML string, exactly like the blog posts do in landing.js.
   Adding a page = one PAGES entry, one GROUPS reference, two body keys, one
   HTML shell, one route in app/server/index.mjs. */
(function () {
  var SHOT = '/web/docs-shots/';

  var PAGES = [
    { id: 'index',              href: '/docs',                      en: 'Introduction',            es: 'Introducción' },
    { id: 'pre-consult',        href: '/docs/pre-consult-interview',en: 'Pre-consult interview',   es: 'Entrevista previa' },
    { id: 'referral-orders',    href: '/docs/referral-orders',      en: 'Referral orders read by AI', es: 'Órdenes leídas por IA' },
    { id: 'prepared-clinician', href: '/docs/prepared-clinician',   en: 'The prepared clinician',  es: 'El médico llega preparado' },
    { id: 'scan-to-register',   href: '/docs/scan-to-register',     en: 'Scan to register',        es: 'Registro por escaneo' },
    { id: 'record-handoff',     href: '/docs/health-record-handoff',en: 'Health-record handoff',   es: 'Envío a la historia clínica' },
    { id: 'booking',            href: '/docs/booking-and-queue',    en: 'Booking and the queue',   es: 'Turnos y la cola' },
    { id: 'install',            href: '/docs/install',              en: 'Install',                 es: 'Instalación' },
    { id: 'connectors',         href: '/docs/connectors',           en: 'Connectors',              es: 'Conectores' }
  ];

  var GROUPS = [
    { en: '',                        es: '',                        items: ['index'] },
    { en: 'What makes it different', es: 'Lo que lo hace distinto', items: ['pre-consult', 'referral-orders', 'prepared-clinician', 'scan-to-register', 'record-handoff'] },
    { en: 'Everyday use',            es: 'El día a día',            items: ['booking'] },
    { en: 'Run it yourself',         es: 'Instalarlo',              items: ['install', 'connectors'] }
  ];

  function page(id) {
    for (var i = 0; i < PAGES.length; i++) if (PAGES[i].id === id) return PAGES[i];
    return null;
  }

  /* One screenshot per page, so the lightbox opens with no prev/next controls
     (photo-zoom's single-photo rule). A page that ever gets a second shot must
     give both the same data-photozoom-group. */
  function shot(file, alt, caption) {
    return '<figure class="docs-shot">' +
      '<button type="button" data-photozoom data-photozoom-src="' + SHOT + file + '"' +
      ' data-photozoom-alt="' + alt + '" aria-label="' + alt + '">' +
      '<img src="' + SHOT + file + '" alt="' + alt + '" loading="lazy"></button>' +
      '<figcaption>' + caption + '</figcaption></figure>';
  }

  function cards(lang, ids) {
    var out = '<ul class="docs-cards">';
    for (var i = 0; i < ids.length; i++) {
      var p = page(ids[i].id);
      out += '<li><h2><a href="' + p.href + '">' + p[lang] + '</a></h2><p>' + ids[i][lang] + '</p></li>';
    }
    return out + '</ul>';
  }

  var HOME_CARDS = [
    { id: 'pre-consult',
      en: 'A QR at the door, the interview on the patient’s own phone.',
      es: 'Un QR en la puerta y la entrevista en el celular del paciente.' },
    { id: 'referral-orders',
      en: 'A photo of the paper order, read by AI — handwriting included.',
      es: 'Una foto de la orden en papel, leída por IA, manuscrita incluida.' },
    { id: 'prepared-clinician',
      en: 'The day’s list already read: triage, reason, summary.',
      es: 'La lista del día ya leída: triage, motivo, resumen.' },
    { id: 'scan-to-register',
      en: 'The camera reads the ID and the insurance card into the record.',
      es: 'La cámara pasa el documento y la credencial a la historia clínica.' },
    { id: 'record-handoff',
      en: 'Writes to the national health record, and survives it being down.',
      es: 'Escribe en la historia clínica nacional y aguanta que se caiga.' },
    { id: 'booking',
      en: 'Search, slots, reminders, waitlist and the staff panel.',
      es: 'Búsqueda, turnos, recordatorios, lista de espera y el panel.' }
  ];

  var copy = {
    en: {
      navDocs: 'Docs',
      docsNext: 'Next',

      index: {
        title: 'Human Rounds documentation',
        lead: 'Human Rounds is an open-source medical platform. AI does the repetitive work around a visit — interviewing, reading paper, summarising, filing — and the care team decides. It runs today at a public hospital in Pinamar, Argentina.',
        body:
          cards('en', HOME_CARDS) +
          '<h2>How one visit runs</h2>' +
          '<ol>' +
            '<li><b>Before.</b> The patient books online, on WhatsApp, or at the desk, and answers an AI interview on their own phone.</li>' +
            '<li><b>At the door.</b> Reception scans the ID; a new patient is registered without retyping anything.</li>' +
            '<li><b>In the room.</b> The clinician opens a list that already carries a triage colour, the reason in the patient’s words, and a summary of the record.</li>' +
            '<li><b>After.</b> The appointment is written into the national health record, and retried on its own if that record is down.</li>' +
          '</ol>' +
          '<h2>What it is not</h2>' +
          '<p>It is <b>not a diagnosis engine</b>. Every AI output is a proposal a person approves, rejects or edits, and the existing medical record stays the source of truth. Triage rules can escalate a patient, never downgrade one.</p>' +
          '<p>It is <b>not measured yet</b>. Nothing here claims a change in waiting times, absenteeism or cost — the platform has not run long enough anywhere to have that data.</p>' +
          '<h2>Try it or run it</h2>' +
          '<p>The <a href="https://demo.humanrounds.org/">live demo</a> is a full installation of a fictional town, rebuilt every day. To put it on your own machine, start with <a href="/docs/install">Install</a>. The code is on <a href="https://github.com/visualpharm/human-rounds" rel="noopener">GitHub</a>.</p>'
      },

      'pre-consult': {
        title: 'Pre-consult interview',
        lead: 'The patient scans a QR at the consulting-room door. The interview opens on their own phone, and the doctor reads the answers before the patient walks in.',
        status: 'Live at the Pinamar installation.',
        body:
          shot('pre-consult-interview.png', 'The pre-consult interview asking a follow-up question',
               'The interview asks in plain language and follows up on what the patient actually said.') +
          '<h2>How it works</h2>' +
          '<ul>' +
            '<li><b>The door carries the entry point.</b> A printed poster with a QR code per consulting room — no app, no account, no password.</li>' +
            '<li><b>The narrative comes first.</b> The patient describes the problem in their own words, typed or dictated. Structured questions come after, not before.</li>' +
            '<li><b>The AI asks the follow-ups</b> a clinician would ask about that specific complaint, then stops. It does not run a fixed questionnaire past someone who already answered.</li>' +
            '<li><b>The result is a triage colour and a summary</b>, waiting in the doctor’s list for that appointment.</li>' +
          '</ul>' +
          '<h2>Where the model is not trusted</h2>' +
          '<p>Red-flag rules are <b>deterministic code, not a prompt</b>. Certain answers raise the triage level no matter what the model concluded. The model may raise a patient’s urgency; it may never lower it below what the rules set.</p>' +
          '<p>The doctor sees the raw answers next to the summary, so a wrong summary is visibly wrong rather than quietly wrong.</p>' +
          '<h2>Editing what it asks</h2>' +
          '<p>The three prompts behind the interview — the questioner, the triage judgment and the summary — are <b>editable from the staff panel</b>. The canonical text is English; staff edit the Spanish.</p>'
      },

      'referral-orders': {
        title: 'Referral orders read by AI',
        lead: 'A patient photographs the paper referral. The AI reads it — handwriting included — and proposes the specialty, the doctor and a slot. Staff approve or reject in one click.',
        status: 'Live at the Pinamar installation.',
        body:
          shot('referral-orders.png', 'The staff queue of referral orders read by AI',
               'Each request carries the AI’s reading, the order photo, and one click to approve.') +
          '<h2>What the AI pulls off the paper</h2>' +
          '<ul>' +
            '<li>The <b>specialty or study</b> requested, matched against the catalogue of what this installation actually offers.</li>' +
            '<li>The <b>diagnosis</b> and the <b>practices</b> written on the order.</li>' +
            '<li>The <b>issue date</b>, which is what makes an order expired.</li>' +
            '<li>Whether it is <b>signed and stamped</b>.</li>' +
          '</ul>' +
          '<h2>What staff see</h2>' +
          '<p>Every request arrives with a plain-language reading — <b>looks right</b> or <b>doubtful</b> — plus the fields the AI extracted and the photo it read them from. Staff never have to open a separate viewer to check a value.</p>' +
          '<p>It is <b>one reading, not a jury</b>: a single pass of one model. Its instructions are editable from the panel, and the whole queue can be worked in bulk when the readings agree.</p>' +
          '<h2>A rejection carries the next step</h2>' +
          '<p>The patient never gets a bare error. An expired order comes back with what to do about it; a wrong specialty comes back with a link to the right one; an unreadable photo comes back with a link to upload another. The rejection reasons are a <b>curated list</b>, so the answer is the same wherever it comes from.</p>'
      },

      'prepared-clinician': {
        title: 'The prepared clinician',
        lead: 'Before the first patient of the day, the list is already read: a triage colour per row, the reason in the patient’s own words, and a summary drawn from the record.',
        status: 'Live at the Pinamar installation. The deeper clinical-history summary is on the roadmap.',
        body:
          shot('prepared-clinician.png', 'Today’s patient list with a pre-visit summary open',
               'Today’s list on the left, the pre-visit summary of the selected patient on the right.') +
          '<h2>What the summary carries</h2>' +
          '<ul>' +
            '<li><b>The reason</b>, taken from the pre-consult interview, in the patient’s words.</li>' +
            '<li><b>Relevant history</b> — the conditions that matter for today’s complaint, not the whole file.</li>' +
            '<li><b>Current medication.</b></li>' +
            '<li><b>Trends</b>, where there are repeated measurements to plot.</li>' +
            '<li><b>The last visit</b> and what changed at it.</li>' +
          '</ul>' +
          '<h2>Where it comes from</h2>' +
          '<p>The summary is assembled from the health record plus the pre-consult interview, and it is <b>generated before the visit</b>, not while the clinician waits. Numeric trends are extracted by code, not by the model, so a chart cannot show a number nobody recorded.</p>' +
          '<h2>It is a draft</h2>' +
          '<p>The summary is labelled as AI-written on the screen where it is read. The underlying record is one click away, and the clinician’s own note is what gets filed.</p>'
      },

      'scan-to-register': {
        title: 'Scan to register',
        lead: 'A camera at the desk reads the ID barcode and the insurance QR, and fills the health-record registration. A credential format nobody has seen before is learned once and recognised from then on.',
        status: 'Prototype. Built and tested end to end, not yet running in production.',
        body:
          shot('scan-to-register.png', 'The reception desk registration screen with a scanned document',
               'The document is read at the desk; the fields land in the health record without retyping.') +
          '<h2>What it reads</h2>' +
          '<ul>' +
            '<li><b>The national ID barcode</b> — document number, sex and date of birth are reliable; accented names are best-effort, because the barcode is plain ASCII.</li>' +
            '<li><b>The insurance credential QR</b>, which each provider designs differently.</li>' +
            '<li><b>A photo instead of a live camera</b>, when the phone or the network will not cooperate. If the barcode will not decode, a vision model reads the card image.</li>' +
          '</ul>' +
          '<h2>Learning an unknown credential</h2>' +
          '<p>An unrecognised QR goes through four stages, and <b>the model is the last one, not the first</b>: known providers, then rules learned from earlier scans, then a structural reading of the raw fields, and only then a model call. Whatever the model works out is saved as a rule, so the next patient with that card parses instantly and for free.</p>' +
          '<h2>Patients can register themselves</h2>' +
          '<p>The same reader runs on the patient’s own phone, which focuses on a dense barcode far better than a desk webcam. A self-registration lands in a queue at the desk, where reception confirms it into the health record.</p>'
      },

      'record-handoff': {
        title: 'Health-record handoff',
        lead: 'Approving an appointment writes it into the national health record. If that record is unreachable, the appointment is still saved, queued, and retried until it lands.',
        status: 'Live at the Pinamar installation.',
        body:
          shot('health-record-handoff.png', 'The health-record queue showing retries in progress',
               'The queue drains itself. Nobody re-enters an appointment because a system was down.') +
          '<h2>Nothing breaks because of an integration</h2>' +
          '<p>The rule is that <b>local state is committed first</b>. Staff approve; the appointment exists; the handoff is a background job. A failed push is a queue entry with a retry time, not an error the front desk has to understand.</p>' +
          '<p>The same rule covers email and messaging: a missing key means a notification is skipped, never that a booking fails.</p>' +
          '<h2>What gets written</h2>' +
          '<p>The patient, the professional, the service and the slot, mapped onto the health record’s own identifiers. Patients who exist there already are matched rather than duplicated.</p>' +
          '<h2>When the two disagree</h2>' +
          '<p>An appointment can also be moved or cancelled inside the health record itself. A resynchroniser compares both sides and resolves the difference, so the staff panel does not keep offering a slot that no longer exists.</p>'
      },

      booking: {
        title: 'Booking and the queue',
        lead: 'The parts every scheduling system has. They are listed here because they have to work, not because they are remarkable.',
        status: 'Live at the Pinamar installation.',
        body:
          shot('booking.png', 'The patient picking an appointment slot',
               'Real slots, nearest first, held for eight minutes while the patient finishes.') +
          '<h2>For the patient</h2>' +
          '<ul>' +
            '<li><b>Find a service by typing three letters</b>, across the hospital and every health centre, with stemming so a near miss still matches.</li>' +
            '<li><b>Real slots, nearest first</b>, held for eight minutes so two people cannot take the same one.</li>' +
            '<li><b>Book on the site, in a chat, or on WhatsApp</b> — the same booking, whichever door it came through.</li>' +
            '<li><b>A reminder the day before</b>, by email and WhatsApp. Answering YES or NO confirms or cancels it.</li>' +
            '<li><b>Sign up with a photo of the ID</b>, and coverage is looked up from the national registry rather than asked for.</li>' +
          '</ul>' +
          '<h2>For the desk</h2>' +
          '<ul>' +
            '<li><b>One queue</b> of requests, with the AI reading attached to each.</li>' +
            '<li><b>Today’s patients</b>, doctor agendas, and a calendar that reflects the real one.</li>' +
            '<li><b>A freed slot is re-offered automatically</b> to the next patient on the waitlist.</li>' +
            '<li><b>Reports</b> on capacity, attendance and billing recovery.</li>' +
          '</ul>' +
          '<h2>Two rules worth knowing</h2>' +
          '<p><b>Walk-in services never offer appointments.</b> If a service is first-come-first-served, no surface anywhere in the product will promise a time for it — the single exception is a same-day opening, which is capped at one day ahead.</p>' +
          '<p><b>How many appointments a patient may hold at once is a number</b>, resolved per doctor, then per service, then per installation. It applies to what the patient books themselves, never to what the front desk books for them.</p>'
      },

      install: {
        title: 'Install',
        lead: 'A container and a Postgres database. The first run opens a setup wizard that writes the installation’s own data package.',
        body:
          '<h2>What you need</h2>' +
          '<ul>' +
            '<li><b>Docker</b> and a <b>PostgreSQL</b> database.</li>' +
            '<li>A domain, if the site is to be public.</li>' +
            '<li>An <b>AI key</b>, only if you want the features that read paper or interview patients. Everything else runs without one.</li>' +
          '</ul>' +
          '<h2>Run it</h2>' +
          '<pre><code>git clone https://github.com/visualpharm/human-rounds\ncd human-rounds\ndocker compose up -d</code></pre>' +
          '<p>Open the site and the <b>setup wizard</b> takes over: it asks for the installation’s name, timezone, languages and first centre, and only writes to the database at the last step, so an abandoned setup leaves nothing behind.</p>' +
          '<h2>Your services and centres are a data package</h2>' +
          '<p>Everything specific to one town — centres, services, professionals, specialties, preparation instructions — lives in a <b>data package</b> layered over a country package and a global one. Upgrading the software does not touch it, and a second installation is a second package rather than a fork.</p>' +
          '<h2>Modules</h2>' +
          '<p>Appointments are one module. The pre-consult interview is another. A module can be turned off in an installation that does not want it, and a new one plugs into the same platform core.</p>'
      },

      connectors: {
        title: 'Connectors',
        lead: 'Identity, coverage and health-record systems are different in every country. Each sits behind a small interface, so bringing a new country is a pull request instead of a fork.',
        body:
          '<h2>What a connector covers</h2>' +
          '<ul>' +
            '<li><b>Identity</b> — reading a national ID document, and verifying it against a registry where one exists.</li>' +
            '<li><b>Coverage</b> — which insurer or public scheme a patient belongs to.</li>' +
            '<li><b>The health record</b> — writing appointments and reading a patient’s history.</li>' +
            '<li><b>Professional registries</b> — confirming a licence number is real and active.</li>' +
            '<li><b>Messaging</b> — whatever channel people in that country actually answer.</li>' +
          '</ul>' +
          '<h2>Degrading is part of the contract</h2>' +
          '<p>A capability with no connector must leave the product usable. No registry means the field is typed by hand; no health record means appointments live only in Human Rounds. A country with none of these connectors still gets a working appointment system on day one.</p>' +
          '<h2>What ships today</h2>' +
          '<p>Argentina: the national ID barcode, the public coverage registry, the federal professional registry, and the national health record. Other countries are welcome — the interface is deliberately small enough to implement in an afternoon and grow later.</p>'
      }
    },

    es: {
      navDocs: 'Documentación',
      docsNext: 'Seguí con',

      index: {
        title: 'Documentación de Human Rounds',
        lead: 'Human Rounds es una plataforma médica de código abierto. La IA hace el trabajo repetitivo alrededor de la consulta —entrevistar, leer papeles, resumir, cargar— y el equipo de salud decide. Hoy funciona en un hospital público de Pinamar.',
        body:
          cards('es', HOME_CARDS) +
          '<h2>Cómo transcurre una consulta</h2>' +
          '<ol>' +
            '<li><b>Antes.</b> El paciente saca turno por el sitio, por WhatsApp o en la ventanilla, y responde una entrevista con IA desde su propio celular.</li>' +
            '<li><b>En la puerta.</b> Mesa de entrada escanea el documento y el paciente nuevo queda registrado sin volver a tipear nada.</li>' +
            '<li><b>En el consultorio.</b> El médico abre una lista que ya trae color de triage, el motivo en palabras del paciente y un resumen de la historia.</li>' +
            '<li><b>Después.</b> El turno se escribe en la historia clínica nacional, y si ese sistema está caído se reintenta solo.</li>' +
          '</ol>' +
          '<h2>Lo que no es</h2>' +
          '<p><b>No diagnostica.</b> Todo lo que sale de la IA es una propuesta que una persona aprueba, rechaza o corrige, y la historia clínica sigue siendo la fuente de verdad. Las reglas de triage pueden subir la urgencia de un paciente, nunca bajarla.</p>' +
          '<p><b>Todavía no está medido.</b> Acá no vas a encontrar una mejora en tiempos de espera, ausentismo ni costos: el sistema no lleva el tiempo suficiente en ningún lado como para tener ese dato.</p>' +
          '<h2>Probalo o instalalo</h2>' +
          '<p>La <a href="https://demo.humanrounds.org/">demo</a> es una instalación completa de un pueblo ficticio, que se regenera todos los días. Para levantarlo en tu máquina, empezá por <a href="/docs/install">Instalación</a>. El código está en <a href="https://github.com/visualpharm/human-rounds" rel="noopener">GitHub</a>.</p>'
      },

      'pre-consult': {
        title: 'Entrevista previa',
        lead: 'El paciente escanea un QR en la puerta del consultorio. La entrevista se abre en su propio celular y el médico lee las respuestas antes de que entre.',
        status: 'Funcionando en la instalación de Pinamar.',
        body:
          shot('pre-consult-interview.png', 'La entrevista previa preguntando algo puntual',
               'La entrevista pregunta en castellano común y repregunta sobre lo que el paciente contó.') +
          '<h2>Cómo funciona</h2>' +
          '<ul>' +
            '<li><b>La puerta es la entrada.</b> Un cartel impreso con un QR por consultorio: sin app, sin cuenta, sin contraseña.</li>' +
            '<li><b>Primero el relato.</b> El paciente cuenta con sus palabras qué le pasa, escribiendo o dictando. Las preguntas cerradas vienen después, no antes.</li>' +
            '<li><b>La IA repregunta</b> lo que preguntaría un médico sobre ese motivo, y ahí para. No le hace un cuestionario fijo a alguien que ya contestó.</li>' +
            '<li><b>El resultado es un color de triage y un resumen</b>, esperando en la lista del médico para ese turno.</li>' +
          '</ul>' +
          '<h2>Dónde no se le cree al modelo</h2>' +
          '<p>Las banderas rojas son <b>código, no un prompt</b>. Ciertas respuestas suben el triage sin importar qué concluyó el modelo. El modelo puede subir la urgencia de un paciente; nunca puede bajarla del piso que fijan las reglas.</p>' +
          '<p>El médico ve las respuestas crudas al lado del resumen, así un resumen equivocado se nota en vez de pasar desapercibido.</p>' +
          '<h2>Editar lo que pregunta</h2>' +
          '<p>Los tres prompts de la entrevista —el que pregunta, el que decide el triage y el que resume— <b>se editan desde el panel</b>. El original está en inglés; el equipo edita el castellano.</p>'
      },

      'referral-orders': {
        title: 'Órdenes leídas por IA',
        lead: 'El paciente le saca una foto a la orden en papel. La IA la lee —manuscrita incluida— y propone especialidad, médico y horario. El equipo aprueba o rechaza en un clic.',
        status: 'Funcionando en la instalación de Pinamar.',
        body:
          shot('referral-orders.png', 'La cola de solicitudes con la lectura de la IA',
               'Cada solicitud llega con la lectura de la IA, la foto de la orden y un clic para aprobar.') +
          '<h2>Qué saca del papel</h2>' +
          '<ul>' +
            '<li>La <b>especialidad o el estudio</b> pedido, cruzado contra el catálogo de lo que esta instalación realmente ofrece.</li>' +
            '<li>El <b>diagnóstico</b> y las <b>prácticas</b> escritas en la orden.</li>' +
            '<li>La <b>fecha de emisión</b>, que es lo que hace que una orden esté vencida.</li>' +
            '<li>Si está <b>firmada y sellada</b>.</li>' +
          '</ul>' +
          '<h2>Qué ve el equipo</h2>' +
          '<p>Cada solicitud llega con una lectura en castellano —<b>parece correcta</b> o <b>dudosa</b>— más los campos que extrajo la IA y la foto de donde los sacó. Nadie tiene que abrir otro visor para chequear un dato.</p>' +
          '<p>Es <b>una sola lectura, no un jurado</b>: una pasada de un modelo. Sus instrucciones se editan desde el panel, y cuando las lecturas coinciden la cola entera se resuelve de a tandas.</p>' +
          '<h2>Un rechazo trae el paso siguiente</h2>' +
          '<p>Al paciente nunca le llega un error pelado. Una orden vencida vuelve con qué hacer al respecto; una especialidad equivocada vuelve con el enlace a la correcta; una foto ilegible vuelve con el enlace para subir otra. Los motivos de rechazo son una <b>lista curada</b>, así la respuesta es la misma venga de donde venga.</p>'
      },

      'prepared-clinician': {
        title: 'El médico llega preparado',
        lead: 'Antes del primer paciente del día, la lista ya está leída: un color de triage por fila, el motivo en palabras del paciente y un resumen armado con la historia clínica.',
        status: 'Funcionando en la instalación de Pinamar. El resumen profundo de la historia clínica está en el roadmap.',
        body:
          shot('prepared-clinician.png', 'La lista de pacientes de hoy con un resumen previo abierto',
               'La lista del día a la izquierda; a la derecha, el resumen previo del paciente elegido.') +
          '<h2>Qué trae el resumen</h2>' +
          '<ul>' +
            '<li><b>El motivo</b>, tomado de la entrevista previa, en palabras del paciente.</li>' +
            '<li><b>Los antecedentes que importan</b> para la consulta de hoy, no el legajo entero.</li>' +
            '<li><b>La medicación actual.</b></li>' +
            '<li><b>Tendencias</b>, cuando hay mediciones repetidas para graficar.</li>' +
            '<li><b>La última consulta</b> y qué se cambió en ella.</li>' +
          '</ul>' +
          '<h2>De dónde sale</h2>' +
          '<p>El resumen se arma con la historia clínica más la entrevista previa, y se <b>genera antes de la consulta</b>, no mientras el médico espera. Las series numéricas las extrae el código y no el modelo, así un gráfico no puede mostrar un número que nadie registró.</p>' +
          '<h2>Es un borrador</h2>' +
          '<p>El resumen dice en pantalla que lo escribió una IA. La historia clínica original está a un clic, y lo que queda asentado es la nota del médico.</p>'
      },

      'scan-to-register': {
        title: 'Registro por escaneo',
        lead: 'Una cámara en la ventanilla lee el código del documento y el QR de la credencial, y completa el registro en la historia clínica. Un formato de credencial que nadie vio antes se aprende una vez y después se reconoce solo.',
        status: 'Prototipo. Construido y probado de punta a punta, todavía no en producción.',
        body:
          shot('scan-to-register.png', 'La pantalla de registro en la ventanilla con un documento leído',
               'El documento se lee en la ventanilla y los campos entran a la historia clínica sin tipear.') +
          '<h2>Qué lee</h2>' +
          '<ul>' +
            '<li><b>El código de barras del DNI</b>: número, sexo y fecha de nacimiento son confiables; los nombres con acento salen aproximados, porque el código es ASCII pelado.</li>' +
            '<li><b>El QR de la credencial</b> de la obra social, que cada prestador diseña a su manera.</li>' +
            '<li><b>Una foto en vez de la cámara en vivo</b>, cuando el celular o la red no acompañan. Si el código no decodifica, un modelo de visión lee la imagen.</li>' +
          '</ul>' +
          '<h2>Aprender una credencial desconocida</h2>' +
          '<p>Un QR que no se reconoce pasa por cuatro etapas, y <b>el modelo es la última, no la primera</b>: prestadores conocidos, después reglas aprendidas en escaneos anteriores, después una lectura estructural de los campos crudos, y recién ahí una llamada al modelo. Lo que el modelo deduce se guarda como regla, así el próximo paciente con esa credencial entra al instante y sin costo.</p>' +
          '<h2>El paciente se puede registrar solo</h2>' +
          '<p>El mismo lector corre en el celular del paciente, que enfoca un código denso muchísimo mejor que una webcam de escritorio. El auto-registro cae en una cola en la ventanilla, donde mesa de entrada lo confirma contra la historia clínica.</p>'
      },

      'record-handoff': {
        title: 'Envío a la historia clínica',
        lead: 'Aprobar un turno lo escribe en la historia clínica nacional. Si ese sistema no responde, el turno igual queda guardado, encolado y se reintenta hasta que entra.',
        status: 'Funcionando en la instalación de Pinamar.',
        body:
          shot('health-record-handoff.png', 'La cola de envíos a la historia clínica reintentando',
               'La cola se vacía sola. Nadie vuelve a cargar un turno porque un sistema se cayó.') +
          '<h2>Nada se rompe por una integración</h2>' +
          '<p>La regla es que <b>primero se guarda acá</b>. El equipo aprueba, el turno existe, y el envío es un trabajo en segundo plano. Un envío fallido es una fila en una cola con hora de reintento, no un error que la ventanilla tenga que entender.</p>' +
          '<p>Lo mismo vale para el mail y los mensajes: si falta una clave se saltea la notificación, nunca se cae el turno.</p>' +
          '<h2>Qué se escribe</h2>' +
          '<p>El paciente, el profesional, el servicio y el horario, mapeados a los identificadores de la historia clínica. A los pacientes que ya existen ahí se los reconoce en vez de duplicarlos.</p>' +
          '<h2>Cuando los dos no coinciden</h2>' +
          '<p>Un turno también se puede mover o cancelar dentro de la historia clínica. Un resincronizador compara los dos lados y resuelve la diferencia, así el panel no sigue ofreciendo un horario que ya no existe.</p>'
      },

      booking: {
        title: 'Turnos y la cola',
        lead: 'Lo que tiene cualquier sistema de turnos. Está listado porque tiene que funcionar, no porque sea notable.',
        status: 'Funcionando en la instalación de Pinamar.',
        body:
          shot('booking.png', 'El paciente eligiendo un horario',
               'Horarios reales, el más cercano primero, reservados ocho minutos mientras el paciente termina.') +
          '<h2>Para el paciente</h2>' +
          '<ul>' +
            '<li><b>Encontrar un servicio tipeando tres letras</b>, en el hospital y en todos los centros de salud, con raíces de palabra para que un casi-acierto igual encuentre.</li>' +
            '<li><b>Horarios reales, el más cercano primero</b>, reservados ocho minutos para que dos personas no tomen el mismo.</li>' +
            '<li><b>Sacar turno en el sitio, en un chat o por WhatsApp</b>: el mismo turno, por la puerta que entre.</li>' +
            '<li><b>Un recordatorio el día antes</b>, por mail y por WhatsApp. Contestando SÍ o NO se confirma o se cancela.</li>' +
            '<li><b>Crear la cuenta con una foto del DNI</b>, y la cobertura se busca en el registro nacional en vez de preguntarla.</li>' +
          '</ul>' +
          '<h2>Para el equipo</h2>' +
          '<ul>' +
            '<li><b>Una sola cola</b> de solicitudes, con la lectura de la IA pegada a cada una.</li>' +
            '<li><b>Los pacientes de hoy</b>, las agendas de cada médico y un calendario que refleja el real.</li>' +
            '<li><b>Un turno liberado se re-ofrece solo</b> al próximo paciente de la lista de espera.</li>' +
            '<li><b>Reportes</b> de capacidad, asistencia y recupero de facturación.</li>' +
          '</ul>' +
          '<h2>Dos reglas que conviene saber</h2>' +
          '<p><b>Lo que es por orden de llegada nunca ofrece turno.</b> Si un servicio se atiende por demanda espontánea, ninguna pantalla del producto va a prometer un horario para eso; la única excepción es una apertura del mismo día, que no pasa de un día.</p>' +
          '<p><b>Cuántos turnos puede tener un paciente a la vez es un número</b>, que se resuelve por médico, después por servicio y después por instalación. Aplica a lo que el paciente saca solo, nunca a lo que le carga la ventanilla.</p>'
      },

      install: {
        title: 'Instalación',
        lead: 'Un contenedor y una base Postgres. El primer arranque abre un asistente que escribe el paquete de datos de la instalación.',
        body:
          '<h2>Qué hace falta</h2>' +
          '<ul>' +
            '<li><b>Docker</b> y una base <b>PostgreSQL</b>.</li>' +
            '<li>Un dominio, si el sitio va a ser público.</li>' +
            '<li>Una <b>clave de IA</b>, sólo si querés las funciones que leen papeles o entrevistan pacientes. Todo lo demás anda sin eso.</li>' +
          '</ul>' +
          '<h2>Levantarlo</h2>' +
          '<pre><code>git clone https://github.com/visualpharm/human-rounds\ncd human-rounds\ndocker compose up -d</code></pre>' +
          '<p>Abrís el sitio y toma el control el <b>asistente de instalación</b>: pregunta el nombre de la instalación, la zona horaria, los idiomas y el primer centro, y recién escribe en la base en el último paso, así un setup abandonado no deja nada.</p>' +
          '<h2>Tus servicios y centros son un paquete de datos</h2>' +
          '<p>Todo lo propio de un pueblo —centros, servicios, profesionales, especialidades, preparaciones— vive en un <b>paquete de datos</b> apilado sobre uno de país y uno global. Actualizar el software no lo toca, y una segunda instalación es un segundo paquete, no un fork.</p>' +
          '<h2>Módulos</h2>' +
          '<p>Los turnos son un módulo. La entrevista previa es otro. Un módulo se puede apagar en una instalación que no lo quiere, y uno nuevo se enchufa al mismo núcleo.</p>'
      },

      connectors: {
        title: 'Conectores',
        lead: 'Los sistemas de identidad, cobertura e historia clínica son distintos en cada país. Cada uno vive detrás de una interfaz chica, así sumar un país es un pull request y no un fork.',
        body:
          '<h2>Qué cubre un conector</h2>' +
          '<ul>' +
            '<li><b>Identidad</b>: leer el documento nacional y, donde exista, verificarlo contra un registro.</li>' +
            '<li><b>Cobertura</b>: a qué obra social o sistema público pertenece el paciente.</li>' +
            '<li><b>La historia clínica</b>: escribir turnos y leer los antecedentes.</li>' +
            '<li><b>Registros profesionales</b>: confirmar que una matrícula existe y está activa.</li>' +
            '<li><b>Mensajería</b>: el canal que la gente de ese país realmente contesta.</li>' +
          '</ul>' +
          '<h2>Degradar es parte del contrato</h2>' +
          '<p>Una capacidad sin conector tiene que dejar el producto usable. Sin registro, el campo se tipea a mano; sin historia clínica, los turnos viven sólo en Human Rounds. Un país sin ninguno de estos conectores igual tiene un sistema de turnos andando desde el primer día.</p>' +
          '<h2>Qué viene hecho</h2>' +
          '<p>Argentina: el código de barras del DNI, el padrón público de cobertura, el registro federal de profesionales y la historia clínica nacional. Otros países son bienvenidos: la interfaz es a propósito lo bastante chica como para implementarla en una tarde y ampliarla después.</p>'
      }
    }
  };

  function currentId() {
    var host = document.querySelector('[data-docs-page]');
    return host ? host.getAttribute('data-docs-page') : null;
  }

  function renderNav(lang, id) {
    var box = document.querySelector('[data-docs-nav]');
    if (!box) return;
    var html = '';
    for (var g = 0; g < GROUPS.length; g++) {
      var grp = GROUPS[g];
      if (grp[lang]) html += '<p class="docs-nav-group">' + grp[lang] + '</p>';
      html += '<ul>';
      for (var i = 0; i < grp.items.length; i++) {
        var p = page(grp.items[i]);
        html += '<li><a href="' + p.href + '"' + (p.id === id ? ' aria-current="page"' : '') + '>' +
          p[lang] + '</a></li>';
      }
      html += '</ul>';
    }
    box.innerHTML = html;
  }

  function renderBody(lang, id) {
    var host = document.querySelector('[data-docs-page]');
    var c = copy[lang][id];
    if (!host || !c) return;
    var html = '<h1>' + c.title + '</h1><p class="docs-lead">' + c.lead + '</p>';
    if (c.status) html += '<p class="docs-status"><b>Status:</b> ' + c.status + '</p>';
    html += c.body;

    var idx = -1;
    for (var i = 0; i < PAGES.length; i++) if (PAGES[i].id === id) idx = i;
    if (idx > -1 && idx < PAGES.length - 1) {
      var nxt = PAGES[idx + 1];
      html += '<p class="docs-next">' + copy[lang].docsNext + ': <a href="' + nxt.href + '">' +
        nxt[lang] + '</a></p>';
    }
    host.innerHTML = html;
    document.title = c.title + ' — Human Rounds';
  }

  /* The status label is the only string the body strings don't carry, and it is
     the same word in both languages, so it stays inline above. */
  function render(lang) {
    if (!copy[lang]) lang = 'en';
    var id = currentId();
    if (!id) return;
    renderNav(lang, id);
    renderBody(lang, id);
  }

  function initialLanguage() {
    var query = new URLSearchParams(location.search).get('lang');
    if (copy[query]) return query;
    try {
      var saved = localStorage.getItem('human-rounds-language');
      if (copy[saved]) return saved;
    } catch (e) {}
    return 'en';
  }

  window.addEventListener('human-rounds:language', function (event) { render(event.detail.lang); });

  function init() { render(initialLanguage()); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
