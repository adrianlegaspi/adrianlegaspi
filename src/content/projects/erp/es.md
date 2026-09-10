---
title: Plataforma ERP de RH / ATS
role: Tech Lead
label: Experiencia profesional
summary: Plataforma multi-tenant de recursos humanos y seguimiento de candidatos, desde cero hasta producción.
placeholder: true
---

## Contexto

Una plataforma empresarial interna para operaciones de recursos humanos y seguimiento de
candidatos. Fui responsable técnico del proyecto, desde la arquitectura inicial hasta la
operación en producción.

## El problema

Los datos de contratación y de RH vivían en hojas de cálculo y herramientas desconectadas.
Los reclutadores no podían ver el historial de un candidato en un solo lugar, y cada nueva
organización cliente significaba otra copia del mismo proceso. La plataforma debía atender
a varias organizaciones desde un solo despliegue sin filtrar datos entre ellas.

## Lo que hice

- Definí la arquitectura: modelo de datos multi-tenant, límites entre servicios, forma del despliegue.
- Construí el backend en Node.js y Express sobre PostgreSQL, con aislamiento por tenant en la capa de datos.
- Construí el front end en React y TypeScript que usan a diario reclutadores y personal de RH.
- Implementé la ingesta de CVs y el emparejamiento de candidatos asistido por IA.
- Lideré al equipo: dirección técnica, revisión de código y entrega en incrementos.

## Aspectos técnicos

La multi-tenencia es la decisión de la que se desprende todo lo demás. El alcance por
tenant vive en la capa de acceso a datos y no en cada endpoint, así un filtro olvidado
falla de forma evidente en lugar de filtrar datos en silencio. La ingesta de CVs
normaliza documentos desordenados en registros estructurados, que es lo que hace posible
el emparejamiento automático.

## Resultado

Entregada a producción y usada en flujos de contratación reales. No se publican cifras
específicas.

## Confidencialidad

Proyecto interno. Las capturas y los detalles propietarios de implementación no se
publican intencionalmente.
