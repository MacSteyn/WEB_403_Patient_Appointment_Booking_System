import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppointmentCard from '../components/AppointmentCard';
import api from '../utils/api';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data.appointments);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter);

  const counts = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard__header">
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p>Here's an overview of your health appointments</p>
        </div>

        {/* Stats */}
        <div className="dashboard__grid">
          {[
            { label: 'Total Appointments', value: counts.total, icon: '📅' },
            { label: 'Pending', value: counts.pending, icon: '⏳' },
            { label: 'Confirmed', value: counts.confirmed, icon: '✅' },
          ].map(s => (
            <div key={s.label} className="dashboard__stat-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div className="stat-number">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem' }}>Your Appointments</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn btn--sm ${filter === f ? 'btn--primary' : 'btn--ghost'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <Link to="/book" className="btn btn--primary btn--sm">+ New Appointment</Link>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
            <h3>No appointments found</h3>
            <p>You don't have any {filter !== 'all' ? filter : ''} appointments yet.</p>
            <Link to="/book" className="btn btn--primary" style={{ marginTop: '1.5rem' }}>Book Your First Appointment</Link>
          </div>
        ) : (
          <div className="appointments-list">
            {filtered.map(appt => (
              <AppointmentCard key={appt._id} appointment={appt} onUpdate={fetchAppointments} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
