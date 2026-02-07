# Footmen Frenzy Web - ECS Engine & RTS Framework Implementation

## Summary
Develop a browser-based RTS engine using Next.js and HTML5 Canvas that recreates the Warcraft III 'Footmen Frenzy' mechanics. The project will feature an Entity-Component-System (ECS) for high-performance unit management, a React-based HUD for hero progression, and Neon/Drizzle persistence.

## Approach
The implementation will utilize a high-performance HTML5 Canvas for the game world and React for the UI/HUD. At the core, we will implement a lightweight ECS (Entity-Component-System) in TypeScript to manage hundreds of active units (Footmen) without performance bottlenecks typical of DOM-heavy rendering. The rendering loop will use requestAnimationFrame to drive the ECS systems. Game state will be managed in a React Context wrapper, providing synchronization between the Canvas simulation and the HUD. Player data (levels, gold, match history) will be persisted using Drizzle ORM to a Neon PostgreSQL database, leveraging the existing @neondatabase/auth integration for user identification.

## Tasks

- [ ] **1. Initialize Core ECS Framework in 'lib/game-engine'** <!-- id:17ksdt -->
  Create 'lib/game-engine/core.ts' with Entity, Component, and System base classes. Define initial components: Position, Velocity, Health, Faction, and Sprite.

- [ ] **2. Implement HTML5 Canvas Renderer Component** <!-- id:EFW3_M -->
  Create 'components/game-canvas.tsx'. Set up the main game loop using requestAnimationFrame. Implement a 'RenderSystem' that draws entities from the ECS onto the canvas based on their Position and Sprite components.

- [ ] **3. Develop Footmen Spawner and Simple AI Systems** <!-- id:0x6nco -->
  Create 'lib/game-engine/systems/spawner-system.ts' to auto-generate Footmen at base coordinates. Implement a 'UnitAISystem' that directs idle Footmen toward the map center or enemy hero positions.

- [ ] **4. Implement RTS Interaction & Input Handling** <!-- id:ASsaN8 -->
  Create hooks for mouse events to handle hero selection and right-click movement commands. Implement basic collision detection and a movement system that updates Velocity based on navigation targets.

- [ ] **5. Add Hero Ability & Combat Logic** <!-- id:AjtnvM -->
  Define a 'CombatSystem' to handle health reduction and experience gain. Implement a data-driven ability system (e.g., 'Avalanche' AOE) in 'lib/game-engine/abilities.ts'.

- [ ] **6. Build React HUD and Inventory UI** <!-- id:Djar9z -->
  Use Radix UI (components/ui) to construct a bottom-bar HUD. Integrate Hero stats (Level, HP, Mana) and a 6-slot inventory grid. Connect this UI to the ECS state via a React Context ('hooks/use-game-state.tsx').

- [ ] **7. Create Item Shop and Gold Economy** <!-- id:eTDu3M -->
  Implement 'components/shop-dialog.tsx' using the Dialog component. Create logic for gold generation from kills and purchasing items like the 'Immolation Cloak' which adds an 'Aura' component to the Hero.

- [ ] **8. Configure Database Schema for Persistence** <!-- id:7CjCAo -->
  Update 'lib/schema.ts' to include 'matches', 'player_stats', and 'hero_unlocks' tables. Reference 'neonAuthUser' for player-specific data.

- [ ] **9. Implement Match Results and XP Persistence** <!-- id:E-K9Df -->
  Create a server action to save match outcomes. Build 'app/match/[id]/page.tsx' to display game summaries and updated player rankings using Drizzle.

- [ ] **10. Final Integration and Hero Selection Screen** <!-- id:Qa1kRk -->
  Refactor 'app/page.tsx' to feature a Hero Selection lobby (AR/Draft) before launching the 'GameCanvas' component for the match.

---
plan_id: dIC-Gi6H
status: draft
created: 2026-02-07T16:55:24.452Z

