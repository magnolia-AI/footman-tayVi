# Footmen Frenzy Web Engine & RTS Framework Implementation

## Summary
Develop a browser-based RTS using an Entity-Component-System (ECS) and HTML5 Canvas to recreate the 'Footmen Frenzy' mechanics. The project features high-performance unit management, a React-based HUD for hero stats/inventory, and persistence using Neon and Drizzle ORM.

## Approach
The core of the game will reside in a custom ECS engine built in TypeScript to handle hundreds of active units efficiently. The rendering will utilize an HTML5 Canvas driven by a requestAnimationFrame loop, while the UI layer (HUD, inventory, shop) will be built with React and Radix UI components for high accessibility and state management. Game state will be synchronized between the ECS simulation and the React UI via a custom context hook. Data persistence for player progression, match history, and hero unlocks will be managed through Drizzle ORM connecting to a Neon PostgreSQL database, leveraging the existing Neon Auth integration for user identification.

## Tasks

- [x] **1. Initialize Core ECS Framework in 'lib/game-engine'** <!-- id:tmahRW -->
  Create 'lib/game-engine/core.ts' with Entity, Component, and System base classes. Define initial components: Position, Velocity, Health, Faction, and Sprite.

- [x] **2. Implement HTML5 Canvas Renderer Component** <!-- id:vzzmwD -->
  Create 'components/game-canvas.tsx'. Set up the main loop using requestAnimationFrame and a 'RenderSystem' to draw entities from the ECS onto the canvas.

- [x] **3. Develop Footmen Spawner and Simple AI Systems** <!-- id:tXwt2F -->
  Create 'lib/game-engine/systems/spawner-system.ts' to auto-generate units and a 'UnitAISystem' for basic movement towards the map center.

- [ ] **4. Implement RTS Interaction & Input Handling** <!-- id:u5K6_j -->
  Create hooks for mouse events to handle hero selection and right-click movement. Implement basic collision detection and a movement system.

- [ ] **5. Define Hero Ability & Combat Logic** <!-- id:QAH3sl -->
  Create 'lib/game-engine/systems/combat-system.ts' for health reduction and XP logic. Implement a data-driven ability system for hero skills like 'Avalanche'.

- [ ] **6. Build React HUD and Inventory UI** <!-- id:l0SBcO -->
  Use Radix UI components to construct a bottom-bar HUD for Hero stats (Level, HP, Mana) and a 6-slot inventory. Sync with ECS via 'hooks/use-game-state.tsx'.

- [ ] **7. Create Item Shop and Gold Economy** <!-- id:hZkN-c -->
  Implement 'components/shop-dialog.tsx'. Add logic for gold generation from kills and purchasing items that grant component-based buffs (e.g., Immolation Aura).

- [ ] **8. Configure Database Schema for Persistence** <!-- id:Uagxlj -->
  Update 'lib/schema.ts' to include 'matches', 'player_stats', and 'hero_unlocks' tables referencing 'neonAuthUser'.

- [ ] **9. Implement Match Results and XP Persistence** <!-- id:CLPZAx -->
  Create server actions to save match outcomes and build 'app/match/[id]/page.tsx' to display game summaries.

- [ ] **10. Final Integration and Hero Selection Lobby** <!-- id:hXaPno -->
  Refactor 'app/page.tsx' to feature a Hero Selection screen (Draft/AR) before initializing the 'GameCanvas' for the match.

---
plan_id: 0cdw14MP
status: executing
created: 2026-02-07T17:02:21.112Z
