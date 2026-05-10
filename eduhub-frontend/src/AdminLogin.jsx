import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // If no admin exists, send to signup
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (!admin) navigate('/admin-signup');
  }, [navigate]);

  const login = () => {
    const admin = JSON.parse(localStorage.getItem('admin'));

    if (admin && admin.email.toLowerCase() === email.toLowerCase() && admin.password === password) {
      localStorage.setItem('user', JSON.stringify({...admin, role: 'admin'}));
      navigate('/admin');
    } else {
      alert('Invalid admin credentials');
    }
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
      <button onClick={() => navigate('/')} style={{position: 'fixed', top: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer'}}>
        ← Back to Home
      </button>
      <div style={boxStyle}>
        <h2 style={{color: '#001f3f', textAlign: 'center'}}>Admin Login</h2>
        <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
        <button onClick={login} style={btnStyle}>Login</button>
      </div>
    </div>
  );
}

export default AdminLogin;