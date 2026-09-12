---
title: DepGuard
role: Autor
label: Proyecto personal
summary: Herramienta para buscar e investigar CVEs e información de seguridad de dependencias.
---

## Contexto

DepGuard es un proyecto personal para buscar e investigar CVEs y datos de seguridad de
dependencias: el tipo de consulta que haces cuando un escáner marca un paquete y necesitas
saber si de verdad te afecta.

## El problema

Los datos de vulnerabilidades son públicos pero incómodos. Los avisos, los registros de
paquetes y los registros CVE viven en formatos distintos, y la pregunta útil —¿esto afecta
a mi dependencia, en mi versión?— necesita unir los tres.

## Lo que hice

- Construí el flujo de búsqueda e investigación de punta a punta.
- Normalicé datos de avisos y paquetes de varias fuentes públicas en un modelo consultable.
- Diseñé la interfaz alrededor del camino de investigación, no de un tablero de conteos.

## Aspectos técnicos

Lo interesante es la ingesta: las fuentes no coinciden en rangos de versiones ni en
identificadores, así que el modelo conserva el registro original junto al normalizado y
trata cada afirmación como algo con fuente. La búsqueda corre sobre la capa normalizada y
la procedencia queda visible en el resultado.

## Resultado

Disponible en depguard-io.vercel.app. Cubre ocho ecosistemas de paquetes, entre ellos npm,
PyPI, Go y Maven, sobre datos de avisos de OSV y GHSA. Sigue en desarrollo activo; el enlace
al código se agrega abajo cuando el repositorio sea público.
