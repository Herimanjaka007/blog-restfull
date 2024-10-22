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
]

export default validateBlog;