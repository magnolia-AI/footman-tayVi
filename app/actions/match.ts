'use server';

import db from '@/lib/db';
import { matches, playerStats } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { authServer } from '@/lib/auth/server';

export interface MatchResultData {
  winnerId?: string;
  durationSeconds: number;
  kills: number;
  deaths: number;
  goldEarned: number;
  xpGained: number;
  victory: boolean;
}

/**
 * Saves a match outcome and updates player statistics
 */
export async function saveMatchResult(data: MatchResultData) {
  const sessionResponse = await authServer.getSession();
  if (sessionResponse.error || !sessionResponse.data?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = sessionResponse.data.user.id;

  // 1. Record the match
  const [newMatch] = await db.insert(matches).values({
    winnerId: data.victory ? userId : null,
    durationSeconds: data.durationSeconds,
    endedAt: new Date(),
  }).returning();

  // 2. Update player stats
  // We use an upsert-like pattern or check existence
  const existingStats = await db.select().from(playerStats).where(eq(playerStats.userId, userId)).limit(1);

  if (existingStats.length === 0) {
    // Initialize stats if they don't exist
    await db.insert(playerStats).values({
      userId,
      totalWins: data.victory ? 1 : 0,
      totalLosses: data.victory ? 0 : 1,
      totalKills: data.kills,
      totalDeaths: data.deaths,
      experiencePoints: data.xpGained,
      goldEarned: data.goldEarned,
      updatedAt: new Date(),
    });
  } else {
    // Update existing stats
    await db.update(playerStats)
      .set({
        totalWins: sql`${playerStats.totalWins} + ${data.victory ? 1 : 0}`,
        totalLosses: sql`${playerStats.totalLosses} + ${data.victory ? 0 : 1}`,
        totalKills: sql`${playerStats.totalKills} + ${data.kills}`,
        totalDeaths: sql`${playerStats.totalDeaths} + ${data.deaths}`,
        experiencePoints: sql`${playerStats.experiencePoints} + ${data.xpGained}`,
        goldEarned: sql`${playerStats.goldEarned} + ${data.goldEarned}`,
        updatedAt: new Date(),
      })
      .where(eq(playerStats.userId, userId));
  }

  revalidatePath('/account/settings'); // Or wherever profile stats are shown
  return { matchId: newMatch.id };
}

/**
 * Gets match details by ID
 */
export async function getMatchDetails(matchId: number) {
  const result = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
  return result[0] || null;
}
