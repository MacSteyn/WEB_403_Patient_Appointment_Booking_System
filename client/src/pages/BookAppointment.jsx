import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00',
];

export default function BookAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDoctor = searchParams.get('doctor');

  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctor: preselectedDoctor || '',
    date: '',
    time: '',
    reason: '',
    notes: '',
    type: 'in-person',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  useEffect(() => {
    api.get('/doctors')
      .then(({ data }) => setDoctors(data.doctors))
      .catch(() => toast.error('Failed to load doctors'))
      .finally(() => setDoctorsLoading(false));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.doctor) errs.doctor = 'Please select a doctor';
    if (!form.date) errs.date = 'Please select a date';
    else {
      const selected = new Date(form.date);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (selected < today) errs.date = 'Date cannot be in the past';
    }
    if (!form.time) errs.time = 'Please select a time slot';
    if (!form.reason.trim()) errs.reason = 'Please describe your reason for visit';
    else if (form.reason.trim().length < 10) errs.reason = 'Please provide more detail (min 10 characters)';
    else if (form.reason.length > 300) errs.reason = 'Reason too long (max 300 characters)';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await api.post('/appointments', form);
      toast.success('Appointment booked successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDoc = doctors.find(d => d._id === form.doctor);

  // Min date = today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '760px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Book an Appointment</h1>
          <p className="text-muted">Fill in the form below to schedule your visit</p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} noValidate>

            {/* Doctor Selection */}
            <div className={`form-group ${errors.doctor ? 'form-group--has-error' : ''}`}>
              <label>Select Doctor *</label>
              {doctorsLoading ? (
                <p className="text-muted">Loading doctors...</p>
              ) : (
                <select name="doctor" value={form.doctor} onChange={handleChange}>
                  <option value="">-- Choose a doctor --</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.user?.name} — {doc.specialty} (${doc.consultationFee})
                    </option>
                  ))}
                </select>
              )}
              {errors.doctor && <span className="form-group__error">⚠ {errors.doctor}</span>}
            </div>

            {/* Selected Doctor Info */}
            {selectedDoc && (
              <div className="alert alert--info" style={{ marginBottom: '1.5rem' }}>
                <strong>Dr. {selectedDoc.user?.name}</strong> · {selectedDoc.specialty}<br />
                <small>Available: {selectedDoc.availableDays?.join(', ')} · Hours: {selectedDoc.availableHours?.start} – {selectedDoc.availableHours?.end}</small>
              </div>
            )}

            {/* Date & Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={`form-group ${errors.date ? 'form-group--has-error' : ''}`}>
                <label>Date *</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} min={today} />
                {errors.date && <span className="form-group__error">⚠ {errors.date}</span>}
              </div>

              <div className={`form-group ${errors.time ? 'form-group--has-error' : ''}`}>
                <label>Time Slot *</label>
                <select name="time" value={form.time} onChange={handleChange}>
                  <option value="">-- Select time --</option>
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.time && <span className="form-group__error">⚠ {errors.time}</span>}
              </div>
            </div>

            {/* Appointment Type */}
            <div className="form-group">
              <label>Appointment Type *</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {['in-person', 'virtual'].map(type => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 400, textTransform: 'none', fontSize: '0.95rem', letterSpacing: 0 }}>
                    <input
                      type="radio" name="type" value={type}
                      checked={form.type === type} onChange={handleChange}
                    />
                    {type === 'in-person' ? '🏥 In-Person' : '💻 Virtual'}
                  </label>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div className={`form-group ${errors.reason ? 'form-group--has-error' : ''}`}>
              <label>Reason for Visit *</label>
              <textarea
                name="reason"
                placeholder="Describe your symptoms or reason for the appointment..."
                value={form.reason}
                onChange={handleChange}
                rows={4}
              />
              <small style={{ color: '#8796a9', fontSize: '0.78rem' }}>{form.reason.length}/300 characters</small>
              {errors.reason && <span className="form-group__error">⚠ {errors.reason}</span>}
            </div>

            {/* Additional Notes */}
            <div className="form-group">
              <label>Additional Notes <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '0.8rem', letterSpacing: 0 }}>(optional)</span></label>
              <textarea
                name="notes"
                placeholder="Any additional information for the doctor..."
                value={form.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn--primary btn--lg" disabled={loading}>
                {loading ? '⏳ Booking...' : '📅 Confirm Booking'}
              </button>
              <button type="button" className="btn btn--ghost btn--lg" onClick={() => navigate(-1)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
