# Sana

**Open infrastructure for the work around public healthcare.**

Sana connects patient registration, intake, referrals, queues, appointments and clinician-reviewed decision support to the health systems public institutions already use. It is designed to improve the operational layer around care without replacing the authoritative clinical record.

[Public project site](https://sana.brieflysites.com) · [Live demo](https://sana.brieflysites.com/demo)

## Current status

Sana is an early open-source project built from working prototypes in Argentina.

Working prototypes include:

- identity capture from an Argentine identity card, typed data or a photo;
- mobile self-registration with reception confirmation;
- voice-first patient intake;
- queues, referrals and appointment workflows;
- deterministic red-flag rules that an artificial-intelligence model cannot downgrade;
- a local reference handoff to Argentina's Integrated Health Record.

Clinical models in development include:

- clinician summaries;
- evidence-backed differential diagnosis for professional review;
- probability estimates after local calibration;
- suggested examinations constrained to approved local catalogues;
- specialty expansion beyond the current cardiology prototype.

No model diagnoses, prescribes, discharges or changes care without a professional action.

## Why this is useful for public health

Public providers often have a clinical record but still coordinate registration, arrivals, referrals, appointments and follow-up through fragmented processes. Sana focuses on that gap.

- **Local control:** deploy locally or in a chosen cloud.
- **Interoperability:** connect to the authorised national or institutional record.
- **Resilience:** support shared devices, intermittent connectivity and low-bandwidth settings.
- **Open implementation:** publish connectors, operating guidance and evaluation findings.

## Grant and pilot partnership

We are looking for public-health institutions, universities, foundations and implementation partners that can host, evaluate or fund a real pilot.

Grant-funded pilots can launch without a software licence fee for participating public providers. Funding supports implementation, local integration, training, independent validation and open documentation.

See the [funding roadmap](docs/roadmap.md) and [architecture overview](docs/architecture.md).

## Repository scope

This repository starts with the public roadmap, architecture, governance documents and website source. Reviewed application modules will be added progressively after privacy, security and licensing review. The private prototype history and patient-like fixtures are intentionally not mirrored here.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a connector, workflow module or clinical-model contribution. Clinical safety, local governance and privacy boundaries are part of the product, not later paperwork.

## Licence

Apache License 2.0. See [LICENSE](LICENSE).
