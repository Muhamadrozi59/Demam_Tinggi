const db = require("../models/db");

exports.getAbsensi = (req,res)=>{
    db.query("SELECT * FROM absensi",(err,result)=>{
        res.json(result);
    });
};

exports.addAbsensi = (req,res)=>{
    const {mahasiswa_id,tanggal,status} = req.body;

    db.query(
        "INSERT INTO absensi (mahasiswa_id,tanggal,status) VALUES (?,?,?)",
        [mahasiswa_id,tanggal,status],
        (err,result)=>{
            res.json(result);
        }
    );
};

exports.updateAbsensi = (req,res)=>{
    const id = req.params.id;
    const {mahasiswa_id,tanggal,status} = req.body;

    db.query(
        "UPDATE absensi SET mahasiswa_id=?,tanggal=?,status=? WHERE id=?",
        [mahasiswa_id,tanggal,status,id],
        (err,result)=>{
            res.json(result);
        }
    );
};

exports.deleteAbsensi = (req,res)=>{
    const id = req.params.id;

    db.query(
        "DELETE FROM absensi WHERE id=?",
        [id],
        (err,result)=>{
            res.json(result);
        }
    );
};