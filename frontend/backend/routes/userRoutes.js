const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { validateUser } = require("../middlewares/validation");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// GET semua user → harus login
router.get("/", authenticate, userController.getUsers);

// GET by ID → harus login
router.get("/:id", authenticate, userController.getUserById);

// CREATE user → hanya admin + upload foto
router.post(
    "/",
    authenticate,
    authorize("admin"),
    upload.single("foto"),
    userController.addUser
);

// UPDATE user → harus login
router.put("/:id", authenticate, validateUser, userController.updateUser);

// DELETE user → hanya admin
router.delete("/:id", authenticate, authorize("admin"), userController.deleteUser);

module.exports = router;