---
title: HR / ATS ERP Platform
role: Tech Lead
label: Professional Experience
summary: Multi-tenant HR and applicant tracking platform taken from scratch to production.
placeholder: true
---

## Context

An internal enterprise platform covering HR operations and applicant tracking. I owned
it as tech lead, from the initial architecture through to production operation.

## The problem

Hiring and HR data lived in spreadsheets and disconnected tools. Recruiters could not see
a candidate's history in one place, and every new client organisation meant another copy
of the same process. The platform had to serve several organisations from one deployment
without leaking data between them.

## What I did

- Owned the architecture: multi-tenant data model, service boundaries, deployment shape.
- Built the backend in Node.js and Express on PostgreSQL, with tenant isolation enforced at the data layer.
- Built the React and TypeScript front end used daily by recruiters and HR staff.
- Implemented résumé ingestion and AI-assisted candidate matching against open roles.
- Led the team: technical direction, code review, breaking delivery into shippable slices.

## Technical highlights

Multi-tenancy is the decision everything else follows from. Tenant scoping lives in the
data access layer rather than in each endpoint, so a missing filter is a hard failure
instead of a silent leak. Résumé ingestion normalises messy documents into structured
candidate records, which is what makes automated matching possible at all.

## Outcome

Delivered to production and used for real hiring workflows. Specific figures are not
published.

## Confidentiality

This is an internal product. Screenshots, proprietary implementation details, internal
architecture and confidential data are intentionally not published.
