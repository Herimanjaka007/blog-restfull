import express from "express";
import bcrypt from "bcryptjs";

import prisma from "../config/prisma.js";

const register = express.Router();

register.post("/", async (req, res) => {
    try {
        const { username, email, role, password } = req.body;
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
        res.status(500).json({
            errors: {
                message: error.message ?? "Server error, try later."
            }
        });
    }
})
export default register;