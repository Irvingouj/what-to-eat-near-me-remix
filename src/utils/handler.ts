import { NextFunction, Request, Response } from "express";



export function middleware(innerHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await innerHandler(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

export const handler = middleware;