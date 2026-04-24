const validateAbsensi = (req, res, next) => {
    let { user_id, tanggal, waktu } = req.body;

    if (user_id === undefined || !tanggal || !waktu) {
        return res.status(400).json({
            status: "error",
            message: "Semua field wajib diisi (user_id, tanggal, waktu)"
        });
    }

    user_id = Number(user_id);
    if (isNaN(user_id)) {
        return res.status(400).json({
            status: "error",
            message: "user_id harus berupa angka"
        });
    }

    const regexTanggal = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexTanggal.test(tanggal)) {
        return res.status(400).json({
            status: "error",
            message: "Format tanggal harus YYYY-MM-DD"
        });
    }

    const date = new Date(tanggal);
    if (isNaN(date.getTime())) {
        return res.status(400).json({
            status: "error",
            message: "Tanggal tidak valid"
        });
    }

    const regexWaktu = /^\d{2}:\d{2}:\d{2}$/;
    if (!regexWaktu.test(waktu)) {
        return res.status(400).json({
            status: "error",
            message: "Format waktu harus HH:MM:SS"
        });
    }

    req.body.user_id = user_id;

    next();
};



// 🔥 TAMBAHAN BARU (UNTUK USER)
const validateUser = (req, res, next) => {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Semua field wajib diisi (nama, email, password)"
        });
    }

    if (typeof nama !== "string") {
        return res.status(400).json({
            status: "error",
            message: "Nama harus berupa string"
        });
    }

    if (!email.includes("@")) {
        return res.status(400).json({
            status: "error",
            message: "Email tidak valid"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            status: "error",
            message: "Password minimal 6 karakter"
        });
    }

    next();
};


// 🔥 EXPORT SEMUA
module.exports = {
    validateAbsensi,
    validateUser
};