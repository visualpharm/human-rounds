# Architecture overview

Human Rounds is an AI-native operational layer around the authoritative health record.

```text
Patient and care team
  <-> Human Rounds listens, coordinates and prepares
  <-> authorised national or institutional record
```

## Design boundaries

- The existing clinical record remains the system of record.
- AI is part of the workflow, not a separate chatbot.
- A regional connector translates approved Human Rounds workflows into the authorised local system.
- The institution controls identity rules, consent, access, catalogues and operating policy.
- Deterministic safety rules cannot be downgraded by a probabilistic model.
- Clinical-model output remains advisory until a professional acts.
- Public materials and automated tests use fictional or synthetic data.

## Reference implementation

Pinamar Turnos is the first working implementation. It provides service discovery, appointment and walk-in guidance, referral-first requests, preparation guidance, patient follow-up and institutional administration for a municipal public-health network.

## Module direction

Reviewed modules will be added for:

- voice or text intake;
- clinician summaries and decision support;
- appointments, arrivals, queues and referrals;
- identity and coverage automation;
- regional and institutional connectors;
- measurement, audit and implementation guidance.

Earlier Sana prototypes are not exposed as public product features. Each module enters Human Rounds only after privacy, security, licensing, technical and clinical review.
