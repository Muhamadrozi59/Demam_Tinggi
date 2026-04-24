const db = require("../models/db");

// CREATE
const createAbsensi = async (req, res, next) => {
    try {
        const { user_id, tanggal, waktu } = req.body;

        db.query(
            "INSERT INTO absensi (user_id, tanggal, waktu) VALUES (?, ?, ?)",
            [user_id, tanggal, waktu],
            (err, result) => {
                if (err) return next(err);

                res.status(201).json({
                    status: "success",
                    message: "Absensi berhasil ditambahkan",
                    data: result
                });
            }
        );
    } catch (err) {
        next(err);
    }
};

// READ
const getAbsensi = (req, res, next) => {
    try {
        db.query("SELECT * FROM absensi", (err, result) => {
            if (err) return next(err);

            res.json({
                status: "success",
                data: result
            });
        });
    } catch (err) {
        next(err);
    }
};

// UPDATE
const updateAbsensi = (req, res, next) => {
    try {
        const { id } = req.params;
        const { user_id, tanggal, waktu } = req.body;

        db.query(
            "UPDATE absensi SET user_id=?, tanggal=?, waktu=? WHERE id=?",
            [user_id, tanggal, waktu, id],
            (err, result) => {
                if (err) return next(err);

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        status: "error",
                        message: "Data tidak ditemukan"
                    });
                }

                res.json({
                    status: "success",
                    message: "Data berhasil diupdate"
                });
            }
        );
    } catch (err) {
        next(err);
    }
};

// DELETE
const deleteAbsensi = (req, res, next) => {
    try {
        const { id } = req.params;

        db.query(
            "DELETE FROM absensi WHERE id=?",
            [id],
            (err, result) => {
                if (err) return next(err);

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        status: "error",
                        message: "Data tidak ditemukan"
                    });
                }

                res.json({
                    status: "success",
                    message: "Data berhasil dihapus"
                });
            }
        );
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createAbsensi,
    getAbsensi,
    updateAbsensi,
    deleteAbsensi
};