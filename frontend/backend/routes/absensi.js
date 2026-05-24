const express = require("express");
const router = express.Router();

const {
    createAbsensi,
    getAbsensi,
    updateAbsensi,
    deleteAbsensi
} = require("../controllers/absensiController");

const { validateAbsensi } = require("../middlewares/validation");

router.post("/", validateAbsensi, createAbsensi);
router.get("/", getAbsensi);
router.put("/:id", validateAbsensi, updateAbsensi);
router.delete("/:id", deleteAbsensi);

module.exports = router;