import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StatsCard from "../components/StatsCard"; 

function EnquiryDashboard() {
  const navigate = useNavigate();

  const [studentsCount, setStudentsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const officerName = localStorage.getItem("name") || "Enquiry Officer";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/students/assigned/enquiry/${officerName}`);
      
      if (res.data && Array.isArray(res.data)) {
        setStudentsCount(res.data.length);

        // Completed means they have been successfully processed past the initial enquiry phase
        setCompletedCount(
          res.data.filter((s) => s.status !== "ENQUIRY").length
        );

        setPendingCount(
          res.data.filter((s) => s.status === "ENQUIRY").length
        );
      }
    } catch (err) {
      console.error("Failed to load intake workstation metrics:", err);
    } finally {
      setLoading(false);
    }
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", flex: 1, background: "#f8fafc" }}>
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
          <h3 style={{ color: "#475569", margin: 0, fontSize: "16px" }}>Aggregating Intake Ledgers...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", padding: "40px 30px", boxSizing: "border-box", background: "#f8fafc", minHeight: "100vh" }}>
      
      {/* HEADER BRANDING DESK AREA */}
      <div style={{ marginBottom: "35px" }}>
        <span style={{ fontSize: "14px", fontWeight: "700", color: "#2563eb", letterSpacing: "1px", textTransform: "uppercase" }}>
          Initial Intake & Screening Desk
        </span>
        <h1 style={{ margin: "4px 0 0 0", color: "#0f172a", fontSize: "32px", fontWeight: "700", letterSpacing: "-0.5px" }}>
          Welcome Back, {officerName}
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "15px" }}>
          Manage incoming prospects, log baseline eligibility scores, and forward vetted records to the counseling division.
        </p>
      </div>

      {/* DATA METRIC STATS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        <div style={{ borderLeft: "4px solid #2563eb", borderRadius: "4px" }}>
          <StatsCard title="Total Prospects Logged" value={studentsCount} />
        </div>
        <div style={{ borderLeft: "4px solid #22c55e", borderRadius: "4px" }}>
          <StatsCard title="Forwarded / Qualified" value={completedCount} />
        </div>
        <div style={{ borderLeft: "4px solid #f59e0b", borderRadius: "4px" }}>
          <StatsCard title="Awaiting Screening" value={pendingCount} />
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
              <strong style={{ display: "block", color: "#0f172a" }}>Process Enquiry Queues</strong>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "normal" }}>Review baseline questionnaires, assign tracking codes, and update files.</span>
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
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "normal" }}>Manage your workplace registration keys and metadata credentials.</span>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
}

export default EnquiryDashboard;