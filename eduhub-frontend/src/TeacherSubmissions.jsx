import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TeacherSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role!== 'teacher') {
      navigate('/teacher-login');
      return;
    }

    const allSubs = JSON.parse(localStorage.getItem('submissions') || '[]');
    const allAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');

    // Only show submissions for this teacher's assignments
    const myAssignmentIds = allAssignments
    .filter(a => a.teacherEmail === user.email)
    .map(a => a.id);

    const mySubs = allSubs.filter(s => myAssignmentIds.includes(s.assignmentId));

    setSubmissions(mySubs);
    setAssignments(allAssignments);
  }, [navigate]);

  const downloadFile = (file) => {
    if (!file ||!file.data) {
      alert('No file attached');
      return;
    }
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  const getAssignmentTitle = (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    return assignment? assignment.title : 'Deleted Assignment';
  };

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #001f3f 0%, #001f3f 40%, #ff851b 40%, #ff851b 70%, #d3d3d3 70%, #d3d3d3 100%)',
    padding: '20px'
  };

  const boxStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    maxWidth: '700px',
    margin: '20px auto',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
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

  const downloadBtnStyle = {
    background: '#001f3f',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px'
  };

  return (
    <div style={pageStyle}>
      <div style={{maxWidth: '700px', margin: '0 auto', marginBottom: '20px'}}>
        <button onClick={() => navigate('/upload')} style={backBtnStyle}>← Back to Post Assignment</button>
        <button onClick={() => navigate('/')} style={backBtnStyle}>Home</button>
      </div>

      <h1 style={{color: '#fff', textAlign: 'center', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
        Student Submissions
      </h1>

      {submissions.length === 0? (
        <div style={boxStyle}><p>No submissions yet for your assignments</p></div>
      ) : (
        submissions.map(sub => (
          <div key={sub.id} style={boxStyle}>
            <h3 style={{color: '#001f3f'}}>{getAssignmentTitle(sub.assignmentId)}</h3>
            <p style={{fontSize: '14px', color: '#666'}}><b>Class:</b> {sub.className}</p>

            {/* THIS IS THE LINE - ADD BOTH NAME AND EMAIL */}
            <p><strong>Student:</strong> {sub.studentName || 'No name'} - {sub.studentEmail || sub.email || 'No email'}</p>

            <p><strong>Submitted:</strong> {sub.submittedAt}</p>
            <p><strong>Auto-Grade:</strong> {sub.grade}% - {sub.feedback}</p>
            <p><strong>Score:</strong> {sub.score}/{sub.total}</p>

            <div style={{background: '#f5f5f5', padding: '10px', borderRadius: '4px', margin: '10px 0'}}>
              <p style={{fontWeight: 'bold', margin: '0 0 5px'}}>Student Answers:</p>
              <pre style={{margin: 0, whiteSpace: 'pre-wrap', fontSize: '12px'}}>
                {JSON.stringify(sub.answers, null, 2)}
              </pre>
            </div>

            {sub.file && sub.file.data && (
              <button
                onClick={() => downloadFile(sub.file)}
                style={downloadBtnStyle}
              >
                Download {sub.file.name}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default TeacherSubmissions;