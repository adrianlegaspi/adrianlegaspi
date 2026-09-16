---
title: DepGuard
role: Author
label: Personal Project
summary: A tool for searching and investigating CVEs and dependency security information.
---

## Context

DepGuard is a personal project for searching and investigating CVEs and dependency
security data. It supports the lookup you need when a scanner flags a package and you
need to know whether it actually matters to you.

## The problem

Vulnerability data is public but awkward. Advisories, package registries and CVE records
live in different shapes. Answering whether a vulnerability affects a dependency at a
specific version requires joining all three.

## What I did

- Built the search and investigation workflow front to back.
- Normalised advisory and package data from multiple public sources into one queryable model.
- Designed the interface around the investigation path rather than a dashboard of counts.

## Technical highlights

The interesting part is ingestion: sources disagree about version ranges and identifiers,
so the model keeps the raw record alongside the normalised one and treats every claim as
sourced. Search runs over the normalised layer; provenance stays visible in the result.

## Outcome

Live at depguard-io.vercel.app. Covers eight package ecosystems including npm, PyPI, Go
and Maven over OSV and GHSA advisory data. Still in active development. Source is
available on GitHub.
