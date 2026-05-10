import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GradeWork() {
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [user, setUser] = useState(null);
  const [gradingData, setGradingData] = useState({}); // Holds marks for each submission
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);
    if (!userData || userData.role!== 'teacher') {
      navigate('/');
      return;
    }

    const allAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const allSubs = JSON.parse(localStorage.getItem('submissions') || '[]');

    const myAssigns = allAssignments.filter(a => a.teacherEmail === userData.email);
    const myIds = myAssigns.map(a => a.id);
    const mySubs = allSubs.filter(s => myIds.includes(s.assignmentId));

    setAssignments(myAssigns);
    setSubmissions(mySubs);

    // Initialize gradingData for each submission
    const initialGrades = {};
    mySubs.forEach(sub => {
      const assignment = myAssigns.find(a => a.id === sub.assignmentId);
      const questionCount = assignment?.questions || 5;
      initialGrades[sub.id] = {
        marks: Array.from({ length: questionCount }, (_, i) => ({
          q: i + 1,
          correct: false,
          points: 0
        })),
        feedback: ''
      };
    });
    setGradingData(initialGrades);
  }, [navigate]);

  const toggleCorrect = (subId, qIndex) => {
    setGradingData(prev => ({
     ...prev,
      [subId]: {
       ...prev[subId],
        marks: prev[subId].marks.map((m, i) =>
          i === qIndex? {...m, correct:!m.correct } : m
        )
      }
    }));
  };

  const updatePoints = (subId, qIndex, points) => {
    setGradingData(prev => ({
     ...prev,
      [subId]: {
       ...prev[subId],
        marks: prev[subId].marks.map((m, i) =>
          i === qIndex? {...m, points: Number(points) || 0 } : m
        )
      }
    }));
  };

  const updateFeedback = (subId, feedback) => {
    setGradingData(prev => ({
     ...prev,
      [subId]: {
       ...prev[subId],
        feedback
      }
    }));
  };

  const saveGrade = (subId) => {
    const data = gradingData[subId];
    const totalGot = data.marks.reduce((sum, m) => sum + (m.correct? m.points : 0), 0);
    const totalPossible = data.marks.reduce((sum, m) => sum + m.points, 0);

    if (totalPossible === 0) {
      alert('Set points for at least one question');
      return;
    }

    const allSubs = JSON.parse(localStorage.getItem('submissions') || '[]');
    const updated = allSubs.map(s =>
      s.id === subId
       ? {
           ...s,
            grade: `${totalGot}/${totalPossible}`,
            feedback: data.feedback,
            marks: data.marks,
            gradedAt: new Date().toLocaleString()
          }
        : s
    );

    localStorage.setItem('submissions', JSON.stringify(updated));
    alert(`Grade saved: ${totalGot}/${totalPossible}`);

    // Refresh submissions to show saved state
    const myIds = assignments.map(a => a.id);
    setSubmissions(updated.filter(s => myIds.includes(s.assignmentId)));
  };

  const getAssignment = (id) => assignments.find(a => a.id === id);

  const cardStyle = {border: '2px solid #001f3f', padding: '20px', margin: '20px 0', borderRadius: '8px', background: '#fff'};
  const answerStyle = {background: '#f5f5f5', padding: '15px', whiteSpace: 'pre-wrap', borderRadius: '4px', margin: '10px 0'};
  const btnStyle = {background: '#ff851b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'};
  const inputStyle = {width: '60px', padding: '5px', marginLeft: '10px', border: '1px solid #001f3f', borderRadius: '4px'};

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{padding: '20px', maxWidth: '900px', margin: '0 auto'}}>
      <button onClick={() => navigate('/upload')} style={{...btnStyle, background: '#001f3f', marginBottom: '20px'}}>
        ← Back to Upload
      </button>
      <h2 style={{color: '#001f3f'}}>Grade Student Work</h2>

      {submissions.length === 0 && <p>No submissions yet for your assignments.</p>}

      {submissions.map(sub => {
        const assignment = getAssignment(sub.assignmentId);
        const data = gradingData[sub.id];
        if (!data) return null;

        const totalGot = data.marks.reduce((sum, m) => sum + (m.correct? m.points : 0), 0);
        const totalPossible = data.marks.reduce((sum, m) => sum + m.points, 0);

        return (
          <div key={sub.id} style={cardStyle}>
            <h3 style={{color: '#001f3f'}}>{assignment? assignment.text : 'Deleted Assignment'}</h3>
            <p><b>Student:</b> {sub.studentEmail} | <b>Submitted:</b> {sub.submittedAt}</p>

            <p><b>Student Answer:</b></p>
            <div style={answerStyle}>{sub.answer}</div>

            {sub.grade? (
              <div style={{color: 'green', fontWeight: 'bold', margin: '15px 0'}}>
                Graded: {sub.grade} - {sub.feedback} | {sub.gradedAt}
              </div>
            ) : (
              <>
                <p><b>Mark Questions:</b></p>
                {data.marks.map((mark, i) => (
                  <div key={i} style={{margin: '8px 0'}}>
                    <label>
                      <input
                        type="checkbox"
                        checked={mark.correct}
                        onChange={() => toggleCorrect(sub.id, i)}
                      /> Q{mark.q} Correct
                    </label>
                    <input
                      type="number"
                      placeholder="pts"
                      value={mark.points}
                      onChange={e => updatePoints(sub.id, i, e.target.value)}
                      style={inputStyle}
                    /> pts
                  </div>
                ))}

                <p style={{fontWeight: 'bold', marginTop: '10px'}}>
                  Total: {totalGot} / {totalPossible}
                </p>

                <textarea
                  placeholder="Feedback for student"
                  value={data.feedback}
                  onChange={e => updateFeedback(sub.id, e.target.value)}
                  rows={3}
                  style={{width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box'}}
                />

                <button onClick={() => saveGrade(sub.id)} style={btnStyle}>
                  Save Grade
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default GradeWork;