---
title: DepGuard
role: Author
label: Personal Project
summary: A tool for searching and investigating CVEs and dependency security information.
placeholder: true
---

## Context

DepGuard is a personal project for searching and investigating CVEs and dependency
security data — the kind of lookup you do when a scanner flags a package and you need to
know whether it actually matters to you.

## The problem

Vulnerability data is public but awkward. Advisories, package registries and CVE records
live in different shapes, and the useful question — does this affect my dependency, at my
version? — needs all three joined together.

## What I did

- Built the search and investigation workflow front to back.
- Normalised advisory and package data from multiple public sources into one queryable model.
- Designed the interface around the investigation path rather than a dashboard of counts.

## Technical highlights

The interesting part is ingestion: sources disagree about version ranges and identifiers,
so the model keeps the raw record alongside the normalised one and treats every claim as
sourced. Search runs over the normalised layer; provenance stays visible in the result.

## Outcome

In active development. Demo and source links are added below as they become public.
