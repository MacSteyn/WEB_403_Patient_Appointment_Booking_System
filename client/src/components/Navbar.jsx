import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar__inner">
          <Link to="/" className="navbar__brand">
            🏥 <span>Medi</span>Book
          </Link>

          <ul className="navbar__links">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/doctors">Doctors</NavLink></li>
            {user && <li><NavLink to="/dashboard">Dashboard</NavLink></li>}
            {user && <li><NavLink to="/book">Book Appointment</NavLink></li>}
            {user?.role === 'admin' && <li><NavLink to="/admin">Admin</NavLink></li>}
          </ul>

          <div className="navbar__actions">
            {user ? (
              <>
                <Link to="/profile" className="btn btn--ghost btn--sm">
                  👤 {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="btn btn--outline btn--sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost btn--sm">Login</Link>
                <Link to="/register" className="btn btn--primary btn--sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
