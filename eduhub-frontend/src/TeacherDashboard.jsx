import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TeacherDashboard() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    // Safe loading with try/catch
    try {
      const storedAssignments = localStorage.getItem('assignments');
      const storedSubmissions = localStorage.getItem('submissions');
      
      setAssignments(storedAssignments ? JSON.parse(storedAssignments) : []);
      setSubmissions(storedSubmissions ? JSON.parse(storedSubmissions) : []);
    } catch (err) {
      console.error('Failed to parse localStorage:', err);
      setAssignments([]);
      setSubmissions([]);
    }
  }, []);

  const getSubmissionCount = (assignmentId) => {
    if (!Array.isArray(submissions)) return 0;
    return submissions.filter(s => s?.assignmentId == assignmentId).length;
  };

  const getSubmitters = (assignmentId) => {
    if (!Array.isArray(submissions)) return [];
    return submissions.filter(s => s?.assignmentId == assignmentId);
  };

  // Define complete button styles - no spreading to avoid warnings
  const btnBase = { padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' };
  
  const styles = {
    page: { minHeight: '100vh', background: '#0f172a', padding: '24px' },
    container: { maxWidth: '1000px', margin: '0 auto' },
    card: { border: '1px solid #334155', borderRadius: '12px', padding: '20px', marginBottom: '16px', background: '#1e293b' },
    header: { color: '#f97316', marginBottom: '24px' },
    btnGhost: { ...btnBase, background: 'transparent', color: '#f97316', border: '2px solid #f97316' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    text: { color: '#e2e8f0' },
    subtext: { color: '#94a3b8', fontSize: '14px' },
    badge: { background: '#f97316', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <h2 style={styles.header}>Assignment Status</h2>
          <button style={styles.btnGhost} onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        {assignments.length === 0 && (
          <div style={styles.card}>
            <p style={styles.text}>No assignments created yet. Go to /upload to create one.</p>
          </div>
        )}

        {assignments.map(a => {
          const count = getSubmissionCount(a?.id);
          const subs = getSubmitters(a?.id);
          
          return (
            <div key={a?.id || Math.random()} style={styles.card}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h3 style={{color: '#f97316', margin: '0 0 8px'}}>{a?.title || 'Untitled'}</h3>
                  <p style={styles.subtext}>
                    <span style={{color: '#f97316', fontWeight: '600'}}>{a?.grade || 'No Grade'}</span> • {a?.questions?.length || 0} questions • Created {a?.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <span style={styles.badge}>{count} Submitted</span>
              </div>

              {count > 0 && (
                <div style={{marginTop: '16px', borderTop: '1px solid #334155', paddingTop: '16px'}}>
                  <p style={{...styles.text, fontWeight: '600', marginBottom: '8px'}}>Students who submitted:</p>
                  {subs.map(s => (
                    <div key={s?.id || Math.random()} style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0'}}>
                      <span style={styles.text}>{s?.studentName || s?.studentEmail || 'Unknown'}</span>
                      <span style={styles.subtext}>
                        {s?.autoGraded ? `Auto-graded: ${s?.grade}%` : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {count === 0 && (
                <p style={{...styles.subtext, marginTop: '12px'}}>
                  No students have submitted yet. Share the /submit link.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeacherDashboard;