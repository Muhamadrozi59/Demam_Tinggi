const db = require("../models/db");

// GET USERS
exports.getUsers = (req, res, next) => {
    console.log("MASUK GET USERS");

    db.query("SELECT * FROM users", (err, result) => {
        if (err) return next(err);

        res.status(200).json({
            status: "success",
            message: "Berhasil mengambil data",
            data: result
        });
    });
};

// GET USER BY ID
exports.getUserById = (req, res, next) => {
    const id = req.params.id;

    db.query("SELECT * FROM users WHERE id=?", [id], (err, result) => {
        if (err) return next(err);

        if (result.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "User tidak ditemukan"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Berhasil mengambil user",
            data: result[0]
        });
    });
};

// CREATE USER + FOTO
exports.addUser = (req, res, next) => {
    console.log("MASUK USER CONTROLLER");

    const { nama, email, password } = req.body;

    // ambil file dari multer
    const foto = req.file ? req.file.filename : null;

    db.query(
        "INSERT INTO users (nama,email,password,foto) VALUES (?,?,?,?)",
        [nama, email, password, foto],
        (err, result) => {
            if (err) return next(err);

            res.status(201).json({
                status: "success",
                message: "User berhasil ditambahkan",
                foto: foto
            });
        }
    );
};

// UPDATE USER
exports.updateUser = (req, res, next) => {
    const id = req.params.id;
    const { nama, email, password } = req.body;

    db.query(
        "UPDATE users SET nama=?,email=?,password=? WHERE id=?",
        [nama, email, password, id],
        (err, result) => {
            if (err) return next(err);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "User tidak ditemukan"
                });
            }

            res.status(200).json({
                status: "success",
                message: "User berhasil diupdate"
            });
        }
    );
};

// DELETE USER
exports.deleteUser = (req, res, next) => {
    const id = req.params.id;

    db.query(
        "DELETE FROM users WHERE id=?",
        [id],
        (err, result) => {
            if (err) return next(err);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "User tidak ditemukan"
                });
            }

            res.status(200).json({
                status: "success",
                message: "User berhasil dihapus"
            });
        }
    );
};