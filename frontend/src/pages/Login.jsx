import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false); // State untuk swith halaman awal ke form login
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("DATA LOGIN:", data);

      if (response.ok) {
        alert("Login Berhasil!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLogin", "true"); 
        localStorage.setItem("user_id", data.id);
        localStorage.setItem("namaUser", data.nama);
        localStorage.setItem("role", data.role);
        
        navigate("/dashboard"); // Setelah sukses login baru ke dashboard
      } else {
        alert("Gagal: " + (data.message || JSON.stringify(data)));
      }
    } catch (error) {
      alert("Server backend mati!");
    }
  };

  // TAMPILAN 1: Halaman Form Input Email & Password (setelah klik masuk)
  if (showForm) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#3f51b5", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "'Inter', sans-serif", padding: "20px" }}>
        <div style={{ backgroundColor: "white", width: "100%", maxWidth: "400px", borderRadius: "20px", padding: "30px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", color: "#333" }}>
          
          {/* Tombol Kembali ke Welcome Screen */}
          <span onClick={() => setShowForm(false)} style={{ cursor: "pointer", color: "#666", fontSize: "14px", display: "inline-block", marginBottom: "15px" }}>⬅️ Kembali</span>
          
          <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#3f51b5", fontWeight: "bold" }}>Masuk Akun</h2>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#666" }}>Email</label>
              <input type="email" name="email" placeholder="Masukkan email" onChange={handleChange} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", marginTop: "5px", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#666" }}>Password</label>
              <input type="password" name="password" placeholder="Masukkan password" onChange={handleChange} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", marginTop: "5px", boxSizing: "border-box" }} />
            </div>

            <button type="submit" style={{ width: "100%", backgroundColor: "#3f51b5", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}>
              Masuk Sekarang
            </button>
          </form>
        </div>
      </div>
    );
  }

  // TAMPILAN 2: Welcome Screen Ala Edlink (Pertama kali dibuka)
  return (
    <div style={{ height: "100vh", backgroundColor: "#3f51b5", display: "flex", flexDirection: "column", justifyContent: "space-between", fontFamily: "'Inter', sans-serif", color: "white", overflow: "hidden" }}>
      
      <div style={{ padding: "60px 40px 20px 40px", flex: 1, display: "flex", flexDirection: "column", justifyConten: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", lineHeight: "1.4", marginBottom: "20px", maxWidth: "80%" }}>
          Permudah Interaksi Dosen & Mahasiswa secara Online.
        </h1>
        <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fff", opacity: 0.4 }}></div>
          <div style={{ width: "20px", height: "8px", borderRadius: "4px", backgroundColor: "#fff" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fff", opacity: 0.4 }}></div>
        </div>
      </div>

      <div style={{ backgroundColor: "white", borderTopLeftRadius: "30px", borderTopRightRadius: "30px", padding: "40px 30px 30px 30px", color: "#333", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* KUNCI PERUBAHAN: Klik ini sekarang bakal ngebuka Form Login, bukan langsung ke Dashboard */}
        <button 
          onClick={() => setShowForm(true)} 
          style={{ width: "100%", backgroundColor: "#3f51b5", color: "white", border: "none", padding: "14px", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 6px rgba(63, 81, 181, 0.2)" }}
        >
          Masuk
        </button>

        <div style={{ textAlign: "center", fontSize: "14px", color: "#666" }}>
          Belum punya akun?{" "}
          <span onClick={() => navigate("/register")} style={{ color: "#3f51b5", fontWeight: "bold", cursor: "pointer" }}>Daftar</span>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "10px 0" }} />

        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <input type="checkbox" id="agree" defaultChecked style={{ marginTop: "4px", accentColor: "#3f51b5", width: "16px", height: "16px" }} />
          <label htmlFor="agree" style={{ fontSize: "12px", color: "#666", lineHeight: "1.4" }}>
            Saya setuju atas seluruh Syarat & Ketentuan dan Kebijakan Privasi Aplikasi Absensi.
          </label>
        </div>
      </div>
    </div>
  );
}