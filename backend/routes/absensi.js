const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");

const {
    createAbsensi,
    getAbsensi,
    getRiwayatByUser,
    updateAbsensi,
    deleteAbsensi,
    getAllAbsensi,
    getTotalHariIni
} = require("../controllers/absensiController");

const { validateAbsensi } = require("../middlewares/validation");

router.post(
    "/",
    upload.fields([
        { name: "selfie", maxCount: 1 },
        { name: "surat_dokter", maxCount: 1 }
    ]),
    createAbsensi
);
router.get("/", getAbsensi);
router.get("/hari-ini", getTotalHariIni);
router.get("/riwayat/:user_id", getRiwayatByUser);
router.put("/:id", validateAbsensi, updateAbsensi);
router.delete("/:id", deleteAbsensi);
router.get("/all", getAllAbsensi);


module.exports = router;