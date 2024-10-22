import { check } from "express-validator";

const validateBlog = [
    check("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required.")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Title must have 3 character at least."),
    check("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required.")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Content must have 3 character at least."),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        return next();
    }
]

export default validateBlog;