import express from 'express';

import validateIdParam from '../validator/validateIdParam.js';
import checkError from '../middleware/checkError.js';
import prisma from '../config/prisma.js';
import authenticate from "../middleware/authenticate.js";

const reactionRouter = express.Router({ mergeParams: true });

/**
 * @openapi
 * /blogs/{id}/reaction:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Blogs
 *    summary: like or dislike a post by the authenticated user.
 *    parameters:
 *      - $ref: "#components/parameters/Id"
 *    responses:
 *      200:
 *        description: Update successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#components/schemas/BlogPost"
 *
 */
reactionRouter.post("/",
    authenticate,
    validateIdParam("id"),
    checkError,
    async (req, res) => {
        const {id: blogId} = req.params;
        const {id: likerId} = req.user

    try {
        const blog = await prisma.post.findUnique({where: {id: blogId}});
        if(!blog) return res.status(404).json({message: `Blog with id: ${blogId} not found.`});

        const like = await prisma.like.findFirst({
                where: {
                    AND: {blogId, likerId}
                }
            }
        );

        if (like){
            await prisma.like.deleteMany({where: {AND: {blogId, likerId}}});
            return res.json({message: "dislike successfully"});
        }else {
            await prisma.like.create({
                data: {
                    blogId,
                    likerId
                }
            })
            return res.json({message: "like successfully"});
        }
    }catch (e) {
        console.log(e);
        return res.status(500).json({message: "Server error, Try later"});
    }
    });

export default reactionRouter;