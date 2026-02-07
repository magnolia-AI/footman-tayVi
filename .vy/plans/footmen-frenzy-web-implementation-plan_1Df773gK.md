# Footmen Frenzy Web Implementation Plan

## Summary
Build a web-based real-time strategy (RTS) engine inspired by Footmen Frenzy, featuring automated unit spawning, hero progression, and multiplayer capabilities using Next.js and Drizzle ORM.

## Approach
The implementation will leverage the existing Next.js structure for the game interface, using a client-side game loop for the RTS mechanics. I will use Drizzle ORM to manage game state, hero stats, and player accounts. Key decisions include: 1) Using React state and Refs for the high-frequency game loop to handle unit movement and collision. 2) implementing a WebSocket layer (via the existing framework) for real-time multiplayer synchronization. 3) Storing persistent hero and item data in the Neon/Drizzle database. 4) Creating a custom canvas or SVG-based renderer for the battleground to handle hundreds of footmen efficiently.

## Tasks

- [ ] **1. Define Core Game Schema in lib/schema.ts** <!-- id:LOT4X8 -->
  Create tables for 'heroes' (stats, abilities), 'items' (buffs, costs), and 'player_stats' (wins, losses, XP). Link these to neonAuthUser from neon-auth-schema.ts.

- [ ] **2. Implement Unit and Hero Logic Classes** <!-- id:5QunnJ -->
  Create a logic directory to handle unit AI (footmen pathfinding towards center/enemies) and Hero attribute scaling (damage, armor, mana per level).

- [ ] **3. Develop the Arena Component** <!-- id:1o7AZo -->
  Build a main game viewport component using HTML5 Canvas or a high-performance React library to render units, health bars, and ability effects.

- [ ] **4. Create Automated Spawner System** <!-- id:kyyds6 -->
  Implement a server-authoritative or synchronized client-side timer that spawns 4 footmen every 30 seconds for each active base.

- [ ] **5. Build Hero Selection and UI** <!-- id:EvqGNn -->
  Create the 'Hero Pick' and 'All Random' interface using Radix UI components like Dialog and Card. Use the existing theme-provider for dark/fantasy styling.

- [ ] **6. Implement Item Shop and Inventory** <!-- id:J09VKf -->
  Develop a shop UI in the game interface. Create a system to apply item modifiers (like the Immolation Cloak periodic damage) to the Hero's stats.

- [ ] **7. Set up Multiplayer Sync via API/WebSockets** <!-- id:TeYXQQ -->
  Utilize app/api routes for match initialization and a WebSocket proxy to synchronize unit positions and health across the 3v3v3v3 teams.

- [ ] **8. Add Experience and Gold Economy** <!-- id:iy33AZ -->
  Write logic to award gold and XP on unit death. Footmen offer small rewards; Hero kills offer massive bonuses and item/level advantages.

- [ ] **9. Integrate Audio and Visual Effects** <!-- id:fQCsiS -->
  Wrap game sounds in the existing Video/Audio patterns. Add CSS animations or canvas particles for abilities like 'Avalanche' or 'Avatar'.

- [ ] **10. Testing and Balance Dashboard** <!-- id:UNI3uQ -->
  Create an admin route to toggle hero stats and spawn rates in real-time to test the 'snowballing' mitigation strategies mentioned in the PRD.

---
plan_id: 6TxAzMxs
status: draft
created: 2026-02-07T16:43:06.978Z

