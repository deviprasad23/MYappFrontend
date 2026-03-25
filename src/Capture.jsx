import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8082";

function Capture() {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const captureAndSend = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) { setResult({ error: "Unable to capture image" }); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API_URL}/api/attendance/scan`, { imageBase64: imageSrc });
      setResult(res.data);
    } catch (err) {
      setResult({ error: err.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Attendance Check-in</div>
        <p style={{ color: "#666", marginBottom: 20, fontSize: "0.9rem" }}>
          Position your face in the camera and click the button to mark attendance.
        </p>
        <div className="webcam-wrapper">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            style={{ width: 360, height: 270, display: "block" }}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <button className="btn btn-accent" onClick={captureAndSend} disabled={loading}
            style={{ fontSize: "1rem", padding: "14px 32px" }}>
            {loading ? "⏳ Scanning..." : "📷 Scan Face & Mark Attendance"}
          </button>
        </div>
        {result && (
          <div style={{ marginTop: 20 }}>
            {result.error && <div className="alert alert-error">⚠️ {result.error}</div>}
            {result.recognized && (
              <div className="alert alert-success">
                ✅ Attendance marked for <strong>{result.username}</strong>
                <br /><span style={{ fontSize: "0.85rem", opacity: 0.8 }}>{result.timestamp}</span>
              </div>
            )}
            {!result.recognized && !result.error && (
              <div className="alert alert-info">🔍 Face not recognized. Try again or register first.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Capture;
