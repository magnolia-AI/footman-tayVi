# Footmen Frenzy Web Implementation Plan

## Summary
Build a web-based real-time strategy (RTS) engine recreating the 'Footmen Frenzy' mechanics using React, Next.js, and Tailwind CSS. The plan focuses on a robust entity-component-system (ECS) for unit management, a real-time game loop, and modern UI for hero selection and itemization.

## Approach
Our approach will leverage the existing Next.js architecture to build a performant RTS in the browser. We will implement an Entity Component System (ECS) architecture in plain TypeScript for the game engine to handle hundreds of footmen efficiently. React will be used primarily for the HUD, menus, and game state management (via Context/State), while the battlefield will be rendered using a high-performance Canvas-based renderer integrated into the 'components/video.tsx' or a new 'GameCanvas' component. Networking will be simulated locally first for the MVP, then expanded toward server-side state for multiplayer. We will adapt the 'lib/schema.ts' to support player profiles, match history, and custom hero loadouts.

## Tasks

- [ ] **1. Initialize Game Engine Core (ECS)** <!-- id:wTo20L -->
  Create 'lib/game-engine' directory. Implement a basic Entity Component System to manage Positions, Health, Movement, and Faction components for Footmen and Heroes.

- [ ] **2. Implement Sprite and Animation System** <!-- id:IJUH5c -->
  Create a 'GameCanvas' component in 'components/game-canvas.tsx'. Implement a rendering loop that handles sprite sheets for unit animations (walking, attacking, death) using the HTML5 Canvas API.

- [ ] **3. Develop Basic Movement and Selection Logic** <!-- id:kzrF9p -->
  Implement RTS box-selection for hero control and right-click movement. Use a simple BFS or A* pathfinding algorithm for unit navigation within the arena.

- [ ] **4. Establish Footmen Spawning & AI System** <!-- id:0fjyvv -->
  Create a 'Spawner' system that generates Footmen for each player at fixed intervals. Implement a simple 'Seek & Destroy' AI that moves Footmen toward the center or enemy heroes.

- [ ] **5. Build Hero Ability System** <!-- id:qmdFWJ -->
  Design a data-driven ability system in 'lib/game-engine/abilities.ts'. Implement 'Avalanche' and 'Fire Lord' base skills (e.g., AOE stomp, ranged projectiles).

- [ ] **6. Design Hero Selection & HUD UI** <!-- id:zuIq0u -->
  Replace 'app/page.tsx' with the Hero Selection screen. Use Radix UI components from 'components/ui' to build the bottom HUD for abilities, health, and inventory (6-slot grid).

- [ ] **7. Implement Item Shop and Gold Economy** <!-- id:C5WjRf -->
  Create a shop UI in 'components/shop-dialog.tsx'. Implement gold generation per Footman kill and logic for items like 'Immolation Cloak' that apply aura effects to entities.

- [ ] **8. Set Up Database Schema for Persistence** <!-- id:7fTqMa -->
  Update 'lib/schema.ts' to include 'matches', 'player_stats', and 'unlocked_cosmetics' tables referencing 'neonAuthUser'.

- [ ] **9. Create Multi-Team Support (3v3v3v3)** <!-- id:IkCoeE -->
  Implement faction-based targeting logic. Ensure the game engine handles up to 12 player slots and 4 distinct base locations on the map.

- [ ] **10. Develop Match Summary and XP System** <!-- id:he6kKK -->
  Create 'app/match/[id]/page.tsx' to display results. Implement logic to save match outcomes to the Neon database via Drizzle.

---
plan_id: gil7gTdd
status: draft
created: 2026-02-07T16:46:02.109Z

