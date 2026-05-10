import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [className, setClassName] = useState('');
  const [studentCount, setStudentCount] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [editCounts, setEditCounts] = useState({});
  const navigate = useNavigate();

  const API = 'http://localhost:8080/api/admin';

  useEffect(() => {
    if (localStorage.getItem('isAdmin')!== 'true') {
      navigate('/admin-login');
      return;
    }
    loadData();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
    navigate('/');
  };

  const loadData = async () => {
    try {
      const [classesRes, teachersRes] = await Promise.all([
        axios.get(`${API}/classes`),
        axios.get(`${API}/teachers`)
      ]);
      setClasses(classesRes.data);
      setTeachers(teachersRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
      alert('Failed to load data from backend');
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    
    if (!className ||!studentCount) return alert('Fill both fields');
    try {
      await axios.post(`${API}/classes`, {
        name: className,
        studentCount: parseInt(studentCount)
      });
      setClassName('');
      setStudentCount('');
      loadData();
    } catch (err) {
      alert('Failed to create class');
    }
  };

  const handleAssign = async () => {
    if (!selectedTeacher ||!selectedClass) return alert('Select teacher and class');
    try {
      await axios.put(`${API}/teachers/${selectedTeacher}/assign/${selectedClass}`);
      alert('Teacher assigned to class!');
      setSelectedTeacher('');
      setSelectedClass('');
    } catch (err) {
      alert('Failed to assign teacher');
    }
  };

  const handleUpdateCount = async (classId) => {
    const newCount = editCounts[classId];
    if (!newCount) return;
    try {
      await axios.patch(`${API}/classes/${classId}/students`, {
        count: parseInt(newCount)
      });
      loadData();
      setEditCounts({...editCounts, [classId]: ''});
    } catch (err) {
      alert('Failed to update count');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
        <h1>Admin Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      {/* Create Class Form */}
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h3>1. Create New Class</h3>
        <form onSubmit={handleCreateClass}>
          <input
            type="text"
            placeholder="Class Name: Form 3 East"
            value={className}
            onChange={e => setClassName(e.target.value)}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <input
            type="number"
            placeholder="Student Count"
            value={studentCount}
            onChange={e => setStudentCount(e.target.value)}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button type="submit">Create Class</button>
        </form>
      </div>

      {/* Assign Teacher to Class */}
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h3>2. Assign Teacher to Class</h3>
        <select
          value={selectedTeacher}
          onChange={e => setSelectedTeacher(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        >
          <option value="">Select Teacher</option>
          {teachers.map(t => (
            <option key={t.id} value={t.id}>{t.name} - {t.email}</option>
          ))}
        </select>

        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        >
          <option value="">Select Class</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button onClick={handleAssign}>Assign</button>
      </div>

      {/* List Classes + Edit Student Count */}
      <div style={{ border: '1px solid #ccc', padding: '15px' }}>
        <h3>3. All Classes</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Class Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Students</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Update Count</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(c => (
              <tr key={c.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{c.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{c.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{c.studentCount}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <input
                    type="number"
                    placeholder="New count"
                    value={editCounts[c.id] || ''}
                    onChange={e => setEditCounts({...editCounts, [c.id]: e.target.value})}
                    style={{ width: '80px', marginRight: '5px' }}
                  />
                  <button onClick={() => handleUpdateCount(c.id)}>Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;