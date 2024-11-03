import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
        return res.status(401).json({ message: "Authorization required." });
    }
    const [, token] = authorization.split(" ");
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        res.status(401).json({
            message: error.message ?? "Token invalid or expired."
        });
    }
};

export default authenticate;