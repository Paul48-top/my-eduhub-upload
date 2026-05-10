import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ClassPage() {
  const { className } = useParams();
  const decodedClass = className.replace(/-/g, ' ');
  const [assignments, setAssignments] = useState([]);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentName, setStudentName] = useState('');
  const [answers, setAnswers] = useState({});
  const [submissionFile, setSubmissionFile] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  useEffect(() => {
    const allAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    // TeacherUpload saves {grade: "Grade 7"}, not className
    setAssignments(allAssignments.filter(a => a.grade === decodedClass));
  }, [decodedClass]);

  const handleAnswerChange = (assignmentId, questionId, value) => {
    setAnswers(prev => ({
     ...prev,
      [assignmentId]: {
       ...prev[assignmentId],
        [questionId]: value
      }
    }));
  };

  const handleSubmissionFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubmissionFile({
          name: file.name,
          type: file.type,
          data: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const submitAssignment = (assignment) => {
    if (!studentEmail ||!studentName) {
      alert('Enter your name and email');
      return;
    }

    // Auto-grade MCQ + text questions
    let score = 0;
    const assignmentAnswers = answers[assignment.id] || {};

    assignment.questions.forEach(q => {
      const studentAns = assignmentAnswers[q.id]?.trim().toLowerCase() || '';
      const correctAns = q.correctAnswer.trim().toLowerCase();
      if (studentAns === correctAns && studentAns!== '') {
        score++;
      }
    });

    const percent = assignment.questions.length > 0
     ? Math.round((score / assignment.questions.length) * 100)
      : 0;

    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    const newSubmission = {
      id: Date.now(),
      assignmentId: assignment.id,
      assignment: assignment.title,
      className: decodedClass,
      studentName: studentName,
      studentEmail: studentEmail, // <-- Added for MyGrades.jsx
      answers: assignmentAnswers,
      file: submissionFile,
      score: score,
      total: assignment.questions.length,
      grade: percent,
      feedback: `Auto-graded: ${score}/${assignment.questions.length}`,
      autoGraded: true,
      submittedAt: new Date().toLocaleString()
    };

    localStorage.setItem('submissions', JSON.stringify([...submissions, newSubmission]));

    // Reset
    setAnswers(prev => ({...prev, [assignment.id]: {}}));
    setSubmissionFile(null);
    setStudentEmail('');
    setStudentName('');
    setSelectedAssignmentId(null);
    const fileInput = document.getElementById(`file-${assignment.id}`);
    if (fileInput) fileInput.value = '';

    alert(`Submitted! You scored ${percent}%`);
  };

  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
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
    marginTop: '10px',
    fontWeight: 'bold'
  };

  return (
    <div style={pageStyle}>
      <Link to="/" style={{color: '#fff', textDecoration: 'none', fontWeight: 'bold'}}>← Back to Classes</Link>

      <h1 style={{color: '#fff', textAlign: 'center', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
        {decodedClass} - Assignments
      </h1>

      {assignments.length === 0? (
        <div style={boxStyle}><p>No assignments yet for {decodedClass}</p></div>
      ) : (
        assignments.map(assignment => (
          <div key={assignment.id} style={boxStyle}>
            <h3 style={{color: '#001f3f'}}>{assignment.title}</h3>
            <p style={{fontSize: '12px', color: '#666'}}>Posted: {new Date(assignment.createdAt).toLocaleString()}</p>

            {/* Show questions from TeacherUpload */}
            {assignment.questions && assignment.questions.map((q, i) => (
              <div key={q.id} style={{margin: '15px 0', padding: '10px', border: '1px solid #ddd', borderRadius: '4px'}}>
                <p><b>Q{i+1}: {q.text}</b></p>
                {q.type === 'mcq'? (
                  q.options.map(opt => (
                    <label key={opt} style={{display: 'block', margin: '5px 0'}}>
                      <input
                        type="radio"
                        name={`${assignment.id}-${q.id}`}
                        value={opt}
                        checked={answers[assignment.id]?.[q.id] === opt}
                        onChange={e => handleAnswerChange(assignment.id, q.id, e.target.value)}
                      /> {opt}
                    </label>
                  ))
                ) : (
                  <input
                    type="text"
                    placeholder="Your answer"
                    value={answers[assignment.id]?.[q.id] || ''}
                    onChange={e => handleAnswerChange(assignment.id, q.id, e.target.value)}
                    style={inputStyle}
                  />
                )}
              </div>
            ))}

            <div style={{borderTop: '2px solid #ff851b', marginTop: '20px', paddingTop: '15px'}}>
              <h4 style={{color: '#001f3f'}}>Submit Your Work</h4>
              <input
                type="text"
                placeholder="Your Full Name"
                value={selectedAssignmentId === assignment.id? studentName : ''}
                onChange={e => {
                  setStudentName(e.target.value);
                  setSelectedAssignmentId(assignment.id);
                }}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Your Email - use this to check grades"
                value={selectedAssignmentId === assignment.id? studentEmail : ''}
                onChange={e => {
                  setStudentEmail(e.target.value);
                  setSelectedAssignmentId(assignment.id);
                }}
                style={inputStyle}
              />
              <label style={{fontSize: '12px', color: '#666'}}>Optional: Attach file</label>
              <input
                id={`file-${assignment.id}`}
                type="file"
                onChange={(e) => {
                  handleSubmissionFile(e);
                  setSelectedAssignmentId(assignment.id);
                }}
                style={{width: '100%', padding: '8px', margin: '8px 0'}}
              />
              <button onClick={() => submitAssignment(assignment)} style={btnStyle}>
                Submit & Auto-Grade
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ClassPage;