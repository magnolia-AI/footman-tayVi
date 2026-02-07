import { System, Entity, UnitAIComponent, PositionComponent, VelocityComponent } from '../core';

/**
 * UnitAISystem manages simple behaviors for units, such as moving towards the map center.
 */
export class UnitAISystem extends System {
  readonly requiredComponents = ['unit-ai', 'position', 'velocity'];

  private readonly MAP_CENTER = { x: 400, y: 300 }; // Configurable or dynamic in a real setup
  private readonly UNIT_SPEED = 50; // Pixels per second

  update(entities: Entity[], deltaTime: number): void {
    for (const entity of entities) {
      const ai = entity.getComponent<UnitAIComponent>('unit-ai')!;
      const pos = entity.getComponent<PositionComponent>('position')!;
      const vel = entity.getComponent<VelocityComponent>('velocity')!;

      if (ai.mode === 'aggressive') {
        // Calculate direction to center
        const dx = this.MAP_CENTER.x - pos.x;
        const dy = this.MAP_CENTER.y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) { // Stop if close to center
          // Normalize and scale by speed
          vel.vx = (dx / distance) * this.UNIT_SPEED;
          vel.vy = (dy / distance) * this.UNIT_SPEED;
        } else {
          vel.vx = 0;
          vel.vy = 0;
        }
      } else {
        // Handle idle or other modes
        vel.vx = 0;
        vel.vy = 0;
      }
    }
  }
}

