import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page">
      <div className="card hero">
        <h2>Smart Attendance System</h2>
        <p>Automated face recognition attendance — fast, accurate, and hands-free.</p>
        <div className="feature-grid">
          <Link to="/register" className="feature-card">
            <div className="icon">📝</div>
            <h3>Register</h3>
            <p>Add a student and capture face images</p>
          </Link>
          <Link to="/capture" className="feature-card">
            <div className="icon">📷</div>
            <h3>Scan</h3>
            <p>Mark attendance by scanning your face</p>
          </Link>
          <Link to="/dashboard" className="feature-card">
            <div className="icon">📊</div>
            <h3>Dashboard</h3>
            <p>View all attendance records</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
