import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Jika user buka halaman utama, otomatis diarahkan ke /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Jalur Halaman Login & Register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;