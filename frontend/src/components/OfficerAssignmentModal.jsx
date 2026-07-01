import { useEffect, useState } from "react";
import api from "../services/api";

function OfficerAssignmentModal({ studentId, role, onAssigned }) {
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Natively triggers operational staff loading since it lives inline now
  useEffect(() => {
    loadOfficers();
    setSelectedOfficer("");
    setStatusMessage({ type: "", text: "" });
  }, [studentId, role]);

  const loadOfficers = async () => {
    try {
      const res = await api.get("/users");
      if (res.data && Array.isArray(res.data)) {
        const filtered = res.data.filter((u) => u.role === role);
        setOfficers(filtered);
      }
    } catch (err) {
      console.error("Failed to aggregate institutional staff credentials:", err);
      setStatusMessage({ type: "error", text: "Could not fetch available officers from backend registry." });
    }
  };

  const handleAssignOfficer = async () => {
    if (!selectedOfficer) {
      setStatusMessage({ type: "error", text: "Please select an operational officer from the ledger dropdown." });
      return;
    }

    if (!studentId || !role) {
      setStatusMessage({ type: "error", text: "Missing structural lifecycle parameter context (ID or Role)." });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusMessage({ type: "", text: "" });

      const endpointMap = {
        ENQUIRY_OFFICER: `/students/assign-enquiry/${studentId}`,
        COUNSELLOR: `/students/assign-counsellor/${studentId}`,
        ADMISSION_OFFICER: `/students/assign-admission/${studentId}`,
        ENROLLMENT_OFFICER: `/students/assign-enrollment/${studentId}`,
        VISA_OFFICER: `/students/assign-visa/${studentId}`,
      };

      const endpoint = endpointMap[role?.toUpperCase()];

      if (!endpoint) {
        setStatusMessage({ type: "error", text: `Unmapped pipeline operational role target: "${role}"` });
        return;
      }

      await api.patch(endpoint, { officer_name: selectedOfficer });

      setStatusMessage({ type: "success", text: "Immigration case tracking row successfully reassigned." });
      
      setTimeout(() => {
        if (onAssigned) onAssigned();
      }, 1000);

    } catch (err) {
      console.error("Pipeline allocation transaction protocol failed:", err);
      const serverFeedback = err.response?.data?.message || "Internal database rejection. Asset allocation parameters invalid.";
      setStatusMessage({ type: "error", text: serverFeedback });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: "100%", marginTop: "15px" }}>
      
      {/* STATUS ACTION TRACKER BANNER */}
      {statusMessage.text && (
        <div style={{
          padding: "12px 14px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: "500",
          marginBottom: "15px",
          border: `1px solid ${statusMessage.type === "error" ? "#fee2e2" : "#dcfce7"}`,
          background: statusMessage.type === "error" ? "#fef2f2" : "#f0fdf4",
          color: statusMessage.type === "error" ? "#991b1b" : "#166534",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span>{statusMessage.type === "error" ? "⚠️" : "✅"}</span>
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* INPUT FLEX GRID ELEMENT SELECTION LAYOUT */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <select
            value={selectedOfficer}
            onChange={(e) => setSelectedOfficer(e.target.value)}
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "11px 14px",
              fontSize: "14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              background: "white",
              color: "#0f172a",
              outline: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxSizing: "border-box"
            }}
          >
            <option value="">Choose individual staff ledger...</option>
            {officers.map((officer) => (
              <option key={officer.id || officer.name} value={officer.name}>
                👤 {officer.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleAssignOfficer}
          disabled={isSubmitting || !selectedOfficer}
          style={{
            padding: "11px 22px",
            background: isSubmitting || !selectedOfficer ? "#93c5fd" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: isSubmitting || !selectedOfficer ? "not-allowed" : "pointer",
            boxShadow: isSubmitting || !selectedOfficer ? "none" : "0 4px 10px rgba(37, 99, 235, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "background 0.15s ease",
            height: "40px",
            boxSizing: "border-box"
          }}
          onMouseEnter={(e) => { if (!isSubmitting && selectedOfficer) e.currentTarget.style.background = "#1d4ed8"; }}
          onMouseLeave={(e) => { if (!isSubmitting && selectedOfficer) e.currentTarget.style.background = "#2563eb"; }}
        >
          {isSubmitting ? "Assigning..." : "Assign Officer"}
        </button>
      </div>
    </div>
  );
}

export default OfficerAssignmentModal;