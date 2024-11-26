import prisma from "../config/prisma.js";

const canDeleteComment = async (req, res, next) => {
    const { commentId } = req.params;
    const { id: idUser } = req.user;
    const { id: idPost } = req.params;


    const post = await prisma.post.findFirst({
        where: { id: idPost },
        select: { authorId: true }
    });

    const comment = await prisma.comment.findFirst({
        where: { id: commentId },
        select: { authorId: true }
    });

    const isCommentOwner = Number(idUser) === Number(comment?.authorId);
    const isPostOwner = Number(idUser) === Number(post?.authorId);

    if (isCommentOwner || isPostOwner) {
        return next();
    }
    return res.status(401).json({
        message: "Unauthorized, owner only can modify comment."
    });
}

export default canDeleteComment;