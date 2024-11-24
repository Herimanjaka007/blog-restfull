import { param } from "express-validator";

const validateIdParam = [
    param("id")
        .isInt({ gt: 0 })
        .withMessage("id param must be an integer greater than 0.")
        .bail()
        .toInt()
]

export default validateIdParam;