function Topbar() {
  const currentRole = localStorage.getItem("role") || "Guest Operator";
  const staffName = localStorage.getItem("name") || "Terminal User";

  // Real-time organizational department style mapping matrix
  const getDepartmentBadgeStyle = (role) => {
    const rawRole = role?.toUpperCase();
    
    let background = "#f1f5f9";
    let color = "#475569";
    let label = rawRole?.replace("_", " ");

    if (rawRole === "SUPERVISOR" || rawRole === "ADMIN") {
      background = "#f0fdf4";
      color = "#166534";
    } else if (rawRole?.includes("OFFICER") || rawRole === "COUNSELLOR") {
      background = "#eff6ff";
      color = "#1e40af";
    }

    return {
      background,
      color,
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      display: "inline-block"
    };
  };

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "16px 32px",
        marginBottom: "24px",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        width: "100%",
        minHeight: "70px"
      }}
    >
      {/* LEFT ASPECT: DYNAMIC PIPELINE DEPARTMENT INDICATOR CHIP */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
          Current Workstation Profile:
        </span>
        <div style={getDepartmentBadgeStyle(currentRole)}>
          💻 {currentRole.replace("_", " ")}
        </div>
      </div>

      {/* RIGHT ASPECT: IDENTITY META ACCOUNT CHANNELS */}
      <div 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "14px",
          borderLeft: "1px solid #e2e8f0",
          paddingLeft: "20px"
        }}
      >
        <div style={{ textAlign: "right" }}>
          <span 
            style={{ 
              display: "block", 
              fontSize: "14px", 
              fontWeight: "700", 
              color: "#0f172a",
              lineHeight: "1.2"
            }}
          >
            {staffName}
          </span>
          <span 
            style={{ 
              display: "block", 
              fontSize: "11px", 
              fontWeight: "500", 
              color: "#94a3b8",
              marginTop: "2px"
            }}
          >
            Session Authenticated
          </span>
        </div>

        {/* PROFILE AVATAR COMPONENT GENERATOR */}
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: "700",
            boxShadow: "0 2px 4px rgba(37, 99, 235, 0.1)",
            userSelect: "none"
          }}
        >
          {staffName.charAt(0).toUpperCase()}
        </div>
      </div>

    </div>
  );
}

export default Topbar;