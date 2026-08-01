# Human Rounds

**Let AI take the screen work. Keep care human.**

Human Rounds is an AI-native, open-source layer for the work around care. It automates access, referrals, scheduling and clinical preparation so patients and care teams can talk to each other again.

[Public project site](https://humanrounds.org) · [Demo](https://demo.humanrounds.org)

## The reference installation

Human Rounds starts from one working implementation: **Pinamar Turnos**, a public-health access layer for a municipal hospital and its primary-care network.

The reference covers:

- service discovery across the hospital and community health centres;
- appointments and walk-in guidance that reflect how each service attends;
- referral-first requests with preparation guidance and professional review;
- patient accounts and follow-up;
- institutional administration of services, centres, schedules and requests;
- structured handoff through the authorised local health-record connector.

The authoritative clinical record remains the source of truth.

## What enters Human Rounds next

Earlier Sana work produced prototypes for additional AI-native capabilities. They are not presented as public product features. They will enter Human Rounds one at a time after technical, clinical and institutional review:

- voice-first intake that structures the patient's account;
- clinician summaries;
- evidence-backed differential suggestions for professional review;
- probability estimates only after local calibration;
- deterministic safety rules that a model cannot downgrade;
- identity and coverage automation through authorised regional connectors.

No model diagnoses, prescribes, discharges or changes care without a professional action.

## Universal core, local connectors

The reusable core covers access, scheduling, referrals, intake, coordination and clinician-reviewed support. Identity, consent, terminology, coverage and the authoritative record remain jurisdiction-specific.

Local teams may need to write adapter code for their systems. Pull requests for regional connectors and implementation guides are welcome.

## Grant and pilot partnership

We are looking for public-health institutions, universities, foundations and implementation partners that can host, evaluate or fund a real pilot.

Grant-funded public pilots can launch without a software licence fee. Funding supports implementation, local integration, training, independent validation and open documentation.

See the [funding roadmap](docs/roadmap.md) and [architecture overview](docs/architecture.md).

## Repository scope

This repository starts with the public roadmap, architecture, governance documents and website source. Reviewed application modules will be added progressively after privacy, security and licensing review. Private prototype history and patient-like fixtures are intentionally not mirrored here.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a connector, workflow module or clinical contribution. Clinical safety, local governance and privacy boundaries are part of the product.

## Licence

Apache License 2.0. See [LICENSE](LICENSE).
