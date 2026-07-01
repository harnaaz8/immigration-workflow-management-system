import React, { useState, useEffect } from 'react';
import { superadminAPI } from '../services/api';

const labelStyle = { display: 'block', marginBottom: '6px', color: '#475569', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', marginBottom: '16px' };

export default function TaskManagement() {
  const [form, setForm] = useState({ title: '', description: '', assigned_to: '', priority: 'MEDIUM' });
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [taskRes, userRes] = await Promise.all([
        superadminAPI.getTasks(),
        superadminAPI.getAllUsers()
      ]);
      setTasks(taskRes.data || []);
      setUsers(userRes.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await superadminAPI.createTask(form);
      setForm({ title: '', description: '', assigned_to: '', priority: 'MEDIUM' });
      setUserSearch('');
      fetchInitialData();
    } catch (err) { alert("Failed to create task."); }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Process Management</h1>

      <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Task Title</label>
            <input style={inputStyle} value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div>
            <label style={labelStyle}>Assign To (Email)</label>
            <input style={inputStyle} value={form.assigned_to} onChange={e => setForm({...form, assigned_to: e.target.value})} required />
          </div>
        </div>
        <label style={labelStyle}>Description</label>
        <textarea style={{...inputStyle, height: '80px'}} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <button type="submit" style={{ background: '#2563eb', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Create Task</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '12px', width: '15%' }}>Title</th>
            <th style={{ padding: '12px', width: '40%' }}>Description</th>
            <th style={{ padding: '12px', width: '20%' }}>Assigned To</th>
            <th style={{ padding: '12px', width: '12%' }}>Status</th>
            <th style={{ padding: '12px', width: '13%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0', verticalAlign: 'top' }}>
              <td style={{ padding: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</td>
              <td style={{ padding: '12px', color: '#64748b', wordWrap: 'break-word' }}>
                {expandedRows[t.id] ? t.description : `${t.description?.substring(0, 50)}${t.description?.length > 50 ? '...' : ''}`}
                <button onClick={() => toggleRow(t.id)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '11px', display: 'block', marginTop: '4px', fontWeight: 'bold' }}>
                  {expandedRows[t.id] ? 'Show Less' : 'Show More'}
                </button>
              </td>
              <td style={{ padding: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#2563eb', fontWeight: '600' }}>{t.assigned_to}</td>
              <td style={{ padding: '10px' }}>
                <select 
                  value={t.status} 
                  onChange={async (e) => {
                    await superadminAPI.updateTaskStatus(t.id, e.target.value);
                    fetchInitialData();
                  }}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN-PROGRESS">IN-PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </td>
              <td style={{ padding: '12px' }}>
                <button onClick={async () => { if(window.confirm("Delete?")) { await superadminAPI.deleteTask(t.id); fetchInitialData(); } }} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}