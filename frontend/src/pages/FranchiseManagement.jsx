import React, { useState, useEffect } from 'react';
import { superadminAPI } from '../services/api';

const thStyle = {
  padding: '16px 20px', background: '#f8fafc', color: '#64748b',
  fontWeight: '600', fontSize: '13px', textAlign: 'left',
  borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.5px'
};

const tdStyle = {
  padding: '16px 20px', borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '15px'
};

const labelStyle = {
  display: 'block', marginBottom: '6px', color: '#475569', fontSize: '12px', fontWeight: '700',
  textTransform: 'uppercase', letterSpacing: '0.5px'
};

const inputStyle = {
  width: '100%', padding: '12px 15px', borderRadius: '8px',
  border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box',
  outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
};

function StatusBadge({ active }) {
  return (
    <span style={{
      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: active ? '#dcfce7' : '#f1f5f9',
      color: active ? '#15803d' : '#94a3b8',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: active ? '#22c55e' : '#cbd5e1' }} />
      {active ? 'Active' : 'Suspended'}
    </span>
  );
}

export default function FranchiseManagement() {
  const [franchises, setFranchises] = useState([]);
  const [form, setForm] = useState({ franchise_code: '', name: '', owner_name: '', owner_email: '', owner_phone: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchFranchises = async () => {
    try {
      setLoading(true);
      const res = await superadminAPI.getFranchises();
      setFranchises(res.data || []);
    } catch (err) {
      console.error('Error retrieving franchise array records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFranchises(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await superadminAPI.createFranchise(form);
      setForm({ franchise_code: '', name: '', owner_name: '', owner_email: '', owner_phone: '' });
      fetchFranchises();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create franchise.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await superadminAPI.toggleFranchise(id);
      fetchFranchises();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update franchise status.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this franchise permanently? This cannot be undone.')) {
      try {
        await superadminAPI.deleteFranchise?.(id);
        fetchFranchises();
      } catch (err) {
        console.error('Failed to delete franchise:', err);
      }
    }
  };

  const activeCount = franchises.filter((f) => f.is_active).length;

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0px 10px', boxSizing: 'border-box' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '28px', fontWeight: '700' }}>Franchise Management</h1>
          <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '15px' }}>
            Register new franchise branches and manage ownership and access.
          </p>
        </div>

        {/* SUMMARY STRIP */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Franchises</p>
            <p style={{ margin: '8px 0 0 0', color: '#0f172a', fontSize: '26px', fontWeight: '700' }}>{franchises.length}</p>
          </div>
          <div style={{ flex: '1 1 200px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active</p>
            <p style={{ margin: '8px 0 0 0', color: '#15803d', fontSize: '26px', fontWeight: '700' }}>{activeCount}</p>
          </div>
          <div style={{ flex: '1 1 200px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suspended</p>
            <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '26px', fontWeight: '700' }}>{franchises.length - activeCount}</p>
          </div>
        </div>

        {/* CREATE FORM CARD */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '28px', marginBottom: '28px' }}>
          <h3 style={{ margin: 0, color: '#1e293b', fontSize: '17px', fontWeight: '700' }}>Add New Franchise</h3>
          <p style={{ margin: '4px 0 20px 0', color: '#94a3b8', fontSize: '13px' }}>
            Register a new branch and assign its owner.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <label style={labelStyle}>Franchise Code</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. FR-DEL-01"
                  value={form.franchise_code}
                  onChange={(e) => setForm({ ...form, franchise_code: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Branch Name</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Delhi Hub Center"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Owner Name</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Robert Chen"
                  value={form.owner_name}
                  onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Owner Email</label>
                <input
                  type="email"
                  style={inputStyle}
                  placeholder="owner@franchise.com"
                  value={form.owner_email}
                  onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input
                  style={inputStyle}
                  placeholder="+1 (555) 000-0000"
                  value={form.owner_phone}
                  onChange={(e) => setForm({ ...form, owner_phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '22px' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting ? '#94a3b8' : '#2563eb', color: 'white', border: 'none',
                  padding: '12px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: '700',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: submitting ? 'none' : '0 4px 12px rgba(37,99,235,0.2)',
                  transition: 'background 0.2s'
                }}
              >
                {submitting ? 'Adding...' : 'Add Franchise'}
              </button>
            </div>
          </form>
        </div>

        {/* TABLE CARD */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>Franchise Directory</span>
            <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', color: '#64748b' }}>
              {franchises.length} registered
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                Loading franchise directory...
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Code</th>
                    <th style={thStyle}>Branch Name</th>
                    <th style={thStyle}>Owner</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Phone</th>
                    <th style={thStyle}>Status</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {franchises.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '50px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                        No franchises registered yet.
                      </td>
                    </tr>
                  ) : (
                    franchises.map((f) => (
                      <tr
                        key={f.id}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        style={{ transition: 'background 0.2s' }}
                      >
                        <td style={{ ...tdStyle, color: '#2563eb', fontWeight: '700', fontSize: '13px', fontFamily: 'monospace' }}>
                          {f.franchise_code}
                        </td>
                        <td style={{ ...tdStyle, fontWeight: '700', color: '#0f172a' }}>{f.name}</td>
                        <td style={{ ...tdStyle, color: '#475569', fontWeight: '600' }}>{f.owner_name}</td>
                        <td style={{ ...tdStyle, color: '#64748b', fontSize: '13px' }}>{f.owner_email}</td>
                        <td style={{ ...tdStyle, color: '#64748b', fontSize: '13px' }}>{f.owner_phone}</td>
                        <td style={tdStyle}><StatusBadge active={f.is_active} /></td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleToggle(f.id)}
                              style={{
                                fontSize: '13px', fontWeight: '700', border: f.is_active ? '1px solid #e2e8f0' : 'none',
                                padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                                background: f.is_active ? 'white' : '#16a34a',
                                color: f.is_active ? '#475569' : 'white',
                                boxShadow: f.is_active ? 'none' : '0 2px 6px rgba(22,163,74,0.2)'
                              }}
                            >
                              {f.is_active ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDelete(f.id)}
                              style={{
                                fontSize: '13px', fontWeight: '700', border: 'none',
                                padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                                background: '#dc2626', color: 'white',
                                boxShadow: '0 2px 6px rgba(220,38,38,0.15)'
                              }}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}