const express = require("express");
const router = express.Router();

const absensi = require("../controllers/absensiController");

router.get("/", absensi.getAbsensi);
router.post("/", absensi.addAbsensi);
router.put("/:id", absensi.updateAbsensi);
router.delete("/:id", absensi.deleteAbsensi);

module.exports = router;