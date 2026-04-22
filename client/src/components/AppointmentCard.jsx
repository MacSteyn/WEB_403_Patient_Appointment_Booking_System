import { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

export default function AppointmentCard({ appointment, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const date = new Date(appointment.date);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const doctorName = appointment.doctor?.user?.name || 'Doctor';
  const specialty = appointment.doctor?.specialty || '';

  const handleCancel = async () => {
    if (!window.confirm('Cancel this appointment?')) return;
    setLoading(true);
    try {
      await api.put(`/appointments/${appointment._id}`, { status: 'cancelled' });
      toast.success('Appointment cancelled');
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: '#ffd166',
    confirmed: '#06d6a0',
    cancelled: '#ef476f',
    completed: '#1a6bcc',
  };

  return (
    <div className="appt-card">
      <div className="appt-card__date-block">
        <span className="day">{day}</span>
        <span className="month">{month}</span>
      </div>

      <div className="appt-card__info">
        <h3>Dr. {doctorName}</h3>
        <p>🩺 {specialty} &nbsp;|&nbsp; ⏰ {appointment.time} &nbsp;|&nbsp; {appointment.type === 'virtual' ? '💻 Virtual' : '🏥 In-Person'}</p>
        <p style={{ marginTop: '4px' }}>📝 {appointment.reason}</p>
        <span
          className={`badge badge--${appointment.status}`}
          style={{ marginTop: '8px', display: 'inline-flex' }}
        >
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>

      <div className="appt-card__actions">
        {appointment.status === 'pending' && (
          <button
            className="btn btn--danger btn--sm"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? '...' : 'Cancel'}
          </button>
        )}
      </div>
    </div>
  );
}
