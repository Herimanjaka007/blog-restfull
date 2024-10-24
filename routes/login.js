import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

import prisma from "../config/prisma.js";

config();
const login = express.Router();

login.post("/", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: { email }
        });

        if (!user) return res.status(401).json({ message: "Wrong email." });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            return res.status(400).json({ message: "Wrong password." });

        const payload = { id: user.id, email: user.email, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "6h" });
        return res.json({
            message: "Authentication succes",
            token,
            user: payload,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error. Try later"
        });
    }
});

export default login;