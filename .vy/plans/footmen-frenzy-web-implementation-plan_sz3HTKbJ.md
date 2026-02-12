# Footmen Frenzy Web Implementation Plan

## Summary
Build a browser-based RTS engine using Next.js and HTML5 Canvas that replicates the Warcraft III 'Footmen Frenzy' experience. The system will use an Entity-Component-System (ECS) architecture for high-performance unit management and React for the game HUD and persistence features.

## Approach
The core of the game will reside in a custom ECS engine implemented in TypeScript, ensuring high-performance rendering of hundreds of units on an HTML5 Canvas. React will handle the UI layer (HUD, Inventory, Hero Selection) and global state management through context. Data persistence for player progression and match history will be handled via Drizzle ORM and Neon PostgreSQL, leveraging the existing @neondatabase/auth setup.

## Tasks

- [ ] **1. Initialize ECS Core Framework** <!-- id:QxHdly -->
  Create 'lib/game-engine/core.ts' to define the base World, Entity, Component, and System classes. Implement the main game loop using requestAnimationFrame.

- [ ] **2. Develop Base Components and Systems** <!-- id:AFcypU -->
  Implement Position, Velocity, Health, and Faction components. Create a 'MovementSystem' for physics and a 'RenderSystem' for drawing to HTML5 Canvas.

- [ ] **3. Implement Unit Spawning and AI** <!-- id:qFBmbc -->
  Develop a 'SpawnerSystem' to generate footmen at specific intervals. Create a simple 'UnitAISystem' that moves idle units toward the map center or enemy bases.

- [ ] **4. Build Hero System and Controls** <!-- id:bfJNzb -->
  Define a 'Hero' component with level, XP, and mana properties. Implement mouse input handling for unit selection and right-click movement commands.

- [ ] **5. Create Combat and Ability Systems** <!-- id:jRsDVo -->
  Implement a 'CombatSystem' to handle damage calculations, health reduction, and XP rewards. Develop a data-driven ability system for hero-specific skills like 'Avalanche'.

- [ ] **6. Construct React HUD and Inventory UI** <!-- id:6McI3s -->
  Use Radix UI components to build the game overlay. Create an 'InventorySystem' within the ECS that syncs with a React 'useGameState' hook to display items and stats.

- [ ] **7. Implement Item Shop and Economy** <!-- id:HnAAST -->
  Create a 'ShopDialog' component. Implement gold generation logic and an item system that applies stat modifiers or 'Aura' components to heroes.

- [ ] **8. Setup Database Schema for RTS Stats** <!-- id:tLzOic -->
  Update 'lib/schema.ts' with 'matches', 'player_stats', and 'hero_unlocks' tables to persist user progression via Neon.

- [ ] **9. Develop Hero Selection Lobby** <!-- id:KBjHNX -->
  Refactor 'app/page.tsx' to include a pre-game draft/selection screen (AR or Hero Pick) before initializing the game engine.

- [ ] **10. Implement Match Lifecycle and Persistence** <!-- id:Wi4mSi -->
  Create server actions to record match results and update player XP at the end of a session. Build a match summary page at 'app/match/[id]'.

---
plan_id: 8MNQ1D5r
status: draft
created: 2026-02-07T16:57:17.061Z

