import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("beranda");
  const [namaUser, setNamaUser] = useState("Mahasiswa");
  const [role, setRole] = useState("");

  // State Utama Status Presensi Global
  const [statusPresensi, setStatusPresensi] = useState("Alpa"); // Default awal sebelum isi adalah Alpa

  // State Form Absen
  const [kelas, setKelas] = useState("");
  const [jadwal, setJadwal] = useState("Minggu 1");
  const [pilihanStatus, setPilihanStatus] = useState("Hadir"); // Pilihan di dalam form (Hadir / Sakit)
  
  // State Kamera & Selfie (Untuk Hadir)
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [ambilKamera, setAmbilKamera] = useState(false);
  const [fotoSelfie, setFotoSelfie] = useState(null);

  // State Surat Dokter (Untuk Sakit)
  const [suratDokter, setSuratDokter] = useState(null);
  const [riwayat, setRiwayat] = useState([]);

 useEffect(() => {
  const namaDisimpan =
    localStorage.getItem("namaUser") || "Mahasiswa";

  const roleDisimpan =
    localStorage.getItem("role") || "user";

  setNamaUser(namaDisimpan);
  setRole(roleDisimpan);

  loadRiwayat();
}, []);

const loadRiwayat = async () => {
  try {
    const userId = localStorage.getItem("user_id");

    const response = await fetch(
      `http://localhost:3000/absensi/riwayat/${userId}`
    );

    const result = await response.json();

    if (result.status === "success") {
      setRiwayat(result.data);
    }
  } catch (error) {
    console.error(error);
  }
};

  // Fungsi untuk Menyalakan Kamera
  const nyalakanKamera = async () => {
    try {
      setAmbilKamera(true);
      setFotoSelfie(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      alert("Gagal mengakses kamera. Pastikan izin kamera diaktifkan!");
      setAmbilKamera(false);
    }
  };

  // Fungsi Menangkap Gambar (Jepret)
  const jepretFoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/jpeg");
      setFotoSelfie(dataUrl);
      matikanKamera();
    }
  };

  // Fungsi Mematikan Aliran Kamera
  const matikanKamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setAmbilKamera(false);
  };

  // Handle Input File Surat Dokter
  const handleFileSurat = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSuratDokter(reader.result); // Mengubah file dokumen/gambar menjadi Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  // Fungsi Kirim Semua Data Kehadiran
  const handleKirimKehadiran = async (e) => {
  e.preventDefault();

  if (pilihanStatus === "Hadir" && !fotoSelfie) {
    alert("Wajib mengambil foto selfie terlebih dahulu!");
    return;
  }

  if (pilihanStatus === "Sakit" && !suratDokter) {
    alert("Wajib mengunggah Surat Dokter!");
    return;
  }

  try {
  const now = new Date();

  const waktu =
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0");

  const response = await fetch(
    "http://localhost:3000/absensi",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: Number(localStorage.getItem("user_id")),
        tanggal: new Date().toISOString().split("T")[0],
        waktu: waktu
      })
    }
  );

    const result = await response.json();

    if (result.status === "success") {
      setStatusPresensi(pilihanStatus);

      alert("Presensi berhasil disimpan");

      setFotoSelfie(null);
      setSuratDokter(null);
      setKelas("");

      loadRiwayat();
    }
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan absensi");
  }
};

const handleDelete = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/absensi/${id}`,
      {
        method: "DELETE"
      }
    );

    const result = await response.json();

    if (result.status === "success") {
      alert("Data berhasil dihapus");
      loadRiwayat();
    }
  } catch (error) {
    console.error(error);
  }
};

const handleEdit = async (id) => {
  const waktuBaru = prompt("Masukkan waktu baru (HH:MM:SS)");

  if (!waktuBaru) return;

  try {
    const item = riwayat.find((r) => r.id === id);

    const response = await fetch(
      `http://localhost:3000/absensi/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: item.user_id,
          tanggal: item.tanggal.split("T")[0],
          waktu: waktuBaru
        })
      }
    );

    const result = await response.json();

    if (result.status === "success") {
      alert("Data berhasil diupdate");
      loadRiwayat();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error(error);
  }
};

  const handleLogout = () => {
    matikanKamera();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f9", fontFamily: "'Inter', sans-serif", paddingBottom: "80px" }}>

      {/* --- HEADER PROFIL (Modifikasi Berdasarkan image_25cf9d.png) --- */}
      <div style={{ backgroundColor: "#3f51b5", color: "white", padding: "30px 20px 40px 20px", borderBottomLeftRadius: "24px", borderBottomRightRadius: "24px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "24px" }}>👤</div>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold", textTransform: "uppercase" }}>{namaUser}</h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "13px", opacity: 0.9 }}>Mahasiswa - Teknik Informatika</p>
          </div>
        </div>


        {/* CARD STATUS PRESENSI OTOMATIS */}
        <div style={{ backgroundColor: "white", color: "#333", borderRadius: "15px", padding: "15px 20px", marginTop: "25px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
            <span style={{ fontSize: "13px", color: "#666", fontWeight: "600" }}>Status Presensi</span>
            <span style={{ fontSize: "12px", color: "#3f51b5", fontWeight: "bold" }}>Hari Ini</span>
          </div>
          
          {/* LOGIKA DINAMIS MENGIKUTI STATUS ABSEN */}
          {statusPresensi === "Alpa" && (
            <div style={{ fontSize: "15px", fontWeight: "bold", color: "#e11d48", textAlign: "center", padding: "5px 0" }}>
              🔴 Alpa (Belum Mengisi Absensi)
            </div>
          )}
          {statusPresensi === "Hadir" && (
            <div style={{ fontSize: "15px", fontWeight: "bold", color: "#10b981", textAlign: "center", padding: "5px 0" }}>
              ✅ Hadir (Sudah Verifikasi Selfie)
            </div>
          )}
          {statusPresensi === "Sakit" && (
            <div style={{ fontSize: "15px", fontWeight: "bold", color: "#f59e0b", textAlign: "center", padding: "5px 0" }}>
              🟡 Sakit (Bukti Surat Dokter Terupload)
            </div>
          )}
        </div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div style={{ padding: "20px" }}>
        
        {activeTab === "beranda" ? (
          <div>
            {/* BOX MENU PENGISIAN ABSENSI */}
            <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
              <div style={{ backgroundColor: "#f8fafc", padding: "15px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#3f51b5", fontWeight: "bold", fontSize: "16px" }}>Menu Pengisian Absensi</span>
                <span style={{ color: "#94a3b8", fontSize: "12px" }}>▼</span>
              </div>

              <form onSubmit={handleKirimKehadiran} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
                
                {/* Selector Kelas */}
                <div>
                  <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: "500" }}>Kelas</label>
                  <select value={kelas} onChange={(e) => setKelas(e.target.value)} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "white", fontSize: "14px", color: "#333", outline: "none" }}>
                    <option value="" disabled>-- Pilih Kelas Kuliah --</option>
                    <option value="Pemrograman Web">Pemrograman Web (TI-Semester 4)</option>
                    <option value="Kecerdasan Artificial">Kecerdasan Artificial (TI-Semester 4)</option>
                    <option value="Jaringan Komputer">Jaringan Komputer (TI-Semester 4)</option>
                    <option value="FullStack">FullStack (TI-Semester 4)</option>
                  </select>
                </div>

                {/* Selector Jadwal */}
                <div>
                  <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: "500" }}>Jadwal</label>
                  <select value={jadwal} onChange={(e) => setJadwal(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "white", fontSize: "14px", color: "#333", outline: "none" }}>
                    <option value="Minggu 1">Minggu 1</option>
                    <option value="Minggu 2">Minggu 2</option>
                    <option value="Minggu 3">Minggu 3</option>
                    <option value="Minggu 4">Minggu 4</option>
                  </select>
                </div>

                {/* Selector Status Kehadiran */}
                <div>
                  <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: "500" }}>Status</label>
                  <select value={pilihanStatus} onChange={(e) => setPilihanStatus(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "white", fontSize: "14px", color: "#333", outline: "none" }}>
                    <option value="Hadir">Hadir</option>
                    <option value="Sakit">Sakit</option>
                  </select>
                </div>

                {/* --- INPUT BUKTI BERDASARKAN STATUS (CONDITIONAL RENDERING) --- */}
                {pilihanStatus === "Hadir" ? (
                  <div>
                    <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: "500" }}>Bukti Kamera Selfie Kelas</label>
                    
                    {!ambilKamera && !fotoSelfie && (
                      <button type="button" onClick={nyalakanKamera} style={{ width: "100%", padding: "12px", backgroundColor: "#f1f5f9", border: "2px dashed #cbd5e1", borderRadius: "8px", color: "#475569", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
                        📸 Ambil Foto Selfie Kelas
                      </button>
                    )}

                    {ambilKamera && (
                      <div style={{ textAlign: "center", backgroundColor: "#000", borderRadius: "8px", overflow: "hidden", paddingBottom: "5px" }}>
                        <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }} />
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "10px 0" }}>
                          <button type="button" onClick={jepretFoto} style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>📸 Jepret</button>
                          <button type="button" onClick={matikanKamera} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Batal</button>
                        </div>
                      </div>
                    )}

                    <canvas ref={canvasRef} style={{ display: "none" }} />

                    {fotoSelfie && (
                      <div style={{ textAlign: "center", marginTop: "5px" }}>
                        <img src={fotoSelfie} alt="Hasil Selfie" style={{ width: "100%", maxHeight: "220px", objectFit: "cover", borderRadius: "8px", border: "2px solid #3f51b5" }} />
                        <button type="button" onClick={nyalakanKamera} style={{ marginTop: "10px", backgroundColor: "#64748b", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>🔄 Foto Ulang</button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* JIKA STATUS SAKIT */
                  <div>
                    <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: "500" }}>Upload Surat Keterangan Dokter</label>
                    <input type="file" accept="image/*,application/pdf" onChange={handleFileSurat} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
                    {suratDokter && (
                      <p style={{ fontSize: "12px", color: "#10b981", marginTop: "5px", fontWeight: "bold" }}>✓ Dokumen berhasil dimuat</p>
                    )}
                  </div>
                )}

                {/* Tombol Kirim Kehadiran */}
                <button type="submit" style={{ backgroundColor: "#3f51b5", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontWeight: "600", fontSize: "15px", cursor: "pointer", marginTop: "10px", boxShadow: "0 2px 4px rgba(63, 81, 181, 0.3)" }}>
                  Kirim Kehadiran
                </button>
              </form>
            </div>
          </div>
        
          ) : activeTab === "riwayat" ? (

  <div
    style={{
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}
  >
   <h3>📋 Rekap Kehadiran</h3>

    {riwayat.length === 0 ? (
      <p>Belum ada riwayat absensi.</p>
    ) : (
      riwayat.map((item) => (
        <div
          key={item.id}
          style={{
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: "15px",
  marginBottom: "12px",
  border: "1px solid #e2e8f0"
}}
        >
          <p>
📅 {new Date(item.tanggal).toLocaleDateString("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric"
})}
</p>

<p>
⏰ {item.waktu}
</p>
        </div>
      ))
    )}
  </div>

) : activeTab === "admin" ? (

<div
  style={{
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px"
  }}
>
  <h3>🎓 Manajemen Kehadiran Mahasiswa</h3>

  {riwayat.map((item) => (
    <div
  key={item.id}
  style={{
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0"
  }}
>
     <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  }}
>
  <div>
    <p
      style={{
        margin: 0,
        fontWeight: "bold",
        color: "#334155"
      }}
    >
      📅 {new Date(item.tanggal).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      })}
    </p>

    <p
      style={{
        margin: "5px 0 0 0",
        color: "#64748b",
        fontSize: "14px"
      }}
    >
      ⏰ {item.waktu}
    </p>
  </div>

  <span
    style={{
      backgroundColor: "#dcfce7",
      color: "#166534",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold"
    }}
  >
    Hadir
  </span>
</div>

      <button
  onClick={() => handleEdit(item.id)}
  style={{
    backgroundColor: "#3f51b5",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    marginRight: "10px"
  }}
>
  ✏️ Edit
</button>

      <button
  onClick={() => handleDelete(item.id)}
  style={{
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px"
  }}
>
  🗑️ Hapus
</button>
    </div>
  ))}
</div>

) : (

  <div
    style={{
      backgroundColor: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      textAlign: "center"
    }}
  >
    <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>
      Manajemen Akun
    </h4>

    <p
      style={{
        fontSize: "14px",
        color: "#666",
        marginBottom: "20px"
      }}
    >
      Kamu login sebagai <strong>{namaUser}</strong>
    </p>

    <button
      onClick={handleLogout}
      style={{
        width: "100%",
        backgroundColor: "#e11d48",
        color: "white",
        border: "none",
        padding: "12px",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      Keluar / Logout
    </button>
  </div>

)}

</div>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "65px", backgroundColor: "white", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-around", alignItems: "center", boxShadow: "0 -2px 10px rgba(0,0,0,0.05)" }}>
        <div onClick={() => setActiveTab("beranda")} style={{ textAlign: "center", cursor: "pointer", flex: 1, color: activeTab === "beranda" ? "#3f51b5" : "#94a3b8", fontWeight: activeTab === "beranda" ? "bold" : "normal" }}>
          <div style={{ fontSize: "20px" }}>🏠</div>
          <div style={{ fontSize: "12px", marginTop: "2px" }}>Beranda</div>
        </div>
        <div
  onClick={() => setActiveTab("riwayat")}
  style={{
    textAlign: "center",
    cursor: "pointer",
    flex: 1,
    color:
      activeTab === "riwayat"
        ? "#3f51b5"
        : "#94a3b8",
    fontWeight:
      activeTab === "riwayat"
        ? "bold"
        : "normal"
  }}
>
  <div style={{ fontSize: "20px" }}>📋</div>
  <div style={{ fontSize: "12px", marginTop: "2px" }}>
    Riwayat
  </div>
</div>
{role === "admin" && (
  <div
    onClick={() => setActiveTab("admin")}
    style={{
      textAlign: "center",
      cursor: "pointer",
      flex: 1,
      color: activeTab === "admin"
        ? "#3f51b5"
        : "#94a3b8"
    }}
  >
    <div style={{ fontSize: "20px" }}>⚙️</div>
    <div style={{ fontSize: "12px" }}>
      Admin
    </div>
  </div>
)}
        <div onClick={() => setActiveTab("akun")} style={{ textAlign: "center", cursor: "pointer", flex: 1, color: activeTab === "akun" ? "#3f51b5" : "#94a3b8", fontWeight: activeTab === "akun" ? "bold" : "normal" }}>
          <div style={{ fontSize: "20px" }}>👤</div>
          <div style={{ fontSize: "12px", marginTop: "2px" }}>Akun</div>
        </div>
      </div>

    </div>
  );
}
