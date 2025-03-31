import { NextFunction, Request, Response } from "express";
import { getAuthUser } from "../../utils/remix.js";

const PROTECTED_ROUTES = ['/nearby'];

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const path = req.path;

    for (const route of PROTECTED_ROUTES) {
        if (path.startsWith(route)) {
            try {
                const authenticated = await getAuthUser(req);
                if (!authenticated) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                return next();
            } catch (error) {
                return next(error);
            }
        }
    }

    next();
}
