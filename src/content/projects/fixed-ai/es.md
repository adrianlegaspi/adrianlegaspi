---
title: FixedAI
role: Founder / Engineer
label: Proyecto personal
summary: Una app móvil que convierte una foto y un prompt en instrucciones de reparación paso a paso para objetos cotidianos.
---

## Contexto

FixedAI es una app en React Native creada para iOS y Android. Solo Android se publicó en
Google Play. Genera instrucciones de reparación paso a paso a partir de una foto de un
objeto roto y un prompt que lo describe.

## El problema

Quienes reparaban objetos cotidianos tenían que resolver los pasos por su cuenta o buscar
entre tutoriales genéricos en línea. La pregunta de ingeniería era si unas instrucciones de
reparación generadas por IA, ancladas a una foto real del objeto, podían ser lo bastante
confiables para seguirse directamente.

## Lo que hice

- Diseñé y construí la app completa, en solitario: onboarding, el flujo de reparación por
  foto y prompt y el manejo de errores.
- Construí el cliente en React Native (Expo) y una API en Fastify/TypeScript detrás. Usa
  Supabase para autenticación y datos, además de Gemini para transformar imagen y prompt
  en instrucciones.
- Publiqué la versión de Android en la Play Store y llevé su proceso de lanzamiento.

## Aspectos técnicos

React Native y TypeScript corren en el cliente. Una API en Fastify usa Supabase y limita
las llamadas a Gemini a operaciones tipadas y validadas antes de usarse, en vez de
generación libre.

## Resultado

Se publicó en la Play Store y ya no aparece ahí, así que no hay enlace de instalación.
Quedó sin soporte a principios de 2026. El código de la app sigue en el repositorio.
