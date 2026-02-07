import { System, Entity, HealthComponent, PositionComponent, FactionComponent } from '../core';
import { CombatComponent, StatsComponent } from '../components/combat';

export class CombatSystem extends System {
  readonly requiredComponents = ['combat', 'health', 'position', 'faction'];

  update(entities: Entity[], deltaTime: number): void {
    const entityManager = (this as any).entityManager; // Hack if not directly available, but we'll assume standard access or pass it

    for (const attacker of entities) {
      const combat = attacker.getComponent<CombatComponent>('combat')!;
      
      // Update cooldown
      if (combat.cooldownTimer > 0) {
        combat.cooldownTimer -= deltaTime;
      }

      if (!combat.targetId) continue;

      const target = this.findEntity(entities, combat.targetId);
      if (!target) {
        combat.targetId = null;
        continue;
      }

      // Check distance
      const attackerPos = attacker.getComponent<PositionComponent>('position')!;
      const targetPos = target.getComponent<PositionComponent>('position')!;
      const targetHealth = target.getComponent<HealthComponent>('health')!;
      const targetFaction = target.getComponent<FactionComponent>('faction')!;
      const attackerFaction = attacker.getComponent<FactionComponent>('faction')!;

      // Friendly fire check
      if (targetFaction.id === attackerFaction.id) {
        combat.targetId = null;
        continue;
      }

      const dx = targetPos.x - attackerPos.x;
      const dy = targetPos.y - attackerPos.y;
      const distSq = dx * dx + dy * dy;

      if (distSq <= combat.attackRange * combat.attackRange) {
        // Within range, try to attack
        if (combat.cooldownTimer <= 0) {
          this.applyDamage(attacker, target, combat.attackDamage);
          combat.cooldownTimer = combat.attackCooldown;
        }
      }
    }
  }

  private findEntity(entities: Entity[], id: string): Entity | undefined {
    // In a real scenario, the system might have access to the EntityManager directly
    return entities.find(e => e.id === id);
  }

  private applyDamage(attacker: Entity, target: Entity, damage: number) {
    const health = target.getComponent<HealthComponent>('health')!;
    const targetStats = target.getComponent<StatsComponent>('stats');
    
    // Simple armor reduction: damage = damage * (1 - armor_reduction)
    // For now: flat reduction
    const armor = targetStats?.armor || 0;
    const finalDamage = Math.max(1, damage - armor);
    
    health.current = Math.max(0, health.current - finalDamage);

    if (health.current <= 0) {
      this.handleDeath(attacker, target);
    }
  }

  private handleDeath(killer: Entity, victim: Entity) {
    const killerStats = killer.getComponent<StatsComponent>('stats');
    
    // Reward XP if killer is a hero or part of a group
    if (killerStats) {
      const xpReward = 20; // Base XP
      killerStats.experience += xpReward;
      this.checkLevelUp(killer, killerStats);
    }

    // In a real system, we'd mark for removal or trigger a death event
    // For now, let's just let the entity manager handle victims with 0 health?
    // Usually systems mark entities for deletion.
  }

  private checkLevelUp(entity: Entity, stats: StatsComponent) {
    const xpNeeded = stats.level * 100;
    if (stats.experience >= xpNeeded) {
      stats.level++;
      stats.experience -= xpNeeded;
      stats.skillPoints++;
      
      // Buff stats
      stats.strength += 2;
      stats.agility += 2;
      stats.intelligence += 2;

      // Heal on level up
      const health = entity.getComponent<HealthComponent>('health');
      if (health) {
        health.max += 20;
        health.current = health.max;
      }
    }
  }
}

