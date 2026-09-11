---
title: AI Automation
role: Senior Software Engineer
label: Technical Specialisation
summary: Production LLM work across RAG retrieval, agent orchestration, structured extraction and evaluation.
placeholder: true
---

## Context

This is not one product. It collects AI integration and automation work across an internal
HR platform and a recipe-processing service because the underlying engineering problems
repeat.

## The problem

The work had two recurring problems: grounding model behavior in heterogeneous documents,
and turning long-form content into dependable structured data. Both required more than a
prompt — ingestion, retrieval, tools, service integration and release evaluation mattered.

## What I did

- Built RAG ingestion pipelines covering document chunking, embeddings and Chroma vector
  search for grounded semantic retrieval.
- Developed agent orchestration over MCP, wiring retrieval and structured tools into LLM calls.
- Built model fine-tuning workflows, plus LLM-as-a-judge evaluation and prompt grading
  before release.
- Used Gemini from a Python and FastAPI service to extract and rewrite structured recipes
  from long-form blog posts.
- Connected AI processing to REST APIs, PostgreSQL and event-driven Firebase triggers.

## Technical highlights

For retrieval, documents move through ingestion, chunking and embeddings before Chroma
search supplies grounded context to agents. For extraction, a FastAPI service publishes
an OpenAPI contract while Firebase triggers run background processing. Evaluation and
prompt grading create a concrete release gate for model behavior.

## Outcome

These workflows were implemented across an internal HR platform and a recipe-processing
backend. Details of internal implementations are not published.
