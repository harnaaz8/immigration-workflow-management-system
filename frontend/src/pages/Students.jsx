import { useState, useEffect } from 'react';
import api from '../services/api';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Fetches the data array using your FastAPI endpoints base path mapping
      const response = await api.get('/students'); 
      setStudents(response.data || []);
    } catch (error) {
      console.error("Error fetching student records directory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this student file?")) {
      try {
        await api.delete(`/students/${id}`);
        setStudents(students.filter(student => student.id !== id));
      } catch (error) {
        console.error("Failed to delete target student record:", error);
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesFilter = filter === 'All' || student.status === filter;
    const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                          (student.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", flex: 1 }}>
        <h3 style={{ color: "#475569" }}>Loading Student Files...</h3>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      
      {/* HEADER ACTION ELEMENTS BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Student Directory</h1>
          <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#64748b" }}>{filteredStudents.length} profiles registered</p>
        </div>
        
        <input 
          type="text" 
          placeholder="🔍 Search name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "12px 16px",
            width: "300px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            fontSize: "14px",
            outline: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}
        />
      </div>

      {/* SEGMENTATION FILTER TABS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
        {['All', 'ENQUIRY', 'COUNSELLING', 'ADMISSION', 'ENROLLMENT', 'VISA'].map((stage) => (
          <button
            key={stage}
            onClick={() => setFilter(stage)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: filter === stage ? "#2563eb" : "#e2e8f0",
              color: filter === stage ? "white" : "#475569",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {stage === 'All' ? 'All Records' : stage}
          </button>
        ))}
      </div>

      {/* CORE DATA LEDGER TABLE */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>
              <th style={{ padding: "16px" }}>STUDENT NAME</th>
              <th style={{ padding: "16px" }}>EMAIL ADDRESS</th>
              <th style={{ padding: "16px" }}>PHONE</th>
              <th style={{ padding: "16px" }}>CURRENT STATUS</th>
              <th style={{ padding: "16px", textAlign: "right" }}>FILE ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                  No student records matched the selection filter matrix.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} style={{ borderBottom: "1px solid #f1f5f9", color: "#334155" }}>
                  <td style={{ padding: "16px", fontWeight: "700", color: "#0f172a" }}>
                    {student.first_name} {student.last_name}
                  </td>
                  <td style={{ padding: "16px", color: "#475569" }}>{student.email}</td>
                  <td style={{ padding: "16px", color: "#475569" }}>{student.phone || "N/A"}</td>
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: "#e0f2fe",
                      color: "#0369a1"
                    }}>
                      {student.status || 'ENQUIRY'}
                    </span>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button 
                        onClick={() => window.location.href = `/student-case/${student.id}`}
                        style={{ background: "#2563eb", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
                      >
                        Open File
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Students;