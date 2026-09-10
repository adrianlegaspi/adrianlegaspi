---
title: Cardom Quest
role: Desarrollador solo
label: Juego indie
summary: Un deck builder roguelike donde reclutas aliados, armas tu mazo y frenas a la horda de orcos.
placeholder: true
---

## Contexto

Cardom Quest es un deck builder roguelike para móvil, autopublicado y disponible en Google
Play. Un proyecto personal, hecho y lanzado en solitario.

## El problema

Los deck builders suelen ser un duelo: tus cartas contra un enemigo. Yo quería que el mazo
fuera un escuadrón — cartas que reclutan aliados que después pelean por su cuenta, así que
armar el mazo es también armar el grupo.

## Lo que hice

- Construí el juego en Phaser 3 y lo publiqué en Google Play.
- Diseñé el set de cartas alrededor de tres funciones —curar, potenciar y atacar— y el
  bucle de reclutamiento que convierte una carta en un aliado permanente.
- Escribí el generador procedural de mapas, para que la campaña de fantasía medieval siga
  en vez de terminar en un jefe final fijo.
- Mantuve el combate por turnos, para que cada pelea sea una decisión y no un reflejo.

## Aspectos técnicos

Los aliados reclutados actúan solos una vez en el campo, lo que sube la decisión
interesante un nivel: se trata de a quién llevas, no de qué tocas cada turno. Los mapas se
generan en cada partida, así que la curva de dificultad sale de la mezcla de encuentros y
no de niveles colocados a mano.

## Resultado

Disponible en Google Play. Gratis con anuncios, y no recoge datos de usuario.
