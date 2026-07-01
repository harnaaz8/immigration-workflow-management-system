import { useState } from "react";
import api from "../services/api";

function CompleteStageButton({ studentId, status, onStageAdvanced }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCompleteStage = async () => {
    if (!studentId || !status) {
      setErrorMessage("Missing critical student identification or stage mapping keys.");
      return;
    }

    // Role lifecycle state to transactional endpoint lookup dictionary
    const endpointMap = {
      ENQUIRY: `/students/complete-enquiry/${studentId}`,
      COUNSELLING: `/students/complete-counselling/${studentId}`,
      ADMISSION: `/students/complete-admission/${studentId}`,
      ENROLLMENT: `/students/complete-enrollment/${studentId}`,
      VISA: `/students/complete-visa/${studentId}`,
    };

    const endpoint = endpointMap[status?.toUpperCase()];

    if (!endpoint) {
      setErrorMessage(`Unmapped pipeline lifecycle transition phase detected: "${status}"`);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      // Dispatch tracking state update to database cluster
      await api.patch(endpoint);

      // Preferred behavior: invoke a parent update handler if provided, else fallback to historical pop
      if (onStageAdvanced) {
        onStageAdvanced();
      } else {
        window.history.back();
      }

    } catch (err) {
      console.error("Pipeline lifecycle transition transaction failure:", err);
      const backendMessage = err.response?.data?.message || "Server rejected execution hook parameter rules.";
      setErrorMessage(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: "8px" }}>
      
      {/* LOCAL WORKFLOW EXCEPTION FALLBACK MESSAGE BAR */}
      {errorMessage && (
        <div style={{
          background: "#fef2f2",
          border: "1px solid #fee2e2",
          color: "#991b1b",
          padding: "10px 14px",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: "600",
          maxWidth: "280px"
        }}>
          ⚠️ {errorMessage}
        </div>
      )}

      {/* COMMAND CONTROL BUTTON ELEMENT */}
      <button
        onClick={handleCompleteStage}
        disabled={isSubmitting}
        style={{
          background: isSubmitting ? "#cbd5e1" : "#22c55e",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "700",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          boxShadow: isSubmitting ? "none" : "0 4px 12px rgba(34, 197, 94, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "all 0.15s ease-in-out"
        }}
        onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = "#16a34a"; }}
        onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.background = "#22c55e"; }}
      >
        {isSubmitting ? (
          <>
            <div style={{
              border: "2px solid rgba(255,255,255,0.3)",
              borderTop: "2px solid white",
              borderRadius: "50%",
              width: "14px",
              height: "14px",
              animation: "spin 0.8s linear infinite"
            }} />
            Advancing Pipeline...
          </>
        ) : (
          <>
            <span>✅</span> Complete Current Stage
          </>
        )}
      </button>

    </div>
  );
}

export default CompleteStageButton;