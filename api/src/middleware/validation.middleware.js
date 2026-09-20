import { AppError } from "../utils/appError.js";

export const validate = (schema) => {
    return (req, res, next) => {
        const validationTargets = ["body", "params", "query"];
        let validationErrors = [];

        for (const target of validationTargets) {
            if (schema[target]) {
                const { error } = schema[target].validate(req[target], { abortEarly: false });
                if (error) {
                    validationErrors.push(...error.details.map((d) => d.message));
                }
            }
        }

        if (validationErrors.length > 0) {
            return next(new AppError(validationErrors.join(", "), 400));
        }

        next();
    };
};
