---
title: FixedAI
role: Founder / Engineer
label: En vivo, sin soporte
summary: Una app móvil que convierte una foto y un prompt en instrucciones de reparación paso a paso para objetos cotidianos.
placeholder: true
---

## Contexto

FixedAI es una app en React Native para iOS y Android. A partir de una foto de un objeto
roto y un prompt que lo describe —una silla, un control de videojuegos, un celular, lo que
sea— genera instrucciones de reparación paso a paso.

## El problema

Quienes reparaban objetos cotidianos tenían que resolver los pasos por su cuenta o buscar
entre tutoriales genéricos en línea. La pregunta de ingeniería era si unas instrucciones de
reparación generadas por IA, ancladas a una foto real del objeto, podían ser lo bastante
confiables para seguirse directamente.

## Lo que hice

- Diseñé y construí la app completa, en solitario: onboarding, el flujo de reparación por
  foto y prompt, y el manejo de errores.
- Construí el cliente en React Native (Expo) y una API en Fastify/TypeScript detrás, con
  Supabase para autenticación y datos, y Gemini para el paso de imagen y prompt a
  instrucciones.
- Publiqué la versión de Android en la Play Store y llevé su proceso de lanzamiento.

## Aspectos técnicos

React Native y TypeScript en el cliente, una API en Fastify sobre Supabase, y llamadas a
Gemini limitadas a operaciones tipadas y validadas antes de usarse, en vez de generación
libre.

## Resultado

Publicada en la Play Store, pero sin soporte desde principios de 2026, así que no se
garantiza su funcionamiento actual. El código de la app sigue en el repositorio.

## Enlaces

El listado en la Play Store está enlazado abajo.
