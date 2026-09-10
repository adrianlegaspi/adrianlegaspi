---
title: Automatización con IA
role: Senior Software Engineer
label: Especialización técnica
summary: Integración de LLMs en producción y automatización — uso de herramientas, servidores MCP y flujos asistidos por IA.
placeholder: true
---

## Contexto

Esto no es un solo producto. Es el trabajo de integración de IA y automatización que
atraviesa varios de los proyectos de esta ciudad, reunido en un mismo lugar porque los
problemas de ingeniería se repiten.

## El problema

La mayoría de las "funciones con IA" fallan por razones poco glamorosas: el modelo recibe
contexto sin estructura, su salida no se valida y no hay forma de que una persona corrija
el resultado. Hacer útil un LLM en producción es sobre todo un problema de datos y de
interfaz.

## Lo que hice

- Integré APIs de LLM en productos existentes con llamadas a herramientas tipadas y validadas.
- Construí servidores MCP para que herramientas internas pudieran ser operadas por agentes mediante un contrato tipado.
- Automaticé flujos orientados a documentos: extracción, normalización y clasificación.
- Mantuve a una persona en el circuito donde la exactitud importaba más que el volumen.

## Aspectos técnicos

Uso estructurado de herramientas en lugar de prompts de texto libre: el modelo elige
entre operaciones tipadas y el esquema rechaza salidas inválidas antes de que lleguen a la
base de datos. Los prompts y las definiciones de herramientas se tratan como código
—revisados, versionados y probados— y no como configuración sin dueño.

## Resultado

Funcionalidades asistidas por IA entregadas dentro de productos reales, no demos. No se
publican detalles de implementaciones internas.
