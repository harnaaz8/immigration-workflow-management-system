import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import api from "../services/api";

const PIE_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#059669", "#d97706", "#dc2626"];

function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    staff: 0,
    enquiries: 0,
    counselling: 0,
    admissions: 0,
    enrollments: 0,
    visas: 0,
    status_breakdown: [],
    monthly_data: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard");
      if (res.data) {
        setStats({
          students:    res.data.students    || 0,
          staff:       res.data.staff       || 0,
          enquiries:   res.data.enquiries   || 0,
          counselling: res.data.counselling || 0,
          admissions:  res.data.admissions  || 0,
          enrollments: res.data.enrollments || 0,
          visas:       res.data.visas       || 0,
          status_breakdown: res.data.status_breakdown || [],
          monthly_data:     res.data.monthly_data     || []
        });
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flex: 1 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 15px auto" }}></div>
          <h3 style={{ color: "#475569", margin: 0 }}>Compiling Master Infrastructure Ledger...</h3>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Students",   value: stats.students,    color: "#3b82f6" },
    { label: "Active Staff",     value: stats.staff,       color: "#a855f7" },
    { label: "Total Enquiries",  value: stats.enquiries,   color: "#06b6d4" },
    { label: "Counselling",      value: stats.counselling, color: "#8b5cf6" },
    { label: "Admissions",       value: stats.admissions,  color: "#10b981" },
    { label: "Enrollments",      value: stats.enrollments, color: "#14b8a6" },
    { label: "Visa Cases",       value: stats.visas,       color: "#f97316" },
  ];

  return (
    <div style={{ width: "100%", padding: "40px 30px", boxSizing: "border-box", background: "#f8fafc", minHeight: "100vh" }}>

      {/* WELCOME HERO BANNER */}
      <div style={{
        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        color: "white", padding: "40px", borderRadius: "20px",
        marginBottom: "35px", boxShadow: "0 10px 25px rgba(37,99,235,0.1)"
      }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "700", letterSpacing: "-0.5px" }}>
          Welcome Back, System Admin
        </h1>
        <p style={{ margin: "8px 0 0 0", fontSize: "16px", opacity: 0.9 }}>
          Real-time analytics across all student enrollment lifecycles.
        </p>
      </div>

      {/* STATS CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginBottom: "35px" }}>
        {statCards.map((card) => (
          <div key={card.label} style={{
            borderTop: `4px solid ${card.color}`, borderRadius: "12px",
            background: "white", padding: "24px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.01)", border: "1px solid #e2e8f0"
          }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {card.label}
            </span>
            <h2 style={{ fontSize: "36px", margin: "10px 0 0 0", color: "#0f172a", fontWeight: "800" }}>
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "30px" }}>

        {/* BAR CHART */}
        <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: "16px", fontWeight: "700" }}>Students by Status</h3>
          {stats.status_breakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.status_breakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: "#94a3b8", fontSize: "14px", textAlign: "center", paddingTop: "80px" }}>
              No status data available yet.
            </div>
          )}
        </div>

        {/* LINE CHART */}
        <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: "16px", fontWeight: "700" }}>Student Registrations (Last 6 Months)</h3>
          {stats.monthly_data.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.monthly_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#7c3aed" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: "#94a3b8", fontSize: "14px", textAlign: "center", paddingTop: "80px" }}>
              No monthly data available yet.
            </div>
          )}
        </div>

      </div>

      {/* PIE CHART */}
      <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: "16px", fontWeight: "700" }}>Status Distribution</h3>
        {stats.status_breakdown.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.status_breakdown}
                dataKey="count"
                nameKey="status"
                cx="50%" cy="50%"
                outerRadius={100}
                label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.status_breakdown.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ color: "#94a3b8", fontSize: "14px", textAlign: "center", paddingTop: "40px", paddingBottom: "40px" }}>
            No distribution data available yet.
          </div>
        )}
      </div>

    </div>
  );
}

export default SuperAdminDashboard;