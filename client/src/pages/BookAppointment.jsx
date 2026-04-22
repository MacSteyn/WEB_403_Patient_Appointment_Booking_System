import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import NearbyDoctors from '../components/NearbyDoctors';
import { addToGoogleCalendar } from '../utils/googleCalendar';

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

  const [nearbyDoctorName, setNearbyDoctorName] = useState('');
  const [useNearby, setUseNearby] = useState(false);
  const [syncCalendar, setSyncCalendar] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  useEffect(() => {
    api.get('/doctors')
      .then(({ data }) => setDoctors(data.doctors))
      .catch(() => toast.error('Failed to load doctors'))
      .finally(() => setDoctorsLoading(false));
  }, []);

  const handleSelectNearbyDoctor = (googleDoctor) => {
    setNearbyDoctorName(googleDoctor.name);
    setUseNearby(true);
    setForm(f => ({ ...f, doctor: '' }));
    toast.info(`Selected: ${googleDoctor.name}`);
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const validate = () => {
    const errs = {};
    if (!useNearby && !form.doctor) errs.doctor = 'Please select a doctor';
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
    if (e.target.name === 'doctor') { setUseNearby(false); setNearbyDoctorName(''); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { toast.error('You must be logged in'); navigate('/login'); return; }

      let appointmentData = { ...form };

      if (useNearby) {
        if (doctors.length === 0) {
          toast.error('No doctors in database. Please use a listed doctor.');
          setLoading(false);
          return;
        }
        appointmentData.doctor = doctors[0]._id;
        appointmentData.notes = `[Nearby: ${nearbyDoctorName}] ${form.notes}`;
      }

      await api.post('/appointments', appointmentData);
      toast.success('Appointment booked successfully! 🎉');

      if (syncCalendar) {
        try {
          const doctorName = useNearby
            ? nearbyDoctorName
            : doctors.find(d => d._id === form.doctor)?.user?.name || 'Doctor';
          const calLink = await addToGoogleCalendar(appointmentData, doctorName);
          toast.success(
            <span>Added to Google Calendar! <a href={calLink} target="_blank" rel="noreferrer" style={{ color: '#1a6bcc' }}>View →</a></span>,
            { autoClose: 6000 }
          );
        } catch (calErr) {
          toast.warning(`Booked! But calendar sync failed: ${calErr.message}`);
        }
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Booking error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDoc = doctors.find(d => d._id === form.doctor);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '760px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Book an Appointment</h1>
          <p className="text-muted">Choose a listed doctor or find one near you using Google Maps</p>
        </div>

        {/* Nearby Doctors */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <NearbyDoctors onSelectDoctor={handleSelectNearbyDoctor} />
        </div>

        {/* Selected Nearby Banner */}
        {useNearby && nearbyDoctorName && (
          <div className="alert alert--success" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📍 Booking with: <strong>{nearbyDoctorName}</strong></span>
            <button onClick={() => { setUseNearby(false); setNearbyDoctorName(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#06d6a0', fontWeight: 700, fontSize: '1.1rem' }}>✕</button>
          </div>
        )}

        {/* Form */}
        <div className="card" id="booking-form" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e9eef5' }}>
            📋 Appointment Details
          </h3>

          <form onSubmit={handleSubmit} noValidate>

            {!useNearby && (
              <div className={`form-group ${errors.doctor ? 'form-group--has-error' : ''}`}>
                <label>Select Doctor *</label>
                {doctorsLoading ? <p className="text-muted">Loading doctors...</p> : (
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
            )}

            {selectedDoc && !useNearby && (
              <div className="alert alert--info" style={{ marginBottom: '1.5rem' }}>
                <strong>Dr. {selectedDoc.user?.name}</strong> · {selectedDoc.specialty}<br />
                <small>Available: {selectedDoc.availableDays?.join(', ')} · {selectedDoc.availableHours?.start} – {selectedDoc.availableHours?.end}</small>
              </div>
            )}

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

            <div className="form-group">
              <label>Appointment Type *</label>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {['in-person', 'virtual'].map(type => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 400, textTransform: 'none', fontSize: '0.95rem', letterSpacing: 0 }}>
                    <input type="radio" name="type" value={type} checked={form.type === type} onChange={handleChange} />
                    {type === 'in-person' ? '🏥 In-Person' : '💻 Virtual'}
                  </label>
                ))}
              </div>
            </div>

            <div className={`form-group ${errors.reason ? 'form-group--has-error' : ''}`}>
              <label>Reason for Visit *</label>
              <textarea name="reason" placeholder="Describe your symptoms..." value={form.reason} onChange={handleChange} rows={4} />
              <small style={{ color: '#8796a9', fontSize: '0.78rem' }}>{form.reason.length}/300</small>
              {errors.reason && <span className="form-group__error">⚠ {errors.reason}</span>}
            </div>

            <div className="form-group">
              <label>Additional Notes <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '0.8rem', letterSpacing: 0 }}>(optional)</span></label>
              <textarea name="notes" placeholder="Any extra info for the doctor..." value={form.notes} onChange={handleChange} rows={3} />
            </div>

            {/* Google Calendar Toggle */}
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1.5px solid #e9eef5', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: 400, textTransform: 'none', fontSize: '0.95rem', letterSpacing: 0, marginBottom: 0 }}>
                <input type="checkbox" checked={syncCalendar} onChange={e => setSyncCalendar(e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#0d1b2a' }}>📅 Add to Google Calendar</div>
                  <div style={{ fontSize: '0.82rem', color: '#8796a9' }}>Syncs appointment with reminders (1 day + 1 hour before)</div>
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn--primary btn--lg" disabled={loading}>
                {loading ? '⏳ Booking...' : '📅 Confirm Booking'}
              </button>
              <button type="button" className="btn btn--ghost btn--lg" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
