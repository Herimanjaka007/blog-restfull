const canEditProfile = async (req, res, next) => {
    const { id: idUserConnected } = req.user;
    const { id: idUserToEdit } = req.params;
    if (Number(idUserConnected) != Number(idUserToEdit)) {
        return res.status(401).json({
            message: "Unauthorized, you can only modify your profile"
        });
    }

    next();
}

export default canEditProfile;