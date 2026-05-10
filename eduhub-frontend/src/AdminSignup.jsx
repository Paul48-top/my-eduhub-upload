import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // If admin already exists, kick them to login
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (admin) navigate('/admin-login');
  }, [navigate]);

  const signup = () => {
    if (!name ||!email ||!password) {
      alert('Fill all fields');
      return;
    }

    // Only 1 admin allowed
    const admin = {name, email, password, role: 'admin'};
    localStorage.setItem('admin', JSON.stringify(admin));
    localStorage.setItem('user', JSON.stringify(admin));
    navigate('/admin');
  };

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #001f3f 0%, #001f3f 40%, #ff851b 40%, #ff851b 70%, #d3d3d3 70%, #d3d3d3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const boxStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: '8px',
    width: '300px'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #001f3f',
    borderRadius: '4px',
    boxSizing: 'border-box'
  };

  const btnStyle = {
    background: '#001f3f',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 'bold'
  };

  return (
    <div style={pageStyle}>
      <div style={boxStyle}>
        <h2 style={{color: '#001f3f', textAlign: 'center'}}>Create Admin Account</h2>
        <p style={{fontSize: '12px', textAlign: 'center'}}>First time setup - only 1 admin allowed</p>
        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
        <button onClick={signup} style={btnStyle}>Create Admin</button>
      </div>
    </div>
  );
}

export default AdminSignup;