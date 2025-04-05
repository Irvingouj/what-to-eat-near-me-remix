import { createCookieSessionStorage } from "@remix-run/node";

let sessionStorage: ReturnType<typeof createCookieSessionStorage>;

export const initSessionStorage = () => {
  if (!process.env.SESSION_SECRET) {
    console.error("SESSION_SECRET is not set");
    process.exit(1);
  }
  sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "_session",
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secrets: [process.env.SESSION_SECRET!],
      secure: process.env.NODE_ENV === "production",
    },
  });
  return sessionStorage;
};

initSessionStorage();
export const getSessionStorage = () => {
  if (!sessionStorage) {
    throw new Error("Session storage not initialized");
  }
  return sessionStorage;
};

// Export the whole sessionStorage object
export const { getSession, commitSession, destroySession } = getSessionStorage();
