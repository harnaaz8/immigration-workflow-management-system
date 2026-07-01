import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ITEMS_PER_PAGE = 10;

const ROLE_OPTIONS = [
  "ALL", "RECEPTIONIST", "ENQUIRY_OFFICER", "COUNSELLOR",
  "ADMISSION_OFFICER", "ENROLLMENT_OFFICER", "VISA_OFFICER"
];

function StaffManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("view");
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadStaff(); }, []);

  useEffect(() => { setCurrentPage(1); }, [search, roleFilter]);

  const loadStaff = async () => {
    try {
      setLoadingStaff(true);
      const res = await api.get("/users");
      if (res.data && Array.isArray(res.data)) {
        setStaff(res.data.filter((u) => u.role !== "STUDENT"));
      }
    } catch (err) {
      console.error("Failed to load staff:", err);
    } finally {
      setLoadingStaff(false);
    }
  };

  const createStaff = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      alert("Please fill out all fields and select a system role.");
      return;
    }
    try {
      setCreating(true);
      await api.post("/users/create-staff", { name, email, password, role });
      alert(`Success! Account for "${name}" has been created.`);
      setName(""); setEmail(""); setPassword(""); setRole("");
      loadStaff();
      setActiveTab("view");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create staff member account.");
    } finally {
      setCreating(false);
    }
  };

  const deleteStaff = async (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${member.name}" (${member.email})? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/users/${member.id}`);
      setStaff((prev) => prev.filter((s) => s.id !== member.id));
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete staff member.");
    }
  };

  // Step 1: search
  const searchFiltered = staff.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Step 2: role filter
  const fullyFiltered = roleFilter === "ALL"
    ? searchFiltered
    : searchFiltered.filter((s) => s.role === roleFilter);

  // Step 3: paginate
  const totalPages = Math.ceil(fullyFiltered.length / ITEMS_PER_PAGE);
  const paginated = fullyFiltered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getRoleBadge = (role) => {
    const base = { padding: "5px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", display: "inline-block" };
    const map = {
      SUPER_ADMIN:        { background: "#fef3c7", color: "#92400e" },
      RECEPTIONIST:       { background: "#e0f2fe", color: "#0369a1" },
      ENQUIRY_OFFICER:    { background: "#f3e8ff", color: "#6b21a8" },
      COUNSELLOR:         { background: "#dcfce7", color: "#15803d" },
      ADMISSION_OFFICER:  { background: "#fff7ed", color: "#c2410c" },
      ENROLLMENT_OFFICER: { background: "#f0fdf4", color: "#166534" },
      VISA_OFFICER:       { background: "#fef9c3", color: "#a16207" },
    };
    const colors = map[role] || { background: "#f1f5f9", color: "#475569" };
    return <span style={{ ...base, ...colors }}>{role?.replace(/_/g, " ")}</span>;
  };

  const thStyle = {
    padding: "16px 20px", background: "#f8fafc", color: "#64748b",
    fontWeight: "600", fontSize: "13px", textAlign: "left",
    borderBottom: "2px solid #e2e8f0", textTransform: "uppercase", letterSpacing: "0.5px"
  };
  const tdStyle = {
    padding: "16px 20px", borderBottom: "1px solid #f1f5f9", color: "#334155", fontSize: "15px"
  };
  const inputStyle = {
    width: "100%", padding: "12px 15px", borderRadius: "8px",
    border: "1px solid #cbd5e1", fontSize: "15px", boxSizing: "border-box",
    outline: "none", transition: "border-color 0.2s"
  };

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>

      {/* MAIN CONTENT VIEW CANVAS CONTAINER */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0px 10px", boxSizing: "border-box" }}>

        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ margin: 0, color: "#0f172a", fontSize: "28px", fontWeight: "700" }}>Staff Directory Management</h1>
          <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "15px" }}>View, search, filter and provision secure internal authentication access for staff.</p>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "28px", borderBottom: "2px solid #e2e8f0" }}>
          {["view", "create"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "10px 24px", border: "none", cursor: "pointer",
              fontWeight: "600", fontSize: "14px", borderRadius: "8px 8px 0 0",
              background: activeTab === tab ? "white" : "transparent",
              color: activeTab === tab ? "#2563eb" : "#64748b",
              borderBottom: activeTab === tab ? "2px solid #2563eb" : "2px solid transparent",
              marginBottom: "-2px"
            }}>
              {tab === "view" ? "👥 View Staff" : "➕ Create Staff"}
            </button>
          ))}
        </div>

        {/* VIEW TAB */}
        {activeTab === "view" && (
          <>
            {/* SEARCH + COUNT ROW */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "16px" }}>
              <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                {fullyFiltered.length} staff member{fullyFiltered.length !== 1 ? "s" : ""} found
                {roleFilter !== "ALL" ? ` · filtered by ${roleFilter.replace(/_/g, " ")}` : ""}
              </p>
              <input
                type="text"
                placeholder="🔍 Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: "12px 20px", width: "280px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "15px", boxShadow: "0 2px 5px rgba(0,0,0,0.02)", outline: "none", background: "white" }}
              />
            </div>

            {/* ROLE FILTER PILLS */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
              {ROLE_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  style={{
                    padding: "7px 16px", borderRadius: "20px", fontSize: "13px",
                    fontWeight: "600", cursor: "pointer", border: "none",
                    background: roleFilter === r ? "#2563eb" : "#f1f5f9",
                    color: roleFilter === r ? "white" : "#475569",
                    transition: "all 0.15s ease"
                  }}
                >
                  {r === "ALL" ? "All Roles" : r.replace(/_/g, " ").charAt(0) + r.replace(/_/g, " ").slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* TABLE */}
            <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              {loadingStaff ? (
                <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
                  <div style={{ border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", width: "36px", height: "36px", margin: "0 auto 15px auto" }}></div>
                  Loading staff directory...
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>Full Name</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Role</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length > 0 ? paginated.map((member) => (
                      <tr key={member.id}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        style={{ transition: "background 0.2s" }}
                      >
                        <td style={{ ...tdStyle, color: "#94a3b8", fontFamily: "monospace", fontWeight: "600" }}>#{member.id}</td>
                        <td style={{ ...tdStyle, fontWeight: "700", color: "#0f172a" }}>{member.name}</td>
                        <td style={{ ...tdStyle, color: "#475569" }}>{member.email}</td>
                        <td style={tdStyle}>{getRoleBadge(member.role)}</td>
                        <td style={tdStyle}>
                          <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: member.is_active ? "#dcfce7" : "#fee2e2", color: member.is_active ? "#15803d" : "#b91c1c" }}>
                            {member.is_active ? "● Active" : "● Inactive"}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => navigate(`/staff-profile/${member.id}`)}
                              style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "14px", cursor: "pointer", boxShadow: "0 2px 6px rgba(37,99,235,0.15)" }}
                            >
                              View Profile
                            </button>
                            {member.role !== "SUPER_ADMIN" && (
                              <button
                                onClick={() => deleteStaff(member)}
                                style={{ background: "#dc2626", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "14px", cursor: "pointer", boxShadow: "0 2px 6px rgba(220,38,38,0.15)" }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No staff members found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "24px" }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", background: currentPage === 1 ? "#f8fafc" : "white", color: currentPage === 1 ? "#94a3b8" : "#334155", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "14px" }}
                >
                  &larr; Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: "8px 14px", borderRadius: "8px", fontWeight: "600",
                      fontSize: "14px", cursor: "pointer",
                      background: currentPage === page ? "#2563eb" : "white",
                      color: currentPage === page ? "white" : "#334155",
                      border: currentPage === page ? "none" : "1px solid #e2e8f0",
                      boxShadow: currentPage === page ? "0 2px 8px rgba(37,99,235,0.2)" : "none"
                    }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", background: currentPage === totalPages ? "#f8fafc" : "white", color: currentPage === totalPages ? "#94a3b8" : "#334155", cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "14px" }}
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}

        {/* CREATE TAB */}
        {activeTab === "create" && (
          <div style={{ maxWidth: "600px" }}>
            <div style={{ background: "white", padding: "35px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: "0 0 24px 0", color: "#1e293b", fontSize: "18px" }}>Create System User Account</h3>
              <form onSubmit={createStaff} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: "#475569", fontSize: "14px", fontWeight: "600" }}>Full Name</label>
                  <input type="text" placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: "#475569", fontSize: "14px", fontWeight: "600" }}>Email Address</label>
                  <input type="email" placeholder="name@agency.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: "#475569", fontSize: "14px", fontWeight: "600" }}>Initial Password</label>
                  <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: "#475569", fontSize: "14px", fontWeight: "600" }}>Assigned Workflow Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} style={{ ...inputStyle, cursor: "pointer", background: "none" }}>
                    <option value="">Choose organizational status...</option>
                    <option value="RECEPTIONIST">Receptionist Desk</option>
                    <option value="ENQUIRY_OFFICER">Enquiry / Eligibility Verification</option>
                    <option value="COUNSELLOR">Academic Course Counsellor</option>
                    <option value="ADMISSION_OFFICER">University Admissions Processing</option>
                    <option value="ENROLLMENT_OFFICER">Enrollment & COE Management</option>
                    <option value="VISA_OFFICER">Immigration Visa Officer</option>
                  </select>
                </div>
                <button type="submit" disabled={creating} style={{ background: creating ? "#94a3b8" : "#2563eb", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: creating ? "not-allowed" : "pointer", boxShadow: creating ? "none" : "0 4px 12px rgba(37,99,235,0.2)", marginTop: "10px", transition: "background 0.2s" }}>
                  {creating ? "Registering Staff Member..." : "🛡️ Provision Account Access"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default StaffManagement;