import prisma from "../config/prisma.js";

const checkResOwner = async (req, res, next) => {
    try {
        const { id: idPost } = req.params;
        const { id: idUser } = req.user;


        const post = await prisma.post.findFirst({
            where: { id: idPost },
            select: { authorId: true }
        });
        if (Number(idUser) !== Number(post?.authorId)) {
            return res.status(401).json({
                message: "Unauthorized, owner only can modify post."
            });
        }
        return next();
    } catch (error) {
        return res.status(500).json({
            message: "Server error, try later."
        })
    }
}

export default checkResOwner;