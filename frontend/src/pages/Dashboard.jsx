import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("beranda");
  const [namaUser, setNamaUser] = useState("Mahasiswa");
  const [role, setRole] = useState("");

  // State Utama Status Presensi Global
  const [statusPresensi, setStatusPresensi] = useState(""); // Default awal sebelum isi adalah Alpa

  // State Form Absen
  const [kelas, setKelas] = useState("");
  const [jadwal, setJadwal] = useState("Pertemuan 1");
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
  const [totalMahasiswa, setTotalMahasiswa] =
  useState(0);
  const [totalHariIni, setTotalHariIni] = useState(0);
  const [jam, setJam] = useState("");

  const [showNotif, setShowNotif] = useState(false);
const [notifType, setNotifType] = useState("success");
const [notifTitle, setNotifTitle] = useState("");
const [notifMessage, setNotifMessage] = useState("");

  useEffect(() => {
  if (showNotif && notifType === "success") {
    const timer = setTimeout(() => {
      setShowNotif(false);
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [showNotif, notifType]);

 useEffect(() => {
  const namaDisimpan =
    localStorage.getItem("namaUser") || "Mahasiswa";

  const roleDisimpan =
    localStorage.getItem("role") || "user";

  setNamaUser(namaDisimpan);
  setRole(roleDisimpan);
}, []);

useEffect(() => {
  if (role) {
    loadRiwayat();

    if (role === "admin") {
      loadTotalMahasiswa();
      loadTotalHariIni();
    }
  }
}, [role]);

useEffect(() => {
  if (role === "admin" && activeTab === "riwayat") {
    setActiveTab("admin");
  }
}, [role, activeTab]);

useEffect(() => {
  const interval = setInterval(() => {
    setJam(
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, 1000);

  return () => clearInterval(interval);
}, []);

const loadRiwayat = async () => {
  try {

    let url = "";

    if (role === "admin") {
      url = "http://localhost:3000/absensi/all";
    } else {
      const userId = localStorage.getItem("user_id");
      url = `http://localhost:3000/absensi/riwayat/${userId}`;
    }

    const response = await fetch(url);
    const result = await response.json();

    if (result.status === "success") {
  setRiwayat(result.data);

  // Khusus mahasiswa
  if (role !== "admin") {
    if (result.data.length > 0) {
      // Ambil status presensi terakhir
      setStatusPresensi(result.data[0].status);
    } else {
      // Belum pernah presensi
      setStatusPresensi("Alpa");
    }
  }
}

  } catch (error) {
    console.error(error);
  }
};

const loadTotalMahasiswa = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/users/total-mahasiswa"
    );

    const result = await response.json();

    setTotalMahasiswa(result.total);
  } catch (error) {
    console.error(error);
  }
};

const loadTotalHariIni = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/absensi/hari-ini"
    );

    const result = await response.json();

    if (result.status === "success") {
      setTotalHariIni(result.total);
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

    context.drawImage(video,0,0);

    canvas.toBlob((blob)=>{

      const file = new File(
        [blob],
        `selfie_${Date.now()}.jpg`,
        {
          type:"image/jpeg"
        }
      );

      setFotoSelfie(file);

    },"image/jpeg");

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
    setSuratDokter(file);
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

    const formData = new FormData();

formData.append(
  "user_id",
  Number(localStorage.getItem("user_id"))
);

formData.append(
  "tanggal",
  new Date().toISOString().split("T")[0]
);

formData.append(
  "waktu",
  waktu
);

formData.append(
  "status",
  pilihanStatus
);

formData.append(
  "kelas",
  kelas
);

formData.append(
  "jadwal",
  jadwal
);

if (fotoSelfie) {
  formData.append(
    "selfie",
    fotoSelfie
  );
}

if (suratDokter) {
  formData.append(
    "surat_dokter",
    suratDokter
  );
}

  const response = await fetch(
    "http://localhost:3000/absensi",
    {
      method: "POST",
      body: formData
    }
  );

    const result = await response.json();

if (!response.ok) {
  setNotifType("error");
  setNotifTitle("Presensi Ditolak");
  setNotifMessage(result.message);
  setShowNotif(true);
  return;
}

setStatusPresensi(pilihanStatus);

setNotifType("success");
setNotifTitle("Presensi Berhasil");
setNotifMessage("Data presensi berhasil disimpan.");
setShowNotif(true);

setFotoSelfie(null);
setSuratDokter(null);
setKelas("");

loadRiwayat();

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

const handleEdit = async (id, statusBaru) => {

  const item = riwayat.find((r) => r.id === id);

  try {

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
          waktu: item.waktu,
          status: statusBaru,
          kelas: item.kelas,
          jadwal: item.jadwal,
          selfie: item.selfie,
          surat_dokter: item.surat_dokter
        })
      }
    );

    const result = await response.json();

    if (result.status === "success") {
      loadRiwayat();
      alert("Status berhasil diubah");
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

  const thStyle = {
  padding: "16px",
  textAlign: "left",
  color: "#334155",
  fontWeight: "700",
  fontSize: "18px",
  borderBottom: "2px solid #CBD5E1"
};

const tdStyle = {
  padding: "18px 16px",
  textAlign: "left",
  color: "#1E293B",
  fontSize: "17px",
  borderBottom: "1px solid #E2E8F0"
};

const hariIni = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f9", fontFamily: "'Inter', sans-serif", paddingBottom: "80px" }}>

      {/* --- HEADER PROFIL (Modifikasi Berdasarkan image_25cf9d.png) --- */}
      <div style={{ background:
"linear-gradient(135deg,#3949AB,#5C6BC0)", color: "white", padding: "30px 20px 40px 20px", borderBottomLeftRadius: "24px", borderBottomRightRadius: "24px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>

  {/* KIRI */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "22px"
    }}
  >
    <div
      style={{
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.18)",
    border: "2px solid rgba(255,255,255,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "34px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
      }}
    >
      👤
    </div>

    <div>

      <p
  style={{
    margin: 0,
    fontSize: "15px",
    opacity: 0.9
  }}
>
  Selamat Datang,
</p>

      <h3
        style={{
          margin: 0,
          fontSize: "30px",
          fontWeight: "bold",
          textTransform: "uppercase",
          fontWeight:"700",
          letterSpacing:"1px"
        }}
      >
        {namaUser}
      </h3>

      <p
        style={{
          marginTop: "5px",
          fontSize: "13px",
          fontWeight: "500"
        }}
      >
        {role === "admin"
          ? "👨‍🏫 Dosen STT Terpadu Nurul Fikri"
          : "🎓 Mahasiswa STT Terpadu Nurul Fikri"}
      </p>
    </div>
  </div>

  {/* KANAN */}
  <div
    style={{
      background: "rgba(255,255,255,0.12)",
      padding: "10px 15px",
      borderRadius: "10px",
      backdropFilter: "blur(8px)",
      textAlign: "right",
      minWidth: "190px",
      color: "white",
      flexShrink: 0
    }}
  >
    <p
      style={{
        margin: 0,
        fontSize: "13px",
        fontWeight: "600"
      }}
    >
      📅 {hariIni}
    </p>

    <p
      style={{
        marginTop: "5px",
        fontSize: "13px"
      }}
    >
      🕒 {jam} WIB
    </p>

    {role === "admin" ? (
      <p
        style={{
          marginTop: "5px",
          color: "#86EFAC",
          fontSize: "13px",
          fontWeight: "bold"
        }}
      >
        🟢 Dashboard Aktif
      </p>
    ) : (
      <p
        style={{
          marginTop: "5px",
          color: "#BFDBFE",
          fontSize: "13px",
          fontWeight: "bold"
        }}
      >
        📖 Semester 4
      </p>
    )}
  </div>

</div>

        {/* STATUS PRESENSI HANYA UNTUK MAHASISWA */}
{role !== "admin" && (
  <div
    style={{
      backgroundColor: "white",
      color: "#333",
      borderRadius: "15px",
      padding: "15px 20px",
      marginTop: "25px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "5px"
      }}
    >
      <span
        style={{
          fontSize: "13px",
          color: "#666",
          fontWeight: "600"
        }}
      >
        Status Presensi
      </span>

      <span
        style={{
          fontSize: "12px",
          color: "#3f51b5",
          fontWeight: "bold"
        }}
      >
        Hari Ini
      </span>
    </div>

    {statusPresensi === "Alpa" && (
      <div
        style={{
          fontSize: "15px",
          fontWeight: "bold",
          color: "#e11d48",
          textAlign: "center"
        }}
      >
        🔴 Alpa (Belum Mengisi Absensi)
      </div>
    )}

    {statusPresensi === "Hadir" && (
      <div
        style={{
          fontSize: "15px",
          fontWeight: "bold",
          color: "#10b981",
          textAlign: "center"
        }}
      >
        ✅ Hadir (Sudah Verifikasi Selfie)
      </div>
    )}

    {statusPresensi === "Sakit" && (
      <div
        style={{
          fontSize: "15px",
          fontWeight: "bold",
          color: "#f59e0b",
          textAlign: "center"
        }}
      >
        🟡 Sakit (Bukti Surat Dokter Terupload)
      </div>
    )}
  </div>
)}
</div>

      {/* --- KONTEN UTAMA --- */}
      <div style={{ padding: "20px" }}>
        
        {activeTab === "beranda" ? (

          role === "admin" ? (

<div>

<h2
  style={{
    textAlign: "center",
    marginTop: "20px",
    marginBottom: "40px",
    color: "#1E293B",
    fontWeight: "700",
    fontSize: "24px"
  }}
>
  📊 Dashboard Monitoring Presensi
</h2>

  {/* DASHBOARD ADMIN */}
  <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "20px",
    marginBottom: "30px"
  }}
>
    <div
    onMouseEnter={(e)=>{
    e.currentTarget.style.transform="translateY(-8px)";
  }}
  onMouseLeave={(e)=>{
    e.currentTarget.style.transform="translateY(0px)";
  }}
  style={{
    background: "white",
    borderRadius: "18px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
    minHeight: "190px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "0.3s",
    cursor: "pointer"
  }}
>
  <div
    style={{
      width: "65px",
      height: "65px",
      borderRadius: "50%",
      background: "#EEF2FF",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "32px",
      margin: "0 auto 15px auto"
    }}
  >
    👨‍🎓
  </div>

  <h3
    style={{
      margin: 0,
      color: "#374151",
      fontWeight: "600",
      fontSize: "18px"
    }}
  >
    Total Mahasiswa
  </h3>

  <h1
    style={{
      fontSize: "40px",
      marginTop: "12px",
      marginBottom: 0,
      fontWeight: "700",
      color: "#4F46E5"
    }}
  >
    {totalMahasiswa}
  </h1>
</div>

    <div
    onMouseEnter={(e)=>{
    e.currentTarget.style.transform="translateY(-8px)";
  }}
  onMouseLeave={(e)=>{
    e.currentTarget.style.transform="translateY(0px)";
  }}
  style={{
    background: "white",
    borderRadius: "18px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
    minHeight: "190px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "0.3s",
    cursor: "pointer"
  }}
>
  <div
    style={{
      width: "65px",
      height: "65px",
      borderRadius: "50%",
      background: "#DBEAFE",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "32px",
      margin: "0 auto 15px auto"
    }}
  >
    📅
  </div>

  <h3
    style={{
      margin: 0,
      color: "#374151",
      fontWeight: "600",
      fontSize: "18px"
    }}
  >
    Presensi Hari Ini
  </h3>

  <h1
    style={{
      fontSize: "40px",
      marginTop: "12px",
      marginBottom: 0,
      color: "#2563EB"
    }}
  >
    {totalHariIni}
  </h1>
</div>

<div
onMouseEnter={(e)=>{
    e.currentTarget.style.transform="translateY(-8px)";
  }}
  onMouseLeave={(e)=>{
    e.currentTarget.style.transform="translateY(0px)";
  }}
  style={{
    background: "white",
    borderRadius: "18px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
    minHeight: "190px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "0.3s",
    cursor: "pointer"
  }}
>
  <div
    style={{
      width: "65px",
      height: "65px",
      borderRadius: "50%",
      background: "#DCFCE7",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "32px",
      margin: "0 auto 15px auto"
    }}
  >
    ✅
  </div>

  <h3
    style={{
      margin: 0,
      color: "#374151",
      fontWeight: "600",
      fontSize: "18px"
    }}
  >
    Hadir
  </h3>

  <h1
    style={{
      fontSize: "40px",
      marginTop: "12px",
      marginBottom: 0,
      color: "#16A34A"
    }}
  >
    {riwayat.filter(x => x.status === "Hadir").length}
  </h1>
</div>

    <div
    onMouseEnter={(e)=>{
    e.currentTarget.style.transform="translateY(-8px)";
  }}
  onMouseLeave={(e)=>{
    e.currentTarget.style.transform="translateY(0px)";
  }}
  style={{
    background: "white",
    borderRadius: "18px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
    minHeight: "190px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "0.3s",
    cursor: "pointer"
  }}
>
  <div
    style={{
      width: "65px",
      height: "65px",
      borderRadius: "50%",
      background: "#FEF3C7",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "32px",
      margin: "0 auto 15px auto"
    }}
  >
    🤒
  </div>

  <h3
    style={{
      margin: 0,
      color: "#374151",
      fontWeight: "600",
      fontSize: "18px"
    }}
  >
    Sakit
  </h3>

  <h1
    style={{
      fontSize: "40px",
      marginTop: "12px",
      marginBottom: 0,
      color: "#F59E0B"
    }}
  >
    {riwayat.filter(x => x.status === "Sakit").length}
  </h1>
</div>

    <div
    onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-8px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0px)";
  }}
  style={{
    background: "white",
    borderRadius: "18px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
    minHeight: "190px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "0.3s",
    cursor: "pointer"
  }}
>
  <div
    style={{
      width: "65px",
      height: "65px",
      borderRadius: "50%",
      background: "#FEE2E2",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "32px",
      margin: "0 auto 15px auto"
    }}
  >
    ❌
  </div>

  <h3
    style={{
      margin: 0,
      color: "#374151",
      fontWeight: "600",
      fontSize: "18px"
    }}
  >
    Alpa
  </h3>

  <h1
    style={{
      fontSize: "40px",
      marginTop: "12px",
      marginBottom: 0,
      color: "#EF4444"
    }}
  >
    {riwayat.filter(x => x.status === "Alpa").length}
  </h1>
</div>
  </div>

  {/* DATA MAHASISWA TERBARU */}
  <div
  style={{
    background: "white",
    borderRadius: "20px",
    padding: "25px",
    overflowX: "auto",
    marginTop: "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)"
  }}
>
  <h3
    style={{
      marginBottom: "20px",
      color: "#1E293B"
    }}
  >
    📋 Aktivitas Presensi Terbaru
  </h3>

  <table
  style={{
    width: "100%",
    borderCollapse: "collapse"
  }}
>
    <thead>
  <tr
    style={{
      background: "#F8FAFC"
    }}
  >
    <th style={thStyle}>Nama</th>
<th style={thStyle}>Status</th>
<th style={thStyle}>Jam</th>
  </tr>
</thead>

    <tbody>
  {riwayat.slice(0, 5).map((item, index) => {
    console.log(item.selfie);

    return (
      <tr
        key={item.id}
        style={{
          borderBottom: "1px solid #E2E8F0"
        }}
      >
        <td style={tdStyle}>
          {item.nama}
        </td>

        <td style={tdStyle}>
          {item.status === "Hadir" && "✅ Hadir"}
          {item.status === "Sakit" && "🤒 Sakit"}
          {item.status === "Alpa" && "❌ Alpa"}
        </td>

        <td style={tdStyle}>
          {item.waktu || "-"}
        </td>
      </tr>
    );
  })}
</tbody>
  </table>
  <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px"
  }}
>
  <button
  onClick={() => setActiveTab("admin")}
  style={{
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600"
  }}
>
  Lihat Selengkapnya →
</button>
</div>
</div>

</div>

) : (

          <div>
            {/* BOX MENU PENGISIAN ABSENSI */}
            {role !== "admin" && (
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
                    <option value="Pertemuan 1">
    Pertemuan 1
</option>

<option value="Pertemuan 2" disabled>
    Pertemuan 2 🔒
</option>

<option value="Pertemuan 3" disabled>
    Pertemuan 3 🔒
</option>
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
                        <img src={URL.createObjectURL(fotoSelfie)}
    alt="Selfie" style={{ width: "100%", maxHeight: "220px", objectFit: "cover", borderRadius: "8px", border: "2px solid #3f51b5" }} />
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
            )}
          </div>
          )
        
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

          <p>
            🏫 <strong>Kelas :</strong> {item.kelas}
          </p>

          <p>
            📚 <strong>Jadwal :</strong> {item.jadwal}
          </p>

          <p
            style={{
              marginTop: "10px",
              fontWeight: "bold",
              color:
                item.status === "Hadir"
                  ? "#16A34A"
                  : item.status === "Sakit"
                  ? "#F59E0B"
                  : "#EF4444"
            }}
          >
            {item.status === "Hadir" && "✅ Hadir"}

            {item.status === "Sakit" && "🤒 Sakit"}

            {item.status === "Alpa" && "❌ Alpa"}
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
    borderRadius: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,.08)"
  }}
>

<h3 style={{marginBottom:"20px"}}>
📊 Monitoring Presensi Mahasiswa
</h3>

<div
style={{
overflowX:"auto"
}}
>

<table
style={{
width:"100%",
borderCollapse:"collapse"
}}
>

<thead>

<tr>

<th style={{...thStyle,width:"60px"}}>
No
</th>

<th style={{...thStyle,width:"180px"}}>
Nama
</th>

<th style={{...thStyle,width:"220px"}}>
Kelas
</th>

<th style={{...thStyle,width:"140px"}}>
Jadwal
</th>

<th style={{...thStyle,width:"180px"}}>
Tanggal
</th>

<th style={{...thStyle,width:"120px"}}>
Jam
</th>

<th style={{ ...thStyle, width: "120px" }}>
  Selfie
</th>

<th style={{ ...thStyle, width: "160px" }}>
  Surat Dokter
</th>

<th style={{...thStyle,width:"150px"}}>
Status
</th>

<th style={{ ...thStyle, width: "180px" }}>
  Aksi
</th>

</tr>

</thead>

<tbody>

{riwayat.map((item,index)=>(

<tr
key={item.id}
style={{
borderBottom:"1px solid #E2E8F0"
}}
>

<td style={tdStyle}>
{index+1}
</td>

<td style={tdStyle}>
{item.nama}
</td>

<td style={tdStyle}>
{item.kelas}
</td>

<td style={tdStyle}>
{item.jadwal}
</td>

<td style={tdStyle}>
{new Date(item.tanggal).toLocaleDateString("id-ID")}
</td>

<td style={tdStyle}>
{item.waktu}
</td>

<td style={tdStyle}>
  {item.selfie ? (
    <img
      src={`http://localhost:3000/uploads/${item.selfie}`}
      alt="Selfie"
      width="70"
      style={{ borderRadius: "8px" }}
    />
  ) : (
    "-"
  )}
</td>

<td style={tdStyle}>
  {item.surat_dokter ? (
    <a
      href={`http://localhost:3000/uploads/${item.surat_dokter}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Lihat Surat
    </a>
  ) : (
    "-"
  )}
</td>

<td style={tdStyle}>
  {item.status}
</td>

<td style={tdStyle}>

<select
  value={item.status}
  onChange={(e)=>handleEdit(item.id,e.target.value)}
  style={{
    padding:"8px",
    borderRadius:"8px",
    border:"1px solid #CBD5E1",
    marginBottom:"8px"
  }}
>

<option value="Hadir">
✅ Hadir
</option>

<option value="Sakit">
🤒 Sakit
</option>

<option value="Alpa">
❌ Alpa
</option>

</select>

<br/>

<button
onClick={()=>handleDelete(item.id)}
style={{
background:"#EF4444",
color:"white",
border:"none",
padding:"8px 14px",
borderRadius:"8px",
cursor:"pointer"
}}
>

🗑️ Hapus

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

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
<div
  style={{
    marginTop: "35px",
    marginBottom: "90px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "25px",
    textAlign: "center",
    boxShadow: "0 4px 18px rgba(0,0,0,.06)"
  }}
>
  <h3
  style={{
    margin: 0,
    color: "#1E3A8A"
  }}
>
  🎓 Sistem Presensi Mahasiswa
</h3>

<p
  style={{
    marginTop: "8px",
    color: "#64748B"
  }}
>
  STT Terpadu Nurul Fikri
</p>

<p
  style={{
    color: "#64748B"
  }}
>
  Version 1.0.0
</p>

<p
  style={{
    marginTop: "10px",
    color: "#94A3B8",
    fontSize: "14px"
  }}
>
  © 2026 Demam Tinggi
</p>

<p
  style={{
    marginTop: "10px",
    color: role === "admin" ? "#16A34A" : "#2563EB",
    fontWeight: "600"
  }}
>
  {role === "admin"
    ? "🟢 Database Connected"
    : "📚 Selamat Belajar"}
</p>
</div>
      {/* --- BOTTOM NAVIGATION BAR --- */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "65px", backgroundColor: "white", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-around", alignItems: "center", boxShadow: "0 -2px 10px rgba(0,0,0,0.05)" }}>
        <div onClick={() => setActiveTab("beranda")} style={{ textAlign: "center", cursor: "pointer", flex: 1, color: activeTab === "beranda" ? "#3f51b5" : "#94a3b8", fontWeight: activeTab === "beranda" ? "bold" : "normal" }}>
          <div style={{ fontSize: "20px" }}>🏠</div>
          <div style={{ fontSize: "12px", marginTop: "2px" }}>Beranda</div>
        </div>

        {role !== "admin" && (
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
)}
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
    <div style={{ fontSize: "20px" }}>🖥️</div>
    <div style={{ fontSize: "12px" }}>
      Monitoring
    </div>
  </div>
)}
        <div onClick={() => setActiveTab("akun")} style={{ textAlign: "center", cursor: "pointer", flex: 1, color: activeTab === "akun" ? "#3f51b5" : "#94a3b8", fontWeight: activeTab === "akun" ? "bold" : "normal" }}>
          <div style={{ fontSize: "20px" }}>👤</div>
          <div style={{ fontSize: "12px", marginTop: "2px" }}>Akun</div>
        </div>
      </div>
{showNotif && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,.55)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      animation: "fadeIn .3s ease"
    }}
  >
    <div
      style={{
        width: "430px",
        background: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,.25)",
        animation: "zoomIn .3s ease"
      }}
    >
      <div
        style={{
          background:
            notifType === "success"
              ? "#16A34A"
              : "#DC2626",
          padding: "25px",
          textAlign: "center",
          color: "white"
        }}
      >
        <div
          style={{
            fontSize: "60px",
            marginBottom: "10px"
          }}
        >
          {notifType === "success" ? "✅" : "⚠️"}
        </div>

        <h2 style={{ margin: 0 }}>
          {notifTitle}
        </h2>
      </div>

      <div
        style={{
          padding: "30px",
          textAlign: "center"
        }}
      >
        <p
          style={{
            color: "#475569",
            lineHeight: "1.8",
            fontSize: "16px"
          }}
        >
          {notifMessage}
        </p>

        {notifType === "error" && (
          <button
            onClick={() => setShowNotif(false)}
            style={{
              marginTop: "25px",
              background: "#2563EB",
              color: "#fff",
              border: "none",
              padding: "12px 35px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px"
            }}
          >
            OK
          </button>
        )}

        {notifType === "success" && (
          <p
            style={{
              marginTop: "20px",
              color: "#94A3B8",
              fontSize: "13px"
            }}
          >
            Jendela ini akan tertutup secara otomatis...
          </p>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
}

<style>
{`
@keyframes fadeIn{
  from{
    opacity:0;
  }
  to{
    opacity:1;
  }
}

@keyframes zoomIn{
  from{
    opacity:0;
    transform:scale(.8);
  }
  to{
    opacity:1;
    transform:scale(1);
  }
}
`}
</style>