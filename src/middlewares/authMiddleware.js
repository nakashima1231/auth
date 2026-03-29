const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido" });
        }

        req.user = decoded;
        next();
    });
}

function isAdmin(req, res, next) {
    if(!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
}



module.exports = { authMiddleware, isAdmin };