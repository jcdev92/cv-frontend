import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import PublicHome from './pages/PublicHome';
import DashboardLayout from './layouts/DashboardLayout';
import ProfileDashboard from './pages/ProfileDashboard';
import ExperienceDashboard from './pages/ExperienceDashboard';
import EducationDashboard from './pages/EducationDashboard';
import ProjectDashboard from './pages/ProjectDashboard';
import SkillDashboard from './pages/SkillDashboard';
import CVDashboard from './pages/CVDashboard';
import ChangePassword from './pages/ChangePassword';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return null; // Podríamos mostrar un loader global aquí
  }

  return (
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
          <Route path="cv" element={<CVDashboard />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
