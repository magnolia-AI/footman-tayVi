# Footmen Frenzy Web Engine Implementation

## Summary
Develop a real-time strategy (RTS) engine using Next.js and HTML5 Canvas that recreates the core mechanics of Footmen Frenzy, including high-density unit management, hero progression, and an arena-based economy.

## Approach
The implementation will use an Entity-Component-System (ECS) architecture written in TypeScript to handle the simulation of hundreds of 'Footmen' without performance degradation. We will use a dual-layer rendering strategy: a high-performance HTML5 Canvas for the game world (units, movements, combat) and a React-based HUD using existing Radix UI components for health, abilities, and inventory management. The state will be managed locally for the MVP, with match persistence handled via Drizzle ORM and Neon Database for player stats and hero unlocks. AI logic will follow a 'Seek and Destroy' pattern where spawned units automatically move toward the center or enemy hero locations.

## Tasks

- [ ] **1. Establish Core Game Engine and ECS Framework** <!-- id:QWZN5k -->
  Create 'lib/game' directory. Implement a lightweight ECS with 'Entity', 'Component', and 'System' classes. Define initial components: Position, Velocity, Health, Faction, and CombatStats.

- [ ] **2. Develop High-Performance Game Canvas Component** <!-- id:fSAjkz -->
  Create 'components/game-canvas.tsx'. Setup the requestAnimationFrame loop to render entities from the ECS onto an HTML5 Canvas. Implement a camera/offset system to support map panning.

- [ ] **3. Implement Sprite and Animation System** <!-- id:2_Zhwt -->
  Create a SpriteSheet utility in 'lib/game/renderer.ts' to handle frame-based animations for walking, attacking, and death for Footmen and Heroes.

- [ ] **4. Add RTS Select & Move Logic** <!-- id:Zu2dRu -->
  Implement mouse input handling for box-selection of Heroes and right-click movement commands with basic A* or BFS pathfinding within the arena boundaries.

- [ ] **5. Create Automated Spawner and Unit AI** <!-- id:sTVaz_ -->
  Build a 'SpawnerSystem' that generates Footmen at player bases every 30 seconds. Implement a 'UnitAI' system that directs idle footmen toward the nearest enemy base or center point.

- [ ] **6. Design Hero Ability and Level-up System** <!-- id:BmfEry -->
  Define a data-driven Hero schema in 'lib/schema.ts'. Implement logic for leveling up stats and casting abilities (e.g., 'Avalanche' stomp and 'Fire Lord' projectiles) with cooldowns.

- [ ] **7. Construct HUD and Inventory UI** <!-- id:68AgNn -->
  Build a React-based HUD overlay using 'components/ui/card.tsx' and 'components/ui/progress.tsx' to display Hero stats, level, and a 6-slot inventory system.

- [ ] **8. Implement Item Shop and Gold Economy** <!-- id:v_PXNl -->
  Create a 'ShopSystem' that generates gold on unit kills. Implement 'components/shop-dialog.tsx' using the 'Dialog' ui-component to allow purchasing of power-ups like the 'Immolation Cloak'.

- [ ] **9. Setup Database Persistence for Player Progress** <!-- id:loeNXD -->
  Update 'lib/schema.ts' to include 'match_history' and 'player_profiles'. Implement server actions in 'lib/db.ts' to save results at the end of a match.

- [ ] **10. Final Integration and Polish** <!-- id:VhkDtE -->
  Replace the boilerplate in 'app/page.tsx' with the Hero Selection screen and the Main Game View. Add sound effect triggers and victory/defeat screens.

---
plan_id: ryxlQh1D
status: draft
created: 2026-02-07T16:51:11.446Z

