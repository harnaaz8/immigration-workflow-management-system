function PrimaryButton({
  text,
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  style = {}
}) {
  
  // Base architecture layout style definitions
  const baseButtonStyle = {
    background: disabled || isLoading ? "#cbd5e1" : "#2563eb",
    color: disabled || isLoading ? "#94a3b8" : "#ffffff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: disabled || isLoading ? "none" : "0 4px 10px rgba(37, 99, 235, 0.15)",
    transition: "all 0.15s ease-in-out",
    outline: "none",
    ...style // Allows parent component overrides if necessary
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={baseButtonStyle}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.background = "#1d4ed8";
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(29, 78, 216, 0.25)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.background = "#2563eb";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(37, 99, 235, 0.15)";
        }
      }}
    >
      {/* ASYNC STATE HANDSHAKE INDICATOR */}
      {isLoading && (
        <div
          style={{
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderTop: "2px solid currentColor",
            borderRadius: "50%",
            width: "14px",
            height: "14px",
            animation: "spin 0.8s linear infinite"
          }}
        />
      )}
      
      <span>{text}</span>
    </button>
  );
}

export default PrimaryButton;