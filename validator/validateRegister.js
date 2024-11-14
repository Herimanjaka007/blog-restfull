import { body } from "express-validator";

const validateRegister = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .bail()
    ,
    body("email")
        .trim()
        .isEmail()
        .withMessage("Wrong mail format.")
        .bail()
    ,
    body("password")
        .notEmpty()
        .withMessage("password is required")
    ,
]

export default validateRegister;