const db = require("../models/db");

// GET Role
exports.getRole = (req, res) => {
    db.query("SELECT * FROM role", (err, result) => {
        if (err) res.send(err);
        else res.send(result);
    });
};

// ADD Role
exports.addRole = (req, res) => {
    const { nama_role } = req.body;

    db.query(
        "INSERT INTO role (nama_role) VALUES (?)",
        [nama_role],
        (err, result) => {
            if (err) res.send(err);
            else res.send("Role berhasil ditambahkan");
        }
    );
};

// UPDATE Role
exports.updateRole = (req, res) => {
    const { id } = req.params;
    const { nama_role } = req.body;

    db.query(
        "UPDATE role SET nama_role=? WHERE id=?",
        [nama_role, id],
        (err, result) => {
            if (err) res.send(err);
            else res.send("Role berhasil diupdate");
        }
    );
};

// DELETE Role
exports.deleteRole = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM role WHERE id=?",
        [id],
        (err, result) => {
            if (err) res.send(err);
            else res.send("Role berhasil dihapus");
        }
    );
};