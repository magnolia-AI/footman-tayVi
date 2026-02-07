import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { authServer } from '@/lib/auth/server';
import { getMatchDetails } from '@/app/actions/match';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trophy, Skull, Clock, TrendingUp, Home } from 'lucide-react';

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchSummaryPage({ params }: MatchPageProps) {
  const sessionResponse = await authServer.getSession();
  if (sessionResponse.error || !sessionResponse.data?.user) {
    redirect('/auth/sign-in');
  }

  const user = sessionResponse.data.user;
  const { id } = await params;
  const matchId = parseInt(id);

  if (isNaN(matchId)) {
    notFound();
  }

  const match = await getMatchDetails(matchId);

  if (!match) {
    notFound();
  }

  const isWinner = match.winnerId === user.id;
  const durationMinutes = Math.floor((match.durationSeconds || 0) / 60);
  const durationSeconds = (match.durationSeconds || 0) % 60;

  return (
    <main className="container max-w-2xl mx-auto py-12 px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${isWinner ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'}`}>
              <Trophy className="w-12 h-12" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold italic tracking-tighter uppercase">
            {isWinner ? 'Victory' : 'Defeat'}
          </CardTitle>
          <CardDescription>
            Match Summary • {match.mapName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Clock className="w-5 h-5 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground uppercase">Duration</span>
              <span className="text-2xl font-bold">
                {durationMinutes}m {durationSeconds}s
              </span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <TrendingUp className="w-5 h-5 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground uppercase">XP Gained</span>
              <span className="text-2xl font-bold text-green-600">
                +{isWinner ? '500' : '150'}
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold uppercase tracking-wider">Player Performance</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={isWinner ? 'default' : 'secondary'}>
                {isWinner ? 'Winner' : 'Participant'}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Match ID</span>
              <span className="font-mono text-xs">#{match.id.toString().padStart(6, '0')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Finished At</span>
              <span>{match.endedAt ? new Date(match.endedAt).toLocaleString() : 'N/A'}</span>
            </div>
          </div>

          <div className="pt-6 flex flex-col gap-3">
            <Button asChild className="w-full uppercase font-bold tracking-widest py-6">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Return to Camp
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/account/settings">
                View Career Stats
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
