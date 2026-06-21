import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // 1. PASTIKAN IMPORT DASHBOARD INI ADA

// Komponen Pembatas (Gembok) agar halaman tidak bisa ditembak langsung via URL sebelum login
function ProtectedRoute({ children }) {
  const isLogin = localStorage.getItem("isLogin");
  if (!isLogin) {
    // Kalau belum login, tendang paksa ke halaman login
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Pertama kali aplikasi dibuka, otomatis arahkan ke halaman Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Jalur Halaman Umum */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2. JALUR DASHBOARD MAHASISWA (Dikunci pake ProtectedRoute) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Jika user mengetik URL ngasal, otomatis balikkan ke Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;