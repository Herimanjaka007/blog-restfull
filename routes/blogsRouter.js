import express from "express";

import prisma from "../config/prisma.js";
import validateBlog from "../validator/validateBlog.js";
import validateIdParam from "../validator/validateIdParam.js";
import checkError from "../middleware/checkError.js";
import authenticate from "../middleware/authenticate.js";
import checkResOwner from "../middleware/checkResOwner.js";
import uploadFileToSupabase from "../config/supabase.js";
import upload from "../config/multer.js";
import commentsRouter from "./commentsRouter.js";

const blogsRouter = express.Router();
/**
 * @openapi
 * /blogs:
 *   post:
 *     security:
 *          - bearerAuth : []
 *     summary: Create a new blog post
 *     description: Creates a new blog post authored by the authenticated user. The user must be authenticated, and the request body must include a valid title and content.
 *     tags:
 *       - Blogs
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *              schema:
 *                  $ref: "#components/schemas/BlogField"
 *     responses:
 *       201:
 *         description: Blog post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: "#components/schemas/BlogPost"
 *       400:
 *         description: Invalid request data.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Validation error: title and content are required."
 *       401:
 *         description: Unauthorized, authentication required.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Unauthorized access."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: "#components/schemas/ErrorResponse"
 */

blogsRouter.post("/", authenticate, upload.single("image"), validateBlog, checkError, async (req, res) => {
    try {
        const { title, content } = req.body;
        const { id, username } = req.user;
        var imageUrl = null;

        if (req.file) {
            const { buffer, mimetype } = req.file;
            const fileName = `${username}/post/${Date.now()}`;
            imageUrl = await uploadFileToSupabase(buffer, fileName, mimetype);
        }

        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                image: imageUrl,
                author: {
                    connect: { id }
                }
            },
        });

        res.status(201).json(newPost);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error, try later." });
    }
});


/**
 * @openapi
 * /blogs:
 *   get:
 *     summary: Retrieve all blog posts
 *     description: Fetches a list of all blog posts from the database.
 *     tags:
 *       - Blogs
 *     responses:
 *       200:
 *         description: A list of blog posts retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: "#components/schemas/BlogPost"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: "#components/schemas/ErrorResponse"
 */
blogsRouter.get("/", async (req, res) => {
    try {
        const blogs = await prisma.post.findMany({
            include: { author: true, comment: true, }
        });
        res.json(blogs);
    } catch (error) {
        console.log(error?.message);
        res.status(500).json({
            errors: {
                message: "Internal server error, try later."
            }
        })
    }
});

/**
 * @openapi
 * /blogs/{id}:
 *   get:
 *     parameters:
 *       -  $ref: "#/components/parameters/Id"
 *     summary: Retrieve a blog post by ID
 *     description: Fetches the details of a single blog post based on the provided ID.
 *     tags:
 *          - Blogs
 * 
 *     responses:
 *       200:
 *         description: Blog post retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       404:
 *         description: Blog post not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Not found message.
 *                   example: "Post with id: 92 is not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
blogsRouter.get("/:id", validateIdParam("id"), checkError, async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await prisma.post.findUnique({
            where: { id },
            include: { comment: true, author: true }
        });

        if (blog)
            return res.json(blog);
        return res.status(404).json({ message: `Post with id: ${id} is not found.` });
    } catch (error) {
        res.status(500).json({ message: "Server error, try later." });
    }
});

/**
 * @openapi
 * /blogs/{id}:
 *  put:
 *      security: 
 *          - bearerAuth: []
 *      summary: Update blog fields (title, content)
 *      description: Update blog fields (title, content)
 *      parameters:
 *          - $ref: "#/components/parameters/Id"
 *      tags: 
 *          - Blogs
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/BlogField"
 *      responses:
 *          200:
 *              description: Update successfull.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref : "#components/schemas/BlogPost"
 * 
 */
blogsRouter.put("/:id", authenticate, validateIdParam("id"), checkResOwner, validateBlog, checkError, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const blog = await prisma.post.update({
            where: { id },
            data: { title, content }
        });
        return res.json({ message: "Update successfull", blog });
    } catch (error) {
        res.status(500).json({ message: "Server error, try later." });
    }
})

/**
 * @openapi
 * /blogs/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Blogs
 *      summary: Delete a specific blog
 *      parameters:
 *          - $ref: "#components/parameters/Id"
 *      responses:
 *          200:
 *              description: Delete successfull.
 *          401:
 *              description: Authorization required
 */
blogsRouter.delete("/:id", authenticate, validateIdParam("id"), checkResOwner, async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await prisma.post.delete({
            where: { id: Number(id) }
        });

        if (blog)
            return res.json({ message: "Deleted successfull", blog });
        return res.json({ message: `Post with id: ${id} is not found.` });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error, try later." });
    }
});

blogsRouter.use("/:id/comments", validateIdParam("id"), commentsRouter);

export default blogsRouter;