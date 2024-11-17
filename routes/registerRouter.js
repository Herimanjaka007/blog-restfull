import express from "express";
import bcrypt from "bcryptjs";

import prisma from "../config/prisma.js";
import validateRegister from "../validator/validateRegister.js";
import checkError from "../middleware/checkError.js";

const register = express.Router();

/**
 * @openapi
 *  /register:
 *      post:
 *          tags:
 *              - register
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#components/schemas/Author"
 *          responses:
 *              201:
 *                  description: registration successfull
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#components/schemas/Author"
 */
register.post("/", validateRegister, checkError, async (req, res) => {
    try {
        const { username, email, role, password } = req.body;
        const emailInDb = await prisma.user.findFirst({
            where: { email },
            select: { email: true }
        });

        if (emailInDb) {
            return res.status(400).json({
                errors: {
                    message: `Email: ${email} is already in use.`
                }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { username, email, role, password: hashedPassword },
            select: {
                username: true,
                email: true,
                role: true,
            }
        });

        res.json(newUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
                message: error.message ?? "Server error, try later."
            }
        });
    }
})
export default register;