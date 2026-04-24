const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { validateUser } = require("../middlewares/validation");

// GET semua user
router.get("/", userController.getUsers);

// CREATE user
router.post("/", validateUser, userController.addUser);

// UPDATE user
router.put("/:id", validateUser, userController.updateUser);

// DELETE user
router.delete("/:id", userController.deleteUser);

router.get("/:id", userController.getUserById);

module.exports = router;