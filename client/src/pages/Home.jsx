import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';

const specialties = [
  { icon: '🫀', name: 'Cardiology', color: '#ef476f', bg: '#fef0f3' },
  { icon: '🧠', name: 'Neurology', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: '🦷', name: 'Dentistry', color: '#06b6d4', bg: '#ecfeff' },
  { icon: '👁️', name: 'Ophthalmology', color: '#0891b2', bg: '#e0f7fa' },
  { icon: '🦴', name: 'Orthopedics', color: '#d97706', bg: '#fffbeb' },
  { icon: '👶', name: 'Pediatrics', color: '#16a34a', bg: '#f0fdf4' },
  { icon: '🧬', name: 'Dermatology', color: '#db2777', bg: '#fdf2f8' },
  { icon: '🩺', name: 'General Practice', color: '#1a6bcc', bg: '#e8f0fb' },
];

const features = [
  { icon: '📅', title: 'Instant Booking', desc: 'Book with top-rated doctors in under 2 minutes. No waiting rooms, no phone calls.', color: '#1a6bcc' },
  { icon: '🔒', title: 'SSL Secured', desc: 'Your health data is fully encrypted with SSL and protected by JWT authentication.', color: '#06d6a0' },
  { icon: '📱', title: 'PWA Ready', desc: 'Install on any device and access your appointments even without internet connection.', color: '#7c3aed' },
  { icon: '🔔', title: 'Smart Reminders', desc: 'Google Calendar sync with automatic push notifications before every appointment.', color: '#ef476f' },
  { icon: '📍', title: 'Find Nearby', desc: 'Discover real doctors and clinics near your location using Google Maps integration.', color: '#f59e0b' },
  { icon: '👨‍⚕️', title: 'Verified Doctors', desc: 'All doctors are verified specialists with confirmed credentials and patient reviews.', color: '#06b6d4' },
];

const testimonials = [
  { name: 'Sarah M.', role: 'Patient', text: 'Booked a cardiologist in literally 2 minutes. MediBook has completely changed how I manage my health.', rating: 5, avatar: 'SM' },
  { name: 'James K.', role: 'Patient', text: 'The Google Calendar sync is genius. I never miss an appointment now. Highly recommend!', rating: 5, avatar: 'JK' },
  { name: 'Priya L.', role: 'Patient', text: 'Found a great dermatologist near me using the map feature. Simple, fast, and reliable.', rating: 5, avatar: 'PL' },
];

const steps = [
  { number: '01', title: 'Create Account', desc: 'Sign up free in seconds. No credit card required.' },
  { number: '02', title: 'Find a Doctor', desc: 'Search by specialty or find doctors near your location.' },
  { number: '03', title: 'Book Instantly', desc: 'Pick a date and time that works for you.' },
  { number: '04', title: 'Get Reminded', desc: 'Receive reminders via push notification and Google Calendar.' },
];

// Animated counter hook
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true);
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, started]);

  return [count, ref];
}

function StatCard({ value, suffix, label, color }) {
  const [count, ref] = useCounter(value);
  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color, lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: '0.88rem', color: '#8796a9', marginTop: '0.5rem', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #0d1b2a 40%, #0f3460 100%)',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '4rem 0',
      }}>
        {/* Animated background orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,107,204,0.25) 0%, transparent 70%)', animation: 'pulse 4s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,214,160,0.12) 0%, transparent 70%)', animation: 'pulse 6s ease-in-out infinite reverse' }} />
          <div style={{ position: 'absolute', top: '30%', left: '50%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,71,111,0.08) 0%, transparent 70%)' }} />
          {/* Grid lines */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <style>{`
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          .hero-tag { animation: fadeUp 0.6s ease forwards; }
          .hero-h1 { animation: fadeUp 0.6s 0.15s ease forwards; opacity: 0; }
          .hero-p { animation: fadeUp 0.6s 0.3s ease forwards; opacity: 0; }
          .hero-btns { animation: fadeUp 0.6s 0.45s ease forwards; opacity: 0; }
          .hero-card { animation: fadeUp 0.6s 0.6s ease forwards; opacity: 0; }
          .floating { animation: float 3s ease-in-out infinite; }
          .specialty-pill:hover { transform: translateY(-3px) scale(1.05) !important; }
          .feature-card:hover { transform: translateY(-6px) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important; }
          .step-card:hover .step-number { transform: scale(1.1); }
          .testimonial-card:hover { transform: translateY(-4px) !important; }
        `}</style>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

            {/* Left Content */}
            <div>
              <div className="hero-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(26,107,204,0.2)', border: '1px solid rgba(26,107,204,0.4)', padding: '0.4rem 1rem', borderRadius: '999px', marginBottom: '1.5rem', backdropFilter: 'blur(10px)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#06d6a0', display: 'inline-block', boxShadow: '0 0 8px #06d6a0' }} />
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Trusted by 10,000+ patients worldwide</span>
              </div>

              <h1 className="hero-h1" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                Your Health,<br />
                <span style={{ background: 'linear-gradient(135deg, #1a6bcc, #06d6a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Our Priority
                </span>
              </h1>

              <p className="hero-p" style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '480px' }}>
                Book appointments with top-rated doctors instantly. Manage your entire health journey from one secure, modern platform — with Google Maps, Calendar sync, and PWA support.
              </p>

              <div className="hero-btns" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {user ? (
                  <Link to="/book" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', background: 'linear-gradient(135deg, #1a6bcc, #0f4f9e)', color: '#fff', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(26,107,204,0.5)', transition: 'all 250ms' }}>
                    📅 Book Appointment
                  </Link>
                ) : (
                  <>
                    <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', background: 'linear-gradient(135deg, #1a6bcc, #0f4f9e)', color: '#fff', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(26,107,204,0.5)', transition: 'all 250ms' }}>
                      🚀 Get Started Free
                    </Link>
                    <Link to="/doctors" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', background: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '999px', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', transition: 'all 250ms' }}>
                      👨‍⚕️ View Doctors
                    </Link>
                  </>
                )}
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                {['🔒 SSL Secured', '📱 PWA App', '⚡ Instant Booking'].map(badge => (
                  <div key={badge} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{badge}</div>
                ))}
              </div>
            </div>

            {/* Right — floating cards */}
            <div className="hero-card" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              {/* Main card */}
              <div className="floating" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '360px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #1a6bcc, #06d6a0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👨‍⚕️</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>Dr. Sarah Johnson</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>Cardiologist · ⭐ 4.9</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Next Available</div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>Tomorrow, 10:00 AM</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>🏥 In-Person · $200</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                  {['09:00', '10:30', '14:00', '16:30'].map(t => (
                    <div key={t} style={{ background: t === '10:30' ? 'linear-gradient(135deg, #1a6bcc, #06d6a0)' : 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#fff', fontWeight: t === '10:30' ? 700 : 400, cursor: 'pointer' }}>{t}</div>
                  ))}
                </div>

                <div style={{ background: 'linear-gradient(135deg, #1a6bcc, #0f4f9e)', borderRadius: '12px', padding: '0.85rem', textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                  ✓ Confirm Booking
                </div>
              </div>

              {/* Floating badge 1 */}
              <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', background: '#06d6a0', borderRadius: '12px', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 20px rgba(6,214,160,0.4)' }}>
                <span style={{ fontSize: '1rem' }}>✅</span>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.6)', fontWeight: 600 }}>CONFIRMED</div>
                  <div style={{ fontSize: '0.8rem', color: '#0d1b2a', fontWeight: 700 }}>Appointment Booked!</div>
                </div>
              </div>

              {/* Floating badge 2 */}
              <div style={{ position: 'absolute', bottom: '1rem', left: '-1.5rem', background: '#fff', borderRadius: '12px', padding: '0.6rem 1rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📍</span>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#8796a9', fontWeight: 600 }}>NEARBY</div>
                  <div style={{ fontSize: '0.82rem', color: '#0d1b2a', fontWeight: 700 }}>12 doctors found</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e9eef5' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <StatCard value={500} suffix="+" label="Verified Doctors" color="#1a6bcc" />
            <StatCard value={10000} suffix="+" label="Happy Patients" color="#06d6a0" />
            <StatCard value={50000} suffix="+" label="Appointments" color="#ef476f" />
            <StatCard value={4.9} suffix="★" label="Average Rating" color="#f59e0b" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-block', background: '#e8f0fb', color: '#1a6bcc', padding: '0.3rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Simple Process
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '0.75rem' }}>How MediBook Works</h2>
            <p style={{ color: '#8796a9', maxWidth: '500px', margin: '0 auto' }}>Book a doctor appointment in 4 simple steps</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', position: 'relative' }}>
            {steps.map((step, i) => (
              <div key={step.number} className="step-card" style={{ background: '#fff', borderRadius: '16px', padding: '2rem 1.5rem', border: '1.5px solid #e9eef5', textAlign: 'center', transition: 'all 300ms ease', cursor: 'default', position: 'relative' }}>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', top: '2.5rem', right: '-0.75rem', color: '#cdd5e0', fontSize: '1.5rem', zIndex: 1, display: 'none' }}>→</div>
                )}
                <div className="step-number" style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 700, color: '#e9eef5', lineHeight: 1, marginBottom: '1rem', transition: 'transform 300ms' }}>
                  {step.number}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0d1b2a' }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#8796a9', lineHeight: 1.6 }}>{step.desc}</p>
                <div style={{ width: 40, height: 3, background: 'linear-gradient(90deg, #1a6bcc, #06d6a0)', borderRadius: '2px', margin: '1rem auto 0' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIALTIES ── */}
      <section style={{ padding: '5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-block', background: '#f0fdf9', color: '#06d6a0', padding: '0.3rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              All Specialties
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '0.75rem' }}>Browse by Specialty</h2>
            <p style={{ color: '#8796a9' }}>Find the right specialist for your exact needs</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
            {specialties.map((s) => (
              <Link key={s.name} to={`/doctors?specialty=${s.name}`}
                className="specialty-pill"
                style={{ background: s.bg, border: `1.5px solid ${s.color}22`, borderRadius: '16px', padding: '1.5rem 1rem', textAlign: 'center', display: 'block', textDecoration: 'none', transition: 'all 250ms ease', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '0.6rem' }}>{s.icon}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: s.color }}>{s.name}</div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/doctors" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', background: '#0d1b2a', color: '#fff', borderRadius: '999px', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 250ms' }}>
              View All Doctors →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #0d1b2a 0%, #0f3460 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(26,107,204,0.2)', color: '#60a5fa', padding: '0.3rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', border: '1px solid rgba(26,107,204,0.3)' }}>
              Why MediBook
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#fff', marginBottom: '0.75rem' }}>Everything You Need</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '500px', margin: '0 auto' }}>Built with the latest technology to give you the best healthcare experience</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {features.map((f) => (
              <div key={f.title} className="feature-card" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.75rem', transition: 'all 300ms ease', cursor: 'default' }}>
                <div style={{ width: 52, height: 52, borderRadius: '14px', background: `${f.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem', border: `1px solid ${f.color}33` }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-block', background: '#fef0f3', color: '#ef476f', padding: '0.3rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Patient Stories
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '0.75rem' }}>What Our Patients Say</h2>
            <p style={{ color: '#8796a9' }}>Real experiences from real patients</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card" style={{ background: '#fff', borderRadius: '20px', padding: '2rem', border: '1.5px solid #e9eef5', transition: 'all 300ms ease', boxShadow: '0 2px 12px rgba(26,107,204,0.06)' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(t.rating)].map((_, i) => <span key={i} style={{ color: '#f59e0b', fontSize: '1rem' }}>★</span>)}
                </div>
                <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #1a6bcc, #06d6a0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem', fontFamily: "'Playfair Display', serif" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0d1b2a' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#8796a9' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!user && (
        <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #0d1b2a, #1a6bcc)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,214,160,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🏥</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', marginBottom: '1rem' }}>
              Ready to Take Control<br />of Your Health?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
              Join thousands of patients already managing their healthcare with MediBook. Free to sign up, no credit card required.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: '#fff', color: '#1a6bcc', borderRadius: '999px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', transition: 'all 250ms' }}>
                🚀 Create Free Account
              </Link>
              <Link to="/doctors" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '999px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', transition: 'all 250ms' }}>
                👨‍⚕️ Browse Doctors
              </Link>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginTop: '1.5rem' }}>
              🔒 SSL Secured &nbsp;·&nbsp; 📱 PWA Ready &nbsp;·&nbsp; ⚡ Instant Setup
            </p>
          </div>
        </section>
      )}
    </>
  );
}

