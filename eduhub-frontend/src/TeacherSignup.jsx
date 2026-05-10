import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function TeacherSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const signup = () => {
    if (!name ||!email ||!password ||!confirmPassword) {
      alert('Fill all fields');
      return;
    }
    if (password!== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    // Check if admin added this email
    const allowedTeachers = JSON.parse(localStorage.getItem('allowedTeachers') || '[]');
    const isAllowed = allowedTeachers.find(t => t.email.toLowerCase() === email.toLowerCase());

    if (!isAllowed) {
      alert('Your email was not added by admin. Contact admin to add your email first.');
      return;
    }

    // Check if already signed up
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    const exists = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      alert('Account already exists. Please login.');
      navigate('/teacher-login');
      return;
    }

    const newTeacher = {
      id: Date.now(),
      name: isAllowed.name,
      email: email,
      password: password
    };
    localStorage.setItem('teachers', JSON.stringify([...teachers, newTeacher]));
    localStorage.setItem('user', JSON.stringify({role: 'teacher',...newTeacher}));
    alert('Account created successfully');
    navigate('/upload');
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
        <h2 style={{color: '#001f3f', textAlign: 'center'}}>Teacher Sign Up</h2>
        <p style={{fontSize: '12px', color: '#666', textAlign: 'center'}}>Use the email admin added for you</p>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email (added by admin)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />
        <button onClick={signup} style={btnStyle}>Create Account</button>
        <p style={{textAlign: 'center', marginTop: '15px', fontSize: '12px'}}>
          <Link to="/teacher-login" style={{color: '#001f3f'}}>Already have account? Login</Link>
        </p>
      </div>
    </div>
  );
}

export default TeacherSignup;