const express = require("express");
const cors = require("cors");

const app = express();

// IMPORT ROUTES
const userRoutes = require("./routes/userRoutes");
const absensiRoutes = require("./routes/absensi");
const roleRoutes = require("./routes/role");
const logRoutes = require("./routes/log");

// IMPORT MIDDLEWARE
const { errorHandler } = require("./middlewares/errorHandler");

// MIDDLEWARE GLOBAL
app.use(cors());
app.use(express.json());

// ROOT
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server Backend Absensi Berjalan"
    });
});

// ROUTES
app.use("/users", userRoutes);
app.use("/absensi", absensiRoutes);
app.use("/role", roleRoutes);
app.use("/log", logRoutes);

// 404 HANDLER (DIARAHKAN KE ERROR HANDLER)
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
});