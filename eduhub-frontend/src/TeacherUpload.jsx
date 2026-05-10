import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TeacherUpload() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState('');
  const [availableGrades, setAvailableGrades] = useState([]);
  const [questions, setQuestions] = useState([
    { id: 1, text: '', type: 'mcq', options: ['', ''], correctAnswer: '' }
  ]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    if (!userData || userData.role!== 'teacher') {
      navigate('/teacher-login');
      return;
    }
    setUser(userData);

    // Load grades that admin added
    const adminClasses = JSON.parse(localStorage.getItem('classes') || '[]');
    setAvailableGrades(adminClasses);
    if (adminClasses.length > 0) {
      setGrade(adminClasses[0].name); // Default to first grade
    }
  }, [navigate]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(event.target.result);
          setTitle(data.title || '');
          setGrade(data.grade || availableGrades[0]?.name || '');
          setQuestions(data.questions || []);
          alert('JSON imported!');
        } else if (file.name.endsWith('.csv')) {
          const lines = event.target.result.split('\n').filter(l => l.trim());
          if (lines.length < 2) throw new Error('CSV empty');
          const parsedQuestions = lines.slice(1).map((line, i) => {
            const values = line.split(',').map(v => v.trim());
            const q = { id: Date.now() + i, text: values[0] || '', type: values[1] || 'mcq' };
            if (q.type === 'mcq') {
              q.options = values.slice(2, -1).filter(v => v);
              q.correctAnswer = values[values.length - 1] || '';
            } else {
              q.correctAnswer = values[2] || '';
              q.options = [];
            }
            return q;
          });
          setQuestions(parsedQuestions);
          alert('CSV imported! Select the grade.');
        }
      } catch (err) {
        console.error(err);
        alert('File error: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const addQuestion = () => setQuestions([...questions, { id: Date.now(), text: '', type: 'mcq', options: ['', ''], correctAnswer: '' }]);
  const updateQuestion = (id, field, value) => setQuestions(questions.map(q => q.id === id? {...q, [field]: value } : q));
  const updateOption = (qId, i, v) => setQuestions(questions.map(q => q.id === qId? {...q, options: q.options.map((opt, idx) => idx === i? v : opt)} : q));
  const addOption = (qId) => setQuestions(questions.map(q => q.id === qId? {...q, options: [...q.options, ''] } : q));
  const removeQuestion = (id) => setQuestions(questions.filter(q => q.id!== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title ||!grade) return alert('Enter title and select grade');
    for (let q of questions) {
      if (!q.text ||!q.correctAnswer) return alert('Fill all questions + answers');
      if (q.type === 'mcq' && q.options.some(opt =>!opt)) return alert('Fill all options');
    }
    try {
      const assignment = {
        id: Date.now(),
        title,
        grade, // <-- This now comes from admin's list
        questions,
        teacherEmail: user.email, // <-- So teacher can see submissions
        createdAt: new Date().toISOString()
      };
      const existing = JSON.parse(localStorage.getItem('assignments') || '[]');
      localStorage.setItem('assignments', JSON.stringify([...existing, assignment]));
      alert(`Assignment created for ${grade}!`);
      setTitle('');
      setGrade(availableGrades[0]?.name || '');
      setQuestions([{ id: 1, text: '', type: 'mcq', options: ['', ''], correctAnswer: '' }]);
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const baseButton = { padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', marginRight: '8px', fontWeight: '600', fontSize: '15px', border: 'none' };

  const styles = {
    page: { minHeight: '100vh', background: '#0f172a', padding: '24px' },
    container: { maxWidth: '900px', margin: '0 auto' },
    card: { border: '1px solid #334155', borderRadius: '12px', padding: '20px', marginBottom: '16px', background: '#1e293b' },
    header: { color: '#f97316', marginBottom: '16px' },
    input: { width: '100%', padding: '12px', border: '2px solid #475569', borderRadius: '8px', margin: '8px 0', fontSize: '15px', background: '#0f172a', color: '#e2e8f0' },
    select: { width: '100%', padding: '12px', border: '2px solid #475569', borderRadius: '8px', margin: '8px 0', background: '#0f172a', color: '#e2e8f0' },
    btnPrimary: {...baseButton, background: '#f97316', color: 'white' },
    btnDanger: {...baseButton, background: '#dc2626', color: 'white' },
    btnSecondary: {...baseButton, background: '#334155', color: '#e2e8f0', border: '2px solid #475569' },
    btnGhost: {...baseButton, background: 'transparent', color: '#f97316', border: '2px solid #f97316' },
    btnGrey: {...baseButton, background: '#334155', color: '#e2e8f0' },
    uploadBox: { border: '2px dashed #f97316', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px', background: '#1e293b' },
    flex: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    correctAnswer: { background: '#1e293b', borderColor: '#f97316' },
    label: { color: '#cbd5e1', fontWeight: '600', fontSize: '14px' },
    subtext: { color: '#94a3b8', fontSize: '14px' },
    row: { display: 'flex', gap: '12px' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <h2 style={styles.header}>Create Assignment</h2>
          <div>
            <button style={styles.btnGrey} onClick={() => navigate('/teacher-dashboard')}>
              View Submissions
            </button>
            <button style={styles.btnGhost} onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </div>

        <div style={styles.uploadBox}>
          <h3 style={{color: '#f97316'}}>Import from File</h3>
          <input type="file" accept=".json,.csv" onChange={handleFileUpload} style={{color: '#e2e8f0'}} />
          <p style={styles.subtext}>Upload JSON or CSV with questions + correct answers</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <input
              style={{...styles.input, flex: 2}}
              placeholder="Assignment Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <select
              style={{...styles.select, flex: 1}}
              value={grade}
              onChange={e => setGrade(e.target.value)}
            >
              {availableGrades.length === 0? (
                <option value="">No grades added by admin</option>
              ) : (
                availableGrades.map(g => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))
              )}
            </select>
          </div>

          {availableGrades.length === 0 && (
            <p style={{color: '#dc2626', marginBottom: '16px'}}>
              Admin has not added any grades yet. Contact admin to add grades in /manage-users
            </p>
          )}

          {questions.map((q, i) => (
            <div key={q.id} style={styles.card}>
              <div style={styles.flex}>
                <h4 style={{color: '#f97316'}}>Question {i + 1}</h4>
                {questions.length > 1 &&
                  <button type="button" style={styles.btnDanger} onClick={() => removeQuestion(q.id)}>Delete</button>
                }
              </div>

              <select style={styles.select} value={q.type} onChange={e => updateQuestion(q.id, 'type', e.target.value)}>
                <option value="mcq">Multiple Choice</option>
                <option value="text">Short Answer</option>
              </select>

              <input
                style={styles.input}
                placeholder="Question text"
                value={q.text}
                onChange={e => updateQuestion(q.id, 'text', e.target.value)}
              />

              {q.type === 'mcq' && (
                <div>
                  <p style={styles.label}>Options:</p>
                  {q.options.map((opt, idx) => (
                    <input
                      key={idx}
                      style={styles.input}
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={e => updateOption(q.id, idx, e.target.value)}
                    />
                  ))}
                  <button type="button" style={styles.btnSecondary} onClick={() => addOption(q.id)}>+ Add Option</button>
                </div>
              )}

              <input
                style={{...styles.input,...styles.correctAnswer}}
                placeholder="Correct Answer - must match exactly"
                value={q.correctAnswer}
                onChange={e => updateQuestion(q.id, 'correctAnswer', e.target.value)}
              />
              <small style={styles.subtext}>For MCQ: exact option text. For text: exact student answer</small>
            </div>
          ))}

          <button type="button" style={styles.btnSecondary} onClick={addQuestion}>+ Add Question</button>
          <button type="submit" style={styles.btnPrimary} disabled={availableGrades.length === 0}>
            Create Assignment for {grade || '...'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeacherUpload;