# White Box Cyclopedia — Foundry VTT

Unofficial, early system framework for Foundry VTT **v14**. Version 0.1.0.

## Install for development
Copy this repository into `Data/systems/wbc` (the folder containing system.json must be named wbc), restart Foundry, and create a world using White Box Cyclopedia. No build step or npm installation is required. This version is not yet a manifest-installable release.

## Included
- Character and NPC / Monster actor types, using ApplicationV2 sheets and typed data models.
- Six ability scores and standard -1/0/+1 modifiers; single saving throw target.
- Editable level, XP, HP, descending AC (with ascending display), attack bonus, movement, coins, languages, and notes.
- NPC hit dice, morale, treasure, and special notes.
- Weapon, armor, equipment, spell, feature, class, and ancestry items; core directory drag/drop support.
- Item creation, editing and confirmed deletion on actors; weapon attack/damage rolls; saving throw rolls.
- Spell tradition, level, range, duration, prepared and expended copies; separate manual daily slot counters.
- Quantity/weight inventory total, excluding coins; equipment state and source references.

## Current boundaries
AC is manually entered: equipping armor does not recalculate it. Class/ancestry items are records and do not change statistics. Saving throw bonuses are applied by the referee. Weapon attacks use ascending AC and do not automatically compare targets or apply damage. Damage chat notes minimum 1; the referee applies it. Spell Use expends one prepared copy without publishing its description or changing slot counters. No rest/reset automation, effects automation, progression tables, compendiums, or full combat workflow yet. Initiative is an individual 1d6 placeholder; group initiative remains a referee workflow. Portraits can be changed through the document's standard artwork tools.

## Validation
Run `npm test`; check modules with `node --check scripts/wbc.mjs` and `node --check scripts/models.mjs`. Foundry itself is required to verify runtime UI and document persistence; automated rule tests are not a Foundry runtime test.

### Foundry smoke test
1. Create one Character and one NPC; reopen sheets and check saved HP, ability scores, AC, notes, and NPC fields.
2. Create each item type in the Items directory, edit its fields, reopen, and drag it onto an actor.
3. Add, edit, and delete actor items. Confirm read-only observers cannot change documents.
4. Roll a weapon attack and damage, and roll a save; verify speaker and formula.
5. Prepare two spell copies; use twice, then confirm a third use is blocked. Check actor copies do not change the world item.
6. Set HP as a token resource and verify token/actor changes synchronize.

## Sources and content
Architecture references: https://foundryvtt.com/api/v14/ . Rules reference: White Box Cyclopedia (2023), chapters 1, 3, 4, 5 and 6. The supplied Quarterlies and Dungeon Adventures are future expansion sources; they are not implemented in this foundation. No book PDFs, artwork, spell descriptions or class text are included. This repository does not declare a redistribution license for White Box Cyclopedia content. Content compendiums and their licensing need a separate pass before publication.

## Next milestones
1. Foundry runtime validation and sheet layout iteration.
2. Class progression, armor/shield calculation and configurable optional rules.
3. Spell preparation/rest workflow and class abilities, including banishing undead.
4. Licensed equipment, class, ancestry, spell and monster compendiums.
5. Tagged release ZIP and installation manifest.
