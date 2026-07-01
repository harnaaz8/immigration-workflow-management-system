import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function StaffProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, [id]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      if (res.data && Array.isArray(res.data)) {
        const found = res.data.find((u) => u.id === parseInt(id));
        setMember(found || null);
      }
    } catch (err) {
      console.error("Failed to load staff profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/auth/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.clear();
    navigate("/login");
  };

  const getRoleBadge = (role) => {
    const base = { padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", display: "inline-block" };
    const map = {
      SUPER_ADMIN:        { background: "#fef3c7", color: "#92400e" },
      RECEPTIONIST:       { background: "#e0f2fe", color: "#0369a1" },
      ENQUIRY_OFFICER:    { background: "#f3e8ff", color: "#6b21a8" },
      COUNSELLOR:         { background: "#dcfce7", color: "#15803d" },
      ADMISSION_OFFICER:  { background: "#fff7ed", color: "#c2410c" },
      ENROLLMENT_OFFICER: { background: "#f0fdf4", color: "#166534" },
      VISA_OFFICER:       { background: "#fef9c3", color: "#a16207" },
    };
    const colors = map[role] || { background: "#f1f5f9", color: "#475569" };
    return <span style={{ ...base, ...colors }}>{role?.replace(/_/g, " ")}</span>;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 15px auto" }}></div>
          <h3 style={{ color: "#475569", margin: 0 }}>Loading Staff Profile...</h3>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>👤</div>
          <h2 style={{ color: "#0f172a" }}>Staff member not found</h2>
          <button onClick={() => navigate("/staff")} style={{ marginTop: "16px", padding: "10px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
            ← Back to Staff Directory
          </button>
        </div>
      </div>
    );
  }

  const cardStyle = {
    background: "white", padding: "30px", borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)", marginBottom: "24px",
    border: "1px solid #e2e8f0"
  };

  const fieldLabel = { color: "#64748b", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "4px" };
  const fieldValue = { color: "#0f172a", fontSize: "16px", fontWeight: "600" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "260px", background: "#0f172a", color: "white",
        padding: "30px 20px", display: "flex", flexDirection: "column",
        gap: "10px", position: "sticky", top: 0, height: "100vh", boxSizing: "border-box"
      }}>
        <h2 style={{ margin: "0 0 30px 10px", fontSize: "20px", color: "#38bdf8", fontWeight: "800" }}>
          ⚙️ SUPER ADMIN
        </h2>
        <button onClick={() => navigate("/super-admin")} style={{ background: "transparent", color: "#cbd5e1", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer" }}>
          📊 System Overview
        </button>
        <button onClick={() => navigate("/staff")} style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer", fontWeight: "bold" }}>
          👥 Manage Staff
        </button>
        <button onClick={() => navigate("/students")} style={{ background: "transparent", color: "#cbd5e1", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer" }}>
          👨‍🎓 View Students
        </button>
        <button onClick={handleLogout} style={{ background: "transparent", color: "#f87171", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer", marginTop: "auto" }}>
          🚪 System Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, maxWidth: "900px", margin: "0 auto", padding: "40px 30px", boxSizing: "border-box" }}>

        {/* BACK BUTTON + HEADER */}
        <div style={{ marginBottom: "28px" }}>
          <button onClick={() => navigate("/staff")} style={{ background: "none", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: "#475569", marginBottom: "16px", fontWeight: "600" }}>
            ← Back to Staff Directory
          </button>
          <h1 style={{ margin: 0, color: "#0f172a", fontSize: "28px", fontWeight: "700" }}>Staff Profile</h1>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>Viewing account details for {member.name}</p>
        </div>

        {/* PROFILE CARD */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #f1f5f9", paddingBottom: "20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "22px", fontWeight: "800" }}>
                {member.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ margin: 0, color: "#0f172a", fontSize: "22px", fontWeight: "700" }}>{member.name}</h2>
                <div style={{ marginTop: "6px" }}>{getRoleBadge(member.role)}</div>
              </div>
            </div>
            <span style={{
              padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "700",
              background: member.is_active ? "#dcfce7" : "#fee2e2",
              color: member.is_active ? "#15803d" : "#b91c1c"
            }}>
              {member.is_active ? "● Active" : "● Inactive"}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
            <div>
              <span style={fieldLabel}>Staff ID</span>
              <span style={{ ...fieldValue, fontFamily: "monospace" }}>#{member.id}</span>
            </div>
            <div>
              <span style={fieldLabel}>Full Name</span>
              <span style={fieldValue}>{member.name}</span>
            </div>
            <div>
              <span style={fieldLabel}>Email Address</span>
              <span style={fieldValue}>{member.email}</span>
            </div>
            <div>
              <span style={fieldLabel}>Assigned Role</span>
              <span style={fieldValue}>{member.role?.replace(/_/g, " ")}</span>
            </div>
            <div>
              <span style={fieldLabel}>Account Status</span>
              <span style={fieldValue}>{member.is_active ? "Active" : "Inactive"}</span>
            </div>
            <div>
              <span style={fieldLabel}>Member Since</span>
              <span style={fieldValue}>
                {member.created_at ? new Date(member.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StaffProfile;