---
title: AI Automation
role: Senior Software Engineer
label: Technical Specialisation
summary: Production LLM integration and automation work — tool use, MCP servers and AI-assisted workflows.
placeholder: true
---

## Context

This is not one product. It is the AI integration and automation work that runs through
several of the projects in this city, collected in one place because the engineering
problems repeat.

## The problem

Most "AI features" fail for unglamorous reasons: the model gets unstructured context, its
output is not validated, and there is no path for a human to correct it. Making an LLM
useful in production is mostly a data and interface problem.

## What I did

- Integrated LLM APIs into existing product surfaces with structured, validated tool calls.
- Built MCP servers so internal tooling could be driven by AI agents through a typed contract.
- Automated document-oriented workflows — extraction, normalisation and classification.
- Kept a human in the loop where correctness mattered more than throughput.

## Technical highlights

Structured tool use over free-text prompting: the model chooses from typed operations and
the schema rejects malformed output before it reaches the database. Prompts and tool
definitions are treated as code — reviewed, versioned and tested — rather than
configuration nobody owns.

## Outcome

AI-assisted features shipped inside real products rather than demos. Details of internal
implementations are not published.
