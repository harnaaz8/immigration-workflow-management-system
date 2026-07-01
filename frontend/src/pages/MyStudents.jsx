import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const officerName = localStorage.getItem("name") || "Officer";

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    if (!role || !officerName) {
      setLoading(false);
      return;
    }

    const endpointMap = {
      ENQUIRY_OFFICER: `/students/assigned/enquiry/${officerName}`,
      COUNSELLOR: `/students/assigned/counsellor/${officerName}`,
      ADMISSION_OFFICER: `/students/assigned/admission/${officerName}`,
      ENROLLMENT_OFFICER: `/students/assigned/enrollment/${officerName}`,
      VISA_OFFICER: `/students/assigned/visa/${officerName}`,
    };

    const roleKey = role?.toUpperCase();
    const endpoint = endpointMap[roleKey];

    if (!endpoint) {
      console.warn(`Role "${roleKey}" does not have an assigned students queue.`);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(endpoint);
      if (res.data && Array.isArray(res.data)) {
        setStudents(res.data);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("API Error details:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "700",
      display: "inline-block",
      letterSpacing: "0.5px"
    };

    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return { ...baseStyle, background: "#dcfce7", color: "#15803d" };
      case "VISA":
      case "VISA_OFFICER":
        return { ...baseStyle, background: "#fef3c7", color: "#d97706" };
      case "REJECTED":
        return { ...baseStyle, background: "#fee2e2", color: "#b91c1c" };
      default:
        return { ...baseStyle, background: "#e0f2fe", color: "#0369a1" };
    }
  };

  return (
    /* Main container is freed from local sidebar constraints */
    <div style={{ flex: 1, padding: "40px 30px", boxSizing: "border-box", background: "#f8fafc", minHeight: "100vh" }}>
      
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* HEADER SECTION */}
        <div style={{ marginBottom: "35px" }}>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#2563eb", letterSpacing: "1px", textTransform: "uppercase" }}>
            Operational Pipeline
          </span>
          <h1 style={{ margin: "4px 0 0 0", color: "#0f172a", fontSize: "32px", fontWeight: "700", letterSpacing: "-0.5px" }}>
            My Assigned Students
          </h1>
          <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "15px" }}>
            Viewing work roster for <strong style={{ color: "#334155" }}>{officerName}</strong> under assignment domain scope <strong style={{ color: "#2563eb" }}>{role}</strong>.
          </p>
        </div>

        {/* LOADING STATE INDICATOR */}
        {loading ? (
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "60px", textAlign: "center" }}>
            <div style={{ border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", width: "36px", height: "36px", margin: "0 auto 15px auto" }}></div>
            <p style={{ margin: 0, color: "#64748b", fontSize: "15px" }}>Fetching active tracking ledger records...</p>
          </div>
        ) : students.length === 0 ? (
          /* EMPTY DATA DESK */
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "60px", textAlign: "center" }}>
            <span style={{ fontSize: "40px", display: "block", marginBottom: "15px" }}>📭</span>
            <h3 style={{ margin: "0 0 6px 0", color: "#1e293b" }}>Roster Clear</h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>There are currently no profile records allocated to this workstation.</p>
          </div>
        ) : (
          /* PIPELINE DATA TABLE */
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "16px 24px", color: "#475569", fontWeight: "700" }}>DATABASE ID</th>
                  <th style={{ padding: "16px 24px", color: "#475569", fontWeight: "700" }}>STUDENT CODE</th>
                  <th style={{ padding: "16px 24px", color: "#475569", fontWeight: "700" }}>FULL NAME</th>
                  <th style={{ padding: "16px 24px", color: "#475569", fontWeight: "700" }}>LIFECYCLE STATUS</th>
                  <th style={{ padding: "16px 24px", color: "#475569", fontWeight: "700", textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s ease" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "16px 24px", color: "#94a3b8", fontFamily: "monospace", fontWeight: "600" }}>
                      #{student.id}
                    </td>
                    <td style={{ padding: "16px 24px", color: "#334155", fontWeight: "600" }}>
                      {student.student_code || "N/A"}
                    </td>
                    <td style={{ padding: "16px 24px", color: "#0f172a", fontWeight: "700" }}>
                      {student.first_name} {student.last_name}
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={getStatusBadgeStyle(student.status)}>
                        {student.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <button
                        onClick={() => navigate(`/student-case/${student.id}`)}
                        style={{
                          background: "#2563eb",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          boxShadow: "0 2px 4px rgba(37, 99, 235, 0.1)",
                          transition: "all 0.1s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#1d4ed8"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#2563eb"}
                      >
                        File Inspection
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default MyStudents;