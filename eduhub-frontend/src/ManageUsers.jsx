import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageUsers() {
  const [classes, setClasses] = useState([]);
  const [allowedTeachers, setAllowedTeachers] = useState([]);
  const [className, setClassName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role!== 'admin') navigate('/admin-login');
    setClasses(JSON.parse(localStorage.getItem('classes') || '[]'));
    setAllowedTeachers(JSON.parse(localStorage.getItem('allowedTeachers') || '[]'));
  }, [navigate]);

  const addClass = () => {
    if (!className.trim()) {
      alert('Enter class name');
      return;
    }
    const newClass = {id: Date.now(), name: className.trim()};
    const updated = [...classes, newClass];
    setClasses(updated);
    localStorage.setItem('classes', JSON.stringify(updated));
    setClassName('');
    alert('Class added');
  };

  const addTeacherEmail = () => {
    if (!teacherName.trim() ||!teacherEmail.trim()) {
      alert('Fill name and email');
      return;
    }
    const exists = allowedTeachers.find(t => t.email === teacherEmail.trim());
    if (exists) {
      alert('Email already added');
      return;
    }
    const newTeacher = {
      id: Date.now(),
      name: teacherName.trim(),
      email: teacherEmail.trim()
    };
    const updated = [...allowedTeachers, newTeacher];
    setAllowedTeachers(updated);
    localStorage.setItem('allowedTeachers', JSON.stringify(updated));
    setTeacherName('');
    setTeacherEmail('');
    alert('Teacher added. They can now sign up at /teacher-signup');
  };

  const deleteClass = (id) => {
    const updated = classes.filter(c => c.id!== id);
    setClasses(updated);
    localStorage.setItem('classes', JSON.stringify(updated));
  };

  const deleteTeacherEmail = (id) => {
    const updated = allowedTeachers.filter(t => t.id!== id);
    setAllowedTeachers(updated);
    localStorage.setItem('allowedTeachers', JSON.stringify(updated));
  };

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #001f3f 0%, #001f3f 40%, #ff851b 40%, #ff851b 70%, #d3d3d3 70%, #d3d3d3 100%)',
    padding: '20px'
  };

  const boxStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    maxWidth: '600px',
    margin: '20px auto',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '8px 0',
    border: '1px solid #001f3f',
    borderRadius: '4px',
    boxSizing: 'border-box'
  };

  const btnStyle = {
    background: '#001f3f',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px'
  };

  const backBtnStyle = {
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px'
  };

  return (
    <div style={pageStyle}>
      <div style={{maxWidth: '600px', margin: '0 auto', marginBottom: '20px'}}>
        <button onClick={() => navigate('/')} style={backBtnStyle}>← Back to Home</button>
        <button onClick={logout} style={{...backBtnStyle, background: '#ff4136'}}>Logout</button>
      </div>

      <h1 style={{color: '#fff', textAlign: 'center', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>Admin Dasboard - {JSON.parse(localStorage.getItem('user') || '{}').name }</h1>

      <div style={boxStyle}>
        <h2 style={{color: '#001f3f'}}>Add Classes</h2>
        <input
          type="text"
          placeholder="Class Name e.g Grade 6"
          value={className}
          onChange={e => setClassName(e.target.value)}
          style={inputStyle}
        />
        <button onClick={addClass} style={btnStyle}>Add Class</button>
        <ul style={{listStyle: 'none', padding: 0, marginTop: '20px'}}>
          {classes.length === 0? (
            <li style={{padding: '10px', color: '#666'}}>No classes added yet</li>
          ) : (
            classes.map(c => (
              <li key={c.id} style={{padding: '10px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between'}}>
                {c.name}
                <button onClick={() => deleteClass(c.id)} style={{...btnStyle, background: '#ff4136', padding: '5px 10px'}}>Delete</button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div style={boxStyle}>
        <h2 style={{color: '#001f3f'}}>Add Teachers</h2>
        <p style={{fontSize: '12px', color: '#666'}}>Add teacher name + email. They will create their own password at signup.</p>
        <input
          type="text"
          placeholder="Teacher Name"
          value={teacherName}
          onChange={e => setTeacherName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Teacher Email"
          value={teacherEmail}
          onChange={e => setTeacherEmail(e.target.value)}
          style={inputStyle}
        />
        <button onClick={addTeacherEmail} style={btnStyle}>Add Teacher</button>
        <ul style={{listStyle: 'none', padding: 0, marginTop: '20px'}}>
          {allowedTeachers.length === 0? (
            <li style={{padding: '10px', color: '#666'}}>No teachers added yet</li>
          ) : (
            allowedTeachers.map(t => (
              <li key={t.id} style={{padding: '10px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between'}}>
                {t.name} - {t.email}
                <button onClick={() => deleteTeacherEmail(t.id)} style={{...btnStyle, background: '#ff4136', padding: '5px 10px'}}>Remove</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default ManageUsers;