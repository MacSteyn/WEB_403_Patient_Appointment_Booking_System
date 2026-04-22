import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (form.phone && !/^[\d\s\+\-\(\)]{7,15}$/.test(form.phone)) errs.phone = 'Invalid phone number';
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
      const { data } = await api.put('/auth/profile', form);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const roleBadgeColor = { patient: '#1a6bcc', doctor: '#06d6a0', admin: '#ef476f' };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Profile</h1>

        <div className="card">
          {/* Avatar + Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e9eef5' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#e8f0fb', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#1a6bcc',
              fontFamily: 'Playfair Display, serif',
            }}>
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{user?.name}</h2>
              <p style={{ color: '#8796a9', fontSize: '0.9rem', marginBottom: '8px' }}>{user?.email}</p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', padding: '2px 12px',
                borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600,
                background: `${roleBadgeColor[user?.role]}22`,
                color: roleBadgeColor[user?.role],
              }}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
            </div>
          </div>

          {/* Profile Info / Edit Form */}
          {!editing ? (
            <div>
              {[
                { label: 'Full Name', value: user?.name },
                { label: 'Email', value: user?.email },
                { label: 'Phone', value: user?.phone || '—' },
                { label: 'Date of Birth', value: user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '—' },
                { label: 'Address', value: user?.address || '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f0f4f8' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8796a9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                  <span style={{ fontSize: '0.95rem', color: '#0d1b2a' }}>{value}</span>
                </div>
              ))}
              <button className="btn btn--primary" style={{ marginTop: '1.5rem' }} onClick={() => setEditing(true)}>
                ✏️ Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {[
                { name: 'name', label: 'Full Name', type: 'text' },
                { name: 'phone', label: 'Phone Number', type: 'tel' },
                { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
                { name: 'address', label: 'Address', type: 'text' },
              ].map(({ name, label, type }) => (
                <div key={name} className={`form-group ${errors[name] ? 'form-group--has-error' : ''}`}>
                  <label>{label}</label>
                  <input type={type} name={name} value={form[name]} onChange={handleChange} />
                  {errors[name] && <span className="form-group__error">⚠ {errors[name]}</span>}
                </div>
              ))}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn--primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
