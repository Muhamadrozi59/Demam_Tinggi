const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "secret123";

// REGISTER
exports.register = async (req, res) => {
    console.log("MASUK AUTH REGISTER"); // 🔥 TAMBAH INI
    try {
        const { nama, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)",
            [nama, email, hashedPassword, role || "user"],
            (err, result) => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Register berhasil" });
            }
        );
    } catch (error) {
        res.status(500).json(error);
    }
};

// LOGIN
exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.length === 0)
                return res.status(404).json({ message: "User tidak ditemukan" });

            const user = results[0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(401).json({ message: "Password salah" });

            const token = jwt.sign(
                { id: user.id, role: user.role },
                SECRET_KEY,
                { expiresIn: "1h" }
            );

            res.json({ message: "Login berhasil", token });
        }
    );
};