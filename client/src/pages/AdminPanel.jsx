import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const TABS = ['Appointments', 'Doctors', 'Add Doctor'];

export default function AdminPanel() {
  const [tab, setTab] = useState('Appointments');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add Doctor form
  const [docForm, setDocForm] = useState({
    userId: '', specialty: 'General Practice', bio: '',
    experience: '', consultationFee: 100,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  });
  const [docErrors, setDocErrors] = useState({});
  const [docLoading, setDocLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [apptRes, docRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/doctors'),
      ]);
      setAppointments(apptRes.data.appointments);
      setDoctors(docRes.data.doctors);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Appointment ${status}`);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDeleteAppt = async (id) => {
    if (!window.confirm('Delete this appointment permanently?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment deleted');
      fetchAll();
    } catch {
      toast.error('Delete failed');
    }
  };

  const validateDoc = () => {
    const errs = {};
    if (!docForm.userId.trim()) errs.userId = 'User ID is required';
    if (!docForm.specialty) errs.specialty = 'Specialty is required';
    return errs;
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const errs = validateDoc();
    if (Object.keys(errs).length) { setDocErrors(errs); return; }

    setDocLoading(true);
    try {
      await api.post('/doctors', { ...docForm, user: docForm.userId });
      toast.success('Doctor profile created!');
      setDocForm({ userId: '', specialty: 'General Practice', bio: '', experience: '', consultationFee: 100, availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'] });
      fetchAll();
      setTab('Doctors');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create doctor');
    } finally {
      setDocLoading(false);
    }
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    doctors: doctors.length,
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛠️ Admin Panel</h1>
          <p className="text-muted">Manage the entire MediBook platform</p>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Appointments', value: stats.total, color: '#1a6bcc' },
            { label: 'Pending', value: stats.pending, color: '#ffd166' },
            { label: 'Confirmed', value: stats.confirmed, color: '#06d6a0' },
            { label: 'Doctors', value: stats.doctors, color: '#ef476f' },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color, fontFamily: 'Playfair Display, serif' }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: '#8796a9', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e9eef5', paddingBottom: '0' }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '0.65rem 1.25rem', border: 'none', background: 'none',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                borderBottom: tab === t ? '2px solid #1a6bcc' : '2px solid transparent',
                color: tab === t ? '#1a6bcc' : '#8796a9',
                marginBottom: '-2px', transition: 'all 200ms',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : (
          <>
            {/* Appointments Tab */}
            {tab === 'Appointments' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(26,107,204,0.08)' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Patient', 'Doctor', 'Date', 'Time', 'Type', 'Reason', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: '#8796a9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a._id} style={{ borderTop: '1px solid #f0f4f8' }}>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>{a.patient?.name || '—'}</td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>Dr. {a.doctor?.user?.name || '—'}</td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{new Date(a.date).toLocaleDateString()}</td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{a.time}</td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{a.type}</td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.reason}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span className={`badge badge--${a.status}`}>{a.status}</span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                            {a.status === 'pending' && (
                              <button className="btn btn--sm btn--primary" onClick={() => handleStatusChange(a._id, 'confirmed')}>✓</button>
                            )}
                            {a.status !== 'cancelled' && a.status !== 'completed' && (
                              <button className="btn btn--sm btn--outline" onClick={() => handleStatusChange(a._id, 'completed')}>Done</button>
                            )}
                            <button className="btn btn--sm btn--danger" onClick={() => handleDeleteAppt(a._id)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {appointments.length === 0 && <div className="empty-state"><h3>No appointments yet</h3></div>}
              </div>
            )}

            {/* Doctors Tab */}
            {tab === 'Doctors' && (
              <div className="doctors-grid">
                {doctors.map(doc => (
                  <div key={doc._id} className="doctor-card">
                    <div className="doctor-card__name">Dr. {doc.user?.name}</div>
                    <div className="doctor-card__specialty">{doc.specialty}</div>
                    <div className="doctor-card__meta">
                      <span>💰 ${doc.consultationFee}</span>
                      <span>🕐 {doc.experience || 0}y exp</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#8796a9' }}>
                      {doc.availableDays?.join(', ')}
                    </div>
                  </div>
                ))}
                {doctors.length === 0 && <div className="empty-state"><h3>No doctors added yet</h3></div>}
              </div>
            )}

            {/* Add Doctor Tab */}
            {tab === 'Add Doctor' && (
              <div className="card" style={{ maxWidth: 560 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Add New Doctor Profile</h2>
                <form onSubmit={handleAddDoctor} noValidate>
                  <div className={`form-group ${docErrors.userId ? 'form-group--has-error' : ''}`}>
                    <label>User ID (MongoDB _id of existing doctor user) *</label>
                    <input
                      type="text" placeholder="60d21b4667d0d8992e610c85"
                      value={docForm.userId}
                      onChange={e => setDocForm({ ...docForm, userId: e.target.value })}
                    />
                    {docErrors.userId && <span className="form-group__error">⚠ {docErrors.userId}</span>}
                  </div>

                  <div className="form-group">
                    <label>Specialty *</label>
                    <select value={docForm.specialty} onChange={e => setDocForm({ ...docForm, specialty: e.target.value })}>
                      {['General Practice','Cardiology','Dermatology','Neurology','Orthopedics','Pediatrics','Psychiatry','Gynecology','Ophthalmology','Dentistry'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Years of Experience</label>
                      <input type="number" min="0" value={docForm.experience} onChange={e => setDocForm({ ...docForm, experience: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Consultation Fee ($)</label>
                      <input type="number" min="0" value={docForm.consultationFee} onChange={e => setDocForm({ ...docForm, consultationFee: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea rows={3} value={docForm.bio} onChange={e => setDocForm({ ...docForm, bio: e.target.value })} placeholder="Short professional bio..." />
                  </div>

                  <button type="submit" className="btn btn--primary" disabled={docLoading}>
                    {docLoading ? 'Creating...' : '+ Create Doctor Profile'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
