import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill in all security fields.");
      return;
    }

    try {
      setErrorMessage("");
      setIsSubmitting(true);

      const res = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      const userRole = res.data.role;

      const routeMap = {
        SUPER_ADMIN: "/super-admin",
        RECEPTIONIST: "/reception",
        ENQUIRY_OFFICER: "/enquiry",
        COUNSELLOR: "/counsellor",
        ADMISSION_OFFICER: "/admission",
        ENROLLMENT_OFFICER: "/enrollment",
        VISA_OFFICER: "/visa",
        STUDENT: "/student",
      };

      const targetRoute = routeMap[userRole];

      if (targetRoute) {
        navigate(targetRoute);
      } else {
        setErrorMessage("Unauthorized or unmapped access group lifecycle role.");
      }

    } catch (err) {
      if (err.response) {
        console.log("Server responded with:", err.response.data);
        console.log("Status code:", err.response.status);

        if (err.response.status === 429) {
          setErrorMessage("Too many login attempts. Please wait before trying again.");
          setLockoutTimer(60);

          const interval = setInterval(() => {
            setLockoutTimer(prev => {
              if (prev <= 1) {
                clearInterval(interval);
                setErrorMessage("");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

        } else {
          setErrorMessage("Invalid credentials or server infrastructure timeout.");
        }
      } else if (err.request) {
        console.log("No response received:", err.request);
        setErrorMessage("Invalid credentials or server infrastructure timeout.");
      } else {
        console.log("Error setting up request:", err.message);
        setErrorMessage("Invalid credentials or server infrastructure timeout.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    marginTop: "6px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "#f8fafc",
    outline: "none",
    transition: "border-color 0.2s ease"
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    display: "block",
    marginTop: "16px"
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f1f5f9",
        fontFamily: "inherit"
      }}
    >
      <div
        style={{
          width: "420px",
          background: "white",
          padding: "45px 40px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e2e8f0"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <span style={{ fontSize: "28px" }}>🌐</span>
          <h1 style={{ margin: "10px 0 4px 0", color: "#0f172a", fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px" }}>
            E-Munch Immigration
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Staff Access & Core Intake Ledger Terminal
          </p>
        </div>

        {errorMessage && (
          <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", color: "#991b1b", padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>⚠️</span> {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div>
            <label style={{ ...labelStyle, marginTop: 0 }}>WORK EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="name@emunchimmigration.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || lockoutTimer > 0}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
            />
          </div>

          <div>
            <label style={labelStyle}>ACCOUNT PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting || lockoutTimer > 0}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || lockoutTimer > 0}
            style={{
              width: "100%",
              marginTop: "28px",
              padding: "14px",
              background: isSubmitting || lockoutTimer > 0 ? "#93c5fd" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: isSubmitting || lockoutTimer > 0 ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
              transition: "all 0.2s ease"
            }}
          >
            {lockoutTimer > 0
              ? `Try again in ${lockoutTimer}s`
              : isSubmitting
              ? "Verifying Credentials..."
              : "Authenticate Session"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;