import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Enter email');
      return;
    }
    
    // Save user to localStorage
    localStorage.setItem('user', JSON.stringify({ email, role }));
    
    // Send them to right page
    if (role === 'teacher') {
      navigate('/upload');
    } else {
      navigate('/submit');
    }
  };

  const btnStyle = {background: '#ff851b', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%'};

  return (
    <div style={{padding: '50px', maxWidth: '400px', margin: '50px auto', background: '#001f3f', color: '#fff', borderRadius: '8px'}}>
      <h2 style={{textAlign: 'center'}}>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{width: '100%', padding: '10px', marginBottom: '15px', boxSizing: 'border-box'}}
        />
        <select 
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{width: '100%', padding: '10px', marginBottom: '15px'}}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button type="submit" style={btnStyle}>Login</button>
      </form>
    </div>
  );
}

export default Login;