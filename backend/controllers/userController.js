const db = require("../models/db");

// GET USERS
exports.getUsers = (req, res, next) => {
    db.query("SELECT * FROM user", (err, result) => {
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

    db.query("SELECT * FROM user WHERE id=?", [id], (err, result) => {
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

// CREATE USER
exports.addUser = (req, res, next) => {
    const { nama, email, password } = req.body;

    db.query(
        "INSERT INTO user (nama,email,password) VALUES (?,?,?)",
        [nama, email, password],
        (err, result) => {
            if (err) return next(err);

            res.status(201).json({
                status: "success",
                message: "User berhasil ditambahkan",
                data: result
            });
        }
    );
};

// UPDATE USER
exports.updateUser = (req, res, next) => {
    const id = req.params.id;
    const { nama, email, password } = req.body;

    db.query(
        "UPDATE user SET nama=?,email=?,password=? WHERE id=?",
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
        "DELETE FROM user WHERE id=?",
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