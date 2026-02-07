import { System, Entity, HealthComponent, PositionComponent, ManaComponent } from '../core';
import { AbilityComponent } from '../components/ability';

export class AbilitySystem extends System {
  readonly requiredComponents = ['abilities', 'position'];

  update(entities: Entity[], deltaTime: number): void {
    for (const entity of entities) {
      const abilityComp = entity.getComponent<AbilityComponent>('abilities')!;
      const manaComp = entity.getComponent<ManaComponent>('mana');

      // Update cooldowns
      for (const [id, cd] of abilityComp.cooldowns.entries()) {
        if (cd > 0) {
          abilityComp.cooldowns.set(id, cd - deltaTime);
        }
      }

      // Regerate mana
      if (manaComp) {
        manaComp.current = Math.min(manaComp.max, manaComp.current + manaComp.regeneration * deltaTime);
      }
    }
  }

  /**
   * Trigger an ability
   */
  executeAbility(caster: Entity, abilityId: string, targetPos?: { x: number, y: number }, allEntities?: Entity[]): boolean {
    const abilityComp = caster.getComponent<AbilityComponent>('abilities');
    const manaComp = caster.getComponent<ManaComponent>('mana');
    
    if (!abilityComp) return false;

    const ability = abilityComp.abilities.find(a => a.id === abilityId);
    if (!ability) return false;

    // Check cooldown
    if (!abilityComp.isReady(abilityId)) return false;

    // Check mana
    if (manaComp && manaComp.current < ability.manaCost) return false;

    // Pay costs
    if (manaComp) {
      manaComp.current -= ability.manaCost;
    }
    abilityComp.startCooldown(abilityId, ability.cooldown);

    // Some specific effects for "Avalanche" or similar skills
    if (abilityId === 'avalanche' && targetPos && allEntities) {
      this.applyAoeDamage(caster, targetPos, 5, 50, allEntities);
    } else {
      // Execute generic effect
      ability.effect(caster.id, targetPos);
    }

    return true;
  }

  private applyAoeDamage(caster: Entity, center: { x: number, y: number }, radius: number, damage: number, entities: Entity[]) {
    const radiusSq = radius * radius;
    const casterFaction = caster.getComponent('faction') as any;

    for (const entity of entities) {
      const pos = entity.getComponent<PositionComponent>('position');
      const health = entity.getComponent<HealthComponent>('health');
      const faction = entity.getComponent('faction') as any;

      if (pos && health && faction && faction.id !== casterFaction?.id) {
        const dx = pos.x - center.x;
        const dy = pos.y - center.y;
        if (dx * dx + dy * dy <= radiusSq) {
          health.current = Math.max(0, health.current - damage);
          // Potential to add stun or other effects here
        }
      }
    }
  }
}

