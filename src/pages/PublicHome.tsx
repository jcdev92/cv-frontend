import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import type { Profile, Education, Experience, Project, Skill } from '../types/cv';

// Importación de componentes refactorizados
import HeroSection from '../components/portfolio/HeroSection';
import ExperienceList from '../components/portfolio/ExperienceList';
import ProjectList from '../components/portfolio/ProjectList';
import SkillsList from '../components/portfolio/SkillsList';
import EducationList from '../components/portfolio/EducationList';
import PortfolioSkeleton from '../components/portfolio/PortfolioSkeleton';
import { ThemeToggle } from '../components/ThemeToggle';
import { LogIn, Sparkles } from 'lucide-react';
import { generateCvPdf } from '../utils/generateCvPdf';
import { useColdStart } from '../hooks/useColdStart';

const REQUEST_TIMEOUT_MS = 30000;
const AUTO_RETRY_COUNT = 2;
const RETRY_DELAY_MS = 6000;

const PublicHome = () => {
  const [data, setData] = useState({
    profile: null as Profile | null,
    experiences: [] as Experience[],
    projects: [] as Project[],
    skills: [] as Skill[],
    educations: [] as Education[]
  });
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const showColdStartMessage = useColdStart(loading);

  // Resolver el usuario del portafolio público:
  // 1) query string ?user=<email>
  // 2) variable de entorno por dominio (VITE_PORTFOLIO_USER_EMAIL)
  const defaultUserEmail = searchParams.get('user') || import.meta.env.VITE_PORTFOLIO_USER_EMAIL || null;

  const handleDownloadCv = () => {
    const { profile } = data;
    if (!profile) return;
    generateCvPdf({ profile, experiences: data.experiences, projects: data.projects, skills: data.skills, educations: data.educations });
  };

  const handleRetry = () => {
    setHasError(false);
    setLoading(true);
    setAttempt((a) => a + 1);
  };

  const demoEmail = import.meta.env.VITE_DEMO_EMAIL;
  const showingDemo =
    !!demoEmail && !!defaultUserEmail && defaultUserEmail.toLowerCase() === demoEmail.toLowerCase();

  const handleTogglePortfolio = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    const target = showingDemo
      ? import.meta.env.VITE_PORTFOLIO_USER_EMAIL || ''
      : demoEmail || '';
    navigate(`/?user=${target}`);
  };

  const handleAdminLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  useEffect(() => {
    let cancelled = false;

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchAllData = async (retriesLeft: number): Promise<void> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      const requestSignal = controller.signal;

      try {
        // Si hay un email de portafolio por dominio, lo resolvemos a su _id
        let userQuery = '';
        if (defaultUserEmail) {
          const users = await api.get('/users', { signal: requestSignal });
          const usersList: Array<{ _id: string; email: string }> = Array.isArray(users.data) ? users.data : [];
          const found = usersList.find(
            (u) => u.email.toLowerCase() === defaultUserEmail.toLowerCase()
          );
          if (found) {
            userQuery = `?user=${found._id}`;
          }
        }

        const [profRes, expRes, projRes, skillRes, eduRes] = await Promise.all([
          api.get(`/profile${userQuery}`, { signal: requestSignal }),
          api.get(`/experiences${userQuery}`, { signal: requestSignal }),
          api.get(`/projects${userQuery}`, { signal: requestSignal }),
          api.get(`/skills${userQuery}`, { signal: requestSignal }),
          api.get(`/educations${userQuery}`, { signal: requestSignal })
        ]);

        if (cancelled) return;

        setData({
          profile: profRes.data,
          experiences: expRes.data,
          projects: projRes.data,
          skills: skillRes.data,
          educations: eduRes.data
        });
        setLoading(false);
      } catch (error) {
        if (cancelled) return;

        if (retriesLeft > 0) {
          await sleep(RETRY_DELAY_MS);
          if (cancelled) return;
          await fetchAllData(retriesLeft - 1);
        } else {
          console.error('Error fetching public data:', error);
          setLoading(false);
          setHasError(true);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    fetchAllData(AUTO_RETRY_COUNT);

    return () => {
      cancelled = true;
    };
  }, [attempt, defaultUserEmail]);

  if (loading) {
    return <PortfolioSkeleton showColdStartMessage={showColdStartMessage} />;
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-page p-4 text-center">
        <h1 className="text-2xl font-bold text-ink mb-3">No pudimos conectar con el servidor</h1>
        <p className="text-muted max-w-md mb-6">
          La API está alojada en un hosting gratuito que se suspende por inactividad y tarda en arrancar de nuevo. Inténtalo de nuevo en unos segundos.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-accent text-on-accent rounded-md hover:bg-accent-hover transition"
          >
            Reintentar
          </button>
          <a href="/login" onClick={handleAdminLogin} className="px-6 py-2 bg-surface-soft text-ink-soft rounded-md hover:bg-line transition">
            Ir al Panel de Administración
          </a>
        </div>
      </div>
    );
  }

  const { profile, experiences, projects, skills, educations } = data;

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-page p-4 text-center">
        <h1 className="text-3xl font-bold text-ink mb-4">Perfil no encontrado</h1>
        <p className="text-muted mb-6">Parece que aún no hay datos en la base de datos.</p>
        <a href="/login" onClick={handleAdminLogin} className="px-6 py-2 bg-accent text-on-accent rounded-md hover:bg-accent-hover transition">
          Ir al Panel de Administración
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page font-sans text-ink selection:bg-accent-soft selection:text-accent">

      {/* Navegación Superior */}
      <nav className="fixed w-full bg-surface/80 backdrop-blur-md z-50 border-b border-line transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-accent to-accent-deep">
            {profile.firstName} {profile.lastName}
          </span>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-muted">
            <a href="#about" className="hover:text-accent transition">Sobre mí</a>
            {experiences.length > 0 && <a href="#experience" className="hover:text-accent transition">Experiencia</a>}
            {projects.length > 0 && <a href="#projects" className="hover:text-accent transition">Proyectos</a>}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href="/login"
              onClick={handleAdminLogin}
              title="Admin Login"
              aria-label="Ir a Admin Login"
              className="p-2 rounded-md text-accent hover:bg-accent-soft transition"
            >
              <LogIn className="h-5 w-5" />
            </a>
            {demoEmail && (
              <a
                href={showingDemo ? `/?user=${import.meta.env.VITE_PORTFOLIO_USER_EMAIL || ''}` : `/?user=${demoEmail}`}
                onClick={handleTogglePortfolio}
                title={showingDemo ? 'Ver CV principal' : 'Ver Demo'}
                aria-label={showingDemo ? 'Ver CV principal' : 'Ver Demo'}
                className="p-2 rounded-md text-success hover:bg-success-soft transition"
              >
                <Sparkles className="h-5 w-5" />
              </a>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <HeroSection profile={profile} onDownloadCv={handleDownloadCv} />
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
      <footer className="bg-surface border-t border-line py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted">
          <p>© {new Date().getFullYear()} {profile.firstName} {profile.lastName}. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs">Desarrollado con React, Node.js & MongoDB.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;
