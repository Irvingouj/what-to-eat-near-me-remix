import { NextFunction, Request, Response } from "express";
import { getUser } from "./auth.js";
import { db } from "../../../common/db/index.js";
import { rateLimits } from "../../../common/db/schema.js";
import { eq, and } from "drizzle-orm";
import { getConfig } from "../../../common/config.js";
import { RateLimitExceededError, NotAuthenticatedError } from "../../../common/errors/error.js";
import { middleware } from "../../utils/handler.js";

const RATE_LIMIT_ROUTES = ['/nearby'];
async function rateLimiterImpl(req: Request, res: Response, next: NextFunction) {

    if (!RATE_LIMIT_ROUTES.includes(req.path)) {
        return next();
    }

    const user = getUser(res);
    const key = user?.id || req.ip
    if (!key) {
        throw NotAuthenticatedError();
    }
    const type = user?.id ? 'user' : 'ip';
    const config = await getConfig();

    const rateLimit = config.rateLimit.find(r => r.path === req.path)?.[type] ?? config.defaultRateLimit[type];
    const window = config.rateLimit.find(r => r.path === req.path)?.window ?? config.defaultRateLimit.window;
    let isTooManyRequests = false;

    await db.transaction(async (tx) => {

        // Get or create rate limit record
        const record = await tx.query.rateLimits.findFirst({
            where: and(
                eq(rateLimits.key, key),
                eq(rateLimits.type, type),
                eq(rateLimits.path, req.path)
            ),
        });

        const now = Date.now();
        const hits = record?.hits ? record.hits.split(',').map(Number) : [];

        // Remove old timestamps
        const validHits = hits.filter(timestamp => now - timestamp < window);

        if (validHits.length >= rateLimit) {
            isTooManyRequests = true;
        }

        // Add current timestamp
        validHits.push(now);

        // Update or insert rate limit record
        if (record) {
            await tx.update(rateLimits)
                .set({
                    hits: validHits.join(','),
                    updatedAt: new Date()
                })
                .where(and(
                    eq(rateLimits.key, key),
                    eq(rateLimits.type, type)
                ));
        } else {
            await tx.insert(rateLimits).values({
                key,
                type,
                path: req.path,
                hits: validHits.join(','),
            });
        }
    });

    if (isTooManyRequests) {
        throw RateLimitExceededError({ retryAfter: 60 * 60 * 1000 });
    }

    return next();
}


export const rateLimiter = middleware(rateLimiterImpl);