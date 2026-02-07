'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Sword, Heart } from 'lucide-react';

export type HeroArchetype = {
  id: string;
  name: string;
  description: string;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    health: number;
  };
  image: string;
  color: string;
};

const HEROES: HeroArchetype[] = [
  {
    id: 'mountain-king',
    name: 'Mountain King',
    description: 'A powerful melee warrior who excels in close-quarters combat and area-of-effect stuns.',
    stats: { strength: 24, agility: 12, intelligence: 15, health: 700 },
    image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=200&h=200&auto=format&fit=crop',
    color: 'from-orange-600 to-amber-900',
  },
  {
    id: 'archmage',
    name: 'Archmage',
    description: 'A brilliant tactician on a flying horse, capable of summoning water elementals and restoring mana.',
    stats: { strength: 14, agility: 17, intelligence: 24, health: 450 },
    image: 'https://images.unsplash.com/photo-1516410529446-2c777cb7366d?q=80&w=200&h=200&auto=format&fit=crop',
    color: 'from-blue-600 to-indigo-900',
  },
  {
    id: 'paladin',
    name: 'Paladin',
    description: 'The ultimate supporter. Heals allies, grants armor, and can become invulnerable.',
    stats: { strength: 22, agility: 13, intelligence: 17, health: 650 },
    image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=200&h=200&auto=format&fit=crop',
    color: 'from-yellow-500 to-amber-700',
  },
  {
    id: 'blood-mage',
    name: 'Blood Mage',
    description: 'A dark caster who controls fire, drains mana, and banishes enemies to other realms.',
    stats: { strength: 18, agility: 14, intelligence: 23, health: 500 },
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200&h=200&auto=format&fit=crop',
    color: 'from-red-600 to-rose-950',
  },
];

interface HeroSelectionProps {
  onSelect: (hero: HeroArchetype) => void;
}

export function HeroSelection({ onSelect }: HeroSelectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedHero = HEROES.find(h => h.id === selectedId);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <div className="max-w-6xl w-full flex flex-col gap-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-extrabold text-white uppercase tracking-tighter">Choose Your Hero</h2>
          <p className="text-slate-400">Select a champion to lead your footmen into battle</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HEROES.map((hero) => (
            <Card 
              key={hero.id}
              className={`relative overflow-hidden border-2 transition-all cursor-pointer hover:border-blue-500/50 ${
                selectedId === hero.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-800 bg-slate-900/50'
              }`}
              onClick={() => setSelectedId(hero.id)}
            >
              <div className={`h-2 bg-gradient-to-r ${hero.color}`} />
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex justify-between items-center">
                  {hero.name}
                  {selectedId === hero.id && <Badge className="bg-blue-600">Selected</Badge>}
                </CardTitle>
                <CardDescription className="line-clamp-2">{hero.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Sword className="w-3 h-3 text-red-500" />
                    <span>{hero.stats.strength} STR</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Zap className="w-3 h-3 text-green-500" />
                    <span>{hero.stats.agility} AGI</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Shield className="w-3 h-3 text-blue-500" />
                    <span>{hero.stats.intelligence} INT</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Heart className="w-3 h-3 text-red-400" />
                    <span>{hero.stats.health} HP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            size="lg" 
            disabled={!selectedId}
            className="px-12 py-6 text-lg font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            onClick={() => selectedHero && onSelect(selectedHero)}
          >
            Enter Battle
          </Button>
        </div>
      </div>
    </div>
  );
}

