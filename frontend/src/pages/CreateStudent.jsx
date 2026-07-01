import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateStudent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
    nationality: "",
    passport_number: "",
    preferred_country: "",
    preferred_intake: ""
  });

  // Track photo input file handle independently 
  const [photoFile, setPhotoFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Process File choice capture from local operating system directory array
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    
    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      setStatusMessage({ type: "error", text: "Core registration parameters (Name, Email, Password) are mandatory." });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusMessage({ type: "", text: "" });

      // TRANSLATE OBJ INTO MULTIPART FORM-DATA:
      const formData = new FormData();
      
      // Append core standard profile field parameters 
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // Append raw binary file tracking if receptionist made selection
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      // Execute request with proper multi-part boundary declaration headers
      await api.post("/students", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setStatusMessage({ type: "success", text: "Profile generated with profile picture attachment committed cleanly to ledger records." });
      
      // Reset layout tracking inputs state
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        dob: "",
        gender: "",
        nationality: "",
        passport_number: "",
        preferred_country: "",
        preferred_intake: ""
      });
      setPhotoFile(null);
      // Clean target document input node element visually on the page interface
      document.getElementById("photoInput").value = "";

    } catch (err) {
      console.error("Student profile creation payload rejection:", err);
      const serverErrorMessage = err.response?.data?.detail || "Failed to commit record. Please verify API server endpoints and permissions CORS alignment.";
      setStatusMessage({ type: "error", text: serverErrorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable Shared Layout Styles
  const containerStyle = { minHeight: "100vh", background: "#f8fafc", padding: "40px 20px", display: "flex", justifyContent: "center" };
  const cardStyle = { width: "100%", maxWidth: "800px", background: "white", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", border: "1px solid #e2e8f0" };
  const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px 24px" };
  const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px", textTransform: "uppercase" };
  const inputStyle = { width: "100%", padding: "12px 14px", fontSize: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", color: "#0f172a" };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>Create Student Ledger</h1>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#64748b" }}>Register a new immigration path tracking instance</p>
          </div>
          <button type="button" onClick={() => navigate(-1)} style={{ padding: "8px 14px", background: "white", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
            ← Cancel & Return
          </button>
        </div>

        {statusMessage.text && (
          <div style={{ padding: "14px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "500", marginBottom: "24px", border: `1px solid ${statusMessage.type === "error" ? "#fee2e2" : "#dcfce7"}`, background: statusMessage.type === "error" ? "#fef2f2" : "#f0fdf4", color: statusMessage.type === "error" ? "#991b1b" : "#166534" }}>
            {statusMessage.type === "error" ? "⚠️" : "✅"} {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleCreateStudent}>
          <div style={gridStyle}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input required name="first_name" placeholder="John" value={form.first_name} onChange={handleChange} disabled={isSubmitting} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Last Name *</label>
                <input required name="last_name" placeholder="Doe" value={form.last_name} onChange={handleChange} disabled={isSubmitting} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input required type="email" name="email" placeholder="johndoe@example.com" value={form.email} onChange={handleChange} disabled={isSubmitting} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Secure Intake Password *</label>
                <input required type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} disabled={isSubmitting} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Contact Mobile Phone</label>
                <input type="tel" name="phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} disabled={isSubmitting} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Date of Birth</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} disabled={isSubmitting} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={labelStyle}>Gender Designation</label>
                <select name="gender" value={form.gender} onChange={handleChange} disabled={isSubmitting} style={inputStyle}>
                  <option value="">Select Gender Alignment</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Nationality Group</label>
                <input name="nationality" placeholder="e.g. Canadian" value={form.nationality} onChange={handleChange} disabled={isSubmitting} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Passport Document Number</label>
                <input name="passport_number" placeholder="A1234567" value={form.passport_number} onChange={handleChange} disabled={isSubmitting} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Target Preferred Country</label>
                <input name="preferred_country" placeholder="e.g. Australia" value={form.preferred_country} onChange={handleChange} disabled={isSubmitting} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Target Term Intake Window</label>
                <input name="preferred_intake" placeholder="e.g. September 2026" value={form.preferred_intake} onChange={handleChange} disabled={isSubmitting} style={inputStyle} />
              </div>

              {/* Student Avatar Image Form Control Attachment */}
              <div>
                <label style={labelStyle}>Student Profile Photograph</label>
                <input 
                  id="photoInput"
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  disabled={isSubmitting} 
                  style={{...inputStyle, padding: "8px"}} 
                />
              </div>
            </div>

          </div>

          <div style={{ marginTop: "35px", borderTop: "1px solid #f1f5f9", paddingTop: "25px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={isSubmitting} style={{ padding: "14px 28px", background: isSubmitting ? "#93c5fd" : "#2563eb", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: isSubmitting ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)" }}>
              {isSubmitting ? "Committing Record..." : "Confirm & Save Profile"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default CreateStudent;