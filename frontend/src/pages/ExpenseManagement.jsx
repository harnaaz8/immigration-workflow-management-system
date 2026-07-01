import React, { useState, useEffect } from 'react';
import { superadminAPI } from '../services/api';

const CATEGORY_OPTIONS = ['Electricity', 'Rent', 'Salaries', 'Marketing', 'Software/IT', 'Misc'];

const CATEGORY_COLORS = {
  Electricity: { background: '#fef9c3', color: '#a16207', bar: '#eab308' },
  Rent: { background: '#fff7ed', color: '#c2410c', bar: '#fb923c' },
  Salaries: { background: '#f3e8ff', color: '#6b21a8', bar: '#a855f7' },
  Marketing: { background: '#fce7f3', color: '#be185d', bar: '#ec4899' },
  'Software/IT': { background: '#e0f2fe', color: '#0369a1', bar: '#0ea5e9' },
  Misc: { background: '#f1f5f9', color: '#475569', bar: '#94a3b8' },
};

const thStyle = {
  padding: '16px 20px', background: '#f8fafc', color: '#64748b',
  fontWeight: '600', fontSize: '13px', textAlign: 'left',
  borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.5px'
};

const tdStyle = {
  padding: '16px 20px', borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '15px'
};

const labelStyle = {
  display: 'block', marginBottom: '6px', color: '#475569', fontSize: '14px', fontWeight: '600'
};

const inputStyle = {
  width: '100%', padding: '12px 15px', borderRadius: '8px',
  border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box',
  outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
};

function CategoryBadge({ category }) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Misc;
  return (
    <span style={{
      padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: colors.background, color: colors.color
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.color }} />
      {category}
    </span>
  );
}

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [form, setForm] = useState({ category: 'Electricity', amount: '', description: '', expense_date: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const initData = async () => {
    try {
      setLoading(true);
      const listRes = await superadminAPI.getExpenses();
      const chartRes = await superadminAPI.getExpenseAnalytics();
      setExpenses(listRes.data || []);
      setChartData(chartRes.data || []);
    } catch (err) {
      console.error('Error fetching expense dataset details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { initData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('category', form.category);
      data.append('amount', form.amount);
      data.append('description', form.description);
      data.append('expense_date', form.expense_date);
      if (file) data.append('file', file);

      await superadminAPI.createExpense(data);
      setForm({ category: 'Electricity', amount: '', description: '', expense_date: '' });
      setFile(null);
      initData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save expense.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalSpend = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const maxChartValue = Math.max(...chartData.map((d) => d.total), 1);

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0px 10px', boxSizing: 'border-box' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '28px', fontWeight: '700' }}>Expense Management</h1>
          <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '15px' }}>
            View, track and manage organization expenses and operational spending.
          </p>
        </div>

        {/* SUMMARY STRIP */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Recorded</p>
            <p style={{ margin: '8px 0 0 0', color: '#0f172a', fontSize: '26px', fontWeight: '700' }}>
              ${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div style={{ flex: '1 1 200px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Entries Logged</p>
            <p style={{ margin: '8px 0 0 0', color: '#0f172a', fontSize: '26px', fontWeight: '700' }}>{expenses.length}</p>
          </div>
          <div style={{ flex: '1 1 200px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Months Tracked</p>
            <p style={{ margin: '8px 0 0 0', color: '#0f172a', fontSize: '26px', fontWeight: '700' }}>{chartData.length}</p>
          </div>
        </div>

        {/* ANALYTICS CARD */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '17px', fontWeight: '700' }}>Monthly Expenses Breakdown</h3>
              <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>Aggregated transaction totals by month.</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', padding: '6px 14px', background: '#eff6ff', color: '#2563eb', borderRadius: '20px', border: '1px solid #dbeafe' }}>
              Auto-aggregated
            </span>
          </div>

          {chartData.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
              No analytics yet — record an expense to see the breakdown.
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '200px', paddingTop: '24px', borderBottom: '1px solid #f1f5f9', overflowX: 'auto' }}>
              {chartData.map((d, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 60px', minWidth: '56px', maxWidth: '80px' }}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '140px' }}>
                    <div
                      title={`$${d.total.toLocaleString()}`}
                      style={{
                        width: '100%',
                        height: `${Math.max(10, (d.total / maxChartValue) * 140)}px`,
                        background: 'linear-gradient(to top, #2563eb, #60a5fa)',
                        borderRadius: '8px 8px 2px 2px',
                        boxShadow: '0 2px 8px rgba(37,99,235,0.18)'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginTop: '10px' }}>{d.month}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginTop: '2px' }}>
                    ${d.total >= 1000 ? `${(d.total / 1000).toFixed(1)}k` : d.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 2fr' : '1fr', gap: '24px', alignItems: 'start' }}>

          {/* FORM CARD */}
          <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '28px' }}>
            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '17px', fontWeight: '700' }}>Record New Expense</h3>
            <p style={{ margin: '4px 0 20px 0', color: '#94a3b8', fontSize: '13px' }}>Log a new operational outflow.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer', background: 'white' }}
                >
                  {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Date</label>
                <input
                  type="date"
                  value={form.expense_date}
                  onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  placeholder="Reference notes, merchant name, or reason..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ ...inputStyle, height: '80px', resize: 'none' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Receipt</label>
                <div style={{ border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '12px', background: '#f8fafc' }}>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ fontSize: '13px', color: '#64748b', width: '100%' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%', marginTop: '24px',
                background: submitting ? '#94a3b8' : '#2563eb', color: 'white', border: 'none',
                padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: '700',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: submitting ? 'none' : '0 4px 12px rgba(37,99,235,0.2)',
                transition: 'background 0.2s'
              }}
            >
              {submitting ? 'Saving...' : 'Save Expense'}
            </button>
          </form>

          {/* TABLE CARD */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>Expense Log</span>
              <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', color: '#64748b' }}>
                {expenses.length} record{expenses.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              {loading ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                  Loading expense ledger...
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Amount</th>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ padding: '50px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                          No expenses recorded yet.
                        </td>
                      </tr>
                    ) : (
                      expenses.map((exp) => (
                        <tr
                          key={exp.id}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          style={{ transition: 'background 0.2s' }}
                        >
                          <td style={tdStyle}><CategoryBadge category={exp.category} /></td>
                          <td style={{ ...tdStyle, color: '#dc2626', fontWeight: '700' }}>
                            ${parseFloat(exp.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td style={{ ...tdStyle, color: '#64748b', fontSize: '13px' }}>
                            {exp.expense_date ? new Date(exp.expense_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                          </td>
                          <td style={{ ...tdStyle, color: '#64748b', fontSize: '13px', maxWidth: '220px' }}>
                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={exp.description}>
                              {exp.description || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>No description</span>}
                            </span>
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
    </div>
  );
}