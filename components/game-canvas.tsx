'use client';

import React, { useEffect, useRef } from 'react';
import { EntityManager, Entity, PositionComponent, SpriteComponent, FactionComponent, SpawnerComponent, MovementSystem } from '@/lib/game-engine/core';
import { SpawnerSystem } from '@/lib/game-engine/systems/spawner-system';
import { UnitAISystem } from '@/lib/game-engine/systems/unit-ai-system';

/**
 * RenderSystem handles drawing entities to the canvas based on their components.
 */
class RenderSystem {
  constructor(private ctx: CanvasRenderingContext2D) {}

  draw(entities: Entity[]) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Filter and draw entities with position and sprite
    for (const entity of entities) {
      const pos = entity.getComponent<PositionComponent>('position');
      const sprite = entity.getComponent<SpriteComponent>('sprite');

      if (pos && sprite) {
        if (sprite.assetId.includes('base')) {
           this.ctx.fillStyle = sprite.assetId.includes('blue') ? '#1e40af' : '#991b1b';
        } else {
           this.ctx.fillStyle = entity.getComponent<FactionComponent>('faction')?.id === 'player' ? '#3b82f6' : '#ef4444';
        }
        
        this.ctx.fillRect(
          pos.x - sprite.width / 2,
          pos.y - sprite.height / 2,
          sprite.width,
          sprite.height
        );
        
        // Simple health bar representation if health exists
        const health = entity.getComponent<any>('health');
        if (health) {
          const barWidth = sprite.width;
          const barHeight = 4;
          const healthPercent = health.current / health.max;
          
          this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          this.ctx.fillRect(pos.x - barWidth / 2, pos.y - sprite.height / 2 - 8, barWidth, barHeight);
          
          this.ctx.fillStyle = healthPercent > 0.5 ? '#22c55e' : '#f59e0b';
          this.ctx.fillRect(pos.x - barWidth / 2, pos.y - sprite.height / 2 - 8, barWidth * healthPercent, barHeight);
        }
      }
    }
  }
}

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const entityManagerRef = useRef<EntityManager | null>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize EntityManager and add some test entities
    const em = new EntityManager();
    em.addSystem(new SpawnerSystem(em));
    em.addSystem(new UnitAISystem());
    em.addSystem(new MovementSystem());
    entityManagerRef.current = em;

    // Add a basic RenderSystem (we handle this inside the loop for canvas context binding)
    const renderSystem = new RenderSystem(ctx);

    // Initial Test Entities: Base Spawners
    const playerBase = new Entity('player-base')
      .addComponent(new PositionComponent(100, 300))
      .addComponent(new FactionComponent('player'))
      .addComponent(new SpawnerComponent(5, 0, 'footman'))
      .addComponent(new SpriteComponent('base-blue', 48, 48));
    
    const enemyBase = new Entity('enemy-base')
      .addComponent(new PositionComponent(700, 300))
      .addComponent(new FactionComponent('enemy'))
      .addComponent(new SpawnerComponent(5, 0, 'footman'))
      .addComponent(new SpriteComponent('base-red', 48, 48));

    em.addEntity(playerBase);
    em.addEntity(enemyBase);

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaTime = (time - lastTimeRef.current) / 1000;
        
        // Update physics systems (if any)
        em.update(deltaTime);
        
        // Draw using our rendering logic
        // Get entities from EntityManager - casting to access private entities for rendering if needed
        // Or better, add a getter to EntityManager or just use the current internal state
        const allEntities = Array.from((em as any).entities.values()) as Entity[];
        renderSystem.draw(allEntities);
      }
      
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden flex items-center justify-center p-4">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-4 border-slate-700 rounded-lg shadow-2xl bg-black cursor-crosshair"
      />
      <div className="absolute top-4 left-4 text-white font-mono text-xs bg-black/50 p-2 rounded">
        Footmen Frenzy Engine v0.1 | Active Entities: {Array.from((entityManagerRef.current as any)?.entities?.values() || []).length}
      </div>
    </div>
  );
};
