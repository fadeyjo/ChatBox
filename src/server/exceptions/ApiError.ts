import { ValidationError } from "express-validator";

export default class ApiError extends Error {
    status: number;
    errors: ValidationError[];

    constructor(message: string, status: number, errors: ValidationError[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static BadRequest(message: string, errors: ValidationError[] = []) {
        return new ApiError(message, 400, errors);
    }

    static UnauthorizedError() {
        return new ApiError("Unauthorized error", 401)
    }

    static ResourseNotFound() {
        return new ApiError("Resource not found", 404)
    }
}
