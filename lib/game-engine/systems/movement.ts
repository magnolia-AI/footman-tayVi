import { System, Entity, PositionComponent, VelocityComponent, Component } from '../core';

export class TargetComponent extends Component {
  readonly type = 'target';
  constructor(public x: number, public y: number) {
    super();
  }
}

export class MoveStatsComponent extends Component {
  readonly type = 'move-stats';
  constructor(public speed: number) {
    super();
  }
}

/**
 * Handles unit movement towards a target location.
 */
export class RTSMovementSystem extends System {
  readonly requiredComponents = ['position', 'velocity', 'target', 'move-stats'];

  update(entities: Entity[], deltaTime: number): void {
    for (const entity of entities) {
      const pos = entity.getComponent<PositionComponent>('position')!;
      const vel = entity.getComponent<VelocityComponent>('velocity')!;
      const target = entity.getComponent<TargetComponent>('target')!;
      const stats = entity.getComponent<MoveStatsComponent>('move-stats')!;

      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Simple threshold to stop when reached
      if (distance < 2) {
        vel.vx = 0;
        vel.vy = 0;
        entity.removeComponent('target');
        continue;
      }

      // Calculate direction vector
      const vx = (dx / distance) * stats.speed;
      const vy = (dy / distance) * stats.speed;

      vel.vx = vx;
      vel.vy = vy;

      // Update position (can also be handled by basic MovementSystem,
      // but keeping it here for integrated movement logic if needed)
      pos.x += vel.vx * deltaTime;
      pos.y += vel.vy * deltaTime;
    }
  }
}

