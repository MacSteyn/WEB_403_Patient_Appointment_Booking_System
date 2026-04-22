import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import Doctors from './pages/Doctors';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import StayHealthy from './pages/StayHealthy';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <p>Loading MediBook...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/stay-healthy" element={<StayHealthy />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/book" element={<BookAppointment />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Only */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer style={{ background: '#0d1b2a', color: 'rgba(255,255,255,0.7)', paddingTop: '3rem', marginTop: 'auto' }}>
          <div className="container">

            {/* Top Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>

              {/* Brand */}
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
                  🏥 MediBook
                </div>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem', color: 'rgba(255,255,255,0.6)' }}>
                  Your trusted partner in managing healthcare appointments. Book, track, and stay healthy.
                </p>
                {/* Social Icons */}
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {[
                    { href: 'https://facebook.com', label: 'Facebook', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' },
                    { href: 'https://twitter.com', label: 'Twitter/X', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
                    { href: 'https://instagram.com', label: 'Instagram', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>' },
                    { href: 'https://youtube.com', label: 'YouTube', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>' },
                    { href: 'https://linkedin.com', label: 'LinkedIn', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>' },
                  ].map(social => (
                    <a key={social.label} href={social.href} target="_blank" rel="noreferrer" title={social.label}
                      style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', transition: 'all 200ms', textDecoration: 'none' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#1a6bcc'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                    >
                      <span style={{ width: 16, height: 16, display: 'flex' }} dangerouslySetInnerHTML={{ __html: social.svg }} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Links</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[{ label: 'Home', href: '/' }, { label: 'Find Doctors', href: '/doctors' }, { label: 'Book Appointment', href: '/book' }, { label: 'Stay Healthy', href: '/stay-healthy' }, { label: 'My Dashboard', href: '/dashboard' }].map(link => (
                    <li key={link.label}>
                      <a href={link.href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 150ms' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                      >→ {link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specialties */}
              <div>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Specialties</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['General Practice', 'Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'Psychiatry'].map(s => (
                    <li key={s}>
                      <a href={`/doctors?specialty=${s}`} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 150ms' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                      >→ {s}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contact Us</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { icon: '📍', text: '123 Health Street, Medical City' },
                    { icon: '📞', text: '+1 (555) 123-4567' },
                    { icon: '✉️', text: 'support@medibook.com' },
                    { icon: '🕐', text: 'Mon–Fri: 8AM – 8PM' },
                  ].map(item => (
                    <li key={item.icon} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', alignItems: 'flex-start' }}>
                      <span>{item.icon}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', flexWrap: 'wrap', gap: '0.75rem' }}>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                © 2025 <strong style={{ color: 'rgba(255,255,255,0.7)' }}>MediBook</strong>. All rights reserved.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                  <a key={item} href="#" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 150ms' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                  >{item}</a>
                ))}
              </div>
            </div>

          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
