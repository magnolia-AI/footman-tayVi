import { Component } from '../core';

export interface AbilityData {
  id: string;
  name: string;
  manaCost: number;
  cooldown: number;
  range: number;
  type: 'active' | 'passive';
  effect: (ownerId: string, targetPos?: { x: number, y: number }) => void;
}

export class AbilityComponent extends Component {
  readonly type = 'abilities';

  /**
   * cooldowns maps ability ID to remaining cooldown time in seconds
   */
  public cooldowns: Map<string, number> = new Map();

  constructor(
    public abilities: AbilityData[] = []
  ) {
    super();
  }

  isReady(abilityId: string): boolean {
    const cd = this.cooldowns.get(abilityId) || 0;
    return cd <= 0;
  }

  startCooldown(abilityId: string, duration: number) {
    this.cooldowns.set(abilityId, duration);
  }
}

