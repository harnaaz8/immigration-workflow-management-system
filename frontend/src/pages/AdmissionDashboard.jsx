import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StatsCard from "../components/StatsCard"; 

function AdmissionDashboard() {
  const navigate = useNavigate();

  const [studentsCount, setStudentsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [alerts, setAlerts] = useState([]); // Broadcast Alerts State
  const [loading, setLoading] = useState(true);

  const officerName = localStorage.getItem("name") || "Admission Officer";

  useEffect(() => {
    loadStatsAndAlerts();
  }, []);

  const loadStatsAndAlerts = async () => {
    try {
      setLoading(true);
      
      // Concurrently parse system parameters and notification bulletins
      const [statsRes, alertsRes] = await Promise.all([
        api.get(`/students/assigned/admission/${officerName}`),
        api.get("/alerts").catch(() => ({ data: [] })) // Avoid crashing dashboard if alerts fail
      ]);
      
      if (alertsRes.data && Array.isArray(alertsRes.data)) {
        setAlerts(alertsRes.data.slice(0, 2)); // Show top 2 most recent notices
      }

      if (statsRes.data && Array.isArray(statsRes.data)) {
        setStudentsCount(statsRes.data.length);
        setCompletedCount(
          statsRes.data.filter(
            (s) => s.status === "ENROLLMENT" || s.status === "VISA" || s.status === "COMPLETED"
          ).length
        );
        setPendingCount(
          statsRes.data.filter((s) => s.status === "ADMISSION").length
        );
      }
    } catch (err) {
      console.error("Failed to load admission workstation metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const actionCardStyle = {
    background: "white",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    padding: "20px 24px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.01)",
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
          <h3 style={{ color: "#475569", margin: 0, fontSize: "16px" }}>Aggregating Admission Ledgers...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", padding: "40px 30px", boxSizing: "border-box", background: "#f8fafc", minHeight: "100vh" }}>
      
      {/* HEADER BRANDING AREA */}
      <div style={{ marginBottom: "35px" }}>
        <span style={{ fontSize: "14px", fontWeight: "700", color: "#2563eb", letterSpacing: "1px", textTransform: "uppercase" }}>
          University Offer & Application Desk
        </span>
        <h1 style={{ margin: "4px 0 0 0", color: "#0f172a", fontSize: "32px", fontWeight: "700", letterSpacing: "-0.5px" }}>
          Welcome Back, {officerName}
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "15px" }}>
          Track institution offers, manage university submissions, audit conditional approvals, and forward qualified files to enrollment confirmation.
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

      {/* DATA METRIC STATS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        <div style={{ borderLeft: "4px solid #2563eb", borderRadius: "4px" }}>
          <StatsCard title="Total Offers Tracked" value={studentsCount} />
        </div>
        <div style={{ borderLeft: "4px solid #22c55e", borderRadius: "4px" }}>
          <StatsCard title="Promoted to Enrollment" value={completedCount} />
        </div>
        <div style={{ borderLeft: "4px solid #f59e0b", borderRadius: "4px" }}>
          <StatsCard title="Awaiting Acceptance" value={pendingCount} />
        </div>
      </div>

      {/* QUICK OPERATIONAL LINKS */}
      <div>
        <h3 style={{ color: "#1e293b", fontSize: "18px", fontWeight: "700", marginBottom: "15px" }}>
          Workstation Control Operations
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          <button 
            onClick={() => navigate("/my-students")}
            style={{ ...actionCardStyle, borderLeft: "4px solid #2563eb" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#2563eb"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >
            <span style={{ fontSize: "24px" }}>📋</span>
            <div>
              <strong style={{ display: "block", color: "#0f172a" }}>Process Admission Queues</strong>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "normal" }}>Log offer letters, cross-examine compliance conditions, and update record parameters.</span>
            </div>
          </button>

          <button 
            onClick={() => navigate("/profile")}
            style={{ ...actionCardStyle, borderLeft: "4px solid #64748b" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#64748b"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >
            <span style={{ fontSize: "24px" }}>👤</span>
            <div>
              <strong style={{ display: "block", color: "#0f172a" }}>Admission Officer Settings</strong>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "normal" }}>View system tracking access keys and security identity metrics.</span>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}

export default AdmissionDashboard;