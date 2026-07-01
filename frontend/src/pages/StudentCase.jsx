import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import CompleteStageButton from "../components/CompleteStageButton";
import OfficerAssignmentModal from "../components/OfficerAssignmentModal";
import DocumentUpload from "../components/DocumentUpload";
import Timeline from "../components/Timeline";

function StudentCase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const role = localStorage.getItem("role");

  // Dynamic workflow evaluation states
  const [counsellingFee, setCounsellingFee] = useState("PENDING");
  const [admissionFee, setAdmissionFee] = useState("PENDING");
  const [counsellingNotes, setCounsellingNotes] = useState("");
  const [admissionNotes, setAdmissionNotes] = useState("");

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      const res = await api.get(`/students/${id}/details`);
      setStudent(res.data);

      const profile = res.data?.student || {};
      setCounsellingFee(profile.counselling_fee_status || "PENDING");
      setAdmissionFee(profile.admission_fee_status || "PENDING");
      setCounsellingNotes(profile.counselling_notes || "");
      setAdmissionNotes(profile.admission_notes || "");
    } catch (err) {
      console.error("Error retrieving case data profile:", err);
    }
  };

  const saveCounselling = async () => {
    try {
      await api.patch(`/students/update-counselling/${student.student.id}`, {
        fee_status: counsellingFee,
        notes: counsellingNotes,
      });
      alert("Counselling operational state updated.");
    } catch (err) {
      console.error(err);
    }
  };

  const saveAdmission = async () => {
    try {
      await api.patch(`/students/update-admission/${student.student.id}`, {
        fee_status: admissionFee,
        notes: admissionNotes,
      });
      alert("University admission tracking state updated.");
    } catch (err) {
      console.error(err);
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

  if (!student) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 15px auto" }}></div>
          <h3 style={{ color: "#475569", margin: 0 }}>Parsing Pipeline Case Profile...</h3>
        </div>
      </div>
    );
  }

  // Common Reusable Component Styles
  const cardStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
    marginBottom: "25px",
    border: "1px solid #e2e8f0",
  };

  const internalBlockStyle = {
    background: "#f8fafc",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "20px",
  };

  const textareaStyle = {
    width: "100%",
    minHeight: "120px",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    boxSizing: "border-box",
    fontFamily: "inherit",
    outline: "none",
    resize: "vertical",
  };

  const btnStyle = {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(37, 99, 235, 0.15)",
  };

  const selectStyle = {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    background: "white",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>

      {/* SIDEBAR */}
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
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ margin: "0 0 30px 10px", fontSize: "20px", color: "#38bdf8", fontWeight: "800" }}>
          💼 STAFF CONSOLE
        </h2>
        <button
          onClick={() => navigate("/my-students")}
          style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer", fontWeight: "bold" }}
        >
          👨‍🎓 My Students
        </button>
        <button
          onClick={() => navigate("/profile")}
          style={{ background: "transparent", color: "#cbd5e1", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer" }}
        >
          👤 Profile Desk
        </button>
        <button
          onClick={handleLogout}
          style={{ background: "transparent", color: "#f87171", border: "none", padding: "12px 15px", borderRadius: "8px", textAlign: "left", cursor: "pointer", marginTop: "auto" }}
        >
          🚪 Logout Session
        </button>
      </div>
      {/* END: SIDEBAR */}

      {/* TWO-COLUMN CONTENT CONTAINER */}
      <div style={{ flex: 1, maxWidth: "1400px", padding: "40px", display: "flex", gap: "30px", boxSizing: "border-box" }}>

        {/* LEFT COLUMN: ROLE-BASED TASK PANELS */}
        <div style={{ flex: 2, minWidth: "0" }}>

          {/* PROFILE CARD */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #f1f5f9", paddingBottom: "15px", marginBottom: "20px" }}>
              <h1 style={{ margin: 0, color: "#0f172a", fontSize: "24px", fontWeight: "700" }}>
                Case Profile: {student.student.first_name} {student.student.last_name}
              </h1>
              <span style={{ padding: "6px 14px", background: "#e0f2fe", color: "#0369a1", borderRadius: "20px", fontSize: "13px", fontWeight: "700" }}>
                🚀 Current Stage: {student.student.status}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
              <div>
                <span style={{ color: "#64748b", fontSize: "13px", display: "block" }}>EMAIL ADDRESS</span>
                <strong style={{ color: "#334155" }}>{student.student.email}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontSize: "13px", display: "block" }}>CONTACT PHONE</span>
                <strong style={{ color: "#334155" }}>{student.student.phone}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontSize: "13px", display: "block" }}>NATIONALITY</span>
                <strong style={{ color: "#334155" }}>{student.student.nationality}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontSize: "13px", display: "block" }}>PASSPORT IDENTIFICATION</span>
                <strong style={{ color: "#334155", fontFamily: "monospace" }}>{student.student.passport_number}</strong>
              </div>
            </div>
          </div>
          {/* END: PROFILE CARD */}

          {/* ROLE: RECEPTIONIST */}
          {(role === "RECEPTIONIST" || role === "RECEPTION") && student.student.status === "RECEPTION" && (
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#1e3a8a", fontSize: "18px" }}>Reception Processing Desk</h2>
              <div style={internalBlockStyle}>
                <h4 style={{ margin: "0 0 6px 0", color: "#334155" }}>Assign Enquiry Officer</h4>
                <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "13px" }}>Delegate this entry file to an eligibility officer for document vetting.</p>
                <OfficerAssignmentModal studentId={student.student.id} role="ENQUIRY_OFFICER" onAssigned={loadStudent} />
              </div>
              <div style={{ ...internalBlockStyle, marginBottom: 0 }}>
                <h4 style={{ margin: "0 0 6px 0", color: "#334155" }}>Complete Reception Stage</h4>
                <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "13px" }}>Verify incoming ledger metrics to sign off on this terminal lifecycle link.</p>
                <CompleteStageButton studentId={student.student.id} status={student.student.status} onComplete={loadStudent} />
              </div>
            </div>
          )}

          {/* ROLE: ENQUIRY OFFICER */}
          {role === "ENQUIRY_OFFICER" && student.student.status === "ENQUIRY" && (
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#1e3a8a", fontSize: "18px" }}>Enquiry Verification Desk</h2>
              <div style={internalBlockStyle}>
                <h4 style={{ margin: "0 0 4px 0", color: "#334155" }}>Initial Eligibility Documents</h4>
                <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "13px" }}>Upload passport scan sheets, language proficiencies (IELTS/PTE), and academic statements.</p>
                <DocumentUpload studentId={student.student.id} />
              </div>
              <div style={internalBlockStyle}>
                <h4 style={{ margin: "0 0 6px 0", color: "#334155" }}>Assign Designated Counsellor</h4>
                <OfficerAssignmentModal studentId={student.student.id} role="COUNSELLOR" onAssigned={loadStudent} />
              </div>
              <CompleteStageButton studentId={student.student.id} status={student.student.status} onComplete={loadStudent} />
            </div>
          )}

          {/* ROLE: COUNSELLOR */}
          {role === "COUNSELLOR" && student.student.status === "COUNSELLING" && (
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: "25px", color: "#1e3a8a", fontSize: "18px" }}>Course Selection & Initial Fee Desk</h2>
              <div style={internalBlockStyle}>
                <h4 style={{ margin: "0 0 10px 0", color: "#334155" }}>Initial Fee Tracking</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", marginBottom: "15px" }}>
                  <p style={{ margin: 0, fontSize: "15px" }}><strong>Standard Base Charge:</strong> ₹10,000</p>
                  <select value={counsellingFee} onChange={(e) => setCounsellingFee(e.target.value)} style={selectStyle}>
                    <option value="PENDING">❌ Payment Pending</option>
                    <option value="PAID">💵 Payment Received</option>
                  </select>
                </div>
                <h5 style={{ margin: "0 0 8px 0", color: "#475569" }}>Upload Fee Receipt Attachment</h5>
                <DocumentUpload studentId={student.student.id} />
              </div>
              <div style={internalBlockStyle}>
                <h4 style={{ margin: "0 0 10px 0", color: "#334155" }}>Counselling Case Summary Notes</h4>
                <textarea
                  rows="5"
                  style={textareaStyle}
                  placeholder="Log academic track evaluations, path preferences, or custom feedback variables..."
                  value={counsellingNotes}
                  onChange={(e) => setCounsellingNotes(e.target.value)}
                />
                <div style={{ marginTop: "12px" }}>
                  <button onClick={saveCounselling} style={btnStyle}>Save Case Profile</button>
                </div>
              </div>
              <div style={internalBlockStyle}>
                <h4 style={{ margin: "0 0 10px 0", color: "#334155" }}>Assign Admission Officer</h4>
                <OfficerAssignmentModal studentId={student.student.id} role="ADMISSION_OFFICER" onAssigned={loadStudent} />
              </div>
              <CompleteStageButton studentId={student.student.id} status={student.student.status} onComplete={loadStudent} />
            </div>
          )}

          {/* ROLE: ADMISSION OFFICER */}
          {role === "ADMISSION_OFFICER" && student.student.status === "ADMISSION" && (
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: "25px", color: "#1e3a8a", fontSize: "18px" }}>University Admission & Tuition Processing</h2>
              <div style={internalBlockStyle}>
                <h4 style={{ margin: "0 0 10px 0", color: "#334155" }}>Admission Fee Statement</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", marginBottom: "15px" }}>
                  <p style={{ margin: 0, fontSize: "15px" }}><strong>Required Deposit:</strong> ₹50,000</p>
                  <select value={admissionFee} onChange={(e) => setAdmissionFee(e.target.value)} style={selectStyle}>
                    <option value="PENDING">❌ Payment Pending</option>
                    <option value="PAID">💵 Payment Received</option>
                  </select>
                </div>
                <h5 style={{ margin: "0 0 8px 0", color: "#475569" }}>Upload Certified Deposit Slip</h5>
                <DocumentUpload studentId={student.student.id} />
              </div>
              <div style={internalBlockStyle}>
                <h4 style={{ margin: "0 0 10px 0", color: "#334155" }}>Administrative Processing Remarks</h4>
                <textarea
                  rows="5"
                  style={textareaStyle}
                  placeholder="Type structural verification numbers, conditional requirements, or institutional delays..."
                  value={admissionNotes}
                  onChange={(e) => setAdmissionNotes(e.target.value)}
                />
                <div style={{ marginTop: "12px" }}>
                  <button onClick={saveAdmission} style={btnStyle}>Save Admission Logs</button>
                </div>
              </div>
              <div style={internalBlockStyle}>
                <h4 style={{ margin: "0 0 10px 0", color: "#334155" }}>Assign Enrollment Officer</h4>
                <OfficerAssignmentModal studentId={student.student.id} role="ENROLLMENT_OFFICER" onAssigned={loadStudent} />
              </div>
              <CompleteStageButton studentId={student.student.id} status={student.student.status} onComplete={loadStudent} />
            </div>
          )}

          {/* ROLE: ENROLLMENT OFFICER */}
          {role === "ENROLLMENT_OFFICER" && student.student.status === "ENROLLMENT" && (
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#1e3a8a", fontSize: "18px" }}>Enrollment Confirmation & COE Ledger</h2>
              <div style={internalBlockStyle}>
                <h4 style={{ margin: "0 0 4px 0", color: "#334155" }}>COE Document Delivery</h4>
                <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "13px" }}>Provide institutional issuance declarations and final course enrollment receipt numbers.</p>
                <DocumentUpload studentId={student.student.id} />
              </div>
              <div style={internalBlockStyle}>
                <h4 style={{ margin: "0 0 10px 0", color: "#334155" }}>Assign Dedicated Visa Officer</h4>
                <OfficerAssignmentModal studentId={student.student.id} role="VISA_OFFICER" onAssigned={loadStudent} />
              </div>
              <CompleteStageButton studentId={student.student.id} status={student.student.status} onComplete={loadStudent} />
            </div>
          )}

          {/* ROLE: VISA OFFICER */}
          {role === "VISA_OFFICER" && student.student.status === "VISA" && (
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#1e3a8a", fontSize: "18px" }}>Visa Filing Control Desk</h2>
              <div style={internalBlockStyle}>
                <h4 style={{ margin: "0 0 4px 0", color: "#334155" }}>Visa Status & GTE Verification Vault</h4>
                <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "13px" }}>Attach final medical receipts, embassy notification copies, and validated immigration outcomes.</p>
                <DocumentUpload studentId={student.student.id} />
              </div>
              <CompleteStageButton studentId={student.student.id} status={student.student.status} onComplete={loadStudent} />
            </div>
          )}

          {/* FALLBACK: Role doesn't match current stage — read-only notice */}
          {!(
            ((role === "RECEPTIONIST" || role === "RECEPTION") && student.student.status === "RECEPTION") ||
            (role === "ENQUIRY_OFFICER"  && student.student.status === "ENQUIRY")    ||
            (role === "COUNSELLOR"       && student.student.status === "COUNSELLING") ||
            (role === "ADMISSION_OFFICER" && student.student.status === "ADMISSION") ||
            (role === "ENROLLMENT_OFFICER" && student.student.status === "ENROLLMENT") ||
            (role === "VISA_OFFICER"     && student.student.status === "VISA")
          ) && (
            <div style={{ ...cardStyle, background: "#f8fafc", border: "1px dashed #cbd5e1", textAlign: "center", padding: "40px 30px" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔒</div>
              <h3 style={{ margin: "0 0 8px 0", color: "#475569", fontSize: "16px", fontWeight: "700" }}>
                This case is not at your stage
              </h3>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>
                Current stage is <strong style={{ color: "#334155" }}>{student.student.status}</strong>. You can view this case but have no actions to perform right now.
              </p>
            </div>
          )}

        </div>
        {/* END: LEFT COLUMN */}

        {/* RIGHT COLUMN: TIMELINE */}
        <div style={{ flex: 1, minWidth: "320px", position: "sticky", top: "40px", height: "fit-content" }}>
          <div style={{ ...cardStyle, background: "#ffffff" }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#0f172a", fontSize: "18px", fontWeight: "700", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px" }}>
              ⏱️ Case File History
            </h3>
            <Timeline status={student.student.status} />
          </div>
        </div>
        {/* END: RIGHT COLUMN */}

      </div>
      {/* END: TWO-COLUMN CONTENT CONTAINER */}

    </div>
    // END: OUTER WRAPPER
  );
}

export default StudentCase;