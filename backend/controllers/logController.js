const db = require("../models/db");

// GET LOG
exports.getLog = (req, res) => {
    db.query("SELECT * FROM log_aktivitas", (err, result) => {
        if (err) res.send(err);
        else res.send(result);
    });
};

// ADD LOG
exports.addLog = (req, res) => {
    const { user_id, aktivitas } = req.body;

    db.query(
        "INSERT INTO log_aktivitas (user_id, aktivitas) VALUES (?, ?)",
        [user_id, aktivitas],
        (err, result) => {
            if (err) res.send(err);
            else res.send("Log berhasil ditambahkan");
        }
    );
};

// DELETE LOG
exports.deleteLog = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM log_aktivitas WHERE id=?",
        [id],
        (err, result) => {
            if (err) res.send(err);
            else res.send("Log berhasil dihapus");
        }
    );
};