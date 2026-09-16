---
title: expo-play-games-services
role: Autor
label: Paquete de código abierto
summary: Módulo nativo de Expo para integrar Google Play Games Services en apps Android con JavaScript y TypeScript.
---

## Contexto

Construido en 2026 como módulo público de Expo para juegos Android que necesitan Google
Play Games Services sin mantener una integración nativa separada.

## El problema

Las apps Expo necesitan código nativo Android y configuración para conectarse con Play
Games Services. Ese trabajo debía estar disponible en un paquete enfocado con una API
TypeScript directa.

## Lo que hice

- Construí APIs para inicio de sesión, identidad de jugador y logros.
- Agregué partidas guardadas para almacenar y cargar datos de texto.
- Agregué persistencia local y acceso a la fecha de instalación original.
- Creé el complemento de configuración de Expo para el ID de Play Games.

## Aspectos técnicos

El paquete combina un módulo Expo y una implementación Android en Kotlin con una API
TypeScript. Solo funciona en Android y entrega valores alternativos seguros en otras plataformas.

## Resultado

Publicado como paquete npm con licencia MIT y código disponible en GitHub. Es compatible con
Expo SDK 52 o posterior y requiere un proyecto de Google Play Console con Play Games Services activado.
