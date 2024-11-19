import express from "express";

import prisma from "../config/prisma.js";
import validateIdParam from "../validator/validateIdParam.js";
import checkError from "../middleware/checkError.js";

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

export default usersRouter;