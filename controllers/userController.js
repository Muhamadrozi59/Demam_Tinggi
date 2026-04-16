const db = require("../models/db");

exports.getUsers = (req,res)=>{
    db.query("SELECT * FROM users",(err,result)=>{
        res.json(result);
    });
};

exports.addUser = (req,res)=>{
    const {nama,email,password} = req.body;

    db.query(
        "INSERT INTO users (nama,email,password) VALUES (?,?,?)",
        [nama,email,password],
        (err,result)=>{
            res.json(result);
        }
    );
};

exports.updateUser = (req,res)=>{
    const id = req.params.id;
    const {nama,email,password} = req.body;

    db.query(
        "UPDATE users SET nama=?,email=?,password=? WHERE id=?",
        [nama,email,password,id],
        (err,result)=>{
            res.json(result);
        }
    );
};

exports.deleteUser = (req,res)=>{
    const id = req.params.id;

    db.query(
        "DELETE FROM users WHERE id=?",
        [id],
        (err,result)=>{
            res.json(result);
        }
    );
};