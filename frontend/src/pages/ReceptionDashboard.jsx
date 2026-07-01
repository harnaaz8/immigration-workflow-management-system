import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StatsCard from "../components/StatsCard"; 

function ReceptionDashboard() {
  const navigate = useNavigate();

  const staffName = localStorage.getItem("name") || "Reception Desk";

  const [studentsCount, setStudentsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [alerts, setAlerts] = useState([]); // Broadcast Alerts State
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatsAndAlerts();
  }, []);

  const loadStatsAndAlerts = async () => {
    try {
      setLoading(true);
      
      const [statsRes, alertsRes] = await Promise.all([
        api.get("/students"),
        api.get("/alerts").catch(() => ({ data: [] }))
      ]);

      if (alertsRes.data && Array.isArray(alertsRes.data)) {
        setAlerts(alertsRes.data.slice(0, 2));
      }

      if (statsRes.data && Array.isArray(statsRes.data)) {
        setStudentsCount(statsRes.data.length);
        setPendingCount(
          statsRes.data.filter(
            (s) => s.status === "ENQUIRY" && !s.assigned_enquiry_officer
          ).length
        );
        setCompletedCount(
          statsRes.data.filter((s) => s.status === "COMPLETED").length
        );
      }
    } catch (err) {
      console.error("Failed to load reception desk metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const actionButtonStyle = {
    background: "white",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    padding: "16px 24px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    transition: "all 0.2s ease",
    textAlign: "left",
    width: "100%",
    boxSizing: "border-box"
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", flex: 1, background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 15px auto" }}></div>
          <h3 style={{ color: "#475569", margin: 0, fontSize: "16px" }}>Aggregating Front Desk Ledgers...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", padding: "40px 30px", boxSizing: "border-box", background: "#f8fafc", minHeight: "100vh" }}>
      
      {/* HEADER HERO AREA */}
      <div style={{ marginBottom: "35px" }}>
        <span style={{ fontSize: "14px", fontWeight: "700", color: "#2563eb", letterSpacing: "1px", textTransform: "uppercase" }}>
          Workspace Intake Desk
        </span>
        <h1 style={{ margin: "4px 0 0 0", color: "#0f172a", fontSize: "32px", fontWeight: "700", letterSpacing: "-0.5px" }}>
          Welcome Back, {staffName}
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "15px" }}>
          Manage walk-in entries, initial registrations, and filter pending application lifecycles.
        </p>
      </div>

      {/* ADMIN ALERTS SYSTEM WIDGET */}
      {alerts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "35px" }}>
          {alerts.map((bulletin) => (
            <div key={bulletin.id} style={{
              background: "linear-gradient(to right, #fef3c7, #fff7ed)",
              border: "1px solid #fde68a",
              borderRadius: "12px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "start",
              gap: "14px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
            }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "#f59e0b" }}></div>
              <span style={{ fontSize: "20px", marginTop: "2px" }}>⚠️</span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <strong style={{ fontSize: "14px", color: "#78350f" }}>{bulletin.title}</strong>
                  <span style={{ fontSize: "9px", px: "6px", py: "2px", background: "#fef3c7", border: "1px solid #fcd34d", color: "#b45309", fontWeight: "700", borderRadius: "4px", textTransform: "uppercase" }}>System Notice</span>
                </div>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#451a03", lineHeight: "1.5" }}>{bulletin.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* METRICS DISPATCH GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        <div style={{ borderLeft: "4px solid #2563eb", borderRadius: "4px" }}>
          <StatsCard title="Total Students" value={studentsCount} />
        </div>
        <div style={{ borderLeft: "4px solid #22c55e", borderRadius: "4px" }}>
          <StatsCard title="Completed Cases" value={completedCount} />
        </div>
        <div style={{ borderLeft: "4px solid #eab308", borderRadius: "4px" }}>
          <StatsCard title="Pending Officer Assignment" value={pendingCount} />
        </div>
      </div>

      {/* QUICK DESK OPERATIONAL ACTIONS */}
      <div>
        <h3 style={{ color: "#1e293b", fontSize: "18px", fontWeight: "700", marginBottom: "15px" }}>
          Front Desk Actions
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          <button 
            onClick={() => navigate("/create-student")}
            style={{ ...actionButtonStyle, borderLeft: "4px solid #2563eb" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#2563eb"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >
            <span style={{ fontSize: "24px" }}>➕</span>
            <div>
              <strong style={{ display: "block", color: "#0f172a" }}>Register New Student</strong>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "normal" }}>Onboard walk-in or new inbound applications.</span>
            </div>
          </button>

          <button 
            onClick={() => navigate("/students")}
            style={{ ...actionButtonStyle, borderLeft: "4px solid #475569" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#475569"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >
            <span style={{ fontSize: "24px" }}>🔍</span>
            <div>
              <strong style={{ display: "block", color: "#0f172a" }}>Search Directory</strong>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "normal" }}>Find active files and update staging pipelines.</span>
            </div>
          </button>

          <button 
            onClick={() => navigate("/profile")}
            style={{ ...actionButtonStyle, borderLeft: "4px solid #64748b" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#64748b"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >
            <span style={{ fontSize: "24px" }}>👤</span>
            <div>
              <strong style={{ display: "block", color: "#0f172a" }}>My Station Settings</strong>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "normal" }}>Update account secrets and tracking logs.</span>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}

export default ReceptionDashboard;