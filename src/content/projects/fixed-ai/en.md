---
title: FixedAI
role: Founder / Engineer
label: Live, Unsupported
summary: A mobile app that turns a photo and a prompt into step-by-step repair instructions for everyday objects.
placeholder: true
---

## Context

FixedAI is a React Native app for iOS and Android. From a photo of a broken object and a
prompt describing it — a chair, a game controller, a phone, whatever it is — it generates
step-by-step repair instructions.

## The problem

People fixing everyday objects had to figure out repair steps themselves or dig through
unrelated tutorials online. The engineering question was whether AI-generated repair
instructions, grounded in an actual photo of the object, could be made reliable enough to
follow directly.

## What I did

- Designed and built the app end to end, alone: onboarding, the photo-and-prompt repair
  flow, and error paths.
- Built the React Native (Expo) client and a Fastify/TypeScript API behind it, with
  Supabase for auth and data and Gemini for the image-and-prompt-to-instructions step.
- Shipped the Android build to the Play Store and handled its release process.

## Technical highlights

React Native and TypeScript on the client, a Fastify API on Supabase, and Gemini calls
constrained to typed operations and validated before use rather than freeform generation.

## Outcome

Published on the Play Store, but it has had no support since early 2026, so current
functionality is not guaranteed. The app code is still in the repository.

## Links

The Play Store listing is linked below.
