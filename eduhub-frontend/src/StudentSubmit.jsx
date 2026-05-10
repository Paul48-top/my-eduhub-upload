import { useState, useEffect } from 'react';

function StudentSubmit() {
  const [email, setEmail] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('assignments')) || [];
    setAssignments(saved);
  }, []);

  const selectedAssignment = assignments.find(a => a.id == selectedId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !selectedId) return alert('Fill all fields');

    let score = 0;
    selectedAssignment.questions.forEach(q => {
      if (answers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        score++;
      }
    });

    const percent = Math.round((score / selectedAssignment.questions.length) * 100);

    const submission = {
      id: Date.now(),
      email,
      assignmentId: selectedId,
      assignment: selectedAssignment.title,
      answers,
      score,
      total: selectedAssignment.questions.length,
      grade: percent,
      feedback: `Auto-graded: ${score}/${selectedAssignment.questions.length}`,
      autoGraded: true
    };

    const allSubs = JSON.parse(localStorage.getItem('submissions')) || [];
    localStorage.setItem('submissions', JSON.stringify([...allSubs, submission]));
    alert(`Done! You scored ${percent}%`);
    setAnswers({});
    setSelectedId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Submit Assignment</h2>
      <input placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} />
      
      <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
        <option value="">Pick Assignment</option>
        {assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
      </select>

      {selectedAssignment?.questions.map(q => (
        <div key={q.id}>
          <p>{q.text}</p>
          {q.type === 'mcq' ? (
            q.options.map(opt => (
              <label key={opt}>
                <input 
                  type="radio" 
                  name={q.id} 
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
                /> {opt}
              </label>
            ))
          ) : (
            <input 
              type="text" 
              value={answers[q.id] || ''}
              onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
            />
          )}
        </div>
      ))}

      {selectedId && <button type="submit">Submit & Auto-Grade</button>}
    </form>
  );
}

export default StudentSubmit;