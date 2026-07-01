import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await api.get("/users/my-profile");
      if (res.data) {
        setProfile(res.data);
      } else {
        throw new Error("Empty profile data received");
      }
    } catch (err) {
      console.error("Failed to retrieve profile credentials:", err);
      setErrorMsg("Failed to authenticate session. Please check your network or try logging in again.");
      
      // If unauthorized or network failure, boot them back cleanly after 3 seconds
      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", flex: 1, background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", width: "40px", height: "40px", margin: "0 auto 15px auto" }}></div>
          <h3 style={{ color: "#475569", margin: 0, fontSize: "16px" }}>Authenticating Station Profile...</h3>
        </div>
      </div>
    );
  }

  if (errorMsg || !profile) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", flex: 1, background: "#f8fafc", padding: "20px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "40px" }}>⚠️</span>
          <h3 style={{ color: "#dc2626", margin: "10px 0" }}>Connection Error</h3>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px 0" }}>{errorMsg || "Unable to load data."}</p>
          <button onClick={() => navigate("/login")} style={{ background: "#2563eb", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    /* REMOVED EXTRA SIDEBAR CONTAINER HERE - Drawing directly into global content canvas */
    <div style={{ flex: 1, maxWidth: "800px", margin: "0 auto", padding: "40px 30px", boxSizing: "border-box" }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: "35px" }}>
        <span style={{ fontSize: "14px", fontWeight: "700", color: "#2563eb", letterSpacing: "1px", textTransform: "uppercase" }}>
          Identity Management
        </span>
        <h1 style={{ margin: "4px 0 0 0", color: "#0f172a", fontSize: "32px", fontWeight: "700", letterSpacing: "-0.5px" }}>
          My Profile
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "15px" }}>
          Verify your system authority privileges, authentication scopes, and core account credentials.
        </p>
      </div>

      {/* PROFILE IDENTITY CARD CONTAINER */}
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "35px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
        
        {/* USER AVATAR BADGE MARKER */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px", borderBottom: "1px solid #f1f5f9", paddingBottom: "25px" }}>
          <div style={{ width: "65px", height: "65px", borderRadius: "50%", background: "#e0f2fe", color: "#0369a1", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "28px", fontWeight: "700" }}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h2 style={{ margin: 0, color: "#0f172a", fontSize: "22px", fontWeight: "700" }}>{profile.name}</h2>
            <span style={{ display: "inline-block", marginTop: "6px", background: "#2563eb", color: "white", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              🔑 {profile.role}
            </span>
          </div>
        </div>

        {/* CREDENTIAL GRID ROWS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", alignItems: "center" }}>
            <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "600" }}>Registered Email Address</span>
            <span style={{ color: "#1e293b", fontSize: "15px", fontWeight: "500", wordBreak: "break-all" }}>{profile.email}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", alignItems: "center" }}>
            <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "600" }}>Access Status</span>
            <div>
              <span 
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "6px",
                  background: profile.active ? "#dcfce7" : "#fee2e2", 
                  color: profile.active ? "#15803d" : "#b91c1c", 
                  fontSize: "13px", 
                  fontWeight: "600", 
                  padding: "4px 12px", 
                  borderRadius: "6px" 
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: profile.active ? "#16a34a" : "#dc2626" }}></span>
                {profile.active ? "Authorized Active Access" : "Deactivated / Blocked"}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", alignItems: "center" }}>
            <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "600" }}>System Security Token</span>
            <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "monospace" }}>Encrypted OAuth Session Active</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;