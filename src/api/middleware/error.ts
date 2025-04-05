import { ApiError } from "../../../common/errors/error.js";
import { Request, Response } from "express";

export default function errorHandler(err: Error, req: Request, res: Response) {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
