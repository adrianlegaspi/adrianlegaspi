---
title: Cardom Quest
role: Solo developer
label: Indie Game
summary: A roguelike deck builder where you recruit allies, build a deck and push back the Orcish horde.
placeholder: true
---

## Context

Cardom Quest is a self-published mobile roguelike deck builder, live on Google Play. A
personal project, built and shipped solo.

## The problem

Deck builders are usually a duel: your cards against one enemy. I wanted the deck to be a
squad instead — cards that recruit allies who then fight on their own, so building the
deck is also building a party.

## What I did

- Built the game in Phaser 3 and shipped it to Google Play.
- Designed the card set around three jobs — heal, buff and attack — and the recruitment
  loop that turns a card into a persistent ally.
- Wrote the procedural map generator, so the medieval-fantasy campaign keeps going instead
  of ending at a fixed final boss.
- Kept combat turn-based, so every fight is a decision rather than a reaction.

## Technical highlights

Recruited allies act on their own once they are on the field, which moves the interesting
choice up a level: it is about who you bring, not what you tap each turn. Maps are
generated per run, so the difficulty curve comes out of the encounter mix rather than
hand-placed levels.

## Outcome

Live on Google Play. Free with ads, and it collects no user data.
