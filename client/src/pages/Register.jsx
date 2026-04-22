import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', role: 'patient', dateOfBirth: '', address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (user) { navigate('/dashboard', { replace: true }); return null; }

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

    if (!form.email) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';

    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    else if (!/(?=.*[0-9])/.test(form.password)) errs.password = 'Password must contain at least one number';

    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';

    if (form.phone && !/^[\d\s\+\-\(\)]{7,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number';

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
      const { confirmPassword, ...submitData } = form;
      await register(submitData);
      toast.success('Account created! Welcome to MediBook 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, type = 'text', placeholder, required }) => (
    <div className={`form-group ${errors[name] ? 'form-group--has-error' : ''}`}>
      <label>{label}{required && ' *'}</label>
      <input
        type={type} name={name} placeholder={placeholder}
        value={form[name]} onChange={handleChange}
      />
      {errors[name] && <span className="form-group__error">⚠ {errors[name]}</span>}
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-page__left">
        <div>
          <h2>Join MediBook Today</h2>
          <p>Create your free account and start booking appointments with top-rated doctors in your area. Quick, easy, and secure.</p>
          <ul style={{ marginTop: '2rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['✅ Free to sign up', '✅ Verified doctors', '✅ Secure & private', '✅ Works on all devices'].map(item => (
              <li key={item} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="auth-page__right" style={{ overflowY: 'auto' }}>
        <div className="auth-page__form-box">
          <h1 className="auth-page__title">Create Account</h1>
          <p className="auth-page__subtitle">Fill in the details below to get started</p>

          <form onSubmit={handleSubmit} noValidate>
            <Field name="name" label="Full Name" placeholder="John Smith" required />
            <Field name="email" label="Email Address" type="email" placeholder="you@example.com" required />

            <div className="form-group">
              <label>Account Type *</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            <Field name="phone" label="Phone Number" placeholder="+1 (555) 000-0000" />
            <Field name="dateOfBirth" label="Date of Birth" type="date" />
            <Field name="address" label="Address" placeholder="123 Main St, City" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={`form-group ${errors.password ? 'form-group--has-error' : ''}`}>
                <label>Password *</label>
                <input type="password" name="password" placeholder="Min 6 chars + number" value={form.password} onChange={handleChange} autoComplete="new-password" />
                {errors.password && <span className="form-group__error">⚠ {errors.password}</span>}
              </div>
              <div className={`form-group ${errors.confirmPassword ? 'form-group--has-error' : ''}`}>
                <label>Confirm Password *</label>
                <input type="password" name="confirmPassword" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" />
                {errors.confirmPassword && <span className="form-group__error">⚠ {errors.confirmPassword}</span>}
              </div>
            </div>

            <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="divider" />
          <p className="text-center text-muted" style={{ fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1a6bcc', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
