'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { EntityManager, Entity, HealthComponent, ManaComponent } from '@/lib/game-engine/core';
import { LevelComponent, InventoryComponent, InventoryItem } from '@/lib/game-engine/components/hero';

import { saveMatchResult } from '@/app/actions/match';

interface GameState {
  selectedEntity: {
    id: string;
    health?: { current: number; max: number };
    mana?: { current: number; max: number };
    level?: { level: number; exp: number; next: number };
    inventory?: (InventoryItem | null)[];
  } | null;
  isGameOver: boolean;
  victory?: boolean;
  matchId?: number;
}

const GameStateContext = createContext<{
  state: GameState;
  updateFromEngine: (em: EntityManager) => void;
  gameOver: (victory: boolean, matchData: any) => Promise<void>;
} | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({ 
    selectedEntity: null,
    isGameOver: false 
  });

  const gameOver = async (victory: boolean, stats: any) => {
    if (state.isGameOver) return;

    try {
      const result = await saveMatchResult({
        victory,
        durationSeconds: stats.duration || 0,
        kills: stats.kills || 0,
        deaths: stats.deaths || 0,
        goldEarned: stats.gold || 0,
        xpGained: victory ? 500 : 150,
      });

      setState(prev => ({ 
        ...prev, 
        isGameOver: true, 
        victory,
        matchId: result.matchId 
      }));
    } catch (error) {
      console.error('Failed to save match result:', error);
      setState(prev => ({ ...prev, isGameOver: true, victory }));
    }
  };

  const updateFromEngine = (em: EntityManager) => {
    // If game is over, we check for bases
    const allEntities = Array.from((em as any).entities.values()) as Entity[];
    
    // Check win/loss condition if not already over
    if (!state.isGameOver) {
      const playerBase = allEntities.find(e => e.id === 'player-base');
      const enemyBase = allEntities.find(e => e.id === 'enemy-base');

      if (!playerBase) {
        gameOver(false, { duration: 120 }); // Mock stats for now
        return;
      }
      if (!enemyBase) {
        gameOver(true, { duration: 120 });
        return;
      }
    }
    const selected = allEntities.find(e => {
        const selectable = e.getComponent<any>('selectable');
        return selectable?.isSelected;
    }) || allEntities.find(e => e.id === 'player-hero');

    if (selected) {
      const health = selected.getComponent<HealthComponent>('health');
      const mana = selected.getComponent<ManaComponent>('mana');
      const level = selected.getComponent<LevelComponent>('level');
      const inv = selected.getComponent<InventoryComponent>('inventory');

      setState(prev => ({
        ...prev,
        selectedEntity: {
          id: selected.id,
          health: health ? { current: health.current, max: health.max } : undefined,
          mana: mana ? { current: mana.current, max: mana.max } : undefined,
          level: level ? { level: level.level, exp: level.experience, next: level.experienceToNext } : undefined,
          inventory: inv ? [...inv.slots] : undefined,
        }
      }));
    } else {
      if (state.selectedEntity) setState(prev => ({ ...prev, selectedEntity: null }));
    }
  };

  return (
    <GameStateContext.Provider value={{ state, updateFromEngine, gameOver }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) throw new Error('useGameState must be used within GameStateProvider');
  return context;
}
