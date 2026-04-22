import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const SPECIALTIES = [
  'General Practice', 'Cardiology', 'Dermatology',
  'Neurology', 'Orthopedics', 'Pediatrics',
  'Psychiatry', 'Gynecology', 'Ophthalmology', 'Dentistry',
];

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('specialty') || '');
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searched, setSearched] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const specialty = searchParams.get('specialty');
    if (specialty) {
      fetchDoctors(specialty);
      setSearchInput(specialty);
      setSearched(true);
    } else {
      fetchDoctors('');
      setSearched(false);
    }
  }, [searchParams]);

  const fetchDoctors = async (specialty) => {
    setLoading(true);
    try {
      const params = specialty ? `?specialty=${specialty}` : '';
      const { data } = await api.get(`/doctors${params}`);
      setDoctors(data.doctors);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    const filtered = val.length > 0
      ? SPECIALTIES.filter(s => s.toLowerCase().includes(val.toLowerCase()))
      : SPECIALTIES;
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleDetectLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) { setLocationInput('Not supported'); setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || 'Your Location';
          const state = data.address?.state_code || '';
          setLocationInput(`${city}${state ? ', ' + state : ''}`);
        } catch { setLocationInput('Location detected'); }
        finally { setLocating(false); }
      },
      () => { setLocationInput('Unable to detect'); setLocating(false); }
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSearched(true);
    if (searchInput) setSearchParams({ specialty: searchInput });
    else { setSearchParams({}); fetchDoctors(''); }
  };

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      {/* ── HERO SEARCH BAR ── */}
      <div style={{ background: 'linear-gradient(135deg, #e8f0fb 0%, #f0f7ff 100%)', padding: '3rem 0 2.5rem', borderBottom: '1px solid #dce8f5' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, marginBottom: '0.5rem', color: '#0d1b2a' }}>
            Find and Book a Doctor
          </h1>
          <p style={{ color: '#4a5568', marginBottom: '1.75rem', fontSize: '1rem' }}>
            Compare local doctors, read verified reviews and book instantly
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr auto auto',
              background: '#fff',
              borderRadius: '14px',
              boxShadow: '0 4px 24px rgba(26,107,204,0.13)',
              border: '1.5px solid #dce8f5',
              overflow: 'visible',
              position: 'relative',
            }}>
              {/* Specialty */}
              <div style={{ padding: '0.85rem 1.25rem', position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#8796a9', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px' }}>Search</label>
                <input
                  type="text"
                  placeholder="Specialty, condition, doctor..."
                  value={searchInput}
                  onChange={handleSearchInput}
                  onFocus={() => { setSuggestions(SPECIALTIES); setShowSuggestions(true); }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', fontWeight: 500, color: '#0d1b2a', background: 'transparent', padding: 0, fontFamily: 'inherit' }}
                />
                {/* Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1.5px solid #dce8f5', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200, overflow: 'hidden' }}>
                    {suggestions.map(s => (
                      <div key={s} onMouseDown={() => { setSearchInput(s); setShowSuggestions(false); }}
                        style={{ padding: '0.65rem 1rem', cursor: 'pointer', fontSize: '0.9rem', color: '#0d1b2a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e8f0fb'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        🩺 {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{ width: '1px', background: '#dce8f5', margin: '0.75rem 0' }} />

              {/* Location */}
              <div style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#8796a9', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px' }}>Location</label>
                  <input
                    type="text"
                    placeholder="City, state or zip code"
                    value={locationInput}
                    onChange={e => setLocationInput(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', fontWeight: 500, color: '#0d1b2a', background: 'transparent', padding: 0, fontFamily: 'inherit' }}
                  />
                </div>
                <button type="button" onClick={handleDetectLocation} title="Detect my location"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: locating ? '#8796a9' : '#1a6bcc', fontSize: '1.2rem', flexShrink: 0 }}>
                  {locating ? '⏳' : '📍'}
                </button>
              </div>

              {/* Divider */}
              <div style={{ width: '1px', background: '#dce8f5', margin: '0.75rem 0' }} />

              {/* Search Button */}
              <button type="submit" style={{
                background: '#1a6bcc', color: '#fff', border: 'none',
                padding: '0 2rem', cursor: 'pointer', borderRadius: '0 12px 12px 0',
                fontWeight: 700, fontSize: '0.95rem', display: 'flex',
                alignItems: 'center', gap: '0.5rem', transition: 'background 200ms',
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#0f4f9e'}
                onMouseLeave={e => e.currentTarget.style.background = '#1a6bcc'}
              >
                🔍 Find Care
              </button>
            </div>
          </form>

          {/* Quick Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            {['General Practice', 'Cardiology', 'Dermatology', 'Pediatrics', 'Dentistry'].map(s => (
              <button key={s}
                onClick={() => { setSearchInput(s); setSearchParams({ specialty: s }); setSearched(true); }}
                style={{ padding: '0.35rem 0.9rem', borderRadius: '999px', border: '1.5px solid #c5d8f0', background: '#fff', fontSize: '0.82rem', fontWeight: 500, color: '#1a6bcc', cursor: 'pointer', transition: 'all 200ms', fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1a6bcc'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1a6bcc'; }}
              >{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RESULTS ── */}
      <div className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">

          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>
                {searched && searchInput
                  ? `${doctors.length} doctor${doctors.length !== 1 ? 's' : ''} for "${searchInput}"${locationInput ? ` near ${locationInput}` : ''}`
                  : `All Doctors (${doctors.length})`}
              </h2>
              {locationInput && <p style={{ color: '#8796a9', fontSize: '0.85rem' }}>📍 {locationInput}</p>}
            </div>
            {searched && (
              <button onClick={() => { setSearched(false); setSearchInput(''); setLocationInput(''); setSearchParams({}); }} className="btn btn--ghost btn--sm">✕ Clear Filter</button>
            )}
          </div>

          {loading && <div className="loading-page"><div className="spinner" /></div>}

          {/* Doctor Cards */}
          {!loading && doctors.length > 0 && (
            <div className="doctors-grid">
              {doctors.map(doc => (
                <div key={doc._id} className="doctor-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="doctor-card__avatar">{getInitials(doc.user?.name)}</div>
                    <div>
                      <div className="doctor-card__name">Dr. {doc.user?.name}</div>
                      <div className="doctor-card__specialty">{doc.specialty}</div>
                    </div>
                  </div>
                  <div className="doctor-card__meta">
                    <span>⭐ {doc.rating > 0 ? doc.rating.toFixed(1) : 'New'}</span>
                    <span>🕐 {doc.experience || 0}y exp</span>
                    <span>📅 {doc.availableDays?.length || 5} days/wk</span>
                  </div>
                  {doc.bio && <p style={{ fontSize: '0.85rem', color: '#8796a9', marginBottom: '1rem', lineHeight: 1.5 }}>{doc.bio.length > 100 ? doc.bio.slice(0, 100) + '...' : doc.bio}</p>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="doctor-card__fee">${doc.consultationFee} <span style={{ fontSize: '0.75rem', color: '#8796a9', fontWeight: 400 }}>/ visit</span></div>
                    <Link to={`/book?doctor=${doc._id}`} className="btn btn--primary btn--sm">Book Now</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && searched && doctors.length === 0 && (
            <div className="empty-state">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h3>No doctors found</h3>
              <p>Try a different specialty or clear the search.</p>
              <button className="btn btn--primary" style={{ marginTop: '1.5rem' }} onClick={() => { setSearched(false); setSearchInput(''); setSearchParams({}); }}>View All Specialties</button>
            </div>
          )}

          {/* Specialty Grid - only show when no doctors loaded */}
          {!loading && doctors.length === 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '🫀', name: 'Cardiology' }, { icon: '🧠', name: 'Neurology' },
                { icon: '🦷', name: 'Dentistry' }, { icon: '👁️', name: 'Ophthalmology' },
                { icon: '🦴', name: 'Orthopedics' }, { icon: '👶', name: 'Pediatrics' },
                { icon: '🧬', name: 'Dermatology' }, { icon: '🩺', name: 'General Practice' },
                { icon: '🧘', name: 'Psychiatry' }, { icon: '👩‍⚕️', name: 'Gynecology' },
              ].map(s => (
                <div key={s.name}
                  onClick={() => { setSearchInput(s.name); setSearchParams({ specialty: s.name }); setSearched(true); }}
                  style={{ background: '#fff', border: '1.5px solid #e9eef5', borderRadius: '12px', padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 250ms' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a6bcc'; e.currentTarget.style.background = '#e8f0fb'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9eef5'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4a5568' }}>{s.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
