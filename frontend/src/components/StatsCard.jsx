function StatsCard({ 
  title = "Metric Log", 
  value = 0, 
  trend = null,        // Optional: e.g., { text: "+12% this week", isPositive: true }
  icon = null,         // Optional: e.g., "👥" or an SVG node
  style = {} 
}) {
  
  const isDataPending = value === undefined || value === null;

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%", // Fluid scaling to let the parent layout control row sizing
        minHeight: "130px",
        boxSizing: "border-box",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        ...style
      }}
    >
      {/* TOP HEADER ROW: TITLE & OPTIONAL ICON */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <h3 
          style={{ 
            margin: 0, 
            fontSize: "14px", 
            fontWeight: "600", 
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          {title}
        </h3>
        {icon && (
          <span style={{ fontSize: "18px", color: "#94a3b8", userSelect: "none" }}>
            {icon}
          </span>
        )}
      </div>

      {/* CORE STATISTICAL COUNTER AND TREND LAYOUT */}
      <div style={{ marginTop: "16px", display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        {isDataPending ? (
          /* Micro pulse skeleton shimmer during asynchronous state load gaps */
          <div 
            style={{ 
              width: "60px", 
              height: "36px", 
              background: "#e2e8f0", 
              borderRadius: "6px",
              animation: "pulse 1.5s infinite ease-in-out" 
            }} 
          />
        ) : (
          <h1 
            style={{ 
              margin: 0, 
              fontSize: "32px", 
              fontWeight: "700", 
              color: "#0f172a", // Darker slate for premium visibility contrast
              letterSpacing: "-1px",
              lineHeight: 1
            }}
          >
            {value}
          </h1>
        )}

        {/* CONDITIONAL TREND BADGE PERFORMANCE ROW */}
        {trend && !isDataPending && (
          <div 
            style={{ 
              fontSize: "12px", 
              fontWeight: "600",
              padding: "4px 8px",
              borderRadius: "6px",
              background: trend.isPositive ? "#f0fdf4" : "#fef2f2",
              color: trend.isPositive ? "#166534" : "#991b1b",
              border: `1px solid ${trend.isPositive ? "#dcfce7" : "#fee2e2"}`
            }}
          >
            {trend.text}
          </div>
        )}
      </div>

    </div>
  );
}

export default StatsCard;