const db = require("../models/db");

// CREATE
const createAbsensi = async (req, res, next) => {
    try {
        const { user_id, tanggal, waktu, status, kelas, jadwal } = req.body;

        let selfie = req.body.selfie;
let surat_dokter = req.body.surat_dokter;

if (req.files && req.files.selfie) {
    selfie = req.files.selfie[0].filename;
}

if (req.files && req.files.surat_dokter) {
    surat_dokter = req.files.surat_dokter[0].filename;
}

console.log("========== CREATE ABSENSI ==========");

console.log("BODY:");
console.log(req.body);

console.log("FILES:");
console.log(req.files);

console.log("SELFIE:");
console.log(selfie);

console.log("SURAT DOKTER:");
console.log(surat_dokter);

console.log("====================================");

        // Cek apakah user sudah melakukan presensi dalam 7 hari terakhir
db.query(
    `SELECT tanggal
     FROM absensi
     WHERE user_id = ?
     ORDER BY tanggal DESC
     LIMIT 1`,
    [user_id],
    (err, hasil) => {
        if (err) return next(err);

        if (hasil.length > 0) {
            const tanggalTerakhir = new Date(hasil[0].tanggal);
            const tanggalSekarang = new Date();

            const tanggalBolehAbsen = new Date(tanggalTerakhir);
            tanggalBolehAbsen.setDate(tanggalBolehAbsen.getDate() + 7);

            if (tanggalSekarang < tanggalBolehAbsen) {
                return res.status(400).json({
    status: "error",
    message:
        `Anda telah melakukan presensi untuk pertemuan ini. Presensi berikutnya dapat dilakukan mulai tanggal ${tanggalBolehAbsen.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })}.`
});
            }
        }

        // Jika sudah lewat 7 hari, simpan presensi
        db.query(
            "INSERT INTO absensi (user_id, tanggal, waktu, status, kelas, jadwal, selfie, surat_dokter) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                user_id,
                tanggal,
                waktu,
                status,
                kelas,
                jadwal,
                selfie,
                surat_dokter
            ],
            (err, result) => {
                if (err) return next(err);

                res.status(201).json({
                    status: "success",
                    message: "Absensi berhasil ditambahkan",
                    data: result
                });
            }
        );
    }
);

    } catch (err) {
        next(err);
    }
};

// READ
const getAbsensi = (req, res, next) => {
    try {
        db.query("SELECT * FROM absensi", (err, result) => {
            if (err) return next(err);

            res.json({
                status: "success",
                data: result
            });
        });
    } catch (err) {
        next(err);
    }
};

// READ BY USER (RIWAYAT ABSENSI)
const getRiwayatByUser = (req, res, next) => {
    try {
        const { user_id } = req.params;

        db.query(
            "SELECT * FROM absensi WHERE user_id = ? ORDER BY tanggal DESC, waktu DESC",
            [user_id],
            (err, result) => {
                if (err) return next(err);

                res.json({
                    status: "success",
                    data: result
                });
            }
        );
    } catch (err) {
        next(err);
    }
};

// UPDATE
const updateAbsensi = (req, res, next) => {
    try {
        const { id } = req.params;
        const { user_id, tanggal, waktu, status, kelas, jadwal } = req.body;

        let selfie = null;
let surat_dokter = null;

if (req.files && req.files.selfie) {
    selfie = req.files.selfie[0].filename;
}

if (req.files && req.files.surat_dokter) {
    surat_dokter = req.files.surat_dokter[0].filename;
}

        db.query(
            "UPDATE absensi SET user_id=?, tanggal=?, waktu=?, status=?, kelas=?, jadwal=?, selfie=?, surat_dokter=? WHERE id=?",
            [user_id, tanggal, waktu, status, kelas, jadwal, selfie,
    surat_dokter, id],
            (err, result) => {
                if (err) return next(err);

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        status: "error",
                        message: "Data tidak ditemukan"
                    });
                }

                res.json({
                    status: "success",
                    message: "Data berhasil diupdate"
                });
            }
        );
    } catch (err) {
        next(err);
    }
};

// DELETE
const deleteAbsensi = (req, res, next) => {
    try {
        const { id } = req.params;

        db.query(
            "DELETE FROM absensi WHERE id=?",
            [id],
            (err, result) => {
                if (err) return next(err);

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        status: "error",
                        message: "Data tidak ditemukan"
                    });
                }

                res.json({
                    status: "success",
                    message: "Data berhasil dihapus"
                });
            }
        );
    } catch (err) {
        next(err);
    }
};

const getAllAbsensi = (req, res, next) => {
  try {
    db.query(
      `
      SELECT
        absensi.*,
        user.nama
      FROM absensi
      JOIN user
      ON absensi.user_id = user.id
      ORDER BY absensi.id DESC
      `,
      (err, result) => {
        if (err) return next(err);

        res.json({
          status: "success",
          data: result
        });
      }
    );
  } catch (err) {
    next(err);
  }
};

const getTotalHariIni = (req, res, next) => {
  const hariIni = new Date().toISOString().split("T")[0];

  db.query(
    `
    SELECT COUNT(*) AS total
    FROM absensi
    WHERE tanggal = ?
    `,
    [hariIni],
    (err, result) => {
      if (err) return next(err);

      res.json({
        status: "success",
        total: result[0].total
      });
    }
  );
};

module.exports = {
    createAbsensi,
    getAbsensi,
    getRiwayatByUser,
    updateAbsensi,
    deleteAbsensi,
    getAllAbsensi,
    getTotalHariIni
};