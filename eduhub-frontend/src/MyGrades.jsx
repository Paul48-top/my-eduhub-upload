import { useState } from 'react';
import { Link } from 'react-router-dom';

function MyGrades() {
  const [email, setEmail] = useState('');
  const [grades, setGrades] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleCheckGrades = () => {
    if (!email.trim()) {
      alert('Enter your email');
      return;
    }

    const allSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    const mySubs = allSubmissions.filter(
      s => s.studentEmail?.toLowerCase() === email.toLowerCase()
    );

    setGrades(mySubs);
    setSearched(true);
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
    padding: '25px',
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
    background: '#ff851b',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%'
  };

  const gradeColor = (percent) => {
    if (percent >= 80) return '#28a745'; // green
    if (percent >= 60) return '#ff851b'; // orange
    return '#dc3545'; // red
  };

  return (
    <div style={pageStyle}>
      <Link to="/" style={{color: '#fff', textDecoration: 'none', fontWeight: 'bold'}}>← Back to Classes</Link>

      <h1 style={{color: '#fff', textAlign: 'center', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
        My Grades
      </h1>

      <div style={boxStyle}>
        <h3 style={{color: '#001f3f'}}>Check Your Grades</h3>
        <p style={{fontSize: '14px', color: '#666'}}>Enter the email you used when submitting assignments</p>
        <input
          type="email"
          placeholder="your.email@gmail.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCheckGrades()}
          style={inputStyle}
        />
        <button onClick={handleCheckGrades} style={btnStyle}>
          View My Grades
        </button>
      </div>

      {searched && (
        <div style={boxStyle}>
          {grades.length === 0? (
            <p>No grades found for {email}. Make sure you used this email when submitting.</p>
          ) : (
            <>
              <h3 style={{color: '#001f3f'}}>Your Submissions</h3>
              {grades.map(sub => (
                <div key={sub.id} style={{
                  border: '2px solid #ddd',
                  borderLeft: `6px solid ${gradeColor(sub.grade)}`,
                  padding: '15px',
                  margin: '10px 0',
                  borderRadius: '4px'
                }}>
                  <h4 style={{margin: '0 0 8px', color: '#001f3f'}}>{sub.assignment}</h4>
                  <p style={{margin: '4px 0', fontSize: '14px'}}><b>Class:</b> {sub.className}</p>
                  <p style={{margin: '4px 0', fontSize: '14px'}}><b>Submitted:</b> {sub.submittedAt}</p>
                  <p style={{margin: '4px 0', fontSize: '18px', fontWeight: 'bold', color: gradeColor(sub.grade)}}>
                    Grade: {sub.grade}% ({sub.score}/{sub.total})
                  </p>
                  {sub.feedback && (
                    <p style={{margin: '8px 0 0', fontSize: '14px', background: '#f5f5f5', padding: '8px', borderRadius: '4px'}}>
                      <b>Feedback:</b> {sub.feedback}
                    </p>
                  )}
                  {sub.autoGraded && (
                    <span style={{fontSize: '12px', color: '#666'}}>✓ Auto-graded</span>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MyGrades;