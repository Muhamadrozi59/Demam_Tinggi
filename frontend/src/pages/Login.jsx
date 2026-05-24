import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // Di sini posisi yang benar

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

      if (response.ok) {
        alert("Login Berhasil!");
        localStorage.setItem("token", data.token);
        alert("Token tersimpan! Siap lanjut Sprint berikutnya.");
      } else {
        alert("Gagal: " + (data.message || JSON.stringify(data)));
      }
    } catch (error) {
      alert("Server backend mati!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br/><br/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br/><br/>
        <button type="submit">Masuk</button>
      </form>
    </div>
  );
};

export default Login;