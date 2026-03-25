import './App.css';
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Reg from "./Reg";
import Home from "./Home";
import Capture from "./Capture";
import Dashboard from "./Dashboard";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="navbar-brand">
          🎓 <span>Smart</span> Attendance
        </div>
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>Register</NavLink>
          <NavLink to="/capture" className={({ isActive }) => isActive ? "active" : ""}>Scan</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Reg />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
