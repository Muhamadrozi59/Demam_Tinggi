import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ nama: "", email: "", password: "", role: "user" });
  const navigate = useNavigate(); // Di sini posisi yang benar

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

      if (response.ok) {
        alert("Register berhasil!");
        navigate("/login");
      } else {
        alert("Gagal: " + data.message);
      }
    } catch (error) {
     alert("Gagal: " + (data.message || JSON.stringify(data)));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nama" placeholder="Nama" onChange={handleChange} required /><br/><br/>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br/><br/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br/><br/>
        <select name="role" onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select><br/><br/>
        <button type="submit">Daftar</button>
      </form>
    </div>
  );
};

export default Register;