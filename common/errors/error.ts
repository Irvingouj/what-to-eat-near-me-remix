import { Request, Response } from "express";

export default function errorHandler(err: Error, req: Request, res: Response) {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export class ApiError<T extends object> extends Error {
    constructor(message: string, public statusCode: number, public data: T | undefined = undefined) {
        super(message);
    }
}

export function NotAuthenticatedError() {
    return new ApiError('Not authenticated', 401);
}

export function NotFoundError() {
    return new ApiError('Not found', 404);
}

export type RateLimitExceededErrorData = {
    retryAfter: number;
}

export function RateLimitExceededError<T extends RateLimitExceededErrorData>(data: T) {
    return new ApiError('Rate limit exceeded', 429, data);
}