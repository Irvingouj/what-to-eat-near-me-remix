import { ApiError } from "../../../common/errors/error.js";
import { NextFunction, Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
    console.error(err);
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ message: err.message, data: err.data });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
