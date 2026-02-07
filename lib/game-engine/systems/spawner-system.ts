import { System, Entity, EntityManager, SpawnerComponent, PositionComponent, VelocityComponent, HealthComponent, FactionComponent, SpriteComponent, UnitAIComponent } from '../core';

/**
 * SpawnerSystem handles the automatic generation of units from entities with a SpawnerComponent.
 */
export class SpawnerSystem extends System {
  readonly requiredComponents = ['spawner', 'position', 'faction'];

  constructor(private entityManager: EntityManager) {
    super();
  }

  update(entities: Entity[], deltaTime: number): void {
    for (const entity of entities) {
      const spawner = entity.getComponent<SpawnerComponent>('spawner')!;
      const pos = entity.getComponent<PositionComponent>('position')!;
      const faction = entity.getComponent<FactionComponent>('faction')!;

      spawner.timer += deltaTime;

      if (spawner.timer >= spawner.interval) {
        spawner.timer = 0;
        this.spawnUnit(pos.x, pos.y, faction.id, spawner.unitType);
      }
    }
  }

  private spawnUnit(x: number, y: number, factionId: string, unitType: string): void {
    const unit = new Entity();
    
    // Units spawn at the spawner's location
    unit.addComponent(new PositionComponent(x, y));
    unit.addComponent(new VelocityComponent(0, 0));
    unit.addComponent(new HealthComponent(100, 100));
    unit.addComponent(new FactionComponent(factionId));
    unit.addComponent(new UnitAIComponent('aggressive'));

    // Placeholder sprite logic
    const spriteSize = unitType === 'footman' ? 16 : 24;
    unit.addComponent(new SpriteComponent(`unit-${unitType}`, spriteSize, spriteSize));

    this.entityManager.addEntity(unit);
  }
}

