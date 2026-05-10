import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function TeacherLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = () => {
    if (!email || !password) {
      alert('Fill all fields');
      return;
    }

    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    const teacher = teachers.find(t => t.email.toLowerCase() === email.toLowerCase() && t.password === password);

    if (teacher) {
      localStorage.setItem('user', JSON.stringify({...teacher, role: 'teacher'}));
      navigate('/upload');
    } else {
      alert('Invalid email or password');
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
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
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
    background: '#ff851b',
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
      <button
        onClick={() => navigate('/')}
        style={{position: 'fixed', top: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer'}}
      >
        ← Back to Home
      </button>

      <div style={boxStyle}>
        <h2 style={{color: '#001f3f', textAlign: 'center'}}>Teacher Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button onClick={login} style={btnStyle}>Login</button>
        <p style={{textAlign: 'center', marginTop: '15px', fontSize: '12px'}}>
          <Link to="/teacher-signup" style={{color: '#001f3f'}}>Don't have account? Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default TeacherLogin;