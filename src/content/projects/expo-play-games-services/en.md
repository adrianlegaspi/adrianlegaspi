---
title: expo-play-games-services
role: Author
label: Open-source package
summary: An Android Expo native module for integrating Google Play Games Services into JavaScript and TypeScript apps.
---

## Context

Built in 2026 as a public Expo module for Android games that need Google Play Games
Services without maintaining a separate native integration.

## The problem

Expo apps need native Android code and configuration to connect with Play Games Services.
That work should be available through a focused package with a straightforward TypeScript API.

## What I did

- Built sign-in, player identity and achievement APIs.
- Added Saved Games snapshots for saving and loading string data.
- Added local persistence and original install-time access.
- Created the Expo config plugin for the Play Games app ID.

## Technical highlights

The package combines an Expo module and Kotlin Android implementation with a TypeScript API.
It is Android only and returns safe fallback values on other platforms.

## Outcome

Published as an MIT-licensed npm package with source available on GitHub. It supports Expo
SDK 52 or later and requires a Google Play Console project with Play Games Services enabled.
