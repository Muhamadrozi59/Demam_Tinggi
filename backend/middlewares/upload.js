const multer = require("multer");
const path = require("path");

// Konfigurasi Penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // File simpan di folder uploads/
  },
  filename: (req, file, cb) => {
    // Rename otomatis: waktu-namaasli.ext
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Validasi File
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Batas 2MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf/;
    const extName =
fileTypes.test(
path.extname(file.originalname).toLowerCase()
);
    
    if (extName) {
      cb(null, true);
    } else {
      cb("Error: Hanya boleh upload gambar (JPG/PNG)!");
    }
  }
});

module.exports = upload;