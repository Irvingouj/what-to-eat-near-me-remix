import { pgTable, text, timestamp, varchar, jsonb, index, customType } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: varchar('email').notNull().unique(),
    name: varchar('name'),
    avatarUrl: varchar('avatar_url'),
    googleId: varchar('google_id').notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const tokens = pgTable('tokens', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at').notNull(),
    provider: varchar('provider').notNull().default('google'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

const location = customType<{
    data: string; // e.g., "POINT(lon lat)"
    driverData: string;
}>({
    dataType() {
        return 'geography(Point, 4326)';
    },
});

export const places = pgTable('places', {
    id: text('id').primaryKey(),
    location: location('location').notNull(),
    data: jsonb('data'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    index('location').on(table.location),
]);
