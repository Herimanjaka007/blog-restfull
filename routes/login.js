import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

import prisma from "../config/prisma.js";

config();
const login = express.Router();
/**
 * @openapi
 *  components:
 *      schemas:
 *          
 *          User:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: Unique identifier for user
 *                  username:
 *                      type: string
 *                  email:
 *                      type: string
 *                      format: email
 *                  role:
 *                      description: user role, USER by default
 *                      example: ADMIN
 */

/**
 * @openapi
 *  /login:
 *      post:
 *          summary: login with email and password.
 *          tags:
 *              - Login
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  decription: email used to log in
 *                                  format: email
 *                              password:
 *                                  type: string
 *                                  format: password
 *                                  description: your password
 *                      
 *          responses:
 *              200:
 *                  description: Authentication successfull
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#components/schemas/User"
 */
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

        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

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