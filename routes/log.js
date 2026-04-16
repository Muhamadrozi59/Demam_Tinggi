const express = require("express");
const router = express.Router();

const log = require("../controllers/logController");

router.get("/", log.getLog);
router.post("/", log.addLog);
router.delete("/:id", log.deleteLog);

module.exports = router;