const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// IMPORT ROUTES
// Pastikan nama file di folder routes adalah authRoutes.js
const authRoutes = require("./routes/authRoutes"); 
const userRoutes = require("./routes/userRoutes");
const absensiRoutes = require("./routes/absensi");
const roleRoutes = require("./routes/role");
const logRoutes = require("./routes/log");

// IMPORT MIDDLEWARE
// Menggunakan { } karena biasanya di-export sebagai objek
const { errorHandler } = require("./middlewares/errorHandler");

// MIDDLEWARE GLOBAL
app.use(cors());
app.use(express.json());

// Agar folder 'uploads' bisa diakses secara publik (Sprint 6)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROOT
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server Backend Absensi Berjalan",
  });
});

// ROUTES
app.use("/auth", authRoutes);    // Untuk Register & Login
app.use("/users", userRoutes);   // Untuk CRUD & Upload Foto
app.use("/absensi", absensiRoutes);
app.use("/role", roleRoutes);
app.use("/log", logRoutes);

// 404 HANDLER
app.use((req, res, next) => {
  const error = new Error("Endpoint tidak ditemukan");
  error.status = 404;
  next(error);
});

// ERROR HANDLER (WAJIB PALING BAWAH)
app.use(errorHandler);

// RUN SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
  console.log(`Cek di Postman: http://localhost:${PORT}`);
});