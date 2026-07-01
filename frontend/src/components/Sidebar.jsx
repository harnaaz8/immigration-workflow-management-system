import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../services/api";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const rawRole = localStorage.getItem("role") || "STAFF";
  const userRole = rawRole.toUpperCase().replace(/_/g, "");
  
  const isSuperAdmin = userRole === "SUPERADMIN";

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/superadmin/notifications");
      if (res.data && Array.isArray(res.data)) {
        setNotifications(res.data);
        const unread = res.data.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Could not fetch system broadcasts:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const getButtonStyle = (path) => ({
    background: isActive(path) ? "#2563eb" : "transparent",
    color: isActive(path) ? "#ffffff" : "#94a3b8",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.2s ease"
  });

  if (userRole === "STUDENT") return null;

  return (
    <div style={{
      width: "260px",
      background: "#0f172a",
      color: "white",
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100vh",
      position: "sticky",
      top: 0,
      boxSizing: "border-box",
      flexShrink: 0,
      borderRight: "1px solid #1e293b",
      zIndex: 100,
      overflowY: "auto"
    }}>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>

        {/* BRAND HEADER */}
        <div style={{ padding: "12px 16px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", color: "#ffffff", fontWeight: "700", letterSpacing: "-0.5px" }}>
            ⚙️ {isSuperAdmin ? "SUPER ADMIN" : "STAFF PORTAL"}
          </h2>
          <span style={{ fontSize: "11px", color: "#3b82f6", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Control Console
          </span>
        </div>

        {/* NOTIFICATIONS DROPDOWN */}
        <div ref={dropdownRef} style={{ position: "relative", marginBottom: "12px", padding: "0 8px" }}>
          <button
            onClick={() => { setIsOpen(!isOpen); setUnreadCount(0); }}
            style={{
              width: "100%",
              background: isOpen ? "#1e293b" : "rgba(30, 41, 59, 0.4)",
              border: "1px solid #334155",
              borderRadius: "8px",
              padding: "10px 14px",
              color: "#f8fafc",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              fontSize: "13px",
              fontWeight: "600",
              transition: "all 0.2s"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
              <span>🔔</span>
              <span>System Broadcasts</span>
            </div>
            {unreadCount > 0 && (
              <span style={{
                background: "#ef4444", color: "white", fontSize: "10px",
                fontWeight: "700", padding: "2px 7px", borderRadius: "10px", marginLeft: "auto"
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* DROPDOWN PANEL */}
          {isOpen && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: "8px",
              right: "8px",
              background: "#1e293b",
              borderRadius: "8px",
              border: "1px solid #334155",
              marginTop: "4px",
              maxHeight: "250px",
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)"
            }}>
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} style={{
                    padding: "12px",
                    borderBottom: "1px solid #334155"
                  }}>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#60a5fa", marginBottom: "4px" }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "#cbd5e1", lineHeight: "1.4" }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: "10px", color: "#475569", marginTop: "4px" }}>
                      {n.created_at ? new Date(n.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "20px", fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>
                  No new broadcasts
                </div>
              )}
            </div>
          )}
        </div>

        {/* CORE NAV */}
        <button onClick={() => navigate(isSuperAdmin ? "/super-admin" : "/dashboard")} style={getButtonStyle(isSuperAdmin ? "/super-admin" : "/dashboard")}>
          📊 System Overview
        </button>
        <button onClick={() => navigate("/students")} style={getButtonStyle("/students")}>
          🧑‍🎓 View Students
        </button>
        <button onClick={() => navigate("/profile")} style={getButtonStyle("/profile")}>
          👤 My Profile
        </button>

        {/* SUPERADMIN ONLY */}
        {isSuperAdmin && (
          <>
            <div style={{ margin: "24px 0 8px 16px", fontSize: "11px", color: "#475569", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
              Management Controls
            </div>
            <button onClick={() => navigate("/staff")} style={getButtonStyle("/staff")}>
              👥 Manage Staff
            </button>
            <button onClick={() => navigate("/franchises")} style={getButtonStyle("/franchises")}>
              🏢 Franchise Units
            </button>
            <button onClick={() => navigate("/institutes")} style={getButtonStyle("/institutes")}>
              🏫 Education Institutes
            </button>
            <button onClick={() => navigate("/alerts")} style={getButtonStyle("/alerts")}>
              🔔 Broadcast Alerts
            </button>
            <button onClick={() => navigate("/expenses")} style={getButtonStyle("/expenses")}>
              💳 Expense Ledger
            </button>
          </>
        )}
      </div>

      {/* LOGOUT */}
      <div style={{ marginTop: "24px", borderTop: "1px solid #1e293b", padding: "16px 0" }}>
        <button
          onClick={handleLogout}
          style={{
            background: "transparent", color: "#ef4444", border: "none",
            padding: "12px 16px", cursor: "pointer", fontWeight: "600",
            fontSize: "14px", width: "100%", display: "flex", alignItems: "center", gap: "12px"
          }}
        >
          🚪 System Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;