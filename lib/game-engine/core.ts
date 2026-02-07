/**
 * Core Entity-Component-System (ECS) Framework
 */

export type EntityId = string;

/**
 * Base Component class.
 * All data-only components should extend this.
 */
export abstract class Component {
  abstract readonly type: string;
}

/**
 * Entity implementation.
 * A container for components identified by an ID.
 */
export class Entity {
  public readonly id: EntityId;
  private components: Map<string, Component> = new Map();

  constructor(id: EntityId = Math.random().toString(36).substring(2, 9)) {
    this.id = id;
  }

  addComponent(component: Component): this {
    this.components.set(component.type, component);
    return this;
  }

  getComponent<T extends Component>(type: string): T | undefined {
    return this.components.get(type) as T;
  }

  hasComponent(type: string): boolean {
    return this.components.has(type);
  }

  removeComponent(type: string): void {
    this.components.delete(type);
  }

  getAllComponents(): Component[] {
    return Array.from(this.components.values());
  }
}

/**
 * Base System class.
 * Systems process entities that have a specific set of components.
 */
export abstract class System {
  /**
   * Defines which components an entity must have to be processed by this system.
   */
  abstract readonly requiredComponents: string[];

  /**
   * Main update loop for the system.
   * @param entities Entities that match the system's requirements.
   * @param deltaTime Time since last frame in seconds.
   */
  abstract update(entities: Entity[], deltaTime: number): void;
}

/**
 * Entity Manager to handle entity lifecycle and system updates.
 */
export class EntityManager {
  private entities: Map<EntityId, Entity> = new Map();
  private systems: System[] = [];

  addEntity(entity: Entity): void {
    this.entities.set(entity.id, entity);
  }

  removeEntity(id: EntityId): void {
    this.entities.delete(id);
  }

  addSystem(system: System): void {
    this.systems.push(system);
  }

  update(deltaTime: number): void {
    const allEntities = Array.from(this.entities.values());

    for (const system of this.systems) {
      const matchKey = system.requiredComponents;
      const filteredEntities = allEntities.filter((entity) =>
        matchKey.every((type) => entity.hasComponent(type))
      );
      system.update(filteredEntities, deltaTime);
    }
  }

  getEntity(id: EntityId): Entity | undefined {
    return this.entities.get(id);
  }
}

/**
 * INITIAL COMPONENTS
 */

export class PositionComponent extends Component {
  readonly type = 'position';
  constructor(public x: number, public y: number) {
    super();
  }
}

export class VelocityComponent extends Component {
  readonly type = 'velocity';
  constructor(public vx: number, public vy: number) {
    super();
  }
}

export class HealthComponent extends Component {
  readonly type = 'health';
  constructor(public current: number, public max: number) {
    super();
  }
}

export class FactionComponent extends Component {
  readonly type = 'faction';
  constructor(public id: string) {
    super();
  }
}

export class SpriteComponent extends Component {
  readonly type = 'sprite';
  /**
   * @param assetId Reference to the visual asset
   * @param width Display width
   * @param height Display height
   */
  constructor(
    public assetId: string,
    public width: number,
    public height: number,
    public frame: number = 0
  ) {
    super();
  }
}

