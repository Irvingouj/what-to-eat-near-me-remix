import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { getSessionStorage } from "./session.server.js";
import { eq } from 'drizzle-orm';
import { users, tokens } from "../db/schema.js";
import { db } from "../db/index.js";

// Define the User type based on our Drizzle schema
type Cookie = Pick<typeof users.$inferSelect, "id">;

// Create an instance of the authenticator
export const authenticator = new Authenticator<Cookie>(getSessionStorage());

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials");
}

authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.VITE_PUBLIC_APPLICATION_URL}/auth/google/callback`,
    },
    async ({ accessToken, refreshToken, extraParams, profile }) => {
      // Get or create the user
      let user = await db.query.users.findFirst({
        where: eq(users.googleId, profile.id),
      });

      if (!user) {
        // Create a new user
        const [newUser] = await db.insert(users)
          .values({
            id: crypto.randomUUID(),
            email: profile.emails[0].value,
            name: profile.displayName,
            avatarUrl: profile.photos?.[0]?.value,
            googleId: profile.id,
          })
          .returning();
        user = newUser;
      }

      // Update or create token
      const expiresAt = new Date(Date.now() + extraParams.expires_in * 1000);

      const existingToken = await db.select().from(tokens).where(eq(tokens.userId, user.id)).limit(1).then(rows => rows[0]);

      if (existingToken) {
        await db.update(tokens)
          .set({
            accessToken,
            refreshToken: refreshToken ?? undefined,
            expiresAt,
            updatedAt: new Date(),
          })
          .where(eq(tokens.userId, user.id));
      } else {
        await db.insert(tokens)
          .values({
            id: crypto.randomUUID(),
            userId: user.id,
            accessToken,
            refreshToken: refreshToken ?? undefined,
            expiresAt,
            provider: 'google',
          });
      }

      // Safety
      return { id: user.id };
    }
  )
); 