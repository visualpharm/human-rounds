# Architecture overview

Sana is an operational layer around the authoritative health record.

```text
Patient
  -> registration and intake
  -> clinic operations
  -> clinician review
  -> authorised national or institutional record
```

## Design boundaries

- The existing clinical record remains the system of record.
- A country connector translates approved Sana workflows into the authorised local system.
- The institution controls identity rules, consent, access, catalogues and operating policy.
- Deterministic safety rules cannot be downgraded by a probabilistic model.
- Clinical-model output remains advisory until a professional acts.
- Public demos and automated tests use fictional or synthetic data.

## Module direction

The project is separating the prototypes into reusable modules for:

- identity and registration;
- voice or text intake;
- appointments, arrivals, queues and referrals;
- clinician-reviewed summaries and decision support;
- country and institutional connectors;
- measurement, audit and implementation guidance.

Application modules will be published only after a privacy, security, licensing and fixture review.
