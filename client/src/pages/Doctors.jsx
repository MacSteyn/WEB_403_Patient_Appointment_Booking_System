import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const SPECIALTIES = [
  'All', 'General Practice', 'Cardiology', 'Dermatology',
  'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry',
  'Gynecology', 'Ophthalmology', 'Dentistry',
];

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const specialty = searchParams.get('specialty') || 'All';

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = specialty && specialty !== 'All' ? `?specialty=${specialty}` : '';
        const { data } = await api.get(`/doctors${params}`);
        setDoctors(data.doctors);
      } catch {
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [specialty]);

  const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Our Doctors</h1>
          <p className="text-muted">Find and book with the right specialist</p>
        </div>

        {/* Specialty Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {SPECIALTIES.map(s => (
            <button
              key={s}
              onClick={() => setSearchParams(s === 'All' ? {} : { specialty: s })}
              className={`btn btn--sm ${specialty === s || (s === 'All' && !searchParams.get('specialty')) ? 'btn--primary' : 'btn--outline'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : doctors.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👨‍⚕️</div>
            <h3>No doctors found</h3>
            <p>Try a different specialty or check back later.</p>
          </div>
        ) : (
          <div className="doctors-grid">
            {doctors.map(doc => (
              <div key={doc._id} className="doctor-card">
                <div className="doctor-card__avatar">{getInitials(doc.user?.name)}</div>
                <div className="doctor-card__name">Dr. {doc.user?.name}</div>
                <div className="doctor-card__specialty">{doc.specialty}</div>
                <div className="doctor-card__meta">
                  <span>⭐ {doc.rating > 0 ? doc.rating.toFixed(1) : 'New'}</span>
                  <span>🕐 {doc.experience || 0}y exp</span>
                  <span>📍 {doc.availableDays?.length || 5} days/wk</span>
                </div>
                {doc.bio && <p style={{ fontSize: '0.85rem', color: '#8796a9', marginBottom: '1rem' }}>{doc.bio}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="doctor-card__fee">${doc.consultationFee}</div>
                  <Link to={`/book?doctor=${doc._id}`} className="btn btn--primary btn--sm">Book Now</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
