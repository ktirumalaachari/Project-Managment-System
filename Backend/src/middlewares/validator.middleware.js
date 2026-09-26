import { body, param, query, validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    
    const extractedErrors = [];
    errors.array().forEach((error) => extractedErrors.push({
        [error.path]: error.msg
    }));

    throw new ApiError(422, "Received data is not valid", extractedErrors);
};

// Example: validate project creation
export const validateProjectCreation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  validate
];