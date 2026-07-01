import { useEffect, useState } from "react";

function DashboardHeader({ title = "Operational Console" }) {
  const [syncTime, setSyncTime] = useState("");
  const officerName = localStorage.getItem("name") || "Console Operator";

  useEffect(() => {
    // Generate an immutable snapshot timestamp of terminal initialization
    const localeString = new Date().toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
    setSyncTime(localeString);
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "#ffffff",
        padding: "30px 35px",
        borderRadius: "16px",
        marginBottom: "35px",
        boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
        boxSizing: "border-box"
      }}
    >
      {/* LEFT ASPECT / CONTEXT METADATA TEXT */}
      <div style={{ flex: "1", minWidth: "260px" }}>
        <h1 
          style={{ 
            margin: 0, 
            fontSize: "28px", 
            fontWeight: "800", 
            letterSpacing: "-0.5px",
            color: "#ffffff"
          }}
        >
          {title}
        </h1>
        <p 
          style={{ 
            margin: "6px 0 0 0", 
            color: "#94a3b8", 
            fontSize: "15px",
            fontWeight: "500" 
          }}
        >
          Welcome back, <strong style={{ color: "#38bdf8", fontWeight: "700" }}>{officerName}</strong>
        </p>
      </div>

      {/* RIGHT ASPECT / SECURITY TERMINAL METADATA BADGE */}
      <div 
        style={{ 
          background: "rgba(255, 255, 255, 0.06)", 
          padding: "10px 16px", 
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <div 
          style={{ 
            width: "8px", 
            height: "8px", 
            borderRadius: "50%", 
            background: "#22c55e",
            boxShadow: "0 0 8px #22c55e"
          }} 
        />
        <span 
          style={{ 
            fontSize: "13px", 
            fontWeight: "600", 
            color: "#cbd5e1",
            fontFamily: "monospace",
            letterSpacing: "0.5px"
          }}
        >
          TERMINAL SYNCED • {syncTime || "--:--"}
        </span>
      </div>

    </div>
  );
}

export default DashboardHeader;