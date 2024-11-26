const checkCommentOwner = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { id: idUser } = req.user;

        const comment = await prisma.comment.findFirst({
            where: { id: commentId },
            select: { authorId: true }
        });

        if (Number(idUser) !== Number(comment?.authorId)) {
            return res.status(401).json({
                message: "Unauthorized, owner only can modify comment."
            });
        }
        return next();
    } catch (error) {
        return res.status(500).json({
            message: "Server error, try later."
        })
    }
}

export default checkCommentOwner;