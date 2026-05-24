const jwt = require("jsonwebtoken");
const SECRET_KEY = "secret123";

// AUTHENTICATION (cek token)
exports.authenticate = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token)
        return res.status(403).json({ message: "Token tidak ada" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err)
            return res.status(401).json({ message: "Token tidak valid" });

        req.user = decoded;
        next();
    });
};

// AUTHORIZATION (cek role)
exports.authorize = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({
                message: "Akses ditolak",
            });
        }
        next();
    };
};