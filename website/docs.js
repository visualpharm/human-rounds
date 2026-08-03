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
    { id: 'booking',            href: '/docs/booking-and-queue',    en: 'Booking',                 es: 'Turnos' },
    { id: 'staff-panel',        href: '/docs/staff-panel',          en: 'The desk and the panel',  es: 'La ventanilla y el panel' },
    { id: 'install',            href: '/docs/install',              en: 'Install',                 es: 'Instalación' },
    { id: 'connectors',         href: '/docs/connectors',           en: 'Connectors',              es: 'Conectores' },
    { id: 'writing-connector',  href: '/docs/writing-a-connector',  en: 'Writing a connector',     es: 'Escribir un conector' }
  ];

  var GROUPS = [
    { en: '',                        es: '',                        items: ['index'] },
    { en: 'What makes it different', es: 'Lo que lo hace distinto', items: ['pre-consult', 'referral-orders', 'prepared-clinician', 'scan-to-register', 'record-handoff'] },
    { en: 'Everyday use',            es: 'El día a día',            items: ['booking', 'staff-panel'] },
    { en: 'Run it yourself',         es: 'Instalarlo',              items: ['install', 'connectors', 'writing-connector'] }
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
      en: 'Search, real slots, reminders, cancellation and the waitlist.',
      es: 'Búsqueda, horarios reales, recordatorios, cancelación y lista de espera.' }
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
        title: 'Booking',
        lead: 'How a patient gets an appointment, from the first three letters they type to the reminder the night before. Ordinary scheduling — written down because it is the part that has to be right every single day.',
        status: 'Live at the Pinamar installation.',
        body:
          shot('booking.png', 'The patient picking an appointment slot',
               'Real slots, nearest first, held for eight minutes while the patient finishes.') +
          '<h2>Finding the service</h2>' +
          '<p>The patient types what they are looking for, and the search answers from three letters on, across the hospital and every health centre at once. It matches on word roots, so <i>cardio</i> finds cardiology and <i>traumato</i> finds traumatology, and it searches specialties, service names and the professionals themselves.</p>' +
          '<p>What it never does is invent an option. A service that is attended first-come-first-served is labelled as such and leads to its opening hours, not to a calendar. A service the installation does not offer says so and points at the ones it does.</p>' +
          '<h2>Being offered a time</h2>' +
          '<ul>' +
            '<li><b>The slots are real.</b> They come from the professional’s own agenda, minus what is already taken, minus that day’s closures. Nothing is offered that the desk would then have to undo.</li>' +
            '<li><b>Nearest first, grouped by day.</b> The patient sees the first date that exists and can walk forward from it.</li>' +
            '<li><b>A chosen slot is held for eight minutes</b> while they finish. Two people cannot take the same time, and an abandoned booking releases the slot on its own.</li>' +
            '<li><b>The first appointment shown is the first one, not the only one.</b> Every band that promises a time leads to a flow that can actually give it.</li>' +
          '</ul>' +
          '<h2>Three doors, one appointment</h2>' +
          '<p>A patient can book <b>on the site</b>, <b>in the chat</b> on the corner of the page, or <b>on WhatsApp</b> — the assistant asks the same questions and produces the same request. A conversation that starts on WhatsApp can be tied to the account already logged in on the site with a short code, so nobody dictates their ID number twice.</p>' +
          '<p>Whichever door it came through, identity comes from the session, never from what the message says. Somebody who writes “I am booking for my mother” has to be logged in as the person who is allowed to.</p>' +
          '<h2>The account</h2>' +
          '<p>Signing up takes a photo of the identity document, front and back. The details are read from it, and health coverage is looked up in the national registry instead of being asked for. What the registry cannot answer stays editable by hand — no field is ever locked because a lookup failed. Detail: <a href="/docs/scan-to-register">Scan to register</a>.</p>' +
          '<h2>Before the visit</h2>' +
          '<ul>' +
            '<li><b>A confirmation the moment it is booked</b>, with the address of that particular centre, the date in words, and what to bring.</li>' +
            '<li><b>Preparation instructions per service</b> — fasting, previous studies, arriving earlier — written once against the service, so they are the same on the site, in the email and at the desk.</li>' +
            '<li><b>A reminder the day before</b>, by email and WhatsApp, that asks a yes-or-no question. Answering confirms it or cancels it; nothing else is required of the patient.</li>' +
          '</ul>' +
          '<h2>Cancelling, and the waitlist</h2>' +
          '<p>A patient can cancel from the email, from the reminder, or from their own account. A freed slot does not sit there: the next person on the waitlist for that service is offered it automatically, and the offer expires so it moves on to the next person if nobody takes it.</p>' +
          '<p>Waitlists exist because the honest answer to “nothing until October” is not to send the patient away. They register once and get told when something opens.</p>' +
          '<h2>When the answer is no</h2>' +
          '<p>A refusal always carries the next concrete step, and the step is a link, not a homepage. An order that cannot be read gets the instruction to photograph it again with the parts that were missing named. A service with no availability gets the waitlist and the nearest centre that has one. A patient who already holds the maximum number of appointments gets shown the one they hold, with the option to move it.</p>' +
          '<h2>Two rules worth knowing</h2>' +
          '<p><b>Walk-in services never offer appointments.</b> If a service is first-come-first-served, no surface anywhere in the product will promise a time for it — the single exception is a same-day opening, which is capped at one day ahead.</p>' +
          '<p><b>How many appointments a patient may hold at once is a number</b>, resolved per doctor, then per service, then per installation. Kinesiology ships at ten because a course of treatment is ten sessions; most services ship at one. It applies to what the patient books themselves, never to what the front desk books for them.</p>'
      },

      'staff-panel': {
        title: 'The desk and the panel',
        lead: 'One queue holds everything patients have asked for. The panel is where the decisions get made — the AI only arrives at them prepared.',
        status: 'Live at the Pinamar installation.',
        body:
          '<h2>The queue</h2>' +
          '<p>Every request lands in one list, oldest first, with the AI’s reading of the referral order already attached: what study it asks for, which specialty it belongs to, whether the professional’s signature and licence are there. The person at the desk approves, rejects, or edits and then approves.</p>' +
          '<p>Approving does three things at once — it books the appointment, writes it to the health record, and emails the patient. If the health record is down, the first two still happen and the write is retried on its own.</p>' +
          '<p>Rejecting picks a reason from a short curated list rather than typing free text, because the reason is what the patient reads, and it is what turns into the instruction for fixing it. The list is edited in the panel when a new reason turns out to be real.</p>' +
          '<h2>Today’s patients</h2>' +
          '<p>The day in one screen: who is coming, at what time, to which professional, with what coverage, and whether they answered the reminder. Anyone who arrives without an appointment is added here, so the list matches the waiting room rather than the calendar.</p>' +
          '<h2>Agendas and the calendar</h2>' +
          '<ul>' +
            '<li><b>Each professional has an agenda</b>: days, hours, appointment length, which centre, which services.</li>' +
            '<li><b>Exceptions are first-class</b> — a holiday, a training day, an afternoon that runs elsewhere. The patient site stops offering those times the moment they are entered.</li>' +
            '<li><b>The calendar reflects the real one.</b> What the desk sees and what the patient can take are the same data, not two systems kept in sync by hand.</li>' +
            '<li><b>A professional who leaves is disabled, never deleted</b>, whenever they have appointments — the history has to stay readable.</li>' +
          '</ul>' +
          '<h2>Who sees what</h2>' +
          '<p>Five roles, and a new endpoint is closed to all of them until it is deliberately opened:</p>' +
          '<ul>' +
            '<li><b>Administrator</b> — everything, including users, services and settings.</li>' +
            '<li><b>Front desk</b> — the queue, today’s patients, booking on someone’s behalf.</li>' +
            '<li><b>Clinician</b> — their own agenda and their own patients, with the pre-consult interview and the record summary.</li>' +
            '<li><b>Reports</b> — the numbers, and nothing identifying beyond what a report needs.</li>' +
            '<li><b>Communications</b> — the public texts, the news entries and the site’s own copy.</li>' +
          '</ul>' +
          '<p>Login is a password plus, optionally, a second factor or a passkey. Sessions are the only source of identity anywhere in the product.</p>' +
          '<h2>Reports</h2>' +
          '<p>Each report answers one question and says the answer in a sentence before it draws anything: how much of the offered capacity was actually used, who did not show up and on which services, and how much of the care given to insured patients was never billed back to their insurer. That last one tends to pay for the installation.</p>' +
          '<h2>Settings and system health</h2>' +
          '<p>Languages, location, the site’s own texts, the AI instructions and the API keys are edited from the panel, without a redeploy. Keys are shown as present or missing, never printed back. A status screen says which integrations are actually answering right now — the health record, the coverage registry, WhatsApp, email, the AI provider — so “it is not working” has an address before anyone opens a terminal.</p>'
      },

      install: {
        title: 'Install',
        lead: 'One container and a Postgres database. No queue, no cache, no worker fleet. The first run opens a setup wizard that writes the installation’s own data package.',
        body:
          '<h2>What you need</h2>' +
          '<ul>' +
            '<li><b>Docker</b> with the compose plugin, or Python 3.12 and Postgres 14 or newer on the host.</li>' +
            '<li>A domain and a reverse proxy for TLS, if the site is to be public. The app itself speaks plain HTTP on one port.</li>' +
            '<li>An <b>AI key</b>, only for the features that read paper, interview patients or summarise a record. Everything else runs without one.</li>' +
          '</ul>' +
          '<h2>Run it</h2>' +
          '<pre><code>git clone https://github.com/visualpharm/human-rounds\ncd human-rounds\ndocker compose up -d</code></pre>' +
          '<p>Open the site and the <b>setup wizard</b> takes over: it asks for the installation’s name, timezone, languages and first centre, and only writes to the database at the last step, so an abandoned setup leaves nothing behind.</p>' +
          '<h2>What it costs to run</h2>' +
          '<p>A small virtual machine is enough. The whole application is a <b>single process</b> that handles each request on its own thread, plus Postgres next to it — two vCPUs and 2 GB of memory carry a district-sized public network — one hospital and a handful of health centres — and the load that matters is measured in requests per minute, not per second. There is no Redis, no message broker, no Node service and no separate worker to deploy.</p>' +
          '<p>Two operating-system packages are needed beyond Python: <code>poppler-utils</code>, to turn a referral order that arrives as a PDF into an image before the AI reads it, and <code>ffmpeg</code>. Three Python packages, all pinned. Nothing else is compiled.</p>' +
          '<p>The only thing on disk that grows is what patients upload — photos and PDFs of referral orders. Put that directory on a volume you actually back up: the database can be restored from a dump, an uploaded order cannot.</p>' +
          '<h2>What runs in the background</h2>' +
          '<p>Inside that same process, a handful of small loops do the work nobody triggers: sending the day-before reminders, re-offering a freed slot to the waitlist, retrying appointments the health record refused, preparing record summaries ahead of the clinic, taking off-site backups, and watching whether the AI provider is answering. Each can be switched off with a setting, and each one failing degrades only itself.</p>' +
          '<h2>Your services and centres are a data package</h2>' +
          '<p>Everything specific to one town — centres, services, professionals, specialties, preparation instructions, the site’s own texts — lives in a <b>data package</b> layered over a country package and a global one. You only write what differs from the layer below. Upgrading the software does not touch it, and a second installation is a second package rather than a fork.</p>' +
          '<h2>Upgrading</h2>' +
          '<p>Pull and redeploy. The database migrates itself on boot, forward only, and refuses to run a migration twice. Your data package, your settings and your uploads are outside the image and survive the redeploy untouched. Take the database dump first anyway.</p>' +
          '<h2>Modules</h2>' +
          '<p>Appointments are one module. The pre-consult interview is another. A module can be turned off in an installation that does not want it, and a new one plugs into the same platform core — the core owns the account, the session, the roles and the data package, and a module owns its own routes and screens.</p>' +
          '<h2>Configuration, and where it lives</h2>' +
          '<p>Only the database connection has to be an environment variable. Everything the institution changes afterwards — languages, location, keys, the texts, the AI instructions — is edited from the panel and takes effect without a redeploy. Secrets are written, never read back: the panel reports a key as present or missing and nothing else.</p>'
      },

      connectors: {
        title: 'Connectors',
        lead: 'Identity, coverage, health records and messaging are different in every country. Each sits behind a small interface, so bringing a new country is a pull request instead of a fork — and running with none of them still gives you a working appointment system.',
        body:
          '<h2>The seven things a connector can be</h2>' +
          '<ul>' +
            '<li><b>Identity</b> — verifying a person against the national identity system.</li>' +
            '<li><b>Coverage</b> — which insurer or public scheme a patient belongs to.</li>' +
            '<li><b>The health record</b> — writing appointments into the institution’s record system.</li>' +
            '<li><b>Clinical history</b> — reading what already exists about this patient, including archives that predate the current system.</li>' +
            '<li><b>Professional registries</b> — confirming a licence number is real and active.</li>' +
            '<li><b>Messaging</b> — the channel people in that country actually answer.</li>' +
            '<li><b>External availability</b> — appointment slots that live in somebody else’s system.</li>' +
          '</ul>' +
          '<p>Argentina ships with all of them wired. Below are the four an institution usually turns on first, and exactly what it has to obtain to do it.</p>' +
          '<h2>Identity</h2>' +
          '<p>Lets a patient log in as themselves, verified against the national identity provider, instead of a password you have to reset by phone.</p>' +
          '<p><b>What the institution needs:</b> to be registered with the national identity provider as a relying party, which for Argentina means the municipality’s own agreement with the registry, not ours. That registration returns a client identifier and a secret, and takes the callback address of your installation. Three values in the settings panel, and the login button appears.</p>' +
          '<p><b>Before you have it:</b> a test mode runs the entire login flow against synthetic identities with no network call, so the screens can be reviewed and demonstrated while the paperwork is in progress. <b>Without it:</b> password login stays on. The product will not let an installation end up with zero usable ways to log in.</p>' +
          '<h2>Coverage</h2>' +
          '<p>Answers “which insurer is this person in today” from the national registry, at the moment of registration and again at the moment of the appointment. It is what makes billing recovery possible, because the patient who says they have no coverage frequently does.</p>' +
          '<p><b>What the institution needs:</b> nothing, to start. There is a public lookup that requires no credentials and is on by default. A service account for the ministry’s registry gives higher limits and a documented interface, and is worth requesting once the volume justifies it.</p>' +
          '<p><b>Without it:</b> the patient types their insurer and membership number by hand, as they do today at every desk.</p>' +
          '<h2>The health record</h2>' +
          '<p>Pushes each approved appointment into the institution’s clinical record system, so the visit exists where the clinician actually works and not only in Human Rounds.</p>' +
          '<p><b>What the institution needs:</b> the address of its record-system instance, a service user and password created inside it, and the institution’s own identifier there. The professionals and specialties you offer have to exist on that side too — that mapping is the real work, and it is done once.</p>' +
          '<p><b>Without it, or when it is down:</b> approving still books the appointment and still emails the patient. The write is queued and retried on its own every few minutes, and a record system that is refusing is not hammered. Nothing a patient or a receptionist does is ever blocked by the record system being unavailable. It can also be switched off deliberately, which is what an installation evaluating the product does on day one.</p>' +
          '<h2>WhatsApp</h2>' +
          '<p>In much of the world this is the only channel a patient reliably reads. It carries the verification code when an account is created, the reminder the day before, and the booking conversation itself.</p>' +
          '<p><b>Two ways to connect it.</b> A <b>self-hosted gateway</b> is a second container, a phone number, and a QR scanned once to pair it — no business verification, no message templates, and it is the path that works on the first afternoon. <b>Meta’s official cloud API</b> needs a business account, a verified number and an access token; it is more paperwork, it carries conversations rather than verification codes, and it is the durable option at scale.</p>' +
          '<p><b>What the institution needs either way:</b> a phone number that belongs to the institution and not to a person, and a webhook address on your installation for inbound replies. That address stays closed — it returns nothing at all — until a shared secret is configured, so a half-finished setup never leaves an open endpoint.</p>' +
          '<p><b>Without it:</b> everything falls back to email. Codes, confirmations and reminders are sent, just on a channel fewer patients open.</p>' +
          '<h2>The rest</h2>' +
          '<p>The professional-licence registry, the clinical-history archives and third-party availability follow the same shape: configured, they add a capability; unconfigured, the screen that used them simply does not offer that assistance. <b>Email</b> is not a connector but behaves like one — a domain and an API key, and without them the site never blocks, it just does not send.</p>' +
          '<h2>Degrading is part of the contract</h2>' +
          '<p>A capability with no connector must leave the product usable, and every connector ships with the test that proves it. No registry means the field is typed by hand. No record system means appointments live only here. A country with none of these connectors still gets a working appointment system on day one, and adds the rest as the agreements arrive.</p>'
      },

      'writing-connector': {
        title: 'Writing a connector',
        lead: 'A connector is a folder with a manifest and one class. If your country’s registry answers an HTTP call, this is an afternoon of work, not a fork of the project.',
        body:
          '<h2>The shape</h2>' +
          '<p>A connector is a directory under <code>connectors/</code> containing three things: a manifest declaring what it is, an implementation that talks to the outside world, and a thin adapter implementing the capability’s interface. Nothing else in the codebase needs to know your country exists.</p>' +
          '<pre><code>connectors/aadhaar/\n  connector.json   id, country, capability, config keys\n  aadhaar.py       the HTTP client\n  adapter.py       implements IdentityVerificationConnector</code></pre>' +
          '<p>The manifest declares one capability out of the seven, a two-letter country code, and every configuration key the connector reads. That last list is what the panel and the command line use to report the connector as configured or not — key names are shown, values never are.</p>' +
          '<h2>Six rules</h2>' +
          '<ul>' +
            '<li><b>Read the capability’s interface first; it is the specification.</b> Each one is a handful of methods with a docstring saying what “not configured”, “not found” and “provider unavailable” have to mean. Implement that, nothing wider.</li>' +
            '<li><b>Fail with the shared errors.</b> Raise the framework’s own “not found” and “provider unavailable”, not a new exception type of your own. Every caller already handles those two, which is what makes your country work without touching their code.</li>' +
            '<li><b>Ship a test mode.</b> A connector that can only be exercised against a live government endpoint cannot be tested, cannot be demonstrated, and cannot be reviewed. One flag, deterministic answers, no network. Every connector in the repository has one.</li>' +
            '<li><b>Degrade, never crash.</b> Unconfigured has to leave the product usable, and the pull request has to contain the test that proves it. This is the single rule the reviewer will check hardest.</li>' +
            '<li><b>Never print a secret.</b> Not in a log line, not in an error message, not in the status screen. Presence or absence is the whole reportable surface.</li>' +
            '<li><b>One capability per connector.</b> A registry that answers both identity and coverage is two connectors sharing a client, not one connector with a flag.</li>' +
          '</ul>' +
          '<h2>What a pull request needs</h2>' +
          '<ul>' +
            '<li>The manifest, with its identifier equal to the directory name and a capability that actually exists.</li>' +
            '<li>The adapter, delegating to the implementation rather than containing it.</li>' +
            '<li>Three tests: the connector is discovered, the unconfigured case degrades as documented, and the test mode answers.</li>' +
            '<li>A row in the connectors documentation, honest about what is real and what is a stub.</li>' +
          '</ul>' +
          '<h2>Be honest about wiring</h2>' +
          '<p>The registry discovers connectors, enables them and holds their configuration. What it does not yet do everywhere is dispatch: several call sites in the Argentine stack still import their connector directly, because that code predates the interface. A new country that wants its identity provider on the login screen today therefore also needs a few lines of glue at the call site, following how Argentina does it.</p>' +
          '<p>That is stated here rather than discovered later. Replacing those direct imports with a lookup through the registry is the next slice of work, and a pull request that does it for the capability you care about is welcome.</p>'
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
        title: 'Turnos',
        lead: 'Cómo un paciente consigue un turno, desde las primeras tres letras que tipea hasta el recordatorio de la noche anterior. Turnos comunes y corrientes, escritos acá porque es la parte que tiene que salir bien todos los días.',
        status: 'Funcionando en la instalación de Pinamar.',
        body:
          shot('booking.png', 'El paciente eligiendo un horario',
               'Horarios reales, el más cercano primero, reservados ocho minutos mientras el paciente termina.') +
          '<h2>Encontrar el servicio</h2>' +
          '<p>El paciente escribe lo que busca y la búsqueda contesta desde la tercera letra, en el hospital y en todos los centros de salud a la vez. Compara raíces de palabra, así <i>cardio</i> encuentra cardiología y <i>traumato</i> encuentra traumatología, y busca en especialidades, en nombres de servicio y en los profesionales.</p>' +
          '<p>Lo que nunca hace es inventar una opción. Un servicio por orden de llegada aparece dicho así y lleva a los horarios de atención, no a un calendario. Un servicio que la instalación no ofrece lo dice y muestra los que sí.</p>' +
          '<h2>Que le ofrezcan un horario</h2>' +
          '<ul>' +
            '<li><b>Los horarios son reales.</b> Salen de la agenda del profesional, menos lo ya tomado, menos los cierres de ese día. No se ofrece nada que después la ventanilla tenga que deshacer.</li>' +
            '<li><b>El más cercano primero, agrupado por día.</b> El paciente ve la primera fecha que existe y desde ahí camina para adelante.</li>' +
            '<li><b>El horario elegido queda reservado ocho minutos</b> mientras termina. Dos personas no pueden tomar el mismo, y un trámite abandonado libera el horario solo.</li>' +
            '<li><b>El primer turno que se muestra es el primero, no el único.</b> Toda pantalla que promete un horario lleva a un flujo que de verdad puede darlo.</li>' +
          '</ul>' +
          '<h2>Tres puertas, un mismo turno</h2>' +
          '<p>Se puede sacar turno <b>en el sitio</b>, <b>en el chat</b> de la esquina de la página o <b>por WhatsApp</b>: el asistente hace las mismas preguntas y produce la misma solicitud. Una conversación que arranca en WhatsApp se ata con un código corto a la cuenta que ya está logueada en el sitio, así nadie dicta el número de documento dos veces.</p>' +
          '<p>Entre por donde entre, la identidad sale de la sesión y nunca de lo que dice el mensaje. El que escribe «saco turno para mi mamá» tiene que estar logueado como alguien que puede hacerlo.</p>' +
          '<h2>La cuenta</h2>' +
          '<p>Registrarse es una foto del documento, frente y dorso. Los datos se leen de ahí y la cobertura se busca en el padrón nacional en vez de preguntarla. Lo que el padrón no contesta queda editable a mano: ningún campo se traba porque una consulta falló. Detalle: <a href="/docs/scan-to-register">Registro por escaneo</a>.</p>' +
          '<h2>Antes de la consulta</h2>' +
          '<ul>' +
            '<li><b>Una confirmación al momento</b>, con la dirección de ese centro en particular, la fecha en palabras y qué llevar.</li>' +
            '<li><b>Preparación por servicio</b> —ayuno, estudios previos, llegar antes—, escrita una sola vez contra el servicio, así dice lo mismo en el sitio, en el mail y en la ventanilla.</li>' +
            '<li><b>Un recordatorio el día antes</b>, por mail y por WhatsApp, que hace una pregunta de sí o no. Contestar confirma o cancela; al paciente no se le pide nada más.</li>' +
          '</ul>' +
          '<h2>Cancelar y la lista de espera</h2>' +
          '<p>Se cancela desde el mail, desde el recordatorio o desde la propia cuenta. Un turno liberado no queda ahí: se le ofrece automáticamente al próximo de la lista de espera de ese servicio, y la oferta vence para que siga al siguiente si nadie la toma.</p>' +
          '<p>La lista de espera existe porque la respuesta honesta a «no hay nada hasta octubre» no es mandar al paciente a su casa. Se anota una vez y le avisan cuando se libera algo.</p>' +
          '<h2>Cuando la respuesta es no</h2>' +
          '<p>Un rechazo siempre trae el paso siguiente concreto, y el paso es un link, no la home. Una orden que no se pudo leer trae la indicación de volver a sacarle la foto, con las partes que faltaban dichas por su nombre. Un servicio sin disponibilidad trae la lista de espera y el centro más cercano que sí tiene. Un paciente que ya llegó al máximo de turnos ve el turno que tiene, con la opción de moverlo.</p>' +
          '<h2>Dos reglas que conviene saber</h2>' +
          '<p><b>Lo que es por orden de llegada nunca ofrece turno.</b> Si un servicio se atiende por demanda espontánea, ninguna pantalla del producto va a prometer un horario para eso; la única excepción es una apertura del mismo día, que no pasa de un día.</p>' +
          '<p><b>Cuántos turnos puede tener un paciente a la vez es un número</b>, que se resuelve por médico, después por servicio y después por instalación. Kinesiología sale con diez porque un tratamiento son diez sesiones; casi todo lo demás sale con uno. Aplica a lo que el paciente saca solo, nunca a lo que le carga la ventanilla.</p>'
      },

      'staff-panel': {
        title: 'La ventanilla y el panel',
        lead: 'Una sola cola con todo lo que pidieron los pacientes. El panel es donde se toman las decisiones; la IA sólo llega preparada a ellas.',
        status: 'Funcionando en la instalación de Pinamar.',
        body:
          '<h2>La cola</h2>' +
          '<p>Cada solicitud cae en una sola lista, la más vieja primero, con la lectura de la orden ya hecha al lado: qué estudio pide, a qué especialidad corresponde, si están la firma y la matrícula del profesional. La persona de la ventanilla aprueba, rechaza, o corrige y aprueba.</p>' +
          '<p>Aprobar hace tres cosas de una: da el turno, lo escribe en la historia clínica y le avisa al paciente. Si la historia clínica está caída, las dos primeras pasan igual y la escritura se reintenta sola.</p>' +
          '<p>Rechazar elige un motivo de una lista corta y curada en vez de escribir texto libre, porque el motivo es lo que lee el paciente y es lo que se convierte en la instrucción para arreglarlo. La lista se edita en el panel cuando aparece un motivo nuevo que resulta ser real.</p>' +
          '<h2>Los pacientes de hoy</h2>' +
          '<p>El día en una pantalla: quién viene, a qué hora, con qué profesional, con qué cobertura y si contestó el recordatorio. El que llega sin turno se agrega acá, así la lista se parece a la sala de espera y no al calendario.</p>' +
          '<h2>Agendas y calendario</h2>' +
          '<ul>' +
            '<li><b>Cada profesional tiene su agenda</b>: días, horarios, duración del turno, en qué centro, para qué servicios.</li>' +
            '<li><b>Las excepciones son de primera clase</b>: un feriado, una capacitación, una tarde que se atiende en otro lado. El sitio deja de ofrecer esos horarios apenas se cargan.</li>' +
            '<li><b>El calendario refleja el real.</b> Lo que ve la ventanilla y lo que puede tomar el paciente son el mismo dato, no dos sistemas sincronizados a mano.</li>' +
            '<li><b>Un profesional que se va se deshabilita, nunca se elimina</b>, si tiene turnos: la historia tiene que quedar legible.</li>' +
          '</ul>' +
          '<h2>Quién ve qué</h2>' +
          '<p>Cinco roles, y un endpoint nuevo queda cerrado para todos hasta que se abre a propósito:</p>' +
          '<ul>' +
            '<li><b>Administración</b>: todo, incluidos usuarios, servicios y configuración.</li>' +
            '<li><b>Admisión</b>: la cola, los pacientes de hoy, sacar turno en nombre de alguien.</li>' +
            '<li><b>Médico</b>: su propia agenda y sus propios pacientes, con la entrevista previa y el resumen de la historia.</li>' +
            '<li><b>Reportes</b>: los números, y nada identificatorio más allá de lo que un reporte necesita.</li>' +
            '<li><b>Comunicación</b>: los textos públicos, las novedades y lo que dice el sitio.</li>' +
          '</ul>' +
          '<p>Se entra con contraseña y, si se quiere, un segundo factor o una passkey. La sesión es la única fuente de identidad en todo el producto.</p>' +
          '<h2>Reportes</h2>' +
          '<p>Cada reporte contesta una pregunta y dice la respuesta en una oración antes de dibujar nada: cuánto de la capacidad ofrecida se usó de verdad, quién no vino y en qué servicios, y cuánta atención dada a pacientes con cobertura nunca se le facturó a la obra social. Ese último suele pagar la instalación.</p>' +
          '<h2>Configuración y estado del sistema</h2>' +
          '<p>Idiomas, ubicación, los textos del sitio, las instrucciones de la IA y las claves se editan desde el panel, sin volver a desplegar. Las claves se muestran como presentes o ausentes, nunca se imprimen. Una pantalla de estado dice qué integraciones están contestando ahora mismo —la historia clínica, el padrón de cobertura, WhatsApp, el mail, el proveedor de IA— así «no anda» tiene una dirección antes de que alguien abra una terminal.</p>'
      },

      install: {
        title: 'Instalación',
        lead: 'Un contenedor y una base Postgres. Sin cola, sin caché, sin flota de workers. El primer arranque abre un asistente que escribe el paquete de datos de la instalación.',
        body:
          '<h2>Qué hace falta</h2>' +
          '<ul>' +
            '<li><b>Docker</b> con el plugin compose, o Python 3.12 y Postgres 14 o más nuevo en la máquina.</li>' +
            '<li>Un dominio y un proxy inverso para el TLS, si el sitio va a ser público. La aplicación habla HTTP común en un puerto.</li>' +
            '<li>Una <b>clave de IA</b>, sólo para las funciones que leen papeles, entrevistan pacientes o resumen una historia. Todo lo demás anda sin eso.</li>' +
          '</ul>' +
          '<h2>Levantarlo</h2>' +
          '<pre><code>git clone https://github.com/visualpharm/human-rounds\ncd human-rounds\ndocker compose up -d</code></pre>' +
          '<p>Abrís el sitio y toma el control el <b>asistente de instalación</b>: pregunta el nombre de la instalación, la zona horaria, los idiomas y el primer centro, y recién escribe en la base en el último paso, así un setup abandonado no deja nada.</p>' +
          '<h2>Qué cuesta tenerlo prendido</h2>' +
          '<p>Alcanza con una máquina virtual chica. Toda la aplicación es <b>un solo proceso</b> que atiende cada pedido en su propio hilo, más Postgres al lado: dos vCPU y 2 GB de memoria sostienen una red pública de un partido —un hospital y varios centros de salud— y la carga que importa se mide en pedidos por minuto, no por segundo. No hay Redis, ni broker de mensajes, ni servicio en Node, ni un worker aparte para desplegar.</p>' +
          '<p>Hacen falta dos paquetes del sistema además de Python: <code>poppler-utils</code>, para convertir en imagen una orden que llega en PDF antes de que la lea la IA, y <code>ffmpeg</code>. Tres paquetes de Python, todos con versión fija. Nada más se compila.</p>' +
          '<p>Lo único que crece en disco es lo que suben los pacientes: fotos y PDF de órdenes. Poné ese directorio en un volumen que realmente respaldes: la base se restaura de un dump, una orden subida no.</p>' +
          '<h2>Qué corre de fondo</h2>' +
          '<p>Dentro de ese mismo proceso, unos cuantos loops chicos hacen lo que nadie dispara: mandar los recordatorios del día antes, re-ofrecer un turno liberado a la lista de espera, reintentar los turnos que rechazó la historia clínica, preparar los resúmenes de historia antes del consultorio, sacar backups fuera de la máquina y mirar si el proveedor de IA está contestando. Cada uno se apaga con una opción, y si uno falla degrada sólo lo suyo.</p>' +
          '<h2>Tus servicios y centros son un paquete de datos</h2>' +
          '<p>Todo lo propio de un pueblo —centros, servicios, profesionales, especialidades, preparaciones, los textos del sitio— vive en un <b>paquete de datos</b> apilado sobre uno de país y uno global. Sólo escribís lo que difiere de la capa de abajo. Actualizar el software no lo toca, y una segunda instalación es un segundo paquete, no un fork.</p>' +
          '<h2>Actualizar</h2>' +
          '<p>Traés los cambios y volvés a desplegar. La base se migra sola al arrancar, sólo hacia adelante, y se niega a correr dos veces la misma migración. Tu paquete de datos, tu configuración y lo subido viven afuera de la imagen y sobreviven intactos. Igual sacá el dump antes.</p>' +
          '<h2>Módulos</h2>' +
          '<p>Los turnos son un módulo. La entrevista previa es otro. Un módulo se puede apagar en una instalación que no lo quiere, y uno nuevo se enchufa al mismo núcleo: el núcleo es dueño de la cuenta, la sesión, los roles y el paquete de datos, y el módulo es dueño de sus rutas y sus pantallas.</p>' +
          '<h2>La configuración y dónde vive</h2>' +
          '<p>Sólo la conexión a la base tiene que ser una variable de entorno. Todo lo que la institución cambia después —idiomas, ubicación, claves, los textos, las instrucciones de la IA— se edita desde el panel y tiene efecto sin volver a desplegar. Los secretos se escriben, no se leen: el panel dice si una clave está o no está, y nada más.</p>'
      },

      connectors: {
        title: 'Conectores',
        lead: 'Identidad, cobertura, historia clínica y mensajería son distintos en cada país. Cada uno vive detrás de una interfaz chica, así sumar un país es un pull request y no un fork; y andar sin ninguno igual te deja un sistema de turnos funcionando.',
        body:
          '<h2>Las siete cosas que puede ser un conector</h2>' +
          '<ul>' +
            '<li><b>Identidad</b>: verificar a una persona contra el sistema nacional de identidad.</li>' +
            '<li><b>Cobertura</b>: a qué obra social o sistema público pertenece el paciente.</li>' +
            '<li><b>La historia clínica</b>: escribir los turnos en el sistema de registro de la institución.</li>' +
            '<li><b>Antecedentes</b>: leer lo que ya existe de ese paciente, incluidos archivos anteriores al sistema actual.</li>' +
            '<li><b>Registros profesionales</b>: confirmar que una matrícula existe y está activa.</li>' +
            '<li><b>Mensajería</b>: el canal que la gente de ese país realmente contesta.</li>' +
            '<li><b>Disponibilidad externa</b>: turnos que viven en el sistema de otro.</li>' +
          '</ul>' +
          '<p>Argentina viene con los siete cableados. Abajo están los cuatro que una institución suele prender primero, y exactamente qué tiene que conseguir para hacerlo.</p>' +
          '<h2>Identidad</h2>' +
          '<p>Deja que el paciente entre como él mismo, verificado contra el proveedor nacional de identidad, en vez de una contraseña que después hay que resetear por teléfono.</p>' +
          '<p><b>Qué necesita la institución:</b> estar registrada ante el proveedor nacional de identidad, que en Argentina es el trámite del municipio con el registro, no nuestro. Ese registro devuelve un identificador de cliente y un secreto, y toma la dirección de retorno de tu instalación. Tres valores en el panel de configuración y aparece el botón de ingreso.</p>' +
          '<p><b>Mientras no lo tenés:</b> un modo de prueba corre todo el flujo de ingreso contra identidades sintéticas, sin salir a la red, así las pantallas se revisan y se muestran mientras el papeleo avanza. <b>Sin esto:</b> queda el ingreso con contraseña. El producto no deja que una instalación se quede sin ninguna forma de entrar.</p>' +
          '<h2>Cobertura</h2>' +
          '<p>Contesta «en qué obra social está hoy esta persona» desde el padrón nacional, al registrarse y otra vez al momento del turno. Es lo que hace posible el recupero, porque el paciente que dice no tener cobertura muchas veces la tiene.</p>' +
          '<p><b>Qué necesita la institución:</b> nada, para empezar. Hay una consulta pública que no pide credenciales y viene prendida. Una cuenta de servicio en el padrón del ministerio da más límite y una interfaz documentada, y conviene pedirla cuando el volumen lo justifica.</p>' +
          '<p><b>Sin esto:</b> el paciente tipea su obra social y su número de afiliado a mano, como hace hoy en cualquier ventanilla.</p>' +
          '<h2>La historia clínica</h2>' +
          '<p>Empuja cada turno aprobado al sistema de registro clínico de la institución, para que la consulta exista donde el médico trabaja de verdad y no sólo en Human Rounds.</p>' +
          '<p><b>Qué necesita la institución:</b> la dirección de su instancia, un usuario de servicio con su contraseña creado ahí adentro, y el identificador propio de la institución en ese sistema. Los profesionales y las especialidades que ofrecés tienen que existir también de aquel lado: ese mapeo es el trabajo real, y se hace una sola vez.</p>' +
          '<p><b>Sin esto, o cuando se cae:</b> aprobar igual da el turno e igual le avisa al paciente. La escritura queda encolada y se reintenta sola cada pocos minutos, y a un sistema que está rechazando no se lo martilla. Nada de lo que hace un paciente o una recepcionista se traba porque la historia clínica no esté. También se puede apagar a propósito, que es lo que hace el primer día una institución que está evaluando el producto.</p>' +
          '<h2>WhatsApp</h2>' +
          '<p>En buena parte del mundo es el único canal que el paciente lee de verdad. Lleva el código de verificación al crear la cuenta, el recordatorio del día antes y la propia conversación para sacar turno.</p>' +
          '<p><b>Dos maneras de conectarlo.</b> Una <b>pasarela propia</b> es un segundo contenedor, un número de teléfono y un QR escaneado una vez para vincularlo: sin verificación de empresa, sin plantillas de mensaje, y es el camino que funciona la primera tarde. La <b>API oficial de Meta</b> pide una cuenta de empresa, un número verificado y un token de acceso; es más papeleo, lleva conversaciones y no códigos de verificación, y es la opción duradera a escala.</p>' +
          '<p><b>Qué necesita la institución en cualquiera de los dos casos:</b> un número de teléfono que sea de la institución y no de una persona, y una dirección de webhook en tu instalación para las respuestas que entran. Esa dirección queda cerrada —no devuelve absolutamente nada— hasta que se configura un secreto compartido, así una instalación a medio hacer nunca deja un endpoint abierto.</p>' +
          '<p><b>Sin esto:</b> todo cae al mail. Códigos, confirmaciones y recordatorios salen igual, sólo que por un canal que abren menos pacientes.</p>' +
          '<h2>Lo demás</h2>' +
          '<p>El registro de matrículas, los archivos de historia clínica y la disponibilidad de terceros siguen la misma forma: configurados suman una capacidad; sin configurar, la pantalla que los usaba simplemente no ofrece esa ayuda. El <b>mail</b> no es un conector pero se comporta como uno: un dominio y una clave, y sin eso el sitio nunca se traba, solamente no manda.</p>' +
          '<h2>Degradar es parte del contrato</h2>' +
          '<p>Una capacidad sin conector tiene que dejar el producto usable, y cada conector viene con el test que lo demuestra. Sin padrón, el campo se tipea a mano. Sin sistema de registro, los turnos viven sólo acá. Un país sin ninguno de estos conectores igual tiene un sistema de turnos andando desde el primer día, y suma el resto a medida que llegan los acuerdos.</p>'
      },

      'writing-connector': {
        title: 'Escribir un conector',
        lead: 'Un conector es una carpeta con un manifiesto y una clase. Si el registro de tu país contesta una llamada HTTP, esto es una tarde de trabajo, no un fork del proyecto.',
        body:
          '<h2>La forma</h2>' +
          '<p>Un conector es un directorio dentro de <code>connectors/</code> con tres cosas: un manifiesto que declara qué es, una implementación que habla con el mundo exterior y un adaptador finito que implementa la interfaz de la capacidad. Nada más en el código necesita enterarse de que tu país existe.</p>' +
          '<pre><code>connectors/aadhaar/\n  connector.json   id, país, capacidad, claves de configuración\n  aadhaar.py       el cliente HTTP\n  adapter.py       implementa IdentityVerificationConnector</code></pre>' +
          '<p>El manifiesto declara una capacidad de las siete, un código de país de dos letras y todas las claves de configuración que el conector lee. Esa última lista es lo que usan el panel y la línea de comandos para decir si el conector está configurado o no: los nombres de las claves se muestran, los valores nunca.</p>' +
          '<h2>Seis reglas</h2>' +
          '<ul>' +
            '<li><b>Leé primero la interfaz de la capacidad: es la especificación.</b> Cada una son unos pocos métodos con un comentario que dice qué tienen que significar «sin configurar», «no encontrado» y «proveedor caído». Implementá eso y nada más ancho.</li>' +
            '<li><b>Fallá con los errores compartidos.</b> Levantá el «no encontrado» y el «proveedor caído» del framework, no un tipo de excepción nuevo tuyo. Todos los que llaman ya manejan esos dos, y eso es lo que hace que tu país funcione sin tocar el código de nadie.</li>' +
            '<li><b>Traé un modo de prueba.</b> Un conector que sólo se puede ejercitar contra un endpoint estatal en vivo no se puede testear, ni mostrar, ni revisar. Una bandera, respuestas deterministas, cero red. Todos los conectores del repositorio tienen uno.</li>' +
            '<li><b>Degradá, no revientes.</b> Sin configurar tiene que dejar el producto usable, y el pull request tiene que traer el test que lo demuestra. Es la regla que el revisor va a mirar más fuerte.</li>' +
            '<li><b>Nunca imprimas un secreto.</b> Ni en un log, ni en un mensaje de error, ni en la pantalla de estado. Que esté o no esté es toda la superficie reportable.</li>' +
            '<li><b>Una capacidad por conector.</b> Un registro que contesta identidad y cobertura son dos conectores compartiendo un cliente, no un conector con una bandera.</li>' +
          '</ul>' +
          '<h2>Qué tiene que traer un pull request</h2>' +
          '<ul>' +
            '<li>El manifiesto, con el identificador igual al nombre del directorio y una capacidad que exista.</li>' +
            '<li>El adaptador, delegando en la implementación en vez de contenerla.</li>' +
            '<li>Tres tests: que el conector se descubre, que el caso sin configurar degrada como está documentado y que el modo de prueba contesta.</li>' +
            '<li>Una fila en la documentación de conectores, honesta sobre qué es real y qué es un stub.</li>' +
          '</ul>' +
          '<h2>Sé honesto con el cableado</h2>' +
          '<p>El registro descubre conectores, los habilita y guarda su configuración. Lo que todavía no hace en todos lados es despachar: varios puntos del stack argentino siguen importando su conector directo, porque ese código es anterior a la interfaz. Un país nuevo que quiera hoy su proveedor de identidad en la pantalla de ingreso necesita además unas líneas de pegamento en el punto de llamada, siguiendo cómo lo hace Argentina.</p>' +
          '<p>Está dicho acá y no se descubre después. Reemplazar esos imports directos por una búsqueda en el registro es la próxima tanda de trabajo, y un pull request que lo haga para la capacidad que te importa es bienvenido.</p>'
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
