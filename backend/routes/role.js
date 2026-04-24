const express = require("express");
const router = express.Router();

const role = require("../controllers/roleController");

router.get("/", role.getRole);
router.post("/", role.addRole);
router.put("/:id", role.updateRole);
router.delete("/:id", role.deleteRole);

module.exports = router;