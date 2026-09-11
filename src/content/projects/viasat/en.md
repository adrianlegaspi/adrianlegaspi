---
title: Viasat
company: Viasat
role: Software Engineer
label: Professional Experience
summary: A centralized internal security platform serving more than 4,000 users at a global satellite communications company.
placeholder: true
---

## Context

Viasat operates satellite communications infrastructure at global scale. I work on a
centralized internal platform that brings security findings from different scanners and
asset sources into one connected model. The platform serves more than 4,000 internal
users rather than external customers.

## What I did

- Architected and built the React and TypeScript dashboard as the sole frontend engineer
  in a backend-heavy team of 15.
- Designed and maintained an OWL ontology linking products, security findings and the
  assets that discover them.
- Evolved the taxonomy with stakeholders as new data sources and use cases arrived.
- Integrated scanner and asset sources through Python Lambda handlers, S3 events and
  inbound webhooks.
- Delivered independently versioned REST APIs behind API Gateway, with Redis on hot read
  paths and CloudWatch logs and alarms for operational visibility.

## Technical highlights

The ontology keeps products, findings and discovery assets queryable as one model instead
of separate source-specific silos. Event-driven handlers bring new source data into that
model, while Redis supports hot read paths. Services run in Docker, with releases shipped
through GitHub Actions across the AWS environment.

## Outcome

The platform serves more than 4,000 internal users. Proprietary implementation details,
system names and internal architecture are not published.

## Confidentiality

This is an internal product. Screenshots, proprietary implementation details, internal
architecture and confidential data are intentionally not published.
