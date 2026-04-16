const express = require("express");
const cors = require("cors");
const db = require("./models/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Backend Absensi Berjalan");
});


// =====================
// CRUD USER
// =====================

// ✅ READ (SUDAH ADA)
app.get("/users", (req, res) => {
    db.query("SELECT * FROM user", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});


// ✅ CREATE
app.post("/users", (req, res) => {
    const { nama, email, password } = req.body;

    db.query(
        "INSERT INTO user (nama, email, password) VALUES (?, ?, ?)",
        [nama, email, password],
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send("User berhasil ditambahkan");
            }
        }
    );
});


// ✅ UPDATE
app.put("/users/:id", (req, res) => {
    const { nama, email, password } = req.body;
    const { id } = req.params;

    db.query(
        "UPDATE user SET nama=?, email=?, password=? WHERE id=?",
        [nama, email, password, id],
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send("User berhasil diupdate");
            }
        }
    );
});


// ✅ DELETE
app.delete("/users/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM user WHERE id=?",
        [id],
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send("User berhasil dihapus");
            }
        }
    );
});


// =====================
// JALANKAN SERVER
// =====================
app.listen(3000, () => {
    console.log("Server berjalan di port 3000");
});