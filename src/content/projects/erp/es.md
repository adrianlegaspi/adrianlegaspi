---
title: Plataforma ERP de RH / ATS
role: Tech Lead
label: Experiencia profesional
summary: Plataforma agéntica de RH que administra 30 empleados y apoya el análisis de vacantes y candidatos.
placeholder: true
---

## Contexto

Una plataforma interna de RH para Jointech AI que administra 30 empleados y apoya el
análisis de vacantes y candidatos. Lideré su arquitectura e implementación con un equipo
de cinco ingenieros.

## El problema

El conocimiento de RH y candidatos llega como documentos heterogéneos, no como registros
limpios de base de datos. La plataforma necesitaba ingerir ese material, recuperar la
evidencia relevante y dar contexto fundamentado a sus flujos de IA para evaluar vacantes
y candidatos.

## Lo que hice

- Lideré a cinco ingenieros en la arquitectura técnica y la implementación.
- Construí la API REST en Node.js, Express y TypeScript, junto con su modelo de datos.
- Configuré con Docker los entornos locales y desplegados.
- Implementé ingesta de documentos, fragmentación, embeddings y búsqueda vectorial con
  Chroma para recuperación semántica fundamentada en documentos de RH y candidatos.
- Construí orquestación de agentes y flujos de prompt engineering sobre MCP, conectando
  recuperación y herramientas estructuradas con llamadas a LLMs.
- Desarrollé flujos de fine-tuning y un paso de evaluación LLM-as-a-judge con calificación
  de prompts antes de cada publicación.
- Construí el cliente en React sobre esos servicios.

## Aspectos técnicos

El pipeline de recuperación convierte documentos heterogéneos en fragmentos y embeddings
almacenados en Chroma, y entrega evidencia relevante a los flujos agénticos mediante
herramientas estructuradas. La evaluación y calificación de prompts crean un control de
publicación para el comportamiento del LLM, en lugar de tratar cambios de prompts como
configuración sin revisar.

## Resultado

Usada internamente en producción para administrar 30 empleados y apoyar el análisis de
contratación.

## Confidencialidad

Proyecto interno. Las capturas y los detalles propietarios de implementación no se
publican intencionalmente.
