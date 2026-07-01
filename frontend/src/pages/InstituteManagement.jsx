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

function CountryBadge({ country }) {
  return (
    <span style={{
      padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700',
      background: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe'
    }}>
      {country}
    </span>
  );
}

export default function InstituteManagement() {
  const [institutes, setInstitutes] = useState([]);
  const [form, setForm] = useState({ name: '', country: '', city: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      const res = await superadminAPI.getInstitutes();
      setInstitutes(res.data || []);
    } catch (err) {
      console.error('Error fetching institutes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInstitutes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await superadminAPI.createInstitute(form);
      setForm({ name: '', country: '', city: '' });
      fetchInstitutes();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add institute.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this institute permanently? This cannot be undone.')) {
      try {
        await superadminAPI.deleteInstitute?.(id);
        fetchInstitutes();
      } catch (err) {
        console.error('Failed to delete institute:', err);
      }
    }
  };

  const countryCount = new Set(institutes.map((i) => i.country)).size;

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0px 10px', boxSizing: 'border-box' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '28px', fontWeight: '700' }}>Education Institutes</h1>
          <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '15px' }}>
            Manage partnered universities and academic institutions.
          </p>
        </div>

        {/* SUMMARY STRIP */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Institutes</p>
            <p style={{ margin: '8px 0 0 0', color: '#0f172a', fontSize: '26px', fontWeight: '700' }}>{institutes.length}</p>
          </div>
          <div style={{ flex: '1 1 200px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Countries Covered</p>
            <p style={{ margin: '8px 0 0 0', color: '#0f172a', fontSize: '26px', fontWeight: '700' }}>{countryCount}</p>
          </div>
        </div>

        {/* CREATE FORM CARD */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '28px', marginBottom: '28px' }}>
          <h3 style={{ margin: 0, color: '#1e293b', fontSize: '17px', fontWeight: '700' }}>Add New Institute</h3>
          <p style={{ margin: '4px 0 20px 0', color: '#94a3b8', fontSize: '13px' }}>
            Register a new partnered university or academic institution.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <label style={labelStyle}>Institute Name</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. University of Toronto"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Country</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Canada"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Toronto"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
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
                {submitting ? 'Adding...' : 'Add Institute'}
              </button>
            </div>
          </form>
        </div>

        {/* TABLE CARD */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>Institute Directory</span>
            <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', color: '#64748b' }}>
              {institutes.length} registered
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                Loading institute directory...
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Institute Name</th>
                    <th style={thStyle}>Country</th>
                    <th style={thStyle}>City</th>
                    <th style={thStyle}>Added On</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {institutes.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '50px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                        No institutes added yet.
                      </td>
                    </tr>
                  ) : (
                    institutes.map((inst) => (
                      <tr
                        key={inst.id}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        style={{ transition: 'background 0.2s' }}
                      >
                        <td style={{ ...tdStyle, fontWeight: '700', color: '#0f172a' }}>{inst.name}</td>
                        <td style={tdStyle}><CountryBadge country={inst.country} /></td>
                        <td style={{ ...tdStyle, color: '#475569', fontWeight: '600', fontSize: '13px' }}>{inst.city}</td>
                        <td style={{ ...tdStyle, color: '#94a3b8', fontSize: '13px', fontFamily: 'monospace' }}>
                          {inst.created_at ? new Date(inst.created_at).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <button
                            onClick={() => handleDelete(inst.id)}
                            style={{
                              fontSize: '13px', fontWeight: '700', border: 'none',
                              padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                              background: '#dc2626', color: 'white',
                              boxShadow: '0 2px 6px rgba(220,38,38,0.15)'
                            }}
                          >
                            Delete
                          </button>
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