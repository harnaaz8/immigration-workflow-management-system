function Timeline({ status = "" }) {
  const stages = [
    { token: "ENQUIRY",     label: "Intake Enquiry",  icon: "📋" },
    { token: "COUNSELLING", label: "Counselling",     icon: "🎓" },
    { token: "ADMISSION",   label: "Admission",       icon: "🏫" },
    { token: "ENROLLMENT",  label: "Enrollment",      icon: "📝" },
    { token: "VISA",        label: "Visa Processing", icon: "✈️"  },
    { token: "COMPLETED",   label: "Completed",       icon: "✅" },
  ];

  const normalised = status?.trim().toUpperCase();
  const currentIndex = stages.findIndex((s) => s.token === normalised);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>

      {/* HEADER */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
          Application Pipeline
        </h2>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>
          Live case progression tracker
        </p>
      </div>

      {/* VERTICAL STEPPER */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {stages.map((stage, index) => {
          const isCompleted = index < activeIndex;
          const isActive    = index === activeIndex;
          const isLast      = index === stages.length - 1;

          let nodeBg     = "#f1f5f9";
          let nodeBorder = "2px solid #e2e8f0";
          let connectorBg = "#e2e8f0";

          if (isCompleted) {
            nodeBg      = "#22c55e";
            nodeBorder  = "2px solid #22c55e";
            connectorBg = "#22c55e";
          } else if (isActive) {
            nodeBg      = "#ffffff";
            nodeBorder  = "3px solid #2563eb";
            connectorBg = "#e2e8f0";
          }

          return (
            <div key={stage.token} style={{ display: "flex", alignItems: "stretch", gap: "16px" }}>

              {/* LEFT: NODE + CONNECTOR */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>

                {/* CIRCLE NODE */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: nodeBg,
                    border: nodeBorder,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: isActive ? "0 0 0 4px rgba(37,99,235,0.12)" : "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                  }}
                >
                  {isCompleted ? (
                    <span style={{ fontSize: "14px", color: "white", fontWeight: "bold" }}>✓</span>
                  ) : isActive ? (
                    <div style={{
                      width: "10px", height: "10px",
                      background: "#2563eb", borderRadius: "50%",
                    }} />
                  ) : (
                    <span style={{ color: "#94a3b8", fontSize: "12px", fontWeight: "600" }}>{index + 1}</span>
                  )}
                </div>

                {/* VERTICAL CONNECTOR LINE */}
                {!isLast && (
                  <div style={{
                    width: "2px",
                    flex: 1,
                    minHeight: "28px",
                    background: connectorBg,
                    transition: "background 0.3s ease",
                    margin: "4px 0",
                  }} />
                )}
              </div>

              {/* RIGHT: LABEL */}
              <div style={{ paddingTop: "6px", paddingBottom: isLast ? "0" : "24px", flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "14px" }}>{stage.icon}</span>
                  <p style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: isActive ? "700" : "600",
                    color: isActive ? "#2563eb" : isCompleted ? "#0f172a" : "#94a3b8",
                    transition: "color 0.3s ease",
                    lineHeight: "1.4",
                  }}>
                    {stage.label}
                  </p>
                  {isActive && (
                    <span style={{
                      fontSize: "10px", fontWeight: "700", color: "#2563eb",
                      background: "#eff6ff", border: "1px solid #bfdbfe",
                      borderRadius: "20px", padding: "2px 8px", whiteSpace: "nowrap",
                    }}>
                      ACTIVE
                    </span>
                  )}
                  {isCompleted && (
                    <span style={{
                      fontSize: "10px", fontWeight: "700", color: "#16a34a",
                      background: "#f0fdf4", border: "1px solid #bbf7d0",
                      borderRadius: "20px", padding: "2px 8px", whiteSpace: "nowrap",
                    }}>
                      DONE
                    </span>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Timeline;