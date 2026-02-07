import { pgTable, serial, varchar, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';
import { neonAuthUser } from './neon-auth-schema';

/**
 * Footmen Frenzy Game Tables
 */

// Table for storing match results
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  winnerId: uuid('winner_id')
    .references(() => neonAuthUser.id, { onDelete: 'set null' }),
  mapName: varchar('map_name', { length: 100 }).default('Footmen Frenzy Standard').notNull(),
  durationSeconds: integer('duration_seconds'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
});

// Table for persistent player statistics
export const playerStats = pgTable('player_stats', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => neonAuthUser.id, { onDelete: 'cascade' }),
  totalWins: integer('total_wins').default(0).notNull(),
  totalLosses: integer('total_losses').default(0).notNull(),
  totalKills: integer('total_kills').default(0).notNull(),
  totalDeaths: integer('total_deaths').default(0).notNull(),
  experiencePoints: integer('experience_points').default(0).notNull(),
  goldEarned: integer('gold_earned').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Table for tracking hero unlocks per player
export const heroUnlocks = pgTable('hero_unlocks', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => neonAuthUser.id, { onDelete: 'cascade' }),
  heroId: varchar('hero_id', { length: 50 }).notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
});

// Type exports
export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;

export type PlayerStats = typeof playerStats.$inferSelect;
export type NewPlayerStats = typeof playerStats.$inferInsert;

export type HeroUnlock = typeof heroUnlocks.$inferSelect;
export type NewHeroUnlock = typeof heroUnlocks.$inferInsert;

export type {
  NeonAuthUser,
  NeonAuthSession,
  NeonAuthAccount,
  NeonAuthVerification,
  NeonAuthOrganization,
  NeonAuthMember,
  NeonAuthInvitation,
} from './neon-auth-schema';

