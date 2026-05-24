const errorHandler = (err, req, res, next) => {
    console.error("ERROR:", err.message);

    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Terjadi kesalahan pada server"
    });
};

module.exports = { errorHandler };