# Footmen Frenzy Web Engine Implementation

## Summary
Develop a browser-based RTS engine using Next.js and HTML5 Canvas with a lightweight Entity-Component-System (ECS) to manage hundreds of units, featuring hero progression, automatic unit spawning, and persistent player stats via Neon/Drizzle.

## Approach
The core of the game will be a custom TypeScript-based ECS framework located in 'lib/game-engine'. This ensures high performance for many units by decoupling data (Components) from logic (Systems). Rendering will be handled by a dedicated 'RenderSystem' drawing to an HTML5 Canvas component, optimized with requestAnimationFrame. The player interface (HUD, Inventory) will be built with React and Radix UI components, synchronized to the ECS state through a custom Game Provider/Context. Persistence for match history and hero progress will be implemented using Drizzle ORM to interface with the existing Neon PostgreSQL database.

## Tasks

- [ ] **1. Initialize Core ECS Framework in 'lib/game-engine'** <!-- id:MAKwjv -->
  Create 'lib/game-engine/world.ts' to manage entities and systems. Define 'Component' types for Position, Velocity, Health, and Faction in 'lib/game-engine/components.ts'.

- [ ] **2. Implement HTML5 Canvas Renderer Component** <!-- id:tyFSpC -->
  Create 'components/game-canvas.tsx' using a canvas ref. Implement a RenderSystem that iterates through entities with Sprite and Position components to draw them at 60fps.

- [ ] **3. Build Unit AI and Auto-Spawner Systems** <!-- id:Z5stQ1 -->
  Create 'lib/game-engine/systems/spawning-system.ts' to spawn Footmen entities for each team every 30 seconds. Implementation a 'MovementSystem' using basic vector math for unit navigation.

- [ ] **4. Develop Hero Input and Selection Logic** <!-- id:jX-Vf7 -->
  Implement click-to-select and right-click-to-move using a 'SelectionSystem'. Connect mouse coordinates on the canvas back to the ECS world coordinates.

- [ ] **5. Establish Hero Stats and Ability System** <!-- id:1DnLaS -->
  Define Hero components (XP, Mana, Level). Create 'lib/game-engine/abilities/registry.ts' to handle skills like 'Avalanche' or 'Healing Wave' with cooldown management.

- [ ] **6. Create Game State Context and React HUD** <!-- id:DPnMrK -->
  Develop 'hooks/use-game-state.tsx' to bridge ECS data into React. Build a bottom-bar HUD in 'components/game-hud.tsx' showing Hero HP, Mana, and skill icons using Radix UI.

- [ ] **7. Implement Inventory and Item Shop** <!-- id:0_6KrH -->
  Create 'components/item-shop.tsx' using a Dialog. Support purchasing items that add components (e.g., 'ImmolationAura') or provide instant buffs (Potions).

- [ ] **8. Update Database Schema for Player Persistence** <!-- id:o5VJfE -->
  Add 'matches', 'player_progression', and 'hero_stats' tables to 'lib/schema.ts' and link them to 'neonAuthUser' for persistent rankings.

- [ ] **9. Build Match Results and Hero Selection Lobby** <!-- id:IAapru -->
  Create 'app/lobby/page.tsx' for hero picking (AR/Draft) and 'app/match/[id]/page.tsx' to display post-game stats using Drizzle queries.

- [ ] **10. Integrate Game Loop with App Entry Point** <!-- id:BpUVew -->
  Refactor 'app/page.tsx' to mount the GameCanvas inside a layout that manages the active game session and player authentication state.

---
plan_id: VCY1AfKH
status: draft
created: 2026-02-07T16:59:47.914Z

