---
title: Automatización con IA
role: Senior Software Engineer
label: Especialización técnica
summary: Trabajo con LLMs en producción: RAG, orquestación de agentes, extracción estructurada y evaluación.
placeholder: true
---

## Contexto

Esto no es un solo producto. Reúne trabajo de integración de IA y automatización en una
plataforma interna de RH y un servicio de procesamiento de recetas porque los problemas
de ingeniería se repiten.

## El problema

El trabajo tuvo dos problemas recurrentes: fundamentar el comportamiento del modelo en
documentos heterogéneos y convertir contenido extenso en datos estructurados confiables.
Ambos necesitaron más que un prompt: importaron la ingesta, recuperación, herramientas,
integración de servicios y evaluación antes de publicar.

## Lo que hice

- Construí pipelines RAG con ingesta, fragmentación, embeddings y búsqueda vectorial en
  Chroma para recuperación semántica fundamentada.
- Desarrollé orquestación de agentes sobre MCP, conectando recuperación y herramientas
  estructuradas con llamadas a LLMs.
- Construí flujos de fine-tuning, evaluación LLM-as-a-judge y calificación de prompts
  antes de publicar.
- Usé Gemini desde un servicio en Python y FastAPI para extraer y reescribir recetas
  estructuradas a partir de artículos extensos.
- Conecté el procesamiento de IA con APIs REST, PostgreSQL y triggers de Firebase
  orientados a eventos.

## Aspectos técnicos

Para recuperación, los documentos pasan por ingesta, fragmentación y embeddings antes de
que Chroma entregue contexto fundamentado a los agentes. Para extracción, un servicio en
FastAPI publica un contrato OpenAPI mientras triggers de Firebase ejecutan procesamiento
en segundo plano. La evaluación y calificación de prompts crean un control concreto antes
de publicar cambios en el comportamiento del modelo.

## Resultado

Estos flujos se implementaron en una plataforma interna de RH y un backend de procesamiento
de recetas. No se publican detalles de implementaciones internas.
