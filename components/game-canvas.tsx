'use client';

import React, { useEffect, useRef } from 'react';
import { EntityManager, Entity, PositionComponent, SpriteComponent, FactionComponent, SpawnerComponent, HealthComponent, ManaComponent } from '@/lib/game-engine/core';
import { SpawnerSystem } from '@/lib/game-engine/systems/spawner-system';
import { UnitAISystem } from '@/lib/game-engine/systems/unit-ai-system';
import { RTSMovementSystem } from '@/lib/game-engine/systems/movement';
import { CollisionSystem } from '@/lib/game-engine/systems/collision';
import { SelectableComponent } from '@/lib/game-engine/components/selection';
import { LevelComponent, InventoryComponent } from '@/lib/game-engine/components/hero';
import { useRTSControls } from '@/hooks/use-rts-controls';
import { useGameState } from '@/hooks/use-game-state';

/**
 * RenderSystem handles drawing entities to the canvas based on their components.
 */
class RenderSystem {
  constructor(private ctx: CanvasRenderingContext2D) {}

  draw(entities: Entity[], isDragging: boolean, dragStart: {x: number, y: number}, currentMouse: {x: number, y: number}) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Filter and draw entities with position and sprite
    for (const entity of entities) {
      const pos = entity.getComponent<PositionComponent>('position');
      const sprite = entity.getComponent<SpriteComponent>('sprite');

      if (pos && sprite) {
        const selectable = entity.getComponent<SelectableComponent>('selectable');
        const faction = entity.getComponent<FactionComponent>('faction');
        
        if (sprite.assetId.includes('base')) {
           this.ctx.fillStyle = sprite.assetId.includes('blue') ? '#1e40af' : '#991b1b';
        } else if (entity.id === 'player-hero') {
           this.ctx.fillStyle = '#facc15'; // Golden for hero
        } else {
           this.ctx.fillStyle = faction?.id === 'player' ? '#3b82f6' : '#ef4444';
        }
        
        // Draw selection circle
        if (selectable?.isSelected) {
          this.ctx.strokeStyle = '#00ff00';
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.arc(pos.x, pos.y, (sprite.width / 2) + 4, 0, Math.PI * 2);
          this.ctx.stroke();
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
          const healthPercent = Math.max(0, health.current / health.max);
          
          this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          this.ctx.fillRect(pos.x - barWidth / 2, pos.y - sprite.height / 2 - 8, barWidth, barHeight);
          
          this.ctx.fillStyle = healthPercent > 0.5 ? '#22c55e' : '#f59e0b';
          this.ctx.fillRect(pos.x - barWidth / 2, pos.y - sprite.height / 2 - 8, barWidth * healthPercent, barHeight);
        }
      }
    }

    // Draw selection box
    if (isDragging) {
      this.ctx.strokeStyle = '#00ff00';
      this.ctx.setLineDash([5, 5]);
      this.ctx.strokeRect(
        dragStart.x,
        dragStart.y,
        currentMouse.x - dragStart.x,
        currentMouse.y - dragStart.y
      );
      this.ctx.setLineDash([]);
      this.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
      this.ctx.fillRect(
        dragStart.x,
        dragStart.y,
        currentMouse.x - dragStart.x,
        currentMouse.y - dragStart.y
      );
    }
  }
}

interface GameCanvasProps {
  selectedHeroId?: string;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ selectedHeroId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const entityManagerRef = useRef<EntityManager | null>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Hook for RTS controls
  const [emState, setEmState] = React.useState<EntityManager | null>(null);
  const { isDragging, dragStart, currentMouse } = useRTSControls(emState, canvasRef);
  const { updateFromEngine } = useGameState();

  // Create refs to mouse state to avoid closure staleness in animate loop
  const mouseStateRef = useRef({ isDragging, dragStart, currentMouse });
  
  useEffect(() => {
    mouseStateRef.current = { isDragging, dragStart, currentMouse };
  }, [isDragging, dragStart, currentMouse]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const em = new EntityManager();
    em.addSystem(new SpawnerSystem(em));
    em.addSystem(new UnitAISystem());
    em.addSystem(new RTSMovementSystem());
    em.addSystem(new CollisionSystem());
    entityManagerRef.current = em;
    setEmState(em);

    const renderSystem = new RenderSystem(ctx);

    // Initial Test Entities: Base Spawners
    const playerBase = new Entity('player-base')
      .addComponent(new PositionComponent(100, 300))
      .addComponent(new FactionComponent('player'))
      .addComponent(new SpawnerComponent(5, 0, 'footman'))
      .addComponent(new SpriteComponent('base-blue', 48, 48))
      .addComponent(new HealthComponent(2000, 2000));

    // Define hero stats based on selection
    let hp = 600, mp = 200;
    if (selectedHeroId === 'mountain-king') { hp = 700; mp = 150; }
    else if (selectedHeroId === 'archmage') { hp = 450; mp = 300; }
    else if (selectedHeroId === 'paladin') { hp = 650; mp = 180; }
    else if (selectedHeroId === 'blood-mage') { hp = 500; mp = 280; }

    // Player Hero
    const hero = new Entity('player-hero')
      .addComponent(new PositionComponent(200, 300))
      .addComponent(new FactionComponent('player'))
      .addComponent(new SpriteComponent(`hero-${selectedHeroId}`, 36, 36))
      .addComponent(new HealthComponent(hp, hp))
      .addComponent(new ManaComponent(mp, mp))
      .addComponent(new LevelComponent(1, 0, 100))
      .addComponent(new InventoryComponent())
      .addComponent(new SelectableComponent());
    
    const enemyBase = new Entity('enemy-base')
      .addComponent(new PositionComponent(712, 300))
      .addComponent(new FactionComponent('enemy'))
      .addComponent(new SpawnerComponent(5, 0, 'footman'))
      .addComponent(new SpriteComponent('base-red', 48, 48))
      .addComponent(new HealthComponent(2000, 2000));

    em.addEntity(playerBase);
    em.addEntity(hero);
    em.addEntity(enemyBase);

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaTime = (time - lastTimeRef.current) / 1000;
        em.update(deltaTime);
        updateFromEngine(em);
        
        const allEntities = Array.from((em as any).entities.values()) as Entity[];
        const { isDragging: dragging, dragStart: start, currentMouse: mouse } = mouseStateRef.current;
        renderSystem.draw(allEntities, dragging, start, mouse);
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
  }, [selectedHeroId, updateFromEngine]);

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

