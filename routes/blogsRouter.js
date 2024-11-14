import express from "express";

import prisma from "../config/prisma.js";
import validateBlog from "../validator/validateBlog.js";
import validateIdParam from "../validator/validateIdParam.js";
import checkError from "../middleware/checkError.js";
import authenticate from "../middleware/authenticate.js";
import checkResOwner from "../middleware/checkResOwner.js";


const blogsRouter = express.Router();

blogsRouter.post("/", authenticate, validateBlog, checkError, async (req, res) => {
    try {
        const { title, content } = req.body;
        const { id } = req.user;
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                author: {
                    connect: { id }
                }
            }
        });

        res.status(201).json(newPost);

    } catch (error) {
        console.log(error);
        res.status(500).json("Server error, try later.");
    }
});

blogsRouter.get("/", async (req, res) => {
try {
        const blogs = await prisma.post.findMany();
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


blogsRouter.get("/:id", validateIdParam, checkError, async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await prisma.post.findUnique({
            where: { id }
        });

        if (blog)
            return res.json(blog);
        return res.json({ message: `Post with id: ${id} is not found.` });
    } catch (error) {
        res.status(500).json({ message: "Server error, try later." });
    }
});

blogsRouter.patch("/:id", authenticate, validateIdParam, checkResOwner, validateBlog, checkError, async (req, res) => {
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

blogsRouter.delete("/:id", authenticate, validateIdParam, checkResOwner, async (req, res) => {
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

export default blogsRouter;