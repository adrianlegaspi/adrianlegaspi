---
title: FixedAI
role: Founder / Engineer
label: Live, Unsupported
summary: A mobile app that turns a photo and a prompt into step-by-step repair instructions for everyday objects.
---

## Context

FixedAI is a React Native app built for iOS and Android. Only the Android version was
published, on Google Play. It generates step-by-step repair instructions from a photo of
a broken object and a prompt describing it.

## The problem

People fixing everyday objects had to figure out repair steps themselves or dig through
unrelated tutorials online. The engineering question was whether AI-generated repair
instructions, grounded in an actual photo of the object, could be made reliable enough to
follow directly.

## What I did

- Designed and built the app end to end, alone: onboarding, the photo-and-prompt repair
  flow and error paths.
- Built the React Native (Expo) client and a Fastify/TypeScript API behind it. It uses
  Supabase for auth and data plus Gemini for the image-and-prompt-to-instructions step.
- Shipped the Android build to the Play Store and handled its release process.

## Technical highlights

React Native and TypeScript run on the client. A Fastify API uses Supabase and constrains
Gemini calls to typed operations validated before use rather than freeform generation.

## Outcome

Published on the Play Store, but it has had no support since early 2026, so current
functionality is not guaranteed. The app code is still in the repository.
