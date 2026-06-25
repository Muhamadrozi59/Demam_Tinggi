const express = require("express");
const router = express.Router();

const {
    createAbsensi,
    getAbsensi,
    getRiwayatByUser,
    updateAbsensi,
    deleteAbsensi,
    getAllAbsensi
} = require("../controllers/absensiController");

const { validateAbsensi } = require("../middlewares/validation");

router.post("/", validateAbsensi, createAbsensi);
router.get("/", getAbsensi);
router.get("/riwayat/:user_id", getRiwayatByUser);
router.put("/:id", validateAbsensi, updateAbsensi);
router.delete("/:id", deleteAbsensi);
router.get("/all", getAllAbsensi);


module.exports = router;