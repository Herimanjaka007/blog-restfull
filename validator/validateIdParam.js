import { param } from "express-validator";

const validateIdParam = (paramNumberName) => {
    return [
        param(paramNumberName)
            .isInt({ gt: 0 })
            .withMessage(`${paramNumberName} param must be an integer greater than 0.`)
            .bail()
            .toInt()
    ]
}

export default validateIdParam;