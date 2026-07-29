# Contributing to Sana

Sana welcomes contributions from public-health institutions, clinicians, implementers, researchers, designers and software teams.

## Good first contributions

- document the public-health workflow or interoperability standard in your jurisdiction;
- improve accessibility, translation or low-bandwidth behaviour in the public website;
- propose a country connector with an explicit system-of-record boundary;
- add testable operational rules that do not require a clinical model;
- improve the evaluation plan, threat model or implementation guidance.

## Clinical contributions

Clinical decision-support work must:

- keep a licensed professional responsible for the decision;
- identify the target population, setting and intended user;
- separate deterministic safety rules from model output;
- document evidence sources, limitations and material exclusions;
- include a plan for local validation and calibration;
- avoid patient-identifiable data in issues, pull requests and fixtures.

Clinical-model output is advisory. It must not diagnose, prescribe, discharge or alter care without professional action.

## Pull requests

Keep changes focused. Explain the public-health problem, the authorised data source, the affected users, the safety boundary and how the change was tested.

By contributing, you agree that your contribution is licensed under the Apache License 2.0.
