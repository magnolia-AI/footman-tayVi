'use client';

import { GameCanvas } from '@/components/game-canvas';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header / HUD Top */}
      <header className="fixed top-0 left-0 right-0 z-10 border-b border-slate-800 bg-black/80 backdrop-blur-md p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">Footmen Frenzy</h1>
          <Badge variant="outline" className="border-blue-500 text-blue-400">v0.1-alpha</Badge>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="text-slate-400">Team Score: <span className="text-white font-bold">0</span></div>
          <div className="text-slate-400">Units: <span className="text-white font-bold">2/100</span></div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex items-center justify-center pt-20 pb-4">
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="p-0">
            <GameCanvas />
          </CardContent>
        </Card>
      </main>

      {/* Hero HUD / Controls */}
      <footer className="fixed bottom-0 left-0 right-0 h-48 bg-slate-900 border-t border-slate-800 p-4 flex gap-4">
        <div className="w-40 h-40 bg-black border border-slate-700 rounded-sm flex flex-col items-center justify-center">
          <div className="text-[10px] text-slate-500 uppercase mb-2">Hero Stats</div>
          <div className="w-16 h-16 bg-blue-900/20 border border-blue-500 rounded-full" />
          <div className="mt-2 text-xs text-white">Lvl 1 Footman</div>
        </div>
        
        <div className="flex-1 bg-black/40 border border-slate-800/50 rounded p-3">
          <div className="grid grid-cols-6 gap-2 h-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-slate-800/30 border border-slate-700 rounded-sm hover:border-blue-500 cursor-pointer transition-colors" />
            ))}
          </div>
        </div>

        <div className="w-64 bg-black/40 border border-slate-800/50 rounded p-3">
          <div className="text-[10px] text-slate-500 uppercase mb-2">Abilities</div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-square bg-slate-800 border border-slate-700 rounded-sm flex items-center justify-center text-xs text-slate-400">Q</div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
