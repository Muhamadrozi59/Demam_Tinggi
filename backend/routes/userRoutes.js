const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { validateUser } = require("../middlewares/validation");
const upload = require("../middlewares/upload"); // <--- 1. IMPORT MIDDLEWARE MULTER

// GET semua user
router.get("/", userController.getUsers);

// CREATE user
router.post("/", validateUser, userController.addUser);

// --- 2. TAMBAHKAN RUTE UPLOAD DI SINI ---
// Alamatnya jadi: /users/upload/:id
router.post("/upload/:id", upload.single("foto"), userController.uploadFoto);

// UPDATE user
router.put("/:id", validateUser, userController.updateUser);

// DELETE user
router.delete("/:id", userController.deleteUser);

router.get("/:id", userController.getUserById);

module.exports = router;