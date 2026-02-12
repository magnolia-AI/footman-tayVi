import { Component } from '../core';

/**
 * CombatComponent stores state for ongoing combat interactions.
 */
export class CombatComponent extends Component {
  readonly type = 'combat';

  constructor(
    public attackDamage: number = 10,
    public attackRange: number = 2,
    public attackCooldown: number = 1.0, // Seconds
    public cooldownTimer: number = 0,
    public targetId: string | null = null
  ) {
    super();
  }
}

/**
 * StatsComponent for hero growth and basic unit attributes.
 */
export class StatsComponent extends Component {
  readonly type = 'stats';

  constructor(
    public strength: number = 1,
    public agility: number = 1,
    public intelligence: number = 1,
    public armor: number = 0,
    public experience: number = 0,
    public level: number = 1,
    public skillPoints: number = 0,
    public isHero: boolean = false
  ) {
    super();
  }
}

/**
 * ManaComponent for hero ability usage.
 */
export class ManaComponent extends Component {
  readonly type = 'mana';

  constructor(
    public current: number = 100,
    public max: number = 100,
    public regeneration: number = 1.0 // Per second
  ) {
    super();
  }
}

