import express from "express";

import prisma from "../config/prisma.js";
import validateIdParam from "../validator/validateIdParam.js";
import checkError from "../middleware/checkError.js";
import register from "./registerRouter.js";
import upload from "../config/multer.js";
import uploadFileToSupabase from "../config/supabase.js";
import authenticate from "../middleware/authenticate.js";
import canEditProfile from "../middleware/canEditProfile.js";

const usersRouter = express.Router();

/**
 * @openapi
 *  /users:
 *      get:
 *          tags:
 *              - User
 *          summary: Retrieve all users
 *          responses:
 *              200:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: "#/components/schemas/User"
 *              500:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/ErrorResponse"
 */
usersRouter.get("/", async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                profilPicture: true,
            }
        })
        res.json(users);
    } catch (error) {
        console.log(`Error happens when retrieving all user in db, error ${error}`);
        res.status(500).json({
            message: "Internal server error. Try later or report me the bug."
        })
    }
});

usersRouter.use("/register", register);

/**
 * @openapi
 * /users/{id}:
 *    get:
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *      tags:
 *          - User
 *      summary: Retrieve a specific user
 *      description: Retrieve a specific user in db which match with id in parameters
 *      responses:
 *          200:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          500:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/ErrorResponse"
 */
usersRouter.get("/:id", validateIdParam, checkError, async (req, res, next) => {
    try {
        const { id } = req.params;
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                profilPicture: true,
            },
            where: { id }
        });
        return res.json(users);
    } catch (error) {
        console.log(`Error happens when retrieving user with id: ${id}, error: ${error}`);
        res.status(500).json({
            message: "Internal server error. Try later or report."
        })
    }
});

/**
 * @openapi
 *  /users/{id}:
 *      put:
 *          security:
 *              - bearerAuth: []
 *          description: Update user field
 *          tags:
 *              - User
 *          parameters:
 *              - in: path
 *                name: id
 *                type: integer
 *                required: true
 *          requestBody:
 *              required: true
 *              type: object
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  description: new username
 *                                  required: true
 *                                  example: myusername
 *                              image:
 *                                  type: string
 *                                  format: binary
 *                                  description: the profile picture blob
 *          responses:
 *              200:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/User"
 */
usersRouter.put("/:id",
    validateIdParam,
    checkError,
    authenticate,
    canEditProfile,
    upload.single("image"),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { username } = req.user;
            const { username: newUsername } = req.body;
            let imageUrl = null;

            if (req.file) {
                const { buffer, mimetype } = req.file;
                const fileName = `${username}/profile/${Date.now()}`;
                imageUrl = await uploadFileToSupabase(buffer, fileName, mimetype);
            }

            const user = await prisma.user.update({
                where: { id },
                data: {
                    username: newUsername,
                    profilPicture: imageUrl
                },
                select: {
                    id: true,
                    username: true,
                    role: true,
                    profilPicture: true
                }
            });

            return res.json(user);
        } catch (error) {
            console.log(`Error happens when trying to update user profil with id: ${id}
        error: ${error}
        `);
            return res.status(500).json({ message: "Server error, try later or report the bug." })
        }
    });

export default usersRouter;