import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/ApiError";

export default (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(error);
    if (error instanceof ApiError) {
        res.status(error.status).json({
            message: error.message,
            errors: error.errors,
        });
    } else {
        res.status(500).json({ message: "Unknown error", errors: error });
    }
};
