import { System, Entity, PositionComponent, Component } from '../core';

export class CircleColliderComponent extends Component {
  readonly type = 'circle-collider';
  constructor(public radius: number) {
    super();
  }
}

/**
 * Basic circle-to-circle collision avoidance.
 * Pushes entities apart if they overlap.
 */
export class CollisionSystem extends System {
  readonly requiredComponents = ['position', 'circle-collider'];

  update(entities: Entity[], deltaTime: number): void {
    // Basic n^2 collision check (fine for small counts, optimize later if needed)
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const e1 = entities[i];
        const e2 = entities[j];

        const p1 = e1.getComponent<PositionComponent>('position')!;
        const c1 = e1.getComponent<CircleColliderComponent>('circle-collider')!;
        const p2 = e2.getComponent<PositionComponent>('position')!;
        const c2 = e2.getComponent<CircleColliderComponent>('circle-collider')!;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distanceSq = dx * dx + dy * dy;
        const minDistance = c1.radius + c2.radius;

        if (distanceSq < minDistance * minDistance) {
          const distance = Math.sqrt(distanceSq) || 0.001;
          const overlap = minDistance - distance;

          // Push them apart
          const nx = dx / distance;
          const ny = dy / distance;

          const pushAmount = overlap / 2;
          p1.x -= nx * pushAmount;
          p1.y -= ny * pushAmount;
          p2.x += nx * pushAmount;
          p2.y += ny * pushAmount;
        }
      }
    }
  }
}

