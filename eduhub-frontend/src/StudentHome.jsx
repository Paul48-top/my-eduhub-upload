import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function StudentHome() {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const storedClasses = JSON.parse(localStorage.getItem('classes') || '[]');
    const storedAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    setClasses(storedClasses);
    setAssignments(storedAssignments);
  }, []);

  const getAssignmentCount = (className) => {
    return assignments.filter((assignment) => assignment.className === className).length;
  };

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #001f3f 0%, #001f3f 40%, #ff851b 40%, #ff851b 70%, #d3d3d3 70%, #d3d3d3 100%)',
    padding: '20px'
  };

  const contentStyle = {
    maxWidth: '800px',
    margin: '0 auto'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '25px',
    margin: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    textDecoration: 'none',
    color: '#333',
    display: 'block'
  };

  const titleStyle = {
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    textAlign: 'center'
  };

  const gradeStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: '#001f3f'
  };

  const countStyle = {
    background: '#ff851b',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'inline-block'
  };

  const adminLoginStyle = {
    position: 'fixed',
    top: '20px',
    right: '150px',
    background: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
  };



  const teacherLoginStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'rgba(255, 133, 27, 0.9)',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
  };

  const teacherSignupStyle = {
    position: 'fixed',
    top: '70px',
    right: '20px',
    background: 'rgba(255, 133, 27, 0.9)',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
  };

  const linkBtnStyle = {
    textDecoration: 'none',
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.6)',
    padding: '10px 18px',
    borderRadius: '6px',
    display: 'inline-block',
    fontSize: '14px'
  };

  return (
    <>
      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <Link to="/my-grades" style={linkBtnStyle}>Check My Grades →</Link>
      </div>
      
      <div style={pageStyle}>
      <Link to="/admin-login" style={adminLoginStyle}>Admin Login</Link>
      <Link to="/teacher-login" style={teacherLoginStyle}>Teacher Login</Link>
      <Link to="/teacher-signup" style={teacherSignupStyle}>Teacher Signup</Link>

      <div style={contentStyle}>
        <h1 style={titleStyle}>Select Your Class</h1>
        <p style={{textAlign: 'center', color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
          Click your grade to view all assignments
        </p>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px', marginTop: '30px'}}>
          {classes.length === 0? (
            <div style={{...cardStyle, gridColumn: '1 / -1'}}>
              <p>No classes available yet</p>
            </div>
          ) : (
            classes.map((classItem) => {
              const count = getAssignmentCount(classItem.name);
              return (
                <Link
                  key={classItem.id}
                  to={`/class/${classItem.name.replace(/\s+/g, '-')}`}
                  style={cardStyle}
                >
                  <div>
                    <div style={gradeStyle}>{classItem.name}</div>
                    <div style={countStyle}>
                      {count} {count === 1? 'Assignment' : 'Assignments'}
                    </div>
                    <p style={{color: '#001f3f', margin: '12px 0 0', fontWeight: 'bold'}}>
                      View Assignments →
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default StudentHome;