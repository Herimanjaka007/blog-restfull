import express from "express";
import prisma from "../config/prisma.js";

const register = express.Router();

register.post("/", async (req, res) => {
    try {
        const newUser = await prisma.user.create({
            data: req.body,
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