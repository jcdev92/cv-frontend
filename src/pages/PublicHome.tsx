import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Loader2 } from 'lucide-react';

// Importación de componentes refactorizados
import HeroSection from '../components/portfolio/HeroSection';
import ExperienceList from '../components/portfolio/ExperienceList';
import ProjectList from '../components/portfolio/ProjectList';
import SkillsList from '../components/portfolio/SkillsList';
import EducationList from '../components/portfolio/EducationList';

interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  title: string;
  summary: string;
  email?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

interface Experience {
  _id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  highlights?: string[];
  technologies?: string[];
}

interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  technologies?: string[];
}

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency?: number;
}

interface Education {
  _id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

const PublicHome = () => {
  const [data, setData] = useState({
    profile: null as Profile | null,
    experiences: [] as Experience[],
    projects: [] as Project[],
    skills: [] as Skill[],
    educations: [] as Education[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [profRes, expRes, projRes, skillRes, eduRes] = await Promise.all([
          api.get('/profile'),
          api.get('/experiences'),
          api.get('/projects'),
          api.get('/skills'),
          api.get('/educations')
        ]);

        setData({
          profile: profRes.data,
          experiences: expRes.data,
          projects: projRes.data,
          skills: skillRes.data,
          educations: eduRes.data
        });
      } catch (error) {
        console.error('Error fetching public data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 h-12 w-12" />
      </div>
    );
  }

  const { profile, experiences, projects, skills, educations } = data;

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Perfil no encontrado</h1>
        <p className="text-gray-600 mb-6">Parece que aún no hay datos en la base de datos.</p>
        <Link to="/admin" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Ir al Panel de Administración
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-200 selection:text-blue-900">
      
      {/* Navegación Superior */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {profile.firstName} {profile.lastName}
          </span>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
            <a href="#about" className="hover:text-blue-600 transition">Sobre mí</a>
            {experiences.length > 0 && <a href="#experience" className="hover:text-blue-600 transition">Experiencia</a>}
            {projects.length > 0 && <a href="#projects" className="hover:text-blue-600 transition">Proyectos</a>}
          </div>
          <Link to="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
            Admin Login
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <HeroSection profile={profile} />
          <ExperienceList experiences={experiences} />
          <ProjectList projects={projects} />
          
          {/* SKILLS & EDUCATION CONTENEDOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-16">
            <SkillsList skills={skills} />
            <EducationList educations={educations} />
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {profile.firstName} {profile.lastName}. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs">Desarrollado con React, Node.js & MongoDB.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;
