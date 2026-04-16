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

// READ
app.get("/users", (req, res) => {
    db.query("SELECT * FROM user", (err, result) => {
        if (err) res.send(err);
        else res.send(result);
    });
});

// CREATE
app.post("/users", (req, res) => {
    const { nama, email, password } = req.body;

    db.query(
        "INSERT INTO user (nama, email, password) VALUES (?, ?, ?)",
        [nama, email, password],
        (err, result) => {
            if (err) res.send(err);
            else res.send("User berhasil ditambahkan");
        }
    );
});

// UPDATE
app.put("/users/:id", (req, res) => {
    const { nama, email, password } = req.body;
    const { id } = req.params;

    db.query(
        "UPDATE user SET nama=?, email=?, password=? WHERE id=?",
        [nama, email, password, id],
        (err, result) => {
            if (err) res.send(err);
            else res.send("User berhasil diupdate");
        }
    );
});

// DELETE
app.delete("/users/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM user WHERE id=?",
        [id],
        (err, result) => {
            if (err) res.send(err);
            else res.send("User berhasil dihapus");
        }
    );
});


// =====================
// CRUD ABSENSI
// =====================

// READ
app.get("/absensi", (req, res) => {
    db.query("SELECT * FROM absensi", (err, result) => {
        if (err) res.send(err);
        else res.send(result);
    });
});

// CREATE
app.post("/absensi", (req, res) => {
    const { user_id, tanggal, waktu } = req.body;

    db.query(
    "INSERT INTO absensi (user_id, tanggal, waktu) VALUES (?, ?, ?)",
    [user_id, tanggal, waktu],
    (err, result) => {
        if (err) res.send(err);
        else {

            // Tambah Log Aktivitas
            db.query(
                "INSERT INTO log_aktivitas (user_id, aktivitas) VALUES (?, ?)",
                [user_id, "Melakukan Absensi"]
            );

            res.send("Absensi berhasil ditambahkan");
        }
    }
);
});

// UPDATE
app.put("/absensi/:id", (req, res) => {
    const { user_id, tanggal, waktu } = req.body;
    const { id } = req.params;

    db.query(
        "UPDATE absensi SET user_id=?, tanggal=?, waktu=? WHERE id=?",
        [user_id, tanggal, waktu, id],
        (err, result) => {
            if (err) res.send(err);
            else res.send("Absensi berhasil diupdate");
        }
    );
});

// DELETE
app.delete("/absensi/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM absensi WHERE id=?",
        [id],
        (err, result) => {
            if (err) res.send(err);
            else res.send("Absensi berhasil dihapus");
        }
    );
});

// =====================
// CRUD ROLE
// =====================

// READ
app.get("/role", (req, res) => {
    db.query("SELECT * FROM role", (err, result) => {
        if (err) res.send(err);
        else res.send(result);
    });
});

// CREATE
app.post("/role", (req, res) => {
    const { role_name } = req.body;

    db.query(
        "INSERT INTO role (role_name) VALUES (?)",
        [role_name],
        (err, result) => {
            if (err) res.send(err);
            else res.send("Role berhasil ditambahkan");
        }
    );
});

// UPDATE
app.put("/role/:id", (req, res) => {
    const { role_name } = req.body;
    const { id } = req.params;

    db.query(
        "UPDATE role SET role_name=? WHERE id=?",
        [role_name, id],
        (err, result) => {
            if (err) res.send(err);
            else res.send("Role berhasil diupdate");
        }
    );
});

// DELETE
app.delete("/role/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM role WHERE id=?",
        [id],
        (err, result) => {
            if (err) res.send(err);
            else res.send("Role berhasil dihapus");
        }
    );
});

// =====================
// CRUD USER ROLE
// =====================

// READ
app.get("/user-role", (req, res) => {
    db.query("SELECT * FROM user_has_role", (err, result) => {
        if (err) res.send(err);
        else res.send(result);
    });
});

// CREATE
app.post("/user-role", (req, res) => {
    const { user_id, role_id } = req.body;

    db.query(
        "INSERT INTO user_has_role (user_id, role_id) VALUES (?, ?)",
        [user_id, role_id],
        (err, result) => {
            if (err) res.send(err);
            else res.send("User role berhasil ditambahkan");
        }
    );
});

// DELETE
app.delete("/user-role/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM user_has_role WHERE id=?",
        [id],
        (err, result) => {
            if (err) res.send(err);
            else res.send("User role berhasil dihapus");
        }
    );
});

// =====================
// CRUD LOG AKTIVITAS
// =====================

// READ
app.get("/log", (req, res) => {
    db.query("SELECT * FROM log_aktivitas", (err, result) => {
        if (err) res.send(err);
        else res.send(result);
    });
});

// CREATE
app.post("/log", (req, res) => {
    const { user_id, aktivitas } = req.body;

    db.query(
        "INSERT INTO log_aktivitas (user_id, aktivitas) VALUES (?, ?)",
        [user_id, aktivitas],
        (err, result) => {
            if (err) res.send(err);
            else res.send("Log aktivitas berhasil ditambahkan");
        }
    );
});

// DELETE
app.delete("/log/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM log_aktivitas WHERE id=?",
        [id],
        (err, result) => {
            if (err) res.send(err);
            else res.send("Log aktivitas berhasil dihapus");
        }
    );
});

// =====================
// JALANKAN SERVER
// =====================

app.listen(3000, () => {
    console.log("Server berjalan di port 3000");
});