import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import PublicHome from './pages/PublicHome';
import DashboardLayout from './layouts/DashboardLayout';
import ProfileDashboard from './pages/ProfileDashboard';
import ExperienceDashboard from './pages/ExperienceDashboard';
import EducationDashboard from './pages/EducationDashboard';
import ProjectDashboard from './pages/ProjectDashboard';
import SkillDashboard from './pages/SkillDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<ProfileDashboard />} />
            <Route path="experiences" element={<ExperienceDashboard />} />
            <Route path="education" element={<EducationDashboard />} />
            <Route path="projects" element={<ProjectDashboard />} />
            <Route path="skills" element={<SkillDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
