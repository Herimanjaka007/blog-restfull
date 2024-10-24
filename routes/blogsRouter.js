import express from "express";

import prisma from "../config/prisma.js";

const blogsRouter = express.Router();

blogsRouter.post("/", async (req, res) => {
    try {
        //temporary use authorId in body because i have not user connected.
        const { title, content, authorId } = req.body;

        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                author: {
                    connect: { id: authorId }
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
    const blogs = await prisma.post.findMany();
    res.json(blogs);
});

blogsRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id)))
            return res.status(404).json({ message: `Incorrect id.` });

        const blog = await prisma.post.findUnique({
            where: { id: parseInt(id) }
        });

        if (blog)
            return res.json(blog);
        return res.json({ message: `Post with id: ${id} is not found.` });
    } catch (error) {
        res.status(500).json({ message: "Server error, try later." });
    }
});

blogsRouter.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const blog = await prisma.post.update({
            where: { id: Number(id) },
            data: { title, content }
        });
        return res.json({ message: "Update successfull", blog });
    } catch (error) {
        res.status(500).json({ message: "Server error, try later." });
    }
})

blogsRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id)))
            return res.status(404).json({ message: `Incorrect id.` });

        const blog = await prisma.post.delete({
            where: { id: Number(id) }
        })

        if (blog)
            return res.json({ message: "Deleted successfull", blog });
        return res.json({ message: `Post with id: ${id} is not found.` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error, try later." });
    }
});



export default blogsRouter;