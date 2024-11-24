import express from "express";
import prisma from "../config/prisma.js";

import checkError from "../middleware/checkError.js";
import authenticate from "../middleware/authenticate.js";
import validateComment from "../validator/validateComment.js";
import validateIdParam from "../validator/validateIdParam.js";

const commentsRouter = express.Router({ mergeParams: true });

/**
 * @openapi
 * /blogs/{id}/comments:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Comments
 *      parameters:
 *          - in: path
 *            name: id
 *            description: unique identifier of a blog to comment
 *            type: integer
 *            required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          content:
 *                              type: string
 *                              description: comment's content
 * 
 *      responses:
 *          200:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#components/schemas/Comment"
 *  
 */
commentsRouter.post("/",
    authenticate,
    validateIdParam,
    validateComment,
    checkError,
    async (req, res) => {
        try {
            const { id: postId } = req.params;
            const { content } = req.body;
            const { id: authorId } = req.user;
            const comment = await prisma.comment.create({
                data: {
                    content,
                    author: {
                        connect: { id: authorId }
                    },
                    post: {
                        connect: { id: postId }
                    }
                }
            });
            res.json(comment);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error, try later or report"
            });
        }
    });
export default commentsRouter;