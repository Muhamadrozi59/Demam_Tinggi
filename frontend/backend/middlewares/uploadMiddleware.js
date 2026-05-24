const multer = require("multer");
const path = require("path");

// KONFIGURASI STORAGE
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    // RENAME FILE OTOMATIS
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

// VALIDASI FILE
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);

    if (ext && mime) {
        cb(null, true);
    } else {
        cb("File harus berupa gambar (jpg, jpeg, png)");
    }
};

// BATAS UKURAN (2MB)
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilter,
});

module.exports = upload;