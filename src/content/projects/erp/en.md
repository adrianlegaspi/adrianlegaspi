---
title: HR / ATS ERP Platform
role: Tech Lead
label: Professional Experience
summary: An agentic HR platform managing 30 employees and supporting analysis of prospective roles and candidates.
placeholder: true
---

## Context

An internal HR platform for Jointech AI that manages 30 employees and supports analysis
of prospective roles and candidates. I led its architecture and implementation with a
team of five engineers.

## The problem

HR and candidate knowledge arrives as heterogeneous documents rather than clean database
records. The platform needed to ingest that material, retrieve relevant evidence and give
its AI workflows grounded context for evaluating roles and candidates.

## What I did

- Led five engineers across technical architecture and implementation.
- Built the Node.js, Express and TypeScript REST API and its underlying data model.
- Containerized local and deployed environments with Docker.
- Implemented document ingestion, chunking, embeddings and Chroma vector search for
  grounded semantic retrieval across HR and candidate documents.
- Built agent orchestration and prompt-engineering workflows over MCP, connecting
  retrieval and structured tools to LLM calls.
- Developed model fine-tuning workflows and an LLM-as-a-judge evaluation step with prompt
  grading before release.
- Built the React client on top of those services.

## Technical highlights

The retrieval pipeline turns heterogeneous documents into chunks and embeddings stored
in Chroma, then supplies relevant evidence to agent workflows through structured tools.
Evaluation and prompt grading provide a release check for LLM behavior rather than
treating prompt changes as unreviewed configuration.

## Outcome

Used internally in production to manage 30 employees and support hiring analysis.

## Confidentiality

This is an internal product. Screenshots, proprietary implementation details, internal
architecture and confidential data are intentionally not published.
