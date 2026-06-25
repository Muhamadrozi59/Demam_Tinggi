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
      <div style={{ height: "100vh", background: "linear-gradient(135deg,#3f51b5,#1e3a8a)", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "'Inter', sans-serif", padding: "20px" }}>
        <div style={{ background: "white", width: "100%", maxWidth: "400px", padding: "30px", boxShadow:
  "0 20px 50px rgba(0,0,0,0.25)", color: "#333" }}>
          <div style={{ textAlign: "center" }}>
  <h2
    style={{
      margin: 0,
      color: "#1e3a8a",
      fontWeight: "700"
    }}
  >
    Selamat Datang
  </h2>

  <p
    style={{
      color: "#64748b",
      marginTop: "8px",
      fontSize: "14px"
    }}
  >
    Silakan masuk untuk melanjutkan ke sistem absensi
  </p>
</div>
          {/* Tombol Kembali ke Welcome Screen */}
          <span onClick={() => setShowForm(false)} style={{ cursor: "pointer", color: "#666", fontSize: "14px", display: "inline-block", marginBottom: "15px" }}>⬅️ Kembali</span>
          
          <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#1e3a8a", fontWeight: "bold" }}>Masuk Akun</h2>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#666" }}>Email</label>
              <input type="email" name="email" placeholder="Masukkan email" onChange={handleChange} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", marginTop: "5px", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#666" }}>Password</label>
              <input type="password" name="password" placeholder="Masukkan password" onChange={handleChange} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", marginTop: "5px", boxSizing: "border-box" }} />
            </div>

            <button type="submit" style={{
  width: "100%",
  background:
    "linear-gradient(135deg,#3f51b5,#5c6bc0)",
  color: "white",
  border: "none",
  padding: "16px",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow:
    "0 10px 20px rgba(63,81,181,0.35)",
  transition: "0.3s"
}}>
              Masuk Sekarang
            </button>
          </form>
        </div>
      </div>
    );
  }

  // TAMPILAN 2: Welcome Screen Ala Edlink (Pertama kali dibuka)
  return (
    <div
  style={{
    height: "100dvh",
    background: "linear-gradient(135deg,#3f51b5,#1e3a8a)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontFamily: "'Inter', sans-serif",
color: "white",
boxShadow: "0 0 40px rgba(0,0,0,0.25)",
overflow: "hidden",
borderRadius: "20px"
  }}
>
      
      <div
  style={{
    padding: "20px 30px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  }}
>
  <div
    style={{
      width: "80px",
      height: "80px",
      background: "rgba(255,255,255,0.15)",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "40px",
      marginBottom: "8px",
      backdropFilter: "blur(10px)"
    }}
  >
    🎓
  </div>

  <h1
    style={{
      fontSize: "24px",
      fontWeight: "700",
      lineHeight: "1.4",
      marginBottom: "8px"
    }}
  >
    Sistem Absensi Mahasiswa
  </h1>

  <p
    style={{
      fontSize: "16px",
      opacity: 0.9,
      maxWidth: "500px",
      lineHeight: "1.5"
    }}
  >
    Kelola kehadiran mahasiswa secara cepat, mudah, dan
    real-time untuk dosen maupun mahasiswa.
  </p>

  <div
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "10px"
  }}
>
  <div
    style={{
      background: "rgba(255,255,255,0.15)",
      padding: "10px",
      borderRadius: "15px",
      minWidth: "100px"
    }}
  >
    <h3 style={{ margin: 0 }}>⚡</h3>
    <small>Real-Time</small>
  </div>

  <div
    style={{
      background: "rgba(255,255,255,0.15)",
      padding: "10px",
      borderRadius: "15px",
      minWidth: "100px"
    }}
  >
    <h3 style={{ margin: 0 }}>🔒</h3>
    <small>Data Aman</small>
  </div>
</div>

  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "20px"
    }}
  >
    <div
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.5)"
      }}
    />

    <div
      style={{
        width: "30px",
        height: "10px",
        borderRadius: "20px",
        background: "#fff"
      }}
    />

    <div
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.5)"
      }}
    />
    </div>
</div>
  {/* CARD PUTIH */}
  <div
    style={{
  backgroundColor: "white",
  borderTopLeftRadius: "30px",
  borderTopRightRadius: "30px",
  padding: "15px 25px",
  color: "#333",
  width: "100%",
  boxSizing: "border-box"
}}
  >
    <button
      onClick={() => setShowForm(true)}
      style={{
        width: "100%",
        background:
          "linear-gradient(135deg,#3f51b5,#5c6bc0)",
        color: "white",
        border: "none",
        padding: "15px",
        borderRadius: "12px",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer"
      }}
    >
      Masuk
    </button>

    <div
      style={{
        textAlign: "center",
        marginTop: "15px",
        color: "#64748b"
      }}
    >
      Belum punya akun?{" "}
      <span
        onClick={() => navigate("/register")}
        style={{
          color: "#3f51b5",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Daftar
      </span>
    </div>

    <hr
      style={{
        margin: "20px 0",
        border: "none",
        borderTop: "1px solid #eee"
      }}
    />

    <div
  style={{
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginTop: "10px"
  }}
>
  <input
    type="checkbox"
    defaultChecked
    style={{
      width: "16px",
      height: "16px"
    }}
  />

  <span
    style={{
      fontSize: "14px",
      color: "#64748b",
      lineHeight: "1.5"
    }}
  >
    Saya setuju dengan syarat dan ketentuan aplikasi.
  </span>
</div>
  </div>

</div>
);
}