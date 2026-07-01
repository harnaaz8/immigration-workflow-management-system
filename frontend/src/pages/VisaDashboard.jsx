import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StatsCard from "../components/StatsCard"; 

function VisaDashboard() {
  const navigate = useNavigate();

  const [studentsCount, setStudentsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const officerName = localStorage.getItem("name") || "Visa Officer";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/students/assigned/visa/${officerName}`);
      
      if (res.data && Array.isArray(res.data)) {
        setStudentsCount(res.data.length);
        
        setCompletedCount(
          res.data.filter((s) => s.status === "COMPLETED").length
        );

        setPendingCount(
          res.data.filter((s) => s.status === "VISA").length
        );
      }
    } catch (err) {
      console.error("Failed to load visa workstation metrics:", err);
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
    } catch (err) {
        console.error("Logout error:", err);
    }
    localStorage.clear();
    navigate("/login");
  };

  // Shared CRM Action Card Styles
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f8fafc" }}>
        {/* Injecting animation keyframes directly to handle inline spinning */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={{ textAlign: "center" }}>
          <div style={{ border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 15px auto" }}></div>
          <h3 style={{ color: "#475569", margin: 0, fontSize: "16px" }}>Aggregating Immigration Ledgers...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      
      {/* GLOBAL SYSTEM SIDEBAR */}
      <div
        style={{
          width: "260px",
          background: "#1e293b",
          color: "white",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          position: "sticky",
          top: 0,
          height: "100vh",
          boxSizing: "border-box"
        }}
      >
        <h2 style={{ margin: "0 0 30px 10px", fontSize: "20px", color: "#38bdf8", fontWeight: "800" }}>
          💼 STAFF CONSOLE
        </h2>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "white",
            border: "none",
            padding: "12px 15px",
            borderRadius: "8px",
            textAlign: "left",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ✈️ Visa Filing Home
        </button>
        <button
          onClick={() => navigate("/my-students")}
          style={{
            background: "transparent",
            color: "#cbd5e1",
            border: "none",
            padding: "12px 15px",
            borderRadius: "8px",
            textAlign: "left",
            cursor: "pointer"
          }}
        >
          👥 My Assigned Files
        </button>
        <button
          onClick={() => navigate("/profile")}
          style={{
            background: "transparent",
            color: "#cbd5e1",
            border: "none",
            padding: "12px 15px",
            borderRadius: "8px",
            textAlign: "left",
            cursor: "pointer"
          }}
        >
          👤 My Profile
        </button>
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            color: "#f87171",
            border: "none",
            padding: "12px 15px",
            borderRadius: "8px",
            textAlign: "left",
            cursor: "pointer",
            marginTop: "auto"
          }}
        >
          🚪 System Logout
        </button>
      </div>

      {/* WORKSPACE MAIN WRAPPER CONTAINER */}
      <div style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", padding: "40px 30px", boxSizing: "border-box" }}>
        
        {/* HEADER BRANDING DESK AREA */}
        <div style={{ marginBottom: "35px" }}>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#2563eb", letterSpacing: "1px", textTransform: "uppercase" }}>
            Consular & GTE Compliance Desk
          </span>
          <h1 style={{ margin: "4px 0 0 0", color: "#0f172a", fontSize: "32px", fontWeight: "700", letterSpacing: "-0.5px" }}>
            Visa Processing Center
          </h1>
          <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "15px" }}>
            Logged in: <strong style={{ color: "#334155" }}>{officerName}</strong> — Track submission states, upload embassy clearances, and dispatch completed pipelines.
          </p>
        </div>

        {/* DATA METRIC STATS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "40px" }}>
          <div style={{ borderLeft: "4px solid #2563eb", borderRadius: "4px" }}>
            <StatsCard title="Total Assigned Files" value={studentsCount} />
          </div>
          <div style={{ borderLeft: "4px solid #22c55e", borderRadius: "4px" }}>
            <StatsCard title="Cleared & Completed" value={completedCount} />
          </div>
          <div style={{ borderLeft: "4px solid #f59e0b", borderRadius: "4px" }}>
            <StatsCard title="In-Filing Stage (Visa)" value={pendingCount} />
          </div>
        </div>

        {/* QUICK OPERATIONAL DESK LINKS */}
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
                <strong style={{ display: "block", color: "#0f172a" }}>Process Assigned Queues</strong>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "normal" }}>Review GTE documents, visa outcome slots, and file logs.</span>
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
                <strong style={{ display: "block", color: "#0f172a" }}>Officer Profile Settings</strong>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "normal" }}>Manage your authentication properties and work summaries.</span>
              </div>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default VisaDashboard;