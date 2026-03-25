import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8082";

function Dashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/attendance`);
      setRecords(res.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAttendance(); }, []);

  return (
    <div className="page">
      <div className="card">
        <div className="table-header">
          <div className="card-title" style={{ margin: 0 }}>Attendance Records</div>
          <button className="btn btn-primary" onClick={loadAttendance} disabled={loading}>
            {loading ? "⏳ Loading..." : "↻ Refresh"}
          </button>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {!loading && !error && records.length === 0 && (
          <div className="empty-state">📭 No attendance records yet.</div>
        )}

        {!loading && !error && records.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Date &amp; Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => (
                <tr key={r.id}>
                  <td style={{ color: "#aaa" }}>{idx + 1}</td>
                  <td><strong>{r.studentName}</strong></td>
                  <td>{new Date(r.timestamp).toLocaleString()}</td>
                  <td><span className="badge">Present</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
