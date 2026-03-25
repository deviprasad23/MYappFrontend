import axios from "axios";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8082";

function Reg() {
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [studentId, setStudentId] = useState(null);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const webcamRef = useRef(null);

  const changeField = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const registerStudent = async () => {
    if (!data.username || !data.email || !data.password) {
      setStatus({ type: "error", message: "Please fill in all fields." });
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/api/register`, data);
      setStudentId(res.data?.studentId);
      setStatus({ type: "success", message: res.data?.message || "Registered! Now capture face images below." });
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || err.response?.data || err.message || "Registration failed." });
    }
  };

  const capture = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) setImages((prev) => [...prev, screenshot]);
  }, []);

  const uploadFaces = async () => {
    if (!studentId) { setStatus({ type: "error", message: "Register a student first." }); return; }
    if (images.length === 0) { setStatus({ type: "error", message: "Capture at least one face image." }); return; }
    setIsUploading(true);
    setStatus(null);
    const formData = new FormData();
    images.forEach((base64, idx) => {
      const blob = dataURLtoBlob(base64);
      formData.append("images", blob, `face_${idx}.jpg`);
    });
    try {
      await axios.post(`${API_URL}/api/students/${studentId}/faces`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus({ type: "success", message: "Face images uploaded. You can now use the Scan feature." });
      setImages([]);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data || err.message || "Failed to upload face images." });
    } finally {
      setIsUploading(false);
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const [header, base64] = dataURL.split(",");
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return new Blob([array], { type: header.match(/:(.*?);/)[1] });
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Register Student</div>
        <div className="form-group">
          <label>Username</label>
          <input name="username" value={data.username} onChange={changeField} placeholder="e.g. john_doe" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={data.email} onChange={changeField} placeholder="e.g. john@example.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={data.password} onChange={changeField} placeholder="Enter password" />
        </div>
        <button className="btn btn-primary" onClick={registerStudent}>✓ Register Student</button>
        {status && !studentId && (
          <div className={`alert alert-${status.type}`}>
            {status.type === "error" ? "⚠️" : "✅"} {status.message}
          </div>
        )}
      </div>

      {studentId && (
        <div className="card">
          <div className="step-label">Step 2</div>
          <div className="card-title">Capture Face Images</div>
          <p style={{ color: "#666", marginBottom: 20, fontSize: "0.9rem" }}>
            Look at the camera and capture a few images with slightly different angles for better recognition.
          </p>
          <div className="webcam-wrapper">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              style={{ width: 320, height: 240, display: "block" }}
            />
          </div>
          <div className="btn-row">
            <button className="btn btn-accent" onClick={capture}>📸 Capture Frame</button>
            <button className="btn btn-primary" onClick={uploadFaces} disabled={isUploading || images.length === 0}>
              {isUploading ? "⏳ Uploading..." : `⬆ Upload Faces${images.length > 0 ? ` (${images.length})` : ""}`}
            </button>
          </div>
          {images.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div className="step-label">Captured Frames</div>
              <div className="captures-grid">
                {images.map((img, idx) => (
                  <div key={idx} className="capture-thumb">
                    <img src={img} alt={`capture-${idx}`} />
                    <button className="remove-btn" onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {status && (
            <div className={`alert alert-${status.type}`}>
              {status.type === "error" ? "⚠️" : "✅"} {status.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Reg;
