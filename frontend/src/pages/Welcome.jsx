import React from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomeLogin() {
  const navigate = useNavigate();

  const handleMasukClick = () => {
    // Arahkan ke halaman input email/password atau jalankan fungsi login lo
    navigate("/dashboard"); 
  };

  return (
    <div style={{
      height: "100vh",
      backgroundColor: "#3f51b5", // WARNA UTAMA: Diubah jadi Biru Indigo (Bukan Hijau)
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      fontFamily: "'Inter', sans-serif",
      color: "white",
      overflow: "hidden"
    }}>
      
      {/* AREA ATAS: Teks Promosi & Ilustrasi Singkat */}
      <div style={{ 
        padding: "60px 40px 20px 40px", 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center" 
      }}>
        <h1 style={{ 
          fontSize: "28px", 
          fontWeight: "bold", 
          lineHeight: "1.4", 
          marginBottom: "20px",
          maxWidth: "80%" 
        }}>
          Permudah Interaksi Dosen & Mahasiswa secara Online.
        </h1>
        
        {/* Indikator Slider Titik 3 di Tengah */}
        <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fff", opacity: 0.4 }}></div>
          <div style={{ width: "20px", height: "8px", borderRadius: "4px", backgroundColor: "#fff" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fff", opacity: 0.4 }}></div>
        </div>
      </div>

      {/* AREA BAWAH: Panel Putih untuk Aksi/Tombol */}
      <div style={{
        backgroundColor: "white",
        borderTopLeftRadius: "30px",
        borderTopRightRadius: "30px",
        padding: "40px 30px 30px 30px",
        color: "#333",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        
        {/* TOMBOL UTAMA: MASUK */}
        <button 
          onClick={handleMasukClick}
          style={{
            width: "100%",
            backgroundColor: "#3f51b5", // Warna tombol disamakan dengan tema utama
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(63, 81, 181, 0.2)"
          }}
        >
          Masuk
        </button>

        {/* TEKS: BELUM PUNYA AKUN */}
        <div style={{ textAlign: "center", fontSize: "14px", color: "#666" }}>
          Belum punya akun?{" "}
          <span 
            onClick={() => navigate("/register")} 
            style={{ color: "#3f51b5", fontWeight: "bold", cursor: "pointer" }}
          >
            Daftar
          </span>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "10px 0" }} />

        {/* CHECKBOX SYARAT & KETENTUAN */}
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <input 
            type="checkbox" 
            id="agree" 
            defaultChecked 
            style={{ marginTop: "4px", accentColor: "#3f51b5", width: "16px", height: "16px" }} 
          />
          <label htmlFor="agree" style={{ fontSize: "12px", color: "#666", lineHeight: "1.4" }}>
            Saya setuju atas seluruh Syarat & Ketentuan dan Kebijakan Privasi Aplikasi Absensi.
          </label>
        </div>

      </div>
    </div>
  );
}