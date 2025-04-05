import { NextFunction, Request, Response } from "express";
import { getAuthUser } from "../../utils/remix.js";
import { db } from "../../../common/db/index.js";
import { users } from "../../../common/db/schema.js";
import { NotAuthenticatedError } from "../../../common/errors/error.js";
import { middleware } from "../../utils/handler.js";
const PROTECTED_ROUTES = ['/nearby'];

async function authMiddlewareImpl(req: Request, res: Response, next: NextFunction) {
    const path = req.path;

    for (const route of PROTECTED_ROUTES) {
        if (path.startsWith(route)) {
            try {
                const authenticated = await getAuthUser(req);

                if (!authenticated) {
                    throw NotAuthenticatedError();
                }
                const user = await db.query.users.findFirst({
                    where: (users, { eq }) => eq(users.id, authenticated?.id),
                });

                if (!user) {
                    throw NotAuthenticatedError();
                }

                res.locals.user = user;
                next();
            } catch (error) {
                next(error);
            }
            return;
        }
    }

    next();
}

export function getUser(res: Response) {
    if (!res.locals.user) {
        throw NotAuthenticatedError();
    }

    return res.locals.user as typeof users.$inferSelect;
}

export const authMiddleware = middleware(authMiddlewareImpl);