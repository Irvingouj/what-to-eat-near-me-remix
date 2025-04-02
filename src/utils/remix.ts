import { authenticator } from "../../common/auth/auth.server.js";

export async function getAuthUser(req: import("express").Request) {
  const origin = `${req.protocol}://${req.get("host")}`;
  const url = new URL(req.originalUrl, origin);

  const headers = new Headers();

  // Copy over all headers from Express
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      headers.set(key, value.join(","));
    } else {
      headers.set(key, value);
    }
  }

  const remixRequest = new Request(url.href, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
  });

  return authenticator.isAuthenticated(remixRequest);
}

export async function removeSessionStorage(res: import("express").Response) {
  res.clearCookie(authenticator.sessionKey);
}