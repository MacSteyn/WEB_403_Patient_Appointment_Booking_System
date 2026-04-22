import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const specialties = [
  { icon: '🫀', name: 'Cardiology' },
  { icon: '🧠', name: 'Neurology' },
  { icon: '🦷', name: 'Dentistry' },
  { icon: '👁️', name: 'Ophthalmology' },
  { icon: '🦴', name: 'Orthopedics' },
  { icon: '👶', name: 'Pediatrics' },
  { icon: '🧬', name: 'Dermatology' },
  { icon: '🩺', name: 'General Practice' },
];

const features = [
  { icon: '📅', title: 'Easy Booking', desc: 'Book appointments in minutes with our simple, intuitive interface.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your health data is protected with SSL encryption and secure authentication.' },
  { icon: '📱', title: 'Works Offline', desc: 'Access your appointments anytime, even without an internet connection (PWA).' },
  { icon: '🔔', title: 'Smart Reminders', desc: 'Get push notifications so you never miss an appointment.' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <div className="hero__tag">
              ✨ Trusted by 10,000+ patients
            </div>
            <h1>Your Health,<br />Our Priority</h1>
            <p>
              Book appointments with top-rated doctors instantly.
              Manage your health journey from one secure, easy-to-use platform.
            </p>
            <div className="hero__actions">
              {user ? (
                <Link to="/book" className="btn btn--primary btn--lg">Book Appointment</Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn--primary btn--lg">Get Started Free</Link>
                  <Link to="/doctors" className="btn btn--outline btn--lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                    View Doctors
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-bar__grid">
            <div className="stats-bar__item"><strong>500+</strong><span>Doctors</span></div>
            <div className="stats-bar__item"><strong>10K+</strong><span>Patients</span></div>
            <div className="stats-bar__item"><strong>50K+</strong><span>Appointments</span></div>
            <div className="stats-bar__item"><strong>4.9★</strong><span>Rating</span></div>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="text-center mb-3">
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Browse by Specialty</h2>
            <p className="text-muted">Find the right specialist for your needs</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
            {specialties.map((s) => (
              <Link
                key={s.name}
                to={`/doctors?specialty=${s.name}`}
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e9eef5',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  transition: 'all 250ms ease',
                  cursor: 'pointer',
                  display: 'block',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a6bcc'; e.currentTarget.style.background = '#e8f0fb'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9eef5'; e.currentTarget.style.background = '#f8fafc'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4a5568' }}>{s.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-3">
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Why Choose MediBook?</h2>
            <p className="text-muted">Everything you need to manage your healthcare</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            {features.map((f) => (
              <div key={f.title} className="card">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: '#8796a9', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="section" style={{ background: '#1a6bcc', color: '#fff', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '1rem' }}>Ready to take control of your health?</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>Join thousands of patients already using MediBook</p>
            <Link to="/register" className="btn btn--lg" style={{ background: '#fff', color: '#1a6bcc', fontWeight: 700 }}>
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
