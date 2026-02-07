'use client';

import React from 'react';
import { useGameState } from '@/hooks/use-game-state';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trophy, Skull } from 'lucide-react';
export const GameHUD: React.FC = () => {
  const { state } = useGameState();
  const router = useRouter();
  const hero = state.selectedEntity;

  if (state.isGameOver) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50 animate-in fade-in duration-500">
        <Card className="max-w-md w-full p-8 text-center space-y-6 border-slate-700 bg-slate-900 shadow-2xl">
          <div className="flex justify-center flex-col items-center gap-4">
            <div className={cn(
               "p-6 rounded-full",
               state.victory ? "bg-yellow-100 text-yellow-600" : "bg-slate-200 text-slate-600"
            )}>
              {state.victory ? <Trophy size={64} /> : <Skull size={64} />}
            </div>
            <h2 className="text-4xl font-extrabold tracking-tighter uppercase italic italic">
              {state.victory ? "Victory" : "Defeat"}
            </h2>
          </div>
          
          <p className="text-slate-400">
            {state.victory 
              ? "The enemy base has been destroyed! You have stood your ground and claimed victory in the arena."
              : "Your base has fallen. Regroup and prepare for the next battle, Footman."}
          </p>

          <Button 
            className="w-full py-8 text-xl font-black uppercase tracking-widest" 
            onClick={() => {
              if (state.matchId) {
                router.push(`/match/${state.matchId}`);
              } else {
                router.push('/');
              }
            }}
          >
            Match Summary
          </Button>
        </Card>
      </div>
    );
  }

  if (!hero) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 pointer-events-none">
      <Card className="bg-slate-900/90 border-slate-700 p-4 flex gap-6 items-end pointer-events-auto shadow-2xl backdrop-blur-sm">
        
        {/* Hero Portrait & Level */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-slate-800 rounded-md border-2 border-slate-600 flex items-center justify-center overflow-hidden">
             {/* We can add a portrait image here later */}
             <div className="text-slate-500 font-bold text-2xl">?</div>
          </div>
          <div className="bg-yellow-600 text-white px-2 py-0.5 rounded text-xs font-bold">
            LVL {hero.level?.level || 1}
          </div>
        </div>

        {/* Stats Bars */}
        <div className="flex-1 flex flex-col gap-3 pb-2">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-white font-bold px-1 uppercase tracking-wider">
              <span>Health</span>
              <span>{Math.round(hero.health?.current || 0)} / {hero.health?.max || 0}</span>
            </div>
            <Progress 
              value={((hero.health?.current || 0) / (hero.health?.max || 1)) * 100} 
              className="h-4 bg-slate-800 border border-slate-700"
              style={{ '--progress-foreground': '#ef4444' } as any}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-white font-bold px-1 uppercase tracking-wider">
              <span>Mana</span>
              <span>{Math.round(hero.mana?.current || 0)} / {hero.mana?.max || 0}</span>
            </div>
            <Progress 
              value={((hero.mana?.current || 0) / (hero.mana?.max || 1)) * 100} 
              className="h-4 bg-slate-800 border border-slate-700"
              style={{ '--progress-foreground': '#3b82f6' } as any}
            />
          </div>

          {/* XP Bar */}
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 mt-1">
             <div 
               className="h-full bg-purple-500 transition-all duration-300"
               style={{ width: `${((hero.level?.exp || 0) / (hero.level?.next || 1)) * 100}%` }}
             />
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-3 gap-1 content-end">
          {Array.from({ length: 6 }).map((_, i) => {
            const item = hero.inventory?.[i];
            return (
              <div 
                key={i}
                className={cn(
                  "w-12 h-12 rounded border-2 flex items-center justify-center transition-colors",
                  item ? "bg-slate-700 border-slate-500" : "bg-slate-800/50 border-slate-700/50"
                )}
              >
                {item ? (
                   <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-slate-700 text-[10px] font-bold uppercase">{i + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
