---
title: Viasat
company: Viasat
role: Software Engineer
label: Experiencia profesional
summary: Plataforma interna centralizada de seguridad para más de 4,000 usuarios en una empresa global de comunicaciones satelitales.
---

## Contexto

Desde agosto de 2022 trabajo en una plataforma interna centralizada de Viasat que reúne
hallazgos de seguridad de distintos escáneres y fuentes de activos dentro de un modelo
conectado. Viasat opera infraestructura de comunicaciones satelitales a escala global. La
plataforma sirve a más de 4,000 usuarios internos, no a clientes externos.

## Lo que hice

- Diseñé y construí el dashboard en React y TypeScript como único ingeniero de frontend
  dentro de un equipo de 15 enfocado principalmente en backend.
- Diseñé y mantuve una ontología OWL que conecta productos, hallazgos de seguridad y los
  activos que los descubren.
- Evolucioné la taxonomía con stakeholders conforme llegaron nuevas fuentes y casos de uso.
- Integré fuentes de escáneres y activos mediante funciones Lambda en Python, eventos de
  S3 y webhooks entrantes.
- Entregué APIs REST versionadas de forma independiente detrás de API Gateway, con Redis
  en rutas de lectura frecuentes y logs y alarmas de CloudWatch para visibilidad operativa.

## Aspectos técnicos

La ontología mantiene productos, hallazgos y activos de descubrimiento consultables como
un solo modelo, no como silos separados por fuente. Los handlers orientados a eventos
integran datos de nuevas fuentes en ese modelo, mientras Redis atiende rutas de lectura
frecuentes. Los servicios corren en Docker y se publican mediante GitHub Actions en AWS.

## Resultado

La plataforma sirve a más de 4,000 usuarios internos. No se publican detalles propietarios
de implementación, nombres de sistemas ni arquitectura interna.

## Confidencialidad

Proyecto interno. Las capturas y los detalles propietarios de implementación no se
publican intencionalmente.
