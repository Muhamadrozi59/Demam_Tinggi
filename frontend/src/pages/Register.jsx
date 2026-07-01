import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  
  // 1. Tambahkan role: "mahasiswa" sebagai default di dalam state
  const [formData, setFormData] = useState({
  nama: "",
  email: "",
  password: "",
  role: "user"
});

const [showNotif, setShowNotif] = useState(false);
const [notifType, setNotifType] = useState("success");
const [notifTitle, setNotifTitle] = useState("");
const [notifMessage, setNotifMessage] = useState("");

useEffect(() => {
  if (showNotif && notifType === "success") {
    const timer = setTimeout(() => {
      setShowNotif(false);
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [showNotif, notifType, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
  setNotifType("error");
  setNotifTitle("Registrasi Gagal");
  setNotifMessage(data.message || "Registrasi gagal.");
  setShowNotif(true);
  return;
}

setNotifType("success");
setNotifTitle("Registrasi Berhasil");
setNotifMessage("Akun berhasil dibuat. Silakan login.");
setShowNotif(true);

    } catch (error) {
      alert("Server backend mati!");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#3f51b5", 
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "white",
        width: "100%",
        maxWidth: "400px",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        color: "#333"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#3f51b5", fontWeight: "bold" }}>Daftar Akun</h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#666" }}>Username</label>
            <input 
              type="text" 
              name="nama" 
              placeholder="Masukkan nama" 
              onChange={handleChange} 
              required 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", marginTop: "5px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#666" }}>Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Masukkan email" 
              onChange={handleChange} 
              required 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", marginTop: "5px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#666" }}>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Masukkan password" 
              onChange={handleChange} 
              required 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", marginTop: "5px", boxSizing: "border-box" }}
            />
          </div>
          {showNotif && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.45)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <div
      style={{
        background: "#fff",
        width: "400px",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0,0,0,.25)"
      }}
    >
      <div
        style={{
          background: notifType === "success"
            ? "#16A34A"
            : "#DC2626",
          color: "#fff",
          padding: "25px",
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: "60px" }}>
          {notifType === "success" ? "✅" : "❌"}
        </div>

        <h2>{notifTitle}</h2>
      </div>

      <div
        style={{
          padding: "30px",
          textAlign: "center"
        }}
      >
        <p>{notifMessage}</p>

        {notifType === "error" && (
          <button
            onClick={() => setShowNotif(false)}
            style={{
              marginTop: "20px",
              padding: "10px 30px",
              background: "#2563EB",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            OK
          </button>
        )}
      </div>
    </div>
  </div>
)}

          {/* 2. INPUT PILIHAN ROLE (BIAR GA ERROR PAS DAFTAR) */}
          <div>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#666" }}>Daftar Sebagai</label>
            <select
  name="role"
  value={formData.role}
  onChange={handleChange}
>
  <option value="user">Mahasiswa</option>
  <option value="admin">Dosen</option>
</select>
          </div>

          <button type="submit" style={{
            width: "100%",
            backgroundColor: "#3f51b5",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px"
          }}>
            Daftar Sekarang
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: "14px", color: "#666", marginTop: "20px" }}>
          Sudah punya akun?{" "}
          <span onClick={() => navigate("/login")} style={{ color: "#3f51b5", fontWeight: "bold", cursor: "pointer" }}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
}