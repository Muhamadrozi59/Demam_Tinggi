const express = require("express");
const router = express.Router();

const user = require("../controllers/userController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

// hanya user yang login
router.get("/", authenticate, user.getUsers);

// sebaiknya register di auth, tapi ini boleh sementara
router.post("/", user.addUser);

// hanya user login
router.put("/:id", authenticate, user.updateUser);

// hanya admin yang boleh delete
router.delete("/:id", authenticate, authorize("admin"), user.deleteUser);

module.exports = router;