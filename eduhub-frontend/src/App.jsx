import { Routes, Route } from 'react-router-dom';

// Pages
import StudentHome from './StudentHome';
import StudentSubmit from './StudentSubmit';
import MyGrades from './MyGrades';
import TeacherUpload from './TeacherUpload';
import GradeWork from './GradeWork';
import TeacherSubmissions from './TeacherSubmissions';
import TeacherLogin from './TeacherLogin';
import TeacherSignup from './TeacherSignup';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';
import AdminSignup from './AdminSignup';
import ManageUsers from './ManageUsers';
import ClassPage from './ClassPage';
import Login from './Login';
import TeacherDashboard from './TeacherDashboard';

function App() {
  return (
    <Routes>
      {/* Students start here - no login needed */}
      <Route path="/" element={<StudentHome />} />
      <Route path="/student" element={<StudentHome />} />
      <Route path="/submit" element={<StudentSubmit />} />
      <Route path="/my-grades" element={<MyGrades />} />
      
      {/* Teachers */}
      <Route path="/upload" element={<TeacherUpload />} />
      <Route path="/grade" element={<GradeWork />} />
      <Route path="/submissions" element={<TeacherSubmissions />} />
      <Route path="/teacher-login" element={<TeacherLogin />} />
      <Route path="/teacher-signup" element={<TeacherSignup />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      {/* Admins */}
      <Route path="/admin" element={<ManageUsers />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-signup" element={<AdminSignup />} />
      <Route path="/manage-users" element={<ManageUsers />} />
      
      {/* Other */}
      <Route path="/class/:className" element={<ClassPage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;