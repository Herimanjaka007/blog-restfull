import { check } from "express-validator";

const validateComment = check("content")
    .trim()
    .notEmpty()
    .withMessage("Comment is required.")

export default validateComment;