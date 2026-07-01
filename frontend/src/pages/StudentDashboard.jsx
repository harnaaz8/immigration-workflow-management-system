import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function StudentDashboard() {
  const [visaDoc, setVisaDoc] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
        const res = await api.get("/students/my-dashboard");
        setData(res.data);
        
        if (res.data.status === "COMPLETED") {
            const detailsRes = await api.get(`/students/${res.data.student_id}/details`);
            
            // LOG the full response to see where 'documents' is
            console.log("Full Details Data:", detailsRes.data); 

            // Search for the document in the response
            const docs = detailsRes.data.documents || []; 
            const foundVisa = docs.find(d => d.document_type === "VISA_APPROVAL");
            
            if (foundVisa) {
                setVisaDoc(foundVisa);
            } else {
                console.warn("Visa document not found in:", docs);
            }
        }
    } catch (err) {
        console.error("Error loading dashboard:", err);
    }
};

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.clear();
    navigate("/login");
  };

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", background: "#f8fafc", minHeight: "100vh" }}>
        <h2 style={{ color: "#ef4444" }}>Failed to load profile dashboard</h2>
        <p style={{ color: "#64748b" }}>Your session may have expired. Please try logging back in.</p>
        <button onClick={handleLogout} style={{ background: "#2563eb", color: "white", padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", marginTop: "15px" }}>
          Return to Login
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 15px auto" }}></div>
          <h2 style={{ color: "#475569", margin: 0, fontSize: "18px" }}>Loading Application Profile...</h2>
        </div>
      </div>
    );
  }

  const stages = [
    { key: "ENQUIRY", label: "Initial Enquiry" },
    { key: "COUNSELLING", label: "Academic Counselling" },
    { key: "ADMISSION", label: "University Admission" },
    { key: "ENROLLMENT", label: "Visa Enrollment" },
    { key: "VISA", label: "Visa Processing" },
    { key: "COMPLETED", label: "Pipeline Completed" },
  ];

  const currentIndex = stages.findIndex(s => s.key === data.status);

  const cardStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
    marginBottom: "30px",
    border: "1px solid #e2e8f0"
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      
      {/* GLOBAL APPLICATION SIDEBAR */}
      <div style={{
          width: "260px", background: "#1e293b", color: "white",
          padding: "30px 20px", display: "flex", flexDirection: "column",
          gap: "10px", position: "sticky", top: 0, height: "100vh", boxSizing: "border-box",
      }}>
        <h2 style={{ margin: "0 0 30px 10px", fontSize: "20px", color: "#38bdf8", fontWeight: "800" }}>🎓 STUDENT PORTAL</h2>
        <button onClick={() => navigate("/dashboard")} style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer", fontWeight: "bold" }}>🏠 Dashboard Overview</button>
        <button onClick={() => navigate("/profile")} style={{ background: "transparent", color: "#cbd5e1", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer" }}>👤 My Profile</button>
        <button onClick={handleLogout} style={{ background: "transparent", color: "#f87171", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer", marginTop: "auto" }}>🚪 Logout Session</button>
      </div>

      {/* DASHBOARD CONTENT HOLDER */}
      <div style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", padding: "40px 30px", boxSizing: "border-box" }}>
        
        {/* WELCOME HERO BANNER */}
        <div style={{
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "white", padding: "40px", borderRadius: "20px", marginBottom: "35px",
            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.15)", display: "flex",
            justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px"
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "700", letterSpacing: "-0.5px" }}>Welcome back, {data.name}</h1>
            <p style={{ margin: "8px 0 0 0", fontSize: "16px", opacity: 0.9 }}>Track the live deployment verification status of your academic relocation file.</p>
          </div>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => navigate("/profile")}
              style={{ background: "white", color: "#2563eb", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              Review Personal Details
            </button>

            {data.status === "COMPLETED" && visaDoc && (
              <a
                href={`http://localhost:8000/uploads/${visaDoc.file_name}`}
                download
                style={{
                  background: "#22c55e", color: "white", border: "none", padding: "12px 24px",
                  borderRadius: "10px", fontWeight: "600", fontSize: "15px", cursor: "pointer",
                  textDecoration: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                }}
              >
                ⬇️ Download Visa
              </a>
            )}
          </div>
        </div>

        {/* RE-ENGINEERED WORKFLOW PROGRESS STEPPER */}
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0, marginBottom: "8px", color: "#0f172a", fontSize: "18px", fontWeight: "700" }}>Application Progress Path</h3>
          <p style={{ margin: "0 0 30px 0", color: "#64748b", fontSize: "14px" }}>Your file must clear verification across consecutive institutional filters.</p>
          
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", rowGap: "24px", columnGap: "0px" }}>
            {stages.map((stage, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              return (
                <div key={stage.key} style={{ display: "flex", alignItems: "center", flex: "1 1 auto", minWidth: "160px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px", position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%", background: isCompleted || isCurrent ? "#22c55e" : "#e2e8f0",
                        display: "flex", alignItems: "center", justifyContent: "center", color: isCompleted || isCurrent ? "white" : "#64748b",
                        fontWeight: "700", fontSize: "14px", border: isCurrent ? "2px solid #16a34a" : "none"
                      }}>
                        {isCompleted ? "✓" : index + 1}
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: isCurrent ? "700" : "600", color: isCurrent ? "#0f172a" : isCompleted ? "#475569" : "#94a3b8" }}>
                        {stage.label}
                      </span>
                    </div>
                  </div>
                  {index !== stages.length - 1 && (
                    <div style={{ flex: 1, height: "2px", background: index < currentIndex ? "#22c55e" : "#e2e8f0", margin: "0 15px", minWidth: "30px" }}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ASSIGNED SUPPORT CORPS GRID */}
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0, marginBottom: "8px", color: "#0f172a", fontSize: "18px", fontWeight: "700" }}>Your Assigned Management Officers</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {[
              { label: "Enquiry Intake Officer", value: data.assigned_enquiry_officer },
              { label: "Academic Counsellor", value: data.assigned_counsellor },
              { label: "Admissions Review Officer", value: data.assigned_admission_officer },
              { label: "Visa Verification Officer", value: data.assigned_visa_officer },
              { label: "Enrollment Registrar", value: data.assigned_enrollment_officer },
            ].map((officer, idx) => (
              <div key={idx} style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>{officer.label}</span>
                <span style={{ fontSize: "15px", color: officer.value ? "#0f172a" : "#a9b8cc", fontWeight: "600" }}>
                  {officer.value ? `👤 ${officer.value}` : "⏳ Awaiting Route Assignment"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;