'use client';

import { useState } from 'react';
import { GameCanvas } from '@/components/game-canvas';
import { GameHUD } from '@/components/game-hud';
import { GameStateProvider } from '@/hooks/use-game-state';
import { Badge } from '@/components/ui/badge';
import { HeroSelection, type HeroArchetype } from '@/components/hero-selection';

export default function Home() {
  const [selectedHero, setSelectedHero] = useState<HeroArchetype | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleHeroSelect = (hero: HeroArchetype) => {
    setSelectedHero(hero);
    setGameStarted(true);
  };

  return (
    <GameStateProvider>
      <div className="min-h-screen bg-black flex flex-col overflow-hidden">
        {/* Header / HUD Top */}
        <header className="fixed top-0 left-0 right-0 z-10 border-b border-slate-800 bg-black/80 backdrop-blur-md p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white tracking-widest uppercase italic">Footmen Frenzyyy!</h1>
            <Badge variant="outline" className="border-blue-500 text-blue-400">v0.1-alpha</Badge>
          </div>
          {gameStarted && (
            <div className="flex gap-6 text-sm">
              <div className="text-slate-400">Hero: <span className="text-blue-400 font-bold uppercase">{selectedHero?.name}</span></div>
              <div className="text-slate-400">Team Score: <span className="text-white font-bold">0</span></div>
            </div>
          )}
        </header>

        {/* Main Area */}
        <main className="flex-1 relative flex items-center justify-center pt-16">
          {!gameStarted ? (
            <HeroSelection onSelect={handleHeroSelect} />
          ) : (
            <>
              <GameCanvas selectedHeroId={selectedHero?.id} />
              <GameHUD />
            </>
          )}
        </main>
      </div>
    </GameStateProvider>
  );
}

