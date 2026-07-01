import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Timeline from "../components/Timeline";
import api from "../services/api";

function AdminStudentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      const res = await api.get(`/students/${id}/details`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to load student:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {}
    localStorage.clear();
    navigate("/login");
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    const clean = filePath.replace(/\\/g, "/").replace("uploads/", "");
    return `http://localhost:8000/uploads/${clean}`;
  };

  const isImage = (fileName) => {
    if (!fileName) return false;
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8fafc" }}>
      <p style={{ color: "#64748b", fontSize: "16px" }}>Loading student profile...</p>
    </div>
  );

  if (!data) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p style={{ color: "#ef4444" }}>Student not found.</p>
    </div>
  );

  const { student, documents } = data;

  const officers = [
    { label: "Enquiry Officer", value: student.assigned_enquiry_officer },
    { label: "Counsellor", value: student.assigned_counsellor },
    { label: "Admission Officer", value: student.assigned_admission_officer },
    { label: "Enrollment Officer", value: student.assigned_enrollment_officer },
    { label: "Visa Officer", value: student.assigned_visa_officer },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "260px", background: "#0f172a", color: "white",
        padding: "30px 20px", display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", boxSizing: "border-box"
      }}>
        <h2 style={{ margin: "0 0 30px 10px", fontSize: "20px", color: "#38bdf8", fontWeight: "800" }}>
          ⚙️ SUPER ADMIN
        </h2>
        <button onClick={() => navigate("/super-admin")} style={{ background: "transparent", color: "#cbd5e1", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer" }}>
          📊 System Overview
        </button>
        <button onClick={() => navigate("/staff")} style={{ background: "transparent", color: "#cbd5e1", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer" }}>
          👥 Manage Staff
        </button>
        <button onClick={() => navigate("/students")} style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer", fontWeight: "bold" }}>
          👨‍🎓 Students
        </button>
        <button onClick={handleLogout} style={{ background: "transparent", color: "#f87171", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer", marginTop: "auto" }}>
          🚪 System Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "40px 30px", boxSizing: "border-box" }}>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/students")}
          style={{ background: "transparent", border: "1px solid #e2e8f0", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", color: "#64748b", marginBottom: "24px", fontSize: "14px" }}
        >
          ← Back to Students
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>

          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* PROFILE CARD */}
            <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
                {student.photo_path ? (
                  <img
                    src={getFileUrl(student.photo_path)}
                    alt="Student"
                    style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "3px solid #e2e8f0" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                    👤
                  </div>
                )}
                <div>
                  <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#0f172a" }}>
                    {student.first_name} {student.last_name}
                  </h2>
                  <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>{student.student_code}</p>
                  <span style={{
                    display: "inline-block", marginTop: "6px",
                    padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                    background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe"
                  }}>
                    {student.status}
                  </span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { label: "Email", value: student.email },
                  { label: "Phone", value: student.phone },
                  { label: "Date of Birth", value: student.dob },
                  { label: "Gender", value: student.gender },
                  { label: "Nationality", value: student.nationality },
                  { label: "Passport No.", value: student.passport_number },
                  { label: "Preferred Country", value: student.preferred_country },
                  { label: "Preferred Intake", value: student.preferred_intake },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "600" }}>{label}</p>
                    <p style={{ margin: "2px 0 0 0", fontSize: "14px", color: "#0f172a", fontWeight: "500" }}>{value || "—"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ASSIGNED OFFICERS */}
            <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", color: "#0f172a" }}>👥 Assigned Officers</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {officers.map(({ label, value }) => (
                  <div key={label} style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "600" }}>{label}</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "14px", fontWeight: "600", color: value ? "#0f172a" : "#94a3b8" }}>
                      {value ? `✓ ${value}` : "Not assigned"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* DOCUMENTS */}
            <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", color: "#0f172a" }}>📎 Uploaded Documents</h3>
              {documents && documents.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {documents.map((doc) => (
                    <div key={doc.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#0f172a" }}>{doc.document_type}</p>
                        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                          {doc.file_name} · Stage: {doc.stage} · By: {doc.uploaded_by}
                        </p>
                      </div>
                      <a
                        href={getFileUrl(doc.file_path)}
                        target="_blank"
                        rel="noreferrer"
                        style={{ background: "#2563eb", color: "white", padding: "7px 14px", borderRadius: "7px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}
                      >
                        {isImage(doc.file_name) ? "View" : "Download"}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#94a3b8", fontSize: "14px" }}>No documents uploaded yet.</p>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN — TIMELINE */}
          <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", height: "fit-content", position: "sticky", top: "40px" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "15px", color: "#0f172a" }}>🕐 Case File History</h3>
            <Timeline status={student.status} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminStudentView;