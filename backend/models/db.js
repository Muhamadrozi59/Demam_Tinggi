const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "127.0.0.1", // 🔥 GANTI INI
    user: "root",
    password: "",
    database: "absensi"
});

db.connect((err) => {
    if (err) {
        console.log("Database Error:", err);
    } else {
        console.log("Database Connected");
    }
});

module.exports = db;