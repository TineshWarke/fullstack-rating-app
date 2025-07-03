const jwt = require("jsonwebtoken");
const config = require("../../config");

const requireAuth = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token" });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            if (roles.length > 0 && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden: Access denied" });
            }

            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    };
};

module.exports = requireAuth;
