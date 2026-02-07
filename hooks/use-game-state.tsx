'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { EntityManager, Entity, HealthComponent, ManaComponent } from '@/lib/game-engine/core';
import { LevelComponent, InventoryComponent, InventoryItem } from '@/lib/game-engine/components/hero';

interface GameState {
  selectedEntity: {
    id: string;
    health?: { current: number; max: number };
    mana?: { current: number; max: number };
    level?: { level: number; exp: number; next: number };
    inventory?: (InventoryItem | null)[];
  } | null;
}

const GameStateContext = createContext<{
  state: GameState;
  updateFromEngine: (em: EntityManager) => void;
} | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({ selectedEntity: null });

  const updateFromEngine = (em: EntityManager) => {
    // In a real RTS, we'd find the selected units. 
    // For now, let's find the 'player-hero' or just the first selected unit
    const allEntities = Array.from((em as any).entities.values()) as Entity[];
    const selected = allEntities.find(e => {
        const selectable = e.getComponent<any>('selectable');
        return selectable?.isSelected;
    }) || allEntities.find(e => e.id === 'player-hero');

    if (selected) {
      const health = selected.getComponent<HealthComponent>('health');
      const mana = selected.getComponent<ManaComponent>('mana');
      const level = selected.getComponent<LevelComponent>('level');
      const inv = selected.getComponent<InventoryComponent>('inventory');

      setState({
        selectedEntity: {
          id: selected.id,
          health: health ? { current: health.current, max: health.max } : undefined,
          mana: mana ? { current: mana.current, max: mana.max } : undefined,
          level: level ? { level: level.level, exp: level.experience, next: level.experienceToNext } : undefined,
          inventory: inv ? [...inv.slots] : undefined,
        }
      });
    } else {
      if (state.selectedEntity) setState({ selectedEntity: null });
    }
  };

  return (
    <GameStateContext.Provider value={{ state, updateFromEngine }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) throw new Error('useGameState must be used within GameStateProvider');
  return context;
}

