import React, { useState, useEffect } from 'react';
import { superadminAPI } from '../services/api';

const labelStyle = {
  display: 'block', marginBottom: '6px', color: '#475569', fontSize: '12px', fontWeight: '700',
  textTransform: 'uppercase', letterSpacing: '0.5px'
};

const inputStyle = {
  width: '100%', padding: '12px 15px', borderRadius: '8px',
  border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box',
  outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
};

export default function NotificationDispatcher() {
  const [form, setForm] = useState({ title: '', message: '', target_type: 'ALL', target_value: '' });
  const [statusMsg, setStatusMsg] = useState('');
  const [pastNotifications, setPastNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const systemRoles = ['COUNSELLOR', 'ENROLLMENT', 'VISA', 'ENQUIRY', 'SUPERADMIN'];

  const [availableEmails, setAvailableEmails] = useState([]);
  const [emailSearchTerm, setEmailSearchTerm] = useState('');
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);

  const initNotificationsData = async () => {
    try {
      setLoading(true);
      const resUsers = await superadminAPI.getAllUsers?.() || { data: [] };
      if (resUsers.data && Array.isArray(resUsers.data)) {
        setAvailableEmails(resUsers.data.map((user) => user.email));
      } else {
        setAvailableEmails(['test@sarc.in', 'admin@sarc.in', 'officer.visa@sarc.in', 'counsel@sarc.in']);
      }

      const resHistory = await superadminAPI.getNotifications?.() || { data: [] };
      setPastNotifications(resHistory.data || []);
    } catch (err) {
      console.error('Could not fetch notification data:', err);
      setAvailableEmails(['test@sarc.in', 'admin@sarc.in', 'officer.visa@sarc.in', 'counsel@sarc.in']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { initNotificationsData(); }, []);

  const handleTargetTypeChange = (newType) => {
    setForm({ ...form, target_type: newType, target_value: '' });
    setEmailSearchTerm('');
    setShowEmailDropdown(false);
  };

  const handleEmailSelect = (email) => {
    setEmailSearchTerm(email);
    setForm({ ...form, target_value: email });
    setShowEmailDropdown(false);
  };

  const filteredEmails = availableEmails.filter((email) =>
    email.toLowerCase().includes(emailSearchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await superadminAPI.createNotification(form);
      setStatusMsg('Notification sent successfully.');
      setForm({ title: '', message: '', target_type: 'ALL', target_value: '' });
      setEmailSearchTerm('');
      initNotificationsData();
      setTimeout(() => setStatusMsg(''), 6000);
    } catch (err) {
      console.error('Failed to send notification:', err);
      alert(err.response?.data?.detail || 'Failed to send notification.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this notification permanently? It will disappear from active dashboards.')) {
      try {
        await superadminAPI.deleteNotification?.(id);
        initNotificationsData();
      } catch (err) {
        console.error('Failed to delete notification:', err);
      }
    }
  };

  const targetLabel = (type) => {
    if (type === 'ALL') return 'All Users';
    if (type === 'ROLE') return 'Role';
    if (type === 'EMAIL') return 'Email';
    return type;
  };

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0px 10px', boxSizing: 'border-box' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '28px', fontWeight: '700' }}>Broadcast Notifications</h1>
          <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '15px' }}>
            Send alerts and updates to your team's dashboards.
          </p>
        </div>

        {/* FORM CARD */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '17px', fontWeight: '700' }}>Send New Alert</h3>
              <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
                Alerts appear instantly on the target's dashboard.
              </p>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', padding: '5px 12px', background: '#fef2f2', color: '#dc2626', borderRadius: '20px', border: '1px solid #fee2e2', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Live Broadcast
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Scheduled maintenance tonight"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Message</label>
                <textarea
                  style={{ ...inputStyle, height: '120px', resize: 'none' }}
                  placeholder="Describe what's happening and what action, if any, is needed..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Send To</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer', background: 'white' }}
                    value={form.target_type}
                    onChange={(e) => handleTargetTypeChange(e.target.value)}
                  >
                    <option value="ALL">Everyone</option>
                    <option value="ROLE">A specific role</option>
                    <option value="EMAIL">A specific person</option>
                  </select>
                </div>

                {form.target_type === 'ROLE' && (
                  <div>
                    <label style={labelStyle}>Role</label>
                    <select
                      style={{ ...inputStyle, cursor: 'pointer', background: 'white' }}
                      value={form.target_value}
                      onChange={(e) => setForm({ ...form, target_value: e.target.value })}
                      required
                    >
                      <option value="">Choose a role...</option>
                      {systemRoles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                )}

                {form.target_type === 'EMAIL' && (
                  <div style={{ position: 'relative' }}>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="text"
                      style={inputStyle}
                      placeholder="Search by email..."
                      value={emailSearchTerm}
                      onChange={(e) => {
                        setEmailSearchTerm(e.target.value);
                        setForm({ ...form, target_value: e.target.value });
                        setShowEmailDropdown(true);
                      }}
                      onFocus={() => setShowEmailDropdown(true)}
                      onBlur={() => setTimeout(() => setShowEmailDropdown(false), 200)}
                      required
                    />

                    {showEmailDropdown && filteredEmails.length > 0 && (
                      <ul style={{
                        position: 'absolute', left: 0, right: 0, top: 'calc(100% + 4px)', zIndex: 20,
                        background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)', maxHeight: '160px', overflowY: 'auto',
                        margin: 0, padding: 0, listStyle: 'none'
                      }}>
                        {filteredEmails.map((email) => (
                          <li
                            key={email}
                            onMouseDown={() => handleEmailSelect(email)}
                            style={{
                              padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#334155',
                              cursor: 'pointer', borderBottom: '1px solid #f1f5f9'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#eff6ff')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                          >
                            {email}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
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
                {submitting ? 'Sending...' : 'Send Notification'}
              </button>
            </div>

            {statusMsg && (
              <div style={{
                marginTop: '16px', padding: '14px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#15803d'
              }}>
                <svg style={{ width: '16px', height: '16px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>{statusMsg}</p>
              </div>
            )}
          </form>
        </div>

        {/* HISTORY CARD */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>Sent Notifications</span>
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
              Loading notification history...
            </div>
          ) : pastNotifications.length === 0 ? (
            <div style={{ padding: '50px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
              No notifications sent yet.
            </div>
          ) : (
            <div>
              {pastNotifications.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{item.title}</h4>
                      <span style={{
                        fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px',
                        background: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe',
                        padding: '3px 8px', borderRadius: '6px'
                      }}>
                        {targetLabel(item.target_type)}{item.target_value ? ` · ${item.target_value}` : ''}
                      </span>
                    </div>
                    <p style={{
                      margin: '6px 0 0 0', fontSize: '13px', color: '#64748b', maxWidth: '500px',
                      overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                    }}>
                      {item.message}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      fontSize: '13px', fontWeight: '700', border: 'none', flexShrink: 0,
                      padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                      background: '#dc2626', color: 'white',
                      boxShadow: '0 2px 6px rgba(220,38,38,0.15)'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}