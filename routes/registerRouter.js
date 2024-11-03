import express from "express";
import bcrypt from "bcryptjs";

import prisma from "../config/prisma.js";

const register = express.Router();

register.post("/", async (req, res) => {
    try {
        const { username, email, role, password } = req.body;
        const emailInDb = await prisma.user.findFirst({
            where: { email },
            select: { email: true }
        });

        if (emailInDb) {
            return res.json({ errors: {
                message :`Email: ${email} is already in use.`
            } });
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