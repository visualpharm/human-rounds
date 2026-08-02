/*
 * constellation.js — the "your health network, connected" hero diagram on
 * humanrounds.org. Hand-rolled DOM + rAF engine, no dependencies. Renders a
 * compact 3D sphere of nodes (institutions on the equator, capabilities on
 * two mid bands, outcome quotes at the poles), billboarded as flat 2D chips
 * (no CSS preserve-3d — keeps text readable). Drag/hover rotate it; the far
 * side fogs out via 4 discrete opacity/blur tiers. A single wandering dot
 * travels the sphere and nudges whatever it lands on.
 *
 * Everything below COUNTRIES/CAPABILITIES/OUTCOMES is pure data — adding a
 * 15th country, a 19th capability or another outcome dot never touches the
 * render engine underneath. Institutions missing a role for a given country
 * render a quiet grayscale "connector planned" placeholder instead of
 * disappearing, so the ring shape never jumps between countries.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------- bilingual strings
  var STR = {
    en: {
      plannedNote: 'planned',
      partialNote: 'in progress',
      switcherLabel: 'Country',
      capabilitiesAria: 'Capabilities Human Rounds runs',
      institutionsAria: 'Institutions in the connector ring'
    },
    es: {
      plannedNote: 'planeado',
      partialNote: 'en desarrollo',
      switcherLabel: 'País',
      capabilitiesAria: 'Capacidades que corre Human Rounds',
      institutionsAria: 'Instituciones del anillo de conectores'
    }
  };

  function lang() { return document.documentElement.lang === 'es' ? 'es' : 'en'; }
  function t(key) { return STR[lang()][key]; }
  function pick(pair) { return pair[lang()] || pair.en; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // ---------------------------------------------------------------- role registry
  // Every country's institution ring fills a subset of these 7 fixed roles. A role a
  // country doesn't fill yet still gets a ring position — it renders as a grayscale
  // placeholder chip, so switching countries never reshuffles the ring shape.
  var ROLES = [
    { key: 'identity', en: 'Identity', es: 'Identidad' },
    { key: 'coverage', en: 'Coverage', es: 'Cobertura' },
    { key: 'licenses', en: 'Licenses', es: 'Matrículas' },
    { key: 'emr', en: 'EMR / interop', es: 'HC / interop' },
    { key: 'messaging', en: 'Messaging', es: 'Mensajería' },
    { key: 'provincial', en: 'Regional slots', es: 'Turno regional' },
    { key: 'billing', en: 'Billing', es: 'Facturación' }
  ];

  // logo id -> filename actually sitting in /web/constellation-logos/. Anything not
  // listed here (or not passed as `logo` at all) renders as its NAME alone — never
  // an initials monogram and never a broken image. A made-up mark is worse than no
  // mark: it looks like the institution's real logo and carries no information.
  var LOGO_FILES = {
    whatsapp: 'whatsapp.svg',
    nhs: 'nhs.svg',
    gmc: 'gmc.svg',
    hl7fhir: 'hl7fhir.png',
    aadhaar: 'aadhaar.svg',
    ayushmanbharat: 'ayushmanbharat.png',
    nmc: 'nmc.png',
    abdm: 'abdm.png',
    govbr: 'govbr.svg',
    sus: 'sus.svg',
    cfm: 'cfm.png',
    renaper: 'renaper.png',
    sumar: 'sumar.png',
    hsi: 'hsi.png',
    rnds: 'rnds.png'
  };

  // ---------------------------------------------------------------- country data
  // status: "live" | "partial" | "planned" — the same bright/toned-down/grayscale
  // grammar as the capability chips. AR statuses come from the docs/website-
  // constellation.md prototype-inventory table. Non-AR institutions default to
  // "planned" except WhatsApp (live everywhere) and literal HL7-FHIR-standard
  // entries (partial) — per the explicit build instruction.
  var COUNTRIES = {
    AR: {
      name: { en: 'Argentina', es: 'Argentina' },
      flag: '🇦🇷',
      institutions: {
        identity: { name: { en: 'RENAPER / Mi Argentina', es: 'RENAPER / Mi Argentina' }, status: 'partial', logo: 'renaper' },
        coverage: { name: { en: 'Insurance registry', es: 'PUCO · SISA' }, status: 'live', logo: 'puco' },
        licenses: { name: { en: 'REFEPS', es: 'REFEPS' }, status: 'live', logo: 'refeps' },
        emr: { name: { en: 'Public health record system', es: 'HSI' }, status: 'live', logo: 'hsi' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp' },
        provincial: { name: { en: 'Mi Salud Digital', es: 'Mi Salud Digital' }, status: 'partial', logo: 'saluddigital' },
        billing: { name: { en: 'SUMAR+', es: 'SUMAR+' }, status: 'live', logo: 'sumar' }
      }
    }
  };

  // The other 22 countries — researched separately (identity/coverage/licenses/
  // emr/messaging per country, `short: null` where that country genuinely has no
  // national institution for the slot). Pure data: growing this list, or widening
  // it to a 23rd country, never touches the render engine below.
  var COUNTRIES_EXPANDED = {
    BO: {
      name: { en: 'Bolivia', es: 'Bolivia' },
      flag: '🇧🇴',
      institutions: {
        identity: { name: { en: 'SEGIP', es: 'SEGIP' }, status: 'planned', title: 'Servicio General de Identificación Personal' },
        coverage: { name: { en: 'SUS Bolivia', es: 'SUS Bolivia' }, status: 'planned', title: 'Seguro Universal de Salud (Ministerio de Salud y Deportes)' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    BR: {
      name: { en: 'Brazil', es: 'Brasil' },
      flag: '🇧🇷',
      institutions: {
        identity: { name: { en: 'gov.br', es: 'gov.br' }, status: 'planned', logo: 'govbr', title: 'gov.br unified digital identity (Secretaria de Governo Digital)' },
        coverage: { name: { en: 'Meu SUS Digital', es: 'Meu SUS Digital' }, status: 'planned', logo: 'sus', title: 'SUS / Cartão Nacional de Saúde via Meu SUS Digital (Ministério da Saúde)' },
        licenses: { name: { en: 'CFM/CRM', es: 'CFM/CRM' }, status: 'planned', logo: 'cfm', title: 'Conselho Federal de Medicina / Conselho Regional de Medicina — public doctor lookup' },
        emr: { name: { en: 'RNDS', es: 'RNDS' }, status: 'planned', logo: 'rnds', title: 'Rede Nacional de Dados em Saúde (Ministério da Saúde / DATASUS)' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    CA: {
      name: { en: 'Canada', es: 'Canadá' },
      flag: '🇨🇦',
      institutions: {
        emr: { name: { en: 'Canada Health Infoway', es: 'Canada Health Infoway' }, status: 'planned', title: 'Canada Health Infoway (federal interoperability coordinating body)' },
        messaging: { name: { en: 'SMS', es: 'SMS' }, status: 'live', title: 'SMS' }
      }
    },
    CL: {
      name: { en: 'Chile', es: 'Chile' },
      flag: '🇨🇱',
      institutions: {
        identity: { name: { en: 'ClaveÚnica', es: 'ClaveÚnica' }, status: 'planned', title: 'Servicio de Registro Civil e Identificación (SRCEI) — ClaveÚnica digital identity' },
        coverage: { name: { en: 'FONASA', es: 'FONASA' }, status: 'planned', title: 'Fondo Nacional de Salud' },
        licenses: { name: { en: 'RNPI', es: 'RNPI' }, status: 'planned', title: 'Registro Nacional de Prestadores Individuales de Salud (Superintendencia de Salud)' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    CO: {
      name: { en: 'Colombia', es: 'Colombia' },
      flag: '🇨🇴',
      institutions: {
        identity: { name: { en: 'Registraduría', es: 'Registraduría' }, status: 'planned', title: 'Registraduría Nacional del Estado Civil' },
        coverage: { name: { en: 'ADRES', es: 'ADRES' }, status: 'planned', title: 'Administradora de los Recursos del Sistema General de Seguridad Social en Salud' },
        licenses: { name: { en: 'ReTHUS', es: 'ReTHUS' }, status: 'planned', title: 'Registro Único Nacional del Talento Humano en Salud (MinSalud)' },
        emr: { name: { en: 'SISPRO', es: 'SISPRO' }, status: 'planned', title: 'Sistema Integral de Información de la Protección Social (MinSalud) / PISIS' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    DE: {
      name: { en: 'Germany', es: 'Alemania' },
      flag: '🇩🇪',
      institutions: {
        identity: { name: { en: 'BundID', es: 'BundID' }, status: 'planned', title: 'Personalausweis (eID) / BundID' },
        coverage: { name: { en: 'eGK / GKV', es: 'eGK / GKV' }, status: 'planned', title: 'elektronische Gesundheitskarte / gesetzliche Krankenversicherung' },
        emr: { name: { en: 'ePA', es: 'ePA' }, status: 'planned', title: 'elektronische Patientenakte (gematik)' },
        messaging: { name: { en: 'SMS', es: 'SMS' }, status: 'live', title: 'SMS' }
      }
    },
    EC: {
      name: { en: 'Ecuador', es: 'Ecuador' },
      flag: '🇪🇨',
      institutions: {
        identity: { name: { en: 'Registro Civil', es: 'Registro Civil' }, status: 'planned', title: 'Registro Civil del Ecuador (cédula)' },
        coverage: { name: { en: 'IESS', es: 'IESS' }, status: 'planned', title: 'Instituto Ecuatoriano de Seguridad Social' },
        licenses: { name: { en: 'SENESCYT', es: 'SENESCYT' }, status: 'planned', title: 'SENESCYT — registro de títulos profesionales' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    ES: {
      name: { en: 'Spain', es: 'España' },
      flag: '🇪🇸',
      institutions: {
        identity: { name: { en: 'Cl@ve', es: 'Cl@ve' }, status: 'planned', title: 'Cl@ve (Ministerio de Presidencia) / DNI electrónico' },
        coverage: { name: { en: 'TSI', es: 'TSI' }, status: 'planned', title: 'Tarjeta Sanitaria Individual (Sistema Nacional de Salud)' },
        licenses: { name: { en: 'REPS', es: 'REPS' }, status: 'planned', title: 'Registro Estatal de Profesionales Sanitarios (Ministerio de Sanidad)' },
        emr: { name: { en: 'HCDSNS', es: 'HCDSNS' }, status: 'planned', title: 'Historia Clínica Digital del Sistema Nacional de Salud' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    FR: {
      name: { en: 'France', es: 'Francia' },
      flag: '🇫🇷',
      institutions: {
        identity: { name: { en: 'France Identité', es: 'France Identité' }, status: 'planned', title: 'France Identité (ANTS) / FranceConnect' },
        coverage: { name: { en: 'Carte Vitale', es: 'Carte Vitale' }, status: 'planned', title: 'Carte Vitale / Assurance Maladie (CNAM)' },
        licenses: { name: { en: 'RPPS', es: 'RPPS' }, status: 'planned', title: 'Répertoire Partagé des Professionnels de Santé — Annuaire Santé (ANS)' },
        emr: { name: { en: 'Mon espace santé', es: 'Mon espace santé' }, status: 'planned', title: 'Mon espace santé (successor to Dossier Médical Partagé)' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    GB: {
      name: { en: 'United Kingdom', es: 'Reino Unido' },
      flag: '🇬🇧',
      institutions: {
        identity: { name: { en: 'NHS Number', es: 'NHS Number' }, status: 'planned', logo: 'nhs', title: 'NHS Number; GOV.UK One Login is the general digital-identity layer' },
        coverage: { name: { en: 'NHS', es: 'NHS' }, status: 'planned', logo: 'nhs', title: 'National Health Service (NHS Number)' },
        licenses: { name: { en: 'GMC', es: 'GMC' }, status: 'planned', logo: 'gmc', title: 'General Medical Council — List of Registered Medical Practitioners' },
        emr: { name: { en: 'NHS Spine', es: 'NHS Spine' }, status: 'planned', logo: 'nhs', title: 'NHS Spine / NHS App (Personal Demographics Service, NHS England)' },
        messaging: { name: { en: 'SMS', es: 'SMS' }, status: 'live', title: 'SMS' }
      }
    },
    ID: {
      name: { en: 'Indonesia', es: 'Indonesia' },
      flag: '🇮🇩',
      institutions: {
        identity: { name: { en: 'NIK', es: 'NIK' }, status: 'planned', title: 'Nomor Induk Kependudukan (Dukcapil)' },
        coverage: { name: { en: 'BPJS Kesehatan', es: 'BPJS Kesehatan' }, status: 'planned', title: 'Badan Penyelenggara Jaminan Sosial Kesehatan' },
        licenses: { name: { en: 'STR / KKI', es: 'STR / KKI' }, status: 'planned', title: 'Surat Tanda Registrasi issued by Konsil Kedokteran Indonesia' },
        emr: { name: { en: 'SATUSEHAT', es: 'SATUSEHAT' }, status: 'planned', title: 'SATUSEHAT platform (Kementerian Kesehatan)' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    IN: {
      name: { en: 'India', es: 'India' },
      flag: '🇮🇳',
      institutions: {
        identity: { name: { en: 'Aadhaar', es: 'Aadhaar' }, status: 'planned', logo: 'aadhaar', title: 'Aadhaar (UIDAI)' },
        coverage: { name: { en: 'PM-JAY', es: 'PM-JAY' }, status: 'planned', logo: 'ayushmanbharat', title: 'Ayushman Bharat PM-JAY (National Health Authority)' },
        licenses: { name: { en: 'NMC', es: 'NMC' }, status: 'planned', logo: 'nmc', title: 'National Medical Commission — Indian Medical Register' },
        emr: { name: { en: 'ABDM', es: 'ABDM' }, status: 'planned', logo: 'abdm', title: 'Ayushman Bharat Digital Mission (NHA); ABHA is the individual health ID' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    IT: {
      name: { en: 'Italy', es: 'Italia' },
      flag: '🇮🇹',
      institutions: {
        identity: { name: { en: 'SPID / CIE', es: 'SPID / CIE' }, status: 'planned', title: 'Sistema Pubblico di Identità Digitale / Carta d\'Identità Elettronica' },
        coverage: { name: { en: 'Tessera Sanitaria', es: 'Tessera Sanitaria' }, status: 'planned', title: 'Tessera Sanitaria (Servizio Sanitario Nazionale)' },
        licenses: { name: { en: 'FNOMCeO', es: 'FNOMCeO' }, status: 'planned', title: 'Federazione Nazionale degli Ordini dei Medici — Albo Unico lookup' },
        emr: { name: { en: 'FSE', es: 'FSE' }, status: 'planned', title: 'Fascicolo Sanitario Elettronico' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    KE: {
      name: { en: 'Kenya', es: 'Kenia' },
      flag: '🇰🇪',
      institutions: {
        identity: { name: { en: 'Huduma Namba', es: 'Huduma Namba' }, status: 'planned', title: 'National Integrated Identity Management System / Huduma Namba' },
        coverage: { name: { en: 'SHA', es: 'SHA' }, status: 'planned', title: 'Social Health Authority (replacing NHIF)' },
        licenses: { name: { en: 'KMPDC', es: 'KMPDC' }, status: 'planned', title: 'Kenya Medical Practitioners and Dentists Council' },
        emr: { name: { en: 'KHIS', es: 'KHIS' }, status: 'planned', title: 'Kenya Health Information System (DHIS2-based)' },
        messaging: { name: { en: 'SMS', es: 'SMS' }, status: 'live', title: 'SMS' }
      }
    },
    MX: {
      name: { en: 'Mexico', es: 'México' },
      flag: '🇲🇽',
      institutions: {
        identity: { name: { en: 'CURP', es: 'CURP' }, status: 'planned', title: 'Clave Única de Registro de Población (RENAPO)' },
        coverage: { name: { en: 'IMSS-Bienestar', es: 'IMSS-Bienestar' }, status: 'planned', title: 'IMSS-Bienestar (informal/uninsured); IMSS and ISSSTE cover the formal sector' },
        licenses: { name: { en: 'Cédula Profesional', es: 'Cédula Profesional' }, status: 'planned', title: 'Dirección General de Profesiones (SEP)' },
        emr: { name: { en: 'CENETEC', es: 'CENETEC' }, status: 'planned', title: 'Centro Nacional de Excelencia Tecnológica en Salud — Expediente Clínico Electrónico standards' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    NG: {
      name: { en: 'Nigeria', es: 'Nigeria' },
      flag: '🇳🇬',
      institutions: {
        identity: { name: { en: 'NIN', es: 'NIN' }, status: 'planned', title: 'National Identification Number (NIMC)' },
        coverage: { name: { en: 'NHIA', es: 'NHIA' }, status: 'planned', title: 'National Health Insurance Authority (formerly NHIS)' },
        licenses: { name: { en: 'MDCN', es: 'MDCN' }, status: 'planned', title: 'Medical and Dental Council of Nigeria' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    PE: {
      name: { en: 'Peru', es: 'Perú' },
      flag: '🇵🇪',
      institutions: {
        identity: { name: { en: 'RENIEC', es: 'RENIEC' }, status: 'planned', title: 'Registro Nacional de Identificación y Estado Civil' },
        coverage: { name: { en: 'SIS', es: 'SIS' }, status: 'planned', title: 'Seguro Integral de Salud' },
        licenses: { name: { en: 'Colegio Médico', es: 'Colegio Médico' }, status: 'planned', title: 'Colegio Médico del Perú (national physician registry); SUSALUD complements' },
        emr: { name: { en: 'RENHICE', es: 'RENHICE' }, status: 'planned', title: 'Registro Nacional de Historias Clínicas Electrónicas (Ministerio de Salud)' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    PH: {
      name: { en: 'Philippines', es: 'Filipinas' },
      flag: '🇵🇭',
      institutions: {
        identity: { name: { en: 'PhilSys', es: 'PhilSys' }, status: 'planned', title: 'Philippine Identification System (PSA)' },
        coverage: { name: { en: 'PhilHealth', es: 'PhilHealth' }, status: 'planned', title: 'Philippine Health Insurance Corporation' },
        licenses: { name: { en: 'PRC', es: 'PRC' }, status: 'planned', title: 'Professional Regulation Commission — online license verification' },
        emr: { name: { en: 'PHIE', es: 'PHIE' }, status: 'planned', title: 'Philippine Health Information Exchange (DOH)' },
        messaging: { name: { en: 'SMS', es: 'SMS' }, status: 'live', title: 'SMS' }
      }
    },
    PT: {
      name: { en: 'Portugal', es: 'Portugal' },
      flag: '🇵🇹',
      institutions: {
        identity: { name: { en: 'Cartão de Cidadão', es: 'Cartão de Cidadão' }, status: 'planned', title: 'Cartão de Cidadão / Chave Móvel Digital' },
        coverage: { name: { en: 'SNS', es: 'SNS' }, status: 'planned', title: 'Serviço Nacional de Saúde — Número de Utente' },
        licenses: { name: { en: 'Ordem dos Médicos', es: 'Ordem dos Médicos' }, status: 'planned', title: 'Ordem dos Médicos' },
        emr: { name: { en: 'RSE', es: 'RSE' }, status: 'planned', title: 'Registo de Saúde Eletrónico (SPMS)' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    PY: {
      name: { en: 'Paraguay', es: 'Paraguay' },
      flag: '🇵🇾',
      institutions: {
        identity: { name: { en: 'Registro Civil', es: 'Registro Civil' }, status: 'planned', title: 'Dirección General del Registro del Estado Civil' },
        coverage: { name: { en: 'IPS', es: 'IPS' }, status: 'planned', title: 'Instituto de Previsión Social' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    },
    US: {
      name: { en: 'United States', es: 'Estados Unidos' },
      flag: '🇺🇸',
      institutions: {
        identity: { name: { en: 'SSA (SSN)', es: 'SSA (SSN)' }, status: 'planned', title: 'Social Security Administration — Social Security Number' },
        coverage: { name: { en: 'CMS', es: 'CMS' }, status: 'planned', title: 'Centers for Medicare & Medicaid Services (Medicare/Medicaid)' },
        emr: { name: { en: 'ONC / TEFCA', es: 'ONC / TEFCA' }, status: 'planned', title: 'Office of the National Coordinator for Health IT — TEFCA' },
        messaging: { name: { en: 'SMS', es: 'SMS' }, status: 'live', title: 'SMS' }
      }
    },
    UY: {
      name: { en: 'Uruguay', es: 'Uruguay' },
      flag: '🇺🇾',
      institutions: {
        identity: { name: { en: 'DNIC', es: 'DNIC' }, status: 'planned', title: 'Dirección Nacional de Identificación Civil (cédula de identidad)' },
        coverage: { name: { en: 'FONASA/JUNASA', es: 'FONASA/JUNASA' }, status: 'planned', title: 'Fondo Nacional de Salud (BPS), overseen por Junta Nacional de Salud (JUNASA) / MSP' },
        emr: { name: { en: 'HCEN', es: 'HCEN' }, status: 'planned', title: 'Historia Clínica Electrónica Nacional (Agesic / Salud.uy)' },
        messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp', title: 'WhatsApp' }
      }
    }
  };
  Object.keys(COUNTRIES_EXPANDED).forEach(function (code) { COUNTRIES[code] = COUNTRIES_EXPANDED[code]; });
  // NHS Spine's real interoperability layer runs on HL7-FHIR-based APIs — a live
  // global standard, not merely "planned" — so this one role keeps the more
  // specific hand-researched status/logo instead of the generic import above.
  COUNTRIES.GB.institutions.emr.status = 'partial';
  COUNTRIES.GB.institutions.emr.name = { en: 'NHS Spine · HL7 FHIR', es: 'NHS Spine · HL7 FHIR' };
  COUNTRIES.GB.institutions.emr.logo = 'hl7fhir';

  // Not a selectable country — the fallback for a visitor whose country isn't in
  // COUNTRIES yet. WhatsApp stays live everywhere (per the build brief: "everything
  // in non-AR countries is planned except WhatsApp"), so even the generic globe
  // state shows one real, working connector instead of an all-gray ring.
  var GENERIC_CODE = '__generic__';
  var GENERIC_COUNTRY = {
    name: { en: 'Other country', es: 'Otro país' },
    flag: '🌍',
    institutions: {
      messaging: { name: { en: 'WhatsApp', es: 'WhatsApp' }, status: 'live', logo: 'whatsapp' }
    }
  };

  // ---------------------------------------------------------------- capability chips
  // status: live (bright, per the 2026-07-30 capability inventory) · partial (lit,
  // don't over-promise) · planned ("próximamente", zero code yet).
  var CAPABILITIES = [
    { id: 'booking', name: { en: 'Book online', es: 'Turnos online' }, status: 'live', icon: 'calendar', connects: { institutions: ['emr', 'messaging'], outcomes: ['p1', 'p2'] } },
    { id: 'aiOrder', name: { en: 'AI reads order', es: 'Órdenes con IA' }, status: 'live', icon: 'soap-note', connects: { institutions: ['emr'], outcomes: ['p3'] } },
    { id: 'directory', name: { en: 'Directory', es: 'Directorio' }, status: 'live', connects: {} },
    { id: 'queue', name: { en: 'Approvals', es: 'Aprobaciones' }, status: 'live', icon: 'checklist', connects: { institutions: ['emr'] } },
    { id: 'reminders', name: { en: 'Reminders', es: 'Recordatorios' }, status: 'live', icon: 'bell', connects: { institutions: ['messaging'] } },
    { id: 'waitlist', name: { en: 'Waitlist', es: 'Lista espera' }, status: 'live', connects: { outcomes: ['p4', 's2'] } },
    { id: 'reports', name: { en: 'Reports', es: 'Reportes' }, status: 'live', icon: 'line-chart', connects: { institutions: ['billing'], outcomes: ['s4'] } },
    { id: 'ranking', name: { en: 'No-show rank', es: 'Ranking faltas' }, status: 'live', icon: 'ranking', connects: {} },
    { id: 'dniSignup', name: { en: 'ID sign-up', es: 'Alta con DNI' }, status: 'live', icon: 'id-card', connects: { institutions: ['identity'] } },
    { id: 'agenda', name: { en: 'Doctor agenda', es: 'Agenda médica' }, status: 'live', icon: 'calendar', connects: {} },
    { id: 'multisite', name: { en: 'Multi-site', es: 'Multi-sede' }, status: 'live', icon: 'module', connects: {} },
    { id: 'triage', name: { en: 'AI triage', es: 'Triaje con IA' }, status: 'live', icon: 'priority', connects: {} },
    { id: 'dniScan', name: { en: 'ID scan', es: 'Escaneo de DNI' }, status: 'live', connects: { institutions: ['identity'] } },
    { id: 'whatsappBooking', name: { en: 'WhatsApp book', es: 'Turno WhatsApp' }, status: 'partial', icon: 'conversation', connects: { institutions: ['messaging'], outcomes: ['p1'] } },
    { id: 'multilang', name: { en: 'Multi-language', es: 'Multi-idioma' }, status: 'partial', connects: {} },
    { id: 'pucoCoverage', name: { en: 'Insurance lookup', es: 'Cobertura PUCO' }, status: 'partial', icon: 'shield', connects: { institutions: ['coverage'] } },
    { id: 'historySummary', name: { en: 'Chart summary', es: 'Resumen HC' }, status: 'live', icon: 'soap-note', connects: { institutions: ['emr'] } }
  ];

  // ---------------------------------------------------------------- outcome dots
  // Three registers, grounded in the meeting-notes mining (docs/website-constellation.md).
  // Translated to English for the English-first redesign; Spanish keeps the original
  // punch from the spec verbatim.
  var OUTCOMES = [
    { id: 'p1', group: 'patients', priority: 1, text: { en: 'No more dawn queues', es: 'Sin cola de madrugada' } },
    { id: 'p2', group: 'patients', priority: 1, text: { en: 'Appointment in your pocket', es: 'Turno en el bolsillo' } },
    { id: 'p3', group: 'patients', priority: 1, text: { en: 'Referral never gets lost', es: 'Orden no se pierde' } },
    { id: 'p4', group: 'patients', priority: 2, text: { en: 'Freed slot, you’re notified', es: 'Se libera, te avisa' } },
    { id: 's2', group: 'staff', priority: 2, text: { en: 'No freed slot wasted', es: 'Ningún turno se pierde' } },
    { id: 's3', group: 'staff', priority: 2, text: { en: 'License verified instantly', es: 'Matrícula verificada al instante' } },
    { id: 's4', group: 'staff', priority: 1, text: { en: 'Billing recovery without spreadsheets', es: 'Recupero SUMAR sin planillas' } },
    { id: 's5', group: 'staff', priority: 2, text: { en: 'Talks to the national EHR', es: 'Se entiende con HSI' } },
    { id: 'm1', group: 'leaders', priority: 1, text: { en: 'Modernization that makes headlines', es: 'Modernización que es noticia' } },
    { id: 'm2', group: 'leaders', priority: 1, text: { en: 'Free and open source', es: 'Gratis y código abierto' } },
    { id: 'm3', group: 'leaders', priority: 2, text: { en: 'A case for conferences', es: 'Caso para el congreso' } },
    { id: 'm4', group: 'leaders', priority: 2, text: { en: 'Data for the ministry', es: 'Datos para el ministerio' } },
    { id: 'm5', group: 'leaders', priority: 1, text: { en: 'Policy, not politics', es: 'Política de Estado' } }
  ];

  // ------------------------------------------------------------ sphere geometry
  // Banded-latitude unit sphere (NOT pure Fibonacci): institutions sit on a
  // recognizable equatorial belt, capabilities split across two mid bands,
  // outcomes sit near (never at) the poles where fog + small scale naturally
  // de-emphasize them. Azimuth uses the golden angle within each band for an
  // organic, non-aligned scatter. Hub is NOT on the sphere — fixed CSS center,
  // outside the rAF loop, always sharp.
  var DEG = Math.PI / 180;
  var GOLDEN_DEG = 137.508;
  // R started at the spec's 150px; bumped to 230 after the first render showed
  // 38 one-line text labels colliding badly at 150 — circumferential space per
  // band item scales with R, and one-line labels (Phase 1's content spec) run
  // 60-110px wide, wider than a bare chip box. Tuned round 1/3. Now recomputed
  // per-frame-rect (see updateFigureRect) so narrow stacked-hero bands get a
  // smaller sphere instead of overflowing the page.
  var SPHERE_R = 230; // px, dynamic default — updateFigureRect rescales it
  var SPHERE_R_MIN = 130, SPHERE_R_MAX = 245; // lowered from 150 so ~360-390px phones don't overlap
  // Horizontal-only multiplier on top of SPHERE_R. The figure box is much
  // wider than it is tall (two-column desktop hero), so a sphere sized off
  // the vertical radius alone leaves the node cloud looking like a small
  // circle stranded in a wide box. Stretches sx (never sy) up to 1.6x on
  // desktop so the composition actually fills the width it's given; phones
  // have the opposite problem (narrow viewport, no room to spare), so this
  // compresses instead (down to .8x) — see updateFigureRect().
  var hStretch = 1;
  // The sphere sits completely still until the visitor hovers or drags it —
  // no idle auto-rotation. Hovering tilts it toward the cursor (parallax,
  // see pointerYawOffset/pointerPitchOffset below) instead of spinning it
  // faster; dragging still gets real inertia via yawVel/pitchVel decay.
  var PARALLAX_YAW_RANGE = 0.5; // rad, max yaw offset from cursor parallax
  var PARALLAX_PITCH_RANGE = 0.4; // rad, max pitch offset from cursor parallax
  var PARALLAX_EASE = 0.06; // per-frame lerp factor easing toward the parallax target
  // Touch has no hover, so the zero-idle-rotation rule above would leave the
  // sphere looking frozen until the visitor actively drags it. Mobile only
  // gets a slow ambient auto-yaw instead — gated strictly to isMobileLayout,
  // desktop's hover-only/zero-idle behavior is untouched.
  var AUTO_YAW_SPEED_MOBILE = 0.05; // rad/s, slow ambient drift, mobile only
  var PITCH_CLAMP = 0.5; // rad, base drag clamp — belt must stay a ring
  // Half-box containment margins per node kind, sized to each chip's rendered
  // box (.cchip is 80px wide, .ichip 92px, .const-outcome quotes wrap taller)
  // — keeps a node's clamped center far enough from the figure edge that its
  // whole box stays inside .const-figure regardless of sphere pose.
  var NODE_MARGIN = {
    cap: { x: 44, y: 30 },
    inst: { x: 50, y: 34 },
    out: { x: 44, y: 40 }
  };

  var BAND_INST_PHI = 90;
  var BAND_CAP_A_PHI = 62;
  var BAND_CAP_B_PHI = 118;
  // Outcome bands moved from 20/160 to 18/162 (still nowhere near the literal
  // poles) — at 20/160 the orbit circumference (sin(20°)≈.34 of R) was too
  // small to fit 6-7 quote strings without full overlap even at larger R.
  // Widened further from the capability bands (62/118, was 54/126 then
  // 25/155) — a visual sweep still caught cap:agenda x out:s4 genuinely
  // overlapping mid-rotation with only 29° of phi between the two bands;
  // 44° gives real vertical separation even when their azimuths happen to
  // align at some yaw.
  var BAND_OUT_A_PHI = 18;
  var BAND_OUT_B_PHI = 162;

  function unitFromSpherical(phiDeg, thetaDeg) {
    var phi = phiDeg * DEG, th = thetaDeg * DEG;
    return { x: Math.sin(phi) * Math.cos(th), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(th) };
  }
  // Even base spacing (360/count) + a small deterministic per-item jitter —
  // NOT raw golden-angle stepping. Golden angle only distributes evenly in
  // the limit of large N; for a single band of 6-9 items it produces gaps
  // ranging ~20°-60° (e.g. band-B capabilities clustered agenda/multilang/
  // historySummary inside a 53° arc), which collided at any R. Even spacing
  // guarantees a floor on adjacent-item separation.
  //
  // The jitter MUST be non-monotonic in i — a linear-ramp jitter (an earlier
  // version of this used one) shifts idx0 one way and idx(last) the other,
  // which cancels out for every *consecutive* gap but COMPRESSES the
  // wrap-around gap between the first and last item by up to 2x the jitter
  // amplitude. That wrap-around pair is real neighbors on the circle, and a
  // collision review caught it as the single biggest source of persistent
  // front-tier overlap (cap:agenda x cap:historySummary, cap:booking x
  // cap:dniSignup, out:s4 x out:m5 — all first/last pairs within their
  // band). A sine of an irrational-ish phase has no net drift end-to-end.
  function jitterDeg(i, amp) { return amp * Math.sin(i * 2.399963); }
  function instUnit(i, count) {
    var step = 360 / count;
    var phiJitter = (i % count) - Math.floor(count / 2); // deterministic ±jitter, e.g. -3..3 for 7
    return unitFromSpherical(BAND_INST_PHI + phiJitter, i * step + jitterDeg(i, 2));
  }
  function capUnit(i, count) {
    var half = Math.ceil(count / 2);
    var band = i < half ? 0 : 1;
    var idx = band === 0 ? i : i - half;
    var bandCount = band === 0 ? half : count - half;
    var step = 360 / bandCount;
    var phi = band === 0 ? BAND_CAP_A_PHI : BAND_CAP_B_PHI;
    var offset = band === 0 ? 0 : step / 2; // lower band offset half-step
    return unitFromSpherical(phi, offset + idx * step + jitterDeg(idx, 1.5));
  }
  function outUnit(i, count) {
    var firstCount = 6;
    var band = i < firstCount ? 0 : 1;
    var idx = band === 0 ? i : i - firstCount;
    var bandCount = band === 0 ? firstCount : count - firstCount;
    var step = 360 / bandCount;
    var phi = band === 0 ? BAND_OUT_A_PHI : BAND_OUT_B_PHI;
    var offset = band === 1 ? step / 2 : 0;
    return unitFromSpherical(phi, offset + idx * step + jitterDeg(idx, 1.5));
  }

  function rotateUnit(u, yaw, pitch) {
    var cosY = Math.cos(yaw), sinY = Math.sin(yaw);
    var x1 = u.x * cosY + u.z * sinY;
    var z1 = -u.x * sinY + u.z * cosY;
    var cosP = Math.cos(pitch), sinP = Math.sin(pitch);
    var y2 = u.y * cosP - z1 * sinP;
    var z2 = u.y * sinP + z1 * cosP;
    return { x: x1, y: y2, z: z2 };
  }
  function spreadFor(d) { return 0.72 + 0.28 * d; }
  function scaleFor(d) { return 0.55 + 0.50 * d; }
  // Tier boundaries are hung off the EQUATOR (d = 0.5): both front tiers are
  // the hemisphere facing the viewer and render sharp, both back tiers are
  // behind it and get blurred (constellation.css). Paired with opacityFor()
  // below, a node that is behind another is always both fainter and softer,
  // which is what stops two labels from fighting to be read at once.
  function tierFor(d) {
    if (d >= 0.72) return 'tf-front';
    if (d >= 0.50) return 'tf-mid';
    if (d >= 0.25) return 'tf-backnear';
    return 'tf-backfar';
  }
  // Piecewise on the same equator: the front hemisphere brightens gently to
  // full at dead-center, the back hemisphere falls away steeply. A single
  // smooth curve over the whole range could only trade one for the other —
  // dimming the front to hide the back, or keeping the back legible enough
  // to overlap the front.
  function opacityFor(d) {
    if (d >= 0.5) return clamp(0.55 + 0.45 * Math.pow((d - 0.5) / 0.5, 1.2), 0, 1);
    return clamp(0.03 + 0.52 * Math.pow(d / 0.5, 2.2), 0, 1);
  }
  function angleBetween(a, b) {
    var dp = clamp(a.x * b.x + a.y * b.y + a.z * b.z, -1, 1);
    return Math.acos(dp) / DEG;
  }
  function slerp(a, b, frac) {
    var dp = clamp(a.x * b.x + a.y * b.y + a.z * b.z, -1, 1);
    var theta = Math.acos(dp) * frac;
    if (theta < 1e-6) return { x: a.x, y: a.y, z: a.z };
    var rx = b.x - a.x * dp, ry = b.y - a.y * dp, rz = b.z - a.z * dp;
    var rlen = Math.sqrt(rx * rx + ry * ry + rz * rz) || 1e-6;
    rx /= rlen; ry /= rlen; rz /= rlen;
    var cosT = Math.cos(theta), sinT = Math.sin(theta);
    return { x: a.x * cosT + rx * sinT, y: a.y * cosT + ry * sinT, z: a.z * cosT + rz * sinT };
  }

  // Custom cubic-bezier(0.65, 0, 0.15, 1) sampler — fast takeoff, decisive stop.
  // Newton-Raphson on the parametric bezier, same shape as the WebKit UnitBezier.
  function makeCubicBezier(x1, y1, x2, y2) {
    function A(a1, a2) { return 1 - 3 * a2 + 3 * a1; }
    function B(a1, a2) { return 3 * a2 - 6 * a1; }
    function C(a1) { return 3 * a1; }
    function calc(tt, a1, a2) { return ((A(a1, a2) * tt + B(a1, a2)) * tt + C(a1)) * tt; }
    function slope(tt, a1, a2) { return 3 * A(a1, a2) * tt * tt + 2 * B(a1, a2) * tt + C(a1); }
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      var tt = x;
      for (var i = 0; i < 8; i++) {
        var s = slope(tt, x1, x2);
        if (Math.abs(s) < 1e-6) break;
        tt -= (calc(tt, x1, x2) - x) / s;
      }
      return calc(tt, y1, y2);
    };
  }
  var dotEase = makeCubicBezier(0.65, 0, 0.15, 1);

  function curvedEdgePath(ax, ay, bx, by) {
    var mx = (ax + bx) / 2, my = (ay + by) / 2;
    var dx = bx - ax, dy = by - ay;
    var bow = 0.12;
    var qx = mx - dy * bow, qy = my + dx * bow;
    return 'M ' + ax.toFixed(1) + ',' + ay.toFixed(1) + ' Q ' + qx.toFixed(1) + ',' + qy.toFixed(1) + ' ' + bx.toFixed(1) + ',' + by.toFixed(1);
  }

  // -------------------------------------------------------------------------- state
  var reduceMotion = false;
  var isMobileLayout = false;
  var figureEl, edgesEl, capsEl, instEl, outcomesEl, hubEl, switcherEl, shadeEl;
  var current = { code: 'AR', auto: true };
  var detected = { code: 'AR', source: 'default' };

  var nodeIndex = {}; // key -> sphere node {el, content, unit, kind, sizeFactor, tier, edgeEl, recoil*}
  var nodeList = [];  // flat list of the same nodes, for iteration/travel

  var figW = 0, figH = 0, centerX = 0, centerY = 0, hubBox = null;
  var yaw = 0, pitch = 0, yawVel = 0, pitchVel = 0;
  // Normalized cursor position within #constFigure, [-1,1] each axis, and the
  // eased offsets it drives (see the parallax step in frame()).
  var pointerNX = 0, pointerNY = 0, pointerYawOffset = 0, pointerPitchOffset = 0;
  var isHovering = false;
  var isDragging = false;
  var dragState = null;
  var debugFreeze = false;
  var rafId = null;
  var lastFrameTime = null;
  var visible = true;
  var dotEl = null;
  var dotState = null;

  var STATUS_CLASSES = ['is-live', 'is-partial', 'is-planned', 'is-placeholder'];
  function setStatusClasses(el, classes) {
    STATUS_CLASSES.forEach(function (c) { el.classList.remove(c); });
    classes.forEach(function (c) { el.classList.add(c); });
  }

  // --------------------------------------------------------------- capability chips
  function buildCapabilities() {
    CAPABILITIES.forEach(function (cap, i) {
      var node = nodeIndex['cap:' + cap.id];
      var el = document.createElement('div');
      el.className = 'cchip sphere-node is-' + cap.status;
      el.dataset.key = 'cap:' + cap.id;
      // These are diagram labels, not controls. Keeping them out of the tab
      // order also prevents keyboard focus from landing on a fogged back node.
      el.tabIndex = -1;
      var content = document.createElement('span');
      content.className = 'chip-content';
      el.appendChild(content);
      node.el = el; node.content = content;
      var iconHtml = cap.icon
        ? '<span class="cchip-icon"><span class="cchip-glyph" aria-hidden="true" style="' +
            'mask-image:url(/web/icons/' + cap.icon + '.svg?v=1);' +
            '-webkit-mask-image:url(/web/icons/' + cap.icon + '.svg?v=1);' +
            'background-color:' + capabilityTint(cap) + ';"></span></span>'
        : '<span class="cchip-dot" aria-hidden="true"></span>';
      content.innerHTML = iconHtml + '<span class="cchip-label"></span><span class="cchip-note"></span>';
      paintCapabilityText(el, cap);
      el.addEventListener('mouseenter', function () { hoverCapability(cap); });
      el.addEventListener('mouseleave', clearHover);
      capsEl.appendChild(el);
    });
  }

  // Capability glyphs are monochrome SVGs (Icons8 "iOS 27 Glyph" pack, per
  // CLAUDE.md — never swap packs) masked onto a colored span instead of ever
  // rendering as a flat-black <img>. A capability can name its own `tint`;
  // otherwise it defaults to the in-progress or the live accent color.
  function capabilityTint(cap) {
    if (cap.tint) return cap.tint;
    return cap.status === 'partial' ? 'var(--development)' : 'var(--accent-deep)';
  }

  function paintCapabilityText(el, cap) {
    var note = cap.status === 'planned' ? t('plannedNote') : (cap.status === 'partial' ? t('partialNote') : '');
    el.querySelector('.cchip-label').textContent = pick(cap.name);
    var noteEl = el.querySelector('.cchip-note');
    noteEl.textContent = note;
    noteEl.style.display = note ? '' : 'none';
  }

  function refreshCapabilityText() {
    CAPABILITIES.forEach(function (cap) {
      var el = capsEl.querySelector('.cchip[data-key="cap:' + cap.id + '"]');
      if (el) paintCapabilityText(el, cap);
    });
  }

  // --------------------------------------------------------------- institution ring
  // Real logo or nothing. An institution we have no logotype for renders as
  // its name alone — never an initials monogram, which is an invented mark
  // that reads like a real one and tells the visitor nothing.
  function logoFileFor(inst) {
    return (inst && inst.logo && LOGO_FILES[inst.logo]) || null;
  }
  function logoMarkup(inst) {
    var file = logoFileFor(inst);
    if (!file) return '';
    // ?v= on the logo too: these files get re-cut (white background removed, a
    // wordmark isolated) and the CDN caches images just like it caches JS.
    return '<span class="ichip-logo"><img src="/web/constellation-logos/' + file + '?v=2" alt="" loading="lazy"></span>';
  }
  // Some logotypes are wordmarks (SUMAR+, NHS, HL7 FHIR): forced into the
  // square logo box they render a few pixels tall and read as a smudge. The
  // artwork's own aspect decides — a new country's assets need no list here.
  function tagWideLogo(el, content) {
    var img = content.querySelector('.ichip-logo img');
    if (!img) return;
    var mark = function () {
      if (!img.naturalWidth || !img.naturalHeight) return;
      var wide = img.naturalWidth / img.naturalHeight >= 2;
      img.parentNode.classList.toggle('ichip-logo--wide', wide);
      el.classList.toggle('is-widelogo', wide);
    };
    if (img.complete) mark();
    else img.addEventListener('load', mark);
  }

  function buildInstitutions() {
    ROLES.forEach(function (role) {
      var node = nodeIndex['inst:' + role.key];
      var el = document.createElement('div');
      el.className = 'ichip sphere-node';
      el.dataset.key = 'inst:' + role.key;
      el.dataset.role = role.key;
      el.tabIndex = -1;
      var content = document.createElement('span');
      content.className = 'chip-content';
      el.appendChild(content);
      node.el = el; node.content = content;
      instEl.appendChild(el);
    });
    paintInstitutions();
  }

  function paintInstitutions() {
    var country = COUNTRIES[current.code] || (current.code === GENERIC_CODE ? GENERIC_COUNTRY : null);
    ROLES.forEach(function (role) {
      var node = nodeIndex['inst:' + role.key];
      var el = node && node.el;
      if (!el) return;
      var content = node.content;
      var inst = country && country.institutions[role.key];
      el.classList.add('is-morphing');
      window.setTimeout(function () {
        if (inst) {
          setStatusClasses(el, ['is-' + inst.status]);
          el.classList.remove('is-placeholder');
          el.title = inst.title || pick(inst.name);
          var note = inst.status === 'planned' ? t('plannedNote') : (inst.status === 'partial' ? t('partialNote') : '');
          el.classList.toggle('is-textonly', !logoFileFor(inst));
          content.innerHTML = logoMarkup(inst) +
            '<span class="ichip-label">' + pick(inst.name) + '</span>' +
            (note ? '<span class="ichip-note">' + note + '</span>' : '');
          el.classList.remove('is-widelogo');
          tagWideLogo(el, content);
        } else {
          setStatusClasses(el, ['is-planned', 'is-placeholder']);
          el.classList.add('is-textonly');
          el.classList.remove('is-widelogo');
          el.removeAttribute('title');
          content.innerHTML = '<span class="ichip-label">' + pick(role) + '</span>' +
            '<span class="ichip-note">' + t('plannedNote') + '</span>';
        }
        el.classList.remove('is-morphing');
      }, reduceMotion ? 0 : 140);
    });
  }

  // ------------------------------------------------------------------ outcome dots
  function buildOutcomes() {
    OUTCOMES.forEach(function (o) {
      var node = nodeIndex['out:' + o.id];
      var el = document.createElement('span');
      el.className = 'const-outcome sphere-node';
      el.dataset.key = 'out:' + o.id;
      el.dataset.priority = String(o.priority);
      el.textContent = '“' + pick(o.text) + '”';
      node.el = el;
      outcomesEl.appendChild(el);
    });
  }

  function refreshOutcomeText() {
    OUTCOMES.forEach(function (o) {
      var el = outcomesEl.querySelector('[data-key="out:' + o.id + '"]');
      if (el) el.textContent = '“' + pick(o.text) + '”';
    });
    measureOutcomes();
  }

  // ------------------------------------------------------------------------- hover
  function hoverCapability(cap) {
    if (isDragging) return;
    figureEl.classList.add('is-hovering');
    var hot = ['cap:' + cap.id];
    (cap.connects.institutions || []).forEach(function (r) { hot.push('inst:' + r); });
    (cap.connects.outcomes || []).forEach(function (o) { hot.push('out:' + o); });
    figureEl.querySelectorAll('[data-key]').forEach(function (el) {
      el.classList.toggle('is-hot', hot.indexOf(el.dataset.key) !== -1);
    });
    edgesEl.querySelectorAll('path[data-key]').forEach(function (p) {
      p.classList.toggle('is-hot', hot.indexOf(p.dataset.key) !== -1);
    });
  }
  function clearHover() {
    figureEl.classList.remove('is-hovering');
    figureEl.querySelectorAll('.is-hot').forEach(function (el) { el.classList.remove('is-hot'); });
  }

  // -------------------------------------------------------------------------- edges
  // Hub->node lines exist only for capabilities + institutions (outcomes never had
  // edges), and are only drawn while that node is in the front fog tier.
  function buildEdges() {
    var svgns = 'http://www.w3.org/2000/svg';
    CAPABILITIES.forEach(function (cap) { nodeIndex['cap:' + cap.id].edgeEl = makeEdgePath(svgns, 'cap:' + cap.id); });
    ROLES.forEach(function (role) { nodeIndex['inst:' + role.key].edgeEl = makeEdgePath(svgns, 'inst:' + role.key); });
  }
  function makeEdgePath(svgns, key) {
    var path = document.createElementNS(svgns, 'path');
    path.setAttribute('class', 'const-edge');
    path.dataset.key = key;
    path.style.display = 'none';
    edgesEl.appendChild(path);
    return path;
  }

  // ------------------------------------------------------------------------ dot
  function pickNear(landingKey, maxDeg) {
    var landing = nodeIndex[landingKey];
    var candidates = [];
    for (var i = 0; i < nodeList.length; i++) {
      var n = nodeList[i];
      if (n.key === landingKey) continue;
      if (angleBetween(landing.unit, n.unit) <= maxDeg) candidates.push(n);
    }
    if (!candidates.length) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  function pickDestination(originKey) {
    var origin = nodeIndex[originKey];
    var candidates = [];
    var best = null, bestDelta = Infinity;
    for (var i = 0; i < nodeList.length; i++) {
      var n = nodeList[i];
      if (n.key === originKey) continue;
      var ang = angleBetween(origin.unit, n.unit);
      if (ang >= 20 && ang <= 90) candidates.push(n);
      var delta = Math.abs(ang - 55);
      if (delta < bestDelta) { bestDelta = delta; best = n; }
    }
    if (candidates.length) return candidates[Math.floor(Math.random() * candidates.length)];
    return best;
  }

  function initDot() {
    dotEl = document.createElement('span');
    dotEl.className = 'const-dot';
    figureEl.appendChild(dotEl);
    var start = nodeList[Math.floor(Math.random() * nodeList.length)];
    dotState = { phase: 'idle', node: start, idleUntil: performance.now() + 400 };
  }

  function stepDot(now, effYaw, effPitch) {
    if (!dotState) return;
    if (dotState.phase === 'idle') {
      if (now >= dotState.idleUntil) {
        var landing = dotState.node;
        var origin = pickNear(landing.key, 35) || landing;
        var dest = pickDestination(origin.key);
        if (!dest) return;
        var ang = angleBetween(origin.unit, dest.unit);
        dotState.phase = 'flying';
        dotState.origin = origin;
        dotState.dest = dest;
        dotState.t0 = now;
        dotState.duration = clamp(280 + ang * 6, 450, 1400);
        dotState.prevX = null; dotState.prevY = null; dotState.curX = null; dotState.curY = null;
        if (dotEl) dotEl.style.opacity = '1';
      }
      return;
    }
    var elapsed = now - dotState.t0;
    var frac = clamp(elapsed / dotState.duration, 0, 1);
    var eased = dotEase(frac);
    var u = slerp(dotState.origin.unit, dotState.dest.unit, eased);
    var loft = 1 + 0.6 * eased * (1 - eased); // peaks at 1.15x radius mid-flight
    var r = rotateUnit(u, effYaw, effPitch);
    var d = (r.z + 1) / 2;
    var sx = centerX + r.x * SPHERE_R * loft * spreadFor(d);
    var sy = centerY - r.y * SPHERE_R * loft * spreadFor(d);
    if (dotEl) {
      var s = 0.6 + 0.5 * scaleFor(d);
      dotEl.style.transform = 'translate(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px) scale(' + s.toFixed(3) + ') translate(-50%,-50%)';
    }
    dotState.prevX = dotState.curX; dotState.prevY = dotState.curY;
    dotState.curX = sx; dotState.curY = sy;

    if (frac >= 1) {
      var dest2 = dotState.dest;
      var dx = dotState.curX - (dotState.prevX == null ? dotState.curX - 1 : dotState.prevX);
      var dy = dotState.curY - (dotState.prevY == null ? dotState.curY : dotState.prevY);
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      dest2.recoilDx = dx / len; dest2.recoilDy = dy / len;
      dest2.recoilAmp = clamp(6 / dest2.sizeFactor, 2, 11);
      dest2.recoilStart = now;

      dotState.phase = 'idle';
      dotState.node = dest2;
      dotState.idleUntil = now + 700 + Math.random() * 700;
      if (dotEl) dotEl.style.opacity = '0';
    }
  }

  // -------------------------------------------------------------------------- rAF
  function updateFigureRect() {
    figW = figureEl.clientWidth;
    figH = figureEl.clientHeight;
    centerX = figW / 2;
    centerY = figH / 2;
    isMobileLayout = window.matchMedia('(max-width: 620px)').matches;
    if (figW && figH) {
      // Narrow stacked-hero bands (tablet/laptop, ~761-1120px) declare a
      // shorter .const-figure to keep the hero's total height in budget;
      // rescale the sphere itself to match instead of letting it overflow
      // that shorter box by a fixed amount regardless of how small it is.
      // figH is always the tighter dimension in this layout (the figure is
      // always wider than tall, mobile included), so it alone drives the
      // vertical radius; hStretch (below) handles the horizontal fill.
      SPHERE_R = clamp(figH * 0.60, SPHERE_R_MIN, SPHERE_R_MAX);
      var maxH = isMobileLayout ? 1 : 1.6;
      var minH = isMobileLayout ? 0.8 : 1;
      hStretch = clamp(figW / (SPHERE_R * 2.3), minH, maxH);
    }
    if (edgesEl && figW && figH) edgesEl.setAttribute('viewBox', '0 0 ' + figW + ' ' + figH);
    // The hub card is the one node that never moves, so its box is measured
    // here (not per frame) and seeded into the occlusion pass — a chip that
    // wanders under the card gives way to it like it would to any nearer node.
    if (hubEl) {
      hubBox = { w: hubEl.offsetWidth, h: hubEl.offsetHeight };
    }
    if (outcomesEl && outcomesEl.firstChild) measureOutcomes();
    // Backdrop always tracks the live sphere radius so it reads as a globe
    // (fills the poles) at every figure size, not just the tuned default.
    // Width follows hStretch too so the glow reads as an ellipse matching
    // the stretched/compressed node cloud, not a circle that's off-center.
    if (shadeEl) {
      shadeEl.style.width = Math.round(SPHERE_R * hStretch * 1.86) + 'px';
      shadeEl.style.height = Math.round(SPHERE_R * 1.86) + 'px';
    }
  }

  // ------------------------------------------------------------------ occlusion
  // Approximate rendered box of a node, in figure pixels. Deliberately an
  // estimate rather than offsetWidth/offsetHeight: reading layout inside the
  // rAF loop forces a reflow every frame, and this only has to be accurate
  // enough to tell "these two labels are sitting on top of each other" from
  // "these two are merely near each other".
  var NODE_BOX = {
    cap: { front: [80, 46], back: [34, 26] },
    inst: { front: [92, 52], back: [44, 34] },
    out: { front: [80, 36], back: [80, 36] }
  };
  function nodeBox(node) {
    var s = node.pscale || 1;
    // Quotes are free text of wildly different lengths, and they are the ones
    // that actually collide, so they get a real measurement (taken once per
    // text change, never inside the loop) instead of an estimate.
    if (node.measW) return { w: node.measW * s, h: node.measH * s };
    var b = NODE_BOX[node.kind] || NODE_BOX.cap;
    var wide = node.tier === 'tf-front' ||
      (node.el && (node.el.classList.contains('is-textonly') ||
                   node.el.classList.contains('is-widelogo')));
    var dims = wide ? b.front : b.back;
    // 0.85 shrink: chip labels are centered in a box with air around them, so
    // raw boxes report a collision before the glyphs actually touch.
    return { w: dims[0] * s * 0.85, h: dims[1] * s * 0.85 };
  }
  // Measured outside the rAF loop (offsetWidth forces layout) — on build, on
  // language change, and on resize.
  function measureOutcomes() {
    OUTCOMES.forEach(function (o) {
      var node = nodeIndex['out:' + o.id];
      if (!node || !node.el) return;
      node.measW = node.el.offsetWidth;
      node.measH = node.el.offsetHeight;
    });
  }

  // Depth fades whatever is BEHIND, but two nodes at nearly the same depth
  // can still land on the same pixels — and then the sharper/fainter rule has
  // nothing to say and both stay half-readable, which is the state that reads
  // as "the text is unreadable, it's overlapping". So: sort front-to-back and
  // let a node that is covered by an already-drawn (nearer) one give way.
  // The winner is the nearer node; ties break on the outcome's own priority.
  function applyOcclusion() {
    var drawn = [];
    if (hubBox) drawn.push({ x: centerX, y: centerY, w: hubBox.w, h: hubBox.h });
    var order = nodeList.slice().sort(function (a, b) {
      var da = a.pd == null ? -1 : a.pd, db = b.pd == null ? -1 : b.pd;
      if (db !== da) return db - da;
      return (a.priority || 0) - (b.priority || 0);
    });
    for (var i = 0; i < order.length; i++) {
      var node = order[i];
      if (!node.el || node.pd == null) continue;
      var box = nodeBox(node);
      var covered = 0;
      for (var j = 0; j < drawn.length; j++) {
        var o = drawn[j];
        var dx = Math.abs(node.px - o.x), dy = Math.abs(node.py - o.y);
        var ox = (box.w + o.w) / 2 - dx, oy = (box.h + o.h) / 2 - dy;
        if (ox > 0 && oy > 0) {
          // Fraction of THIS node's own area the nearer one sits on.
          var f = (Math.min(ox, box.w) * Math.min(oy, box.h)) / (box.w * box.h);
          if (f > covered) covered = f;
        }
      }
      // Text is unforgiving: even a tenth of a label sitting under another
      // one is enough to make both unreadable, so the ramp is short and the
      // loser drops nearly all the way out rather than lingering at half.
      var target = 1 - 0.9 * clamp(covered / 0.10, 0, 1);
      if (node.occl == null) node.occl = target;
      // Eased so a node crossing another doesn't strobe on rotation.
      node.occl += (target - node.occl) * 0.14;
      var op = opacityFor(node.pd) * node.occl;
      node.el.style.opacity = op.toFixed(2);
      // Only a node you can actually read blocks the one behind it. Without
      // this a ghost at 4% opacity would push a legible label out of the way
      // and leave that patch of the sphere empty for no visible reason.
      if (op > 0.25) drawn.push({ x: node.px, y: node.py, w: box.w, h: box.h });
    }
  }

  function frame(now) {
    if (!visible) { rafId = null; return; }
    var dt = lastFrameTime == null ? 16 : Math.min(now - lastFrameTime, 48);
    lastFrameTime = now;
    var dtS = dt / 1000;

    if (!reduceMotion && !debugFreeze && !isDragging) {
      // No idle spin on desktop: yawVel/pitchVel only carry drag-release
      // momentum, which decays to a stop instead of settling into a
      // constant background spin. Mobile has no hover, so it gets a small
      // constant ambient drift added on top instead — otherwise the sphere
      // would look completely frozen until the visitor drags it.
      yaw += (yawVel + (isMobileLayout ? AUTO_YAW_SPEED_MOBILE : 0)) * dtS;
      yawVel *= 0.94;
      pitch += pitchVel * dtS;
      pitchVel *= 0.94;
    }
    pitch = clamp(pitch, -PITCH_CLAMP, PITCH_CLAMP);

    if (!reduceMotion && !debugFreeze) {
      var yawTarget = (isHovering && !isDragging) ? pointerNX * PARALLAX_YAW_RANGE : 0;
      var pitchTarget = (isHovering && !isDragging) ? pointerNY * PARALLAX_PITCH_RANGE : 0;
      pointerYawOffset += (yawTarget - pointerYawOffset) * PARALLAX_EASE;
      pointerPitchOffset += (pitchTarget - pointerPitchOffset) * PARALLAX_EASE;
    }

    var effYaw = yaw + pointerYawOffset;
    var effPitch = clamp(pitch + pointerPitchOffset, -(PITCH_CLAMP + PARALLAX_PITCH_RANGE), PITCH_CLAMP + PARALLAX_PITCH_RANGE);

    for (var i = 0; i < nodeList.length; i++) {
      var node = nodeList[i];
      var r = rotateUnit(node.unit, effYaw, effPitch);
      var d = (r.z + 1) / 2;
      var spread = spreadFor(d);
      var scale = scaleFor(d);
      var effR = SPHERE_R * (node.rMult || 1);
      var sx = centerX + r.x * effR * hStretch * spread;
      var sy = centerY - r.y * effR * spread;
      // Hard containment: at extreme pitch a node's projected position can
      // land past the figure's own box (the outcome band's larger rMult
      // made this dramatic — quotes rendered over the figcaption/proof
      // strip below the figure, or poked above it toward the header). Clamp
      // the CENTER point so the rendered box (roughly 2x the margin below,
      // sized per node kind) stays inside .const-figure regardless of pose.
      if (figW > 0 && figH > 0) {
        var m = NODE_MARGIN[node.kind] || NODE_MARGIN.cap;
        var mx = Math.min(m.x, figW / 2 - 1), my = Math.min(m.y, figH / 2 - 1);
        sx = clamp(sx, mx, figW - mx);
        sy = clamp(sy, my, figH - my);
      }

      var rx = 0, ry = 0;
      if (node.recoilStart) {
        var rt = now - node.recoilStart;
        if (rt > 900) { node.recoilStart = 0; }
        else {
          var amp = node.recoilAmp * Math.exp(-0.006 * rt) * Math.cos(0.02 * rt);
          if (Math.abs(amp) < 0.3) { node.recoilStart = 0; }
          else { rx = node.recoilDx * amp; ry = node.recoilDy * amp; }
        }
      }

      var tier = tierFor(d);
      if (tier !== node.tier) {
        if (node.el) {
              if (node.tier) node.el.classList.remove(node.tier);
              node.el.classList.add(tier);
            }
        node.tier = tier;
      }

      if (node.el) {
        node.el.style.transform = 'translate(' + (sx + rx).toFixed(1) + 'px,' + (sy + ry).toFixed(1) + 'px) scale(' + scale.toFixed(3) + ') translate(-50%,-50%)';
        // Opacity is written in the occlusion pass below — depth alone can't
        // decide it, because two labels can collide while sitting at almost
        // the same depth (the pole quote bands do it constantly).
        node.pd = d;
        node.px = sx + rx;
        node.py = sy + ry;
        node.pscale = scale;
      }
      if (node.edgeEl) {
        if (tier === 'tf-front') {
          if (node.edgeEl.style.display !== '') node.edgeEl.style.display = '';
          node.edgeEl.setAttribute('d', curvedEdgePath(centerX, centerY, sx, sy));
        } else if (node.edgeEl.style.display !== 'none') {
          node.edgeEl.style.display = 'none';
        }
      }
    }

    applyOcclusion();

    // stepDot(now, effYaw, effPitch); — wandering dot disabled, see initSphereEngine.

    rafId = window.requestAnimationFrame(frame);
  }

  function onVisibilityChange() {
    visible = !document.hidden;
    if (visible && rafId == null) { lastFrameTime = null; rafId = window.requestAnimationFrame(frame); }
  }

  // ------------------------------------------------------------------- interaction
  function onPointerDown(e) {
    dragState = { startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastY: e.clientY, lastT: performance.now(), engaged: false, pointerId: e.pointerId };
  }
  function onPointerMove(e) {
    if (!dragState || dragState.pointerId !== e.pointerId) return;
    var now = performance.now();
    if (!dragState.engaged) {
      var totalDx = e.clientX - dragState.startX, totalDy = e.clientY - dragState.startY;
      if (Math.sqrt(totalDx * totalDx + totalDy * totalDy) < 8) return;
      dragState.engaged = true;
      isDragging = true;
      figureEl.classList.add('is-dragging');
      try { figureEl.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
    var dx = e.clientX - dragState.lastX, dy = e.clientY - dragState.lastY;
    var dt = Math.max(now - dragState.lastT, 1) / 1000;
    yaw += dx * 0.0065;
    pitch = clamp(pitch + dy * 0.0065, -PITCH_CLAMP, PITCH_CLAMP);
    yawVel = reduceMotion ? 0 : (dx * 0.0065) / dt;
    pitchVel = reduceMotion ? 0 : (dy * 0.0065) / dt;
    dragState.lastX = e.clientX; dragState.lastY = e.clientY; dragState.lastT = now;
    e.preventDefault();
  }
  function endDrag(e) {
    if (!dragState) return;
    if (dragState.engaged) {
      isDragging = false;
      figureEl.classList.remove('is-dragging');
      try { figureEl.releasePointerCapture(dragState.pointerId); } catch (err) { /* ignore */ }
      if (reduceMotion) { yawVel = 0; pitchVel = 0; }
    }
    dragState = null;
  }
  function onFigureMouseEnter() { if (!reduceMotion && !isDragging) isHovering = true; }
  function onFigureMouseLeave() { isHovering = false; pointerNX = 0; pointerNY = 0; }
  function onFigureMouseMove(e) {
    if (reduceMotion) return;
    var rect = figureEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointerNX = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    pointerNY = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
  }

  function initSphereEngine() {
    if (reduceMotion) { yaw = 20 * DEG; pitch = -8 * DEG; yawVel = 0; pitchVel = 0; }

    updateFigureRect();
    if ('ResizeObserver' in window) {
      new ResizeObserver(updateFigureRect).observe(figureEl);
    } else {
      window.addEventListener('resize', updateFigureRect);
    }

    figureEl.style.touchAction = 'none';
    figureEl.addEventListener('pointerdown', onPointerDown);
    figureEl.addEventListener('pointermove', onPointerMove);
    figureEl.addEventListener('pointerup', endDrag);
    figureEl.addEventListener('pointercancel', endDrag);
    if (!reduceMotion) {
      figureEl.addEventListener('mouseenter', onFigureMouseEnter);
      figureEl.addEventListener('mouseleave', onFigureMouseLeave);
      figureEl.addEventListener('mousemove', onFigureMouseMove);
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    try {
      var params = new URLSearchParams(window.location.search);
      if (params.get('debugSphere') === '1') {
        debugFreeze = true;
        window.__sphereDebug = { setAngles: function (y, p) { yaw = y; pitch = p; } };
      }
    } catch (e) { /* ignore */ }

    // initDot(); — wandering dot disabled ("they kind of bother some"); the
    // dot travel functions stay defined above but are never invoked.

    frame(performance.now());
  }

  // -------------------------------------------------------------------- geolocation
  // Browser language (navigator.language / Intl.Locale region) reflects the
  // OS/browser's configured language, NOT the visitor's real location — a
  // dev machine or any browser set to en-US reports "United States" no
  // matter where the request actually comes from (e.g. localhost). Real
  // detection needs an actual IP geolocation lookup; see detectCountryByIP.
  function detectCountry() {
    try {
      var cf = document.body.getAttribute('data-cf-country');
      if (cf && /^[A-Za-z]{2}$/.test(cf)) return { code: cf.toUpperCase(), source: 'cf' };
    } catch (e) { /* ignore */ }
    return { code: 'AR', source: 'default' };
  }

  // Async, client-side IP geolocation via a free no-key geo-IP API. Only
  // called when the CF header (accurate, but only present when proxied
  // through Cloudflare) isn't available. Applies the result only if the
  // visitor hasn't since picked a country manually (current.auto).
  function detectCountryByIP(callback) {
    var controller = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, 4000);
    fetch('https://ipwho.is/', { signal: controller ? controller.signal : undefined })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        clearTimeout(timer);
        if (data && data.success !== false && data.country_code && /^[A-Za-z]{2}$/.test(data.country_code)) {
          callback({ code: data.country_code.toUpperCase(), source: 'geoip' });
        }
      })
      .catch(function () { clearTimeout(timer); /* keep the CF/default guess */ });
  }

  // --------------------------------------------------------------------- switcher
  // One native <select> with every country (flag + localized name), pre-selected
  // to the visitor's geo-detected country. Switching morphs only the institution
  // ring — no separate "Auto" control; the pre-selection IS the auto-detected
  // state, and picking any option (including the visitor's own country) simply
  // becomes the new explicit choice.
  function allCountryCodesSorted() {
    return Object.keys(COUNTRIES).sort(function (a, b) {
      return pick(COUNTRIES[a].name).localeCompare(pick(COUNTRIES[b].name));
    });
  }

  function buildSwitcher() {
    switcherEl.innerHTML = '';

    var select = document.createElement('select');
    select.className = 'const-country-select';
    select.setAttribute('aria-label', t('switcherLabel'));

    var matched = false;
    allCountryCodesSorted().forEach(function (code) {
      var c = COUNTRIES[code];
      var opt = document.createElement('option');
      opt.value = code;
      opt.textContent = c.flag + ' ' + pick(c.name);
      if (current.code === code) { opt.selected = true; matched = true; }
      select.appendChild(opt);
    });
    var genericOpt = document.createElement('option');
    genericOpt.value = GENERIC_CODE;
    genericOpt.textContent = GENERIC_COUNTRY.flag + ' ' + pick(GENERIC_COUNTRY.name);
    if (!matched) genericOpt.selected = true;
    select.appendChild(genericOpt);

    select.addEventListener('change', function () {
      selectCountry(select.value, false);
    });
    switcherEl.appendChild(select);
  }

  function selectCountry(code, auto) {
    current = { code: code, auto: !!auto };
    paintInstitutions();
    buildSwitcher();
  }

  // ------------------------------------------------------------------------- init
  function refreshLanguageDependentText() {
    buildSwitcher();
    refreshCapabilityText();
    paintInstitutions();
    refreshOutcomeText();
    var capLabel = figureEl.querySelector('.const-ring--capabilities');
    var instLabel = figureEl.querySelector('.const-ring--institutions');
    if (capLabel) capLabel.setAttribute('aria-label', t('capabilitiesAria'));
    if (instLabel) instLabel.setAttribute('aria-label', t('institutionsAria'));
  }

  function buildSphereNodes() {
    nodeIndex = {};
    nodeList = [];
    CAPABILITIES.forEach(function (cap, i) {
      var node = { key: 'cap:' + cap.id, kind: 'cap', unit: capUnit(i, CAPABILITIES.length), sizeFactor: 1.0, tier: null, recoilStart: 0 };
      nodeIndex[node.key] = node;
      nodeList.push(node);
    });
    ROLES.forEach(function (role, i) {
      var node = { key: 'inst:' + role.key, kind: 'inst', unit: instUnit(i, ROLES.length), sizeFactor: 1.35, tier: null, recoilStart: 0 };
      nodeIndex[node.key] = node;
      nodeList.push(node);
    });
    OUTCOMES.forEach(function (o, i) {
      // Outcome bands sit near the poles (small sin(phi) => small orbit
      // circumference for a given R), and quote strings are wider than
      // capability/institution labels. Two things now keep this contained:
      // (1) constellation.css makes outcomes opacity:0 outside the front
      // tier (see .const-outcome.tf-mid/backnear/backfar) — only the ~front
      // slice is ever legible/simultaneous, so far fewer need to fit into
      // the arc at once; (2) a modest rMult (1.2, was 1.6) gives a little
      // extra circumference without the frame loop's hard containment clamp
      // (NODE_MARGIN) having to fight it at every pose — a big rMult plus a
      // hard clamp just piles every outcome up against the same clamped
      // edge, re-creating the crowding it was meant to fix.
      var node = { key: 'out:' + o.id, kind: 'out', unit: outUnit(i, OUTCOMES.length), sizeFactor: 0.55, rMult: 1.3, tier: null, recoilStart: 0, priority: o.priority || 0 };
      nodeIndex[node.key] = node;
      nodeList.push(node);
    });
  }

  function init() {
    figureEl = document.getElementById('constFigure');
    if (!figureEl) return;
    edgesEl = document.getElementById('constEdges');
    capsEl = document.getElementById('constCapabilities');
    instEl = document.getElementById('constInstitutions');
    outcomesEl = document.getElementById('constOutcomes');
    hubEl = document.getElementById('constHub');
    switcherEl = document.getElementById('constSwitcher');
    shadeEl = document.getElementById('constSphereShade');

    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isMobileLayout = window.matchMedia('(max-width: 620px)').matches;

    detected = detectCountry();
    // Generic-country visitors (not in COUNTRIES) stay on "auto" with no real
    // institutions filled — paintInstitutions() already renders that as the
    // "connector planned for your region" state via the placeholder branch.
    current = { code: COUNTRIES[detected.code] ? detected.code : GENERIC_CODE, auto: true };
    if (detected.source !== 'cf') {
      detectCountryByIP(function (geo) {
        detected = geo;
        if (!current.auto) return; // visitor already picked a country manually
        current = { code: COUNTRIES[geo.code] ? geo.code : GENERIC_CODE, auto: true };
        paintInstitutions();
        buildSwitcher();
      });
    }

    buildSphereNodes();
    buildCapabilities();
    buildInstitutions();
    buildOutcomes();
    measureOutcomes();
    buildEdges();
    buildSwitcher();

    var capRing = figureEl.querySelector('.const-ring--capabilities');
    var instRing = figureEl.querySelector('.const-ring--institutions');
    if (capRing) capRing.setAttribute('aria-label', t('capabilitiesAria'));
    if (instRing) instRing.setAttribute('aria-label', t('institutionsAria'));

    // Same animated sphere at every width, including mobile — see
    // AUTO_YAW_SPEED_MOBILE above for the ambient drift that replaces hover
    // on touch devices.
    initSphereEngine();

    window.addEventListener('human-rounds:language', refreshLanguageDependentText);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
