import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  Github, Linkedin, Twitter, Globe, Mail, MapPin, 
  Download, ExternalLink, Calendar, Building2, Code2,
  ChevronRight, Loader2, BookOpen, Briefcase, Star
} from 'lucide-react';

const PublicHome = () => {
  const [data, setData] = useState({
    profile: null as any,
    experiences: [] as any[],
    projects: [] as any[],
    skills: [] as any[],
    educations: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Al no pasar ?user=ID, nuestra API devuelve por defecto el primer usuario (tu seeder)
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

  // Agrupar habilidades
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, any[]>);

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
            <a href="#experience" className="hover:text-blue-600 transition">Experiencia</a>
            <a href="#projects" className="hover:text-blue-600 transition">Proyectos</a>
          </div>
          <Link to="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
            Admin Login
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* HERO SECTION */}
          <section id="about" className="py-12 md:py-20 flex flex-col-reverse md:flex-row items-center md:justify-between gap-10 border-b border-gray-200">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
                Hola, soy <span className="text-blue-600">{profile.firstName}</span>
              </h1>
              <h2 className="text-xl md:text-2xl font-medium text-gray-600 mb-6">
                {profile.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl">
                {profile.summary}
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
                {profile.resumeUrl && (
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition shadow-sm">
                    <Download className="w-4 h-4 mr-2" /> Descargar CV
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition shadow-sm">
                    <Mail className="w-4 h-4 mr-2" /> Contáctame
                  </a>
                )}
              </div>

              <div className="flex items-center justify-center md:justify-start space-x-5 text-gray-500">
                {profile.socialLinks?.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-gray-900 transition"><Github className="w-6 h-6" /></a>
                )}
                {profile.socialLinks?.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-700 transition"><Linkedin className="w-6 h-6" /></a>
                )}
                {profile.socialLinks?.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition"><Twitter className="w-6 h-6" /></a>
                )}
                {profile.socialLinks?.website && (
                  <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="hover:text-gray-900 transition"><Globe className="w-6 h-6" /></a>
                )}
                {profile.location && (
                  <span className="flex items-center text-sm font-medium border-l border-gray-300 pl-5"><MapPin className="w-4 h-4 mr-1" /> {profile.location}</span>
                )}
              </div>
            </div>

            {profile.avatarUrl && (
              <div className="w-48 h-48 md:w-72 md:h-72 shrink-0">
                <img src={profile.avatarUrl} alt={profile.firstName} className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white" />
              </div>
            )}
          </section>

          {/* EXPERIENCE SECTION */}
          {experiences.length > 0 && (
            <section id="experience" className="py-16 border-b border-gray-200">
              <div className="flex items-center mb-10">
                <Briefcase className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Experiencia Laboral</h3>
              </div>
              
              <div className="space-y-12">
                {experiences.map((exp, idx) => (
                  <div key={exp._id} className="relative pl-8 md:pl-0">
                    <div className="md:grid md:grid-cols-4 md:gap-8 items-start">
                      <div className="hidden md:block col-span-1 text-gray-500 text-sm mt-1">
                        <div className="font-medium text-gray-900 mb-1">{new Date(exp.startDate).getFullYear()} — {exp.isCurrent ? 'Actualidad' : new Date(exp.endDate).getFullYear()}</div>
                        <div className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {exp.location}</div>
                      </div>
                      
                      <div className="col-span-3">
                        <div className="md:hidden text-sm font-medium text-blue-600 mb-2">
                          {new Date(exp.startDate).getFullYear()} — {exp.isCurrent ? 'Actualidad' : new Date(exp.endDate).getFullYear()}
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">{exp.jobTitle}</h4>
                        <div className="text-lg text-gray-600 mb-4 flex items-center font-medium">
                          <Building2 className="w-4 h-4 mr-1.5" /> {exp.company}
                        </div>
                        <p className="text-gray-600 mb-4">{exp.description}</p>
                        
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="space-y-2 mb-4">
                            {exp.highlights.map((item: string, i: number) => (
                              <li key={i} className="flex items-start text-gray-600">
                                <ChevronRight className="w-4 h-4 text-blue-500 mr-2 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {exp.technologies.map((tech: string, i: number) => (
                              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS SECTION */}
          {projects.length > 0 && (
            <section id="projects" className="py-16 border-b border-gray-200">
              <div className="flex items-center mb-10">
                <Code2 className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Proyectos Destacados</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((proj) => (
                  <div key={proj._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
                    {proj.imageUrl && (
                      <div className="h-56 overflow-hidden">
                        <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-8 flex-1 flex flex-col">
                      <h4 className="text-xl font-bold text-gray-900 mb-3">{proj.title}</h4>
                      <p className="text-gray-600 mb-6 flex-1">{proj.description}</p>
                      
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {proj.technologies.map((tech: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-100">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex space-x-4 pt-4 border-t border-gray-100">
                        {proj.repoUrl && (
                          <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                            <Github className="w-4 h-4 mr-1.5" /> Código
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                            <ExternalLink className="w-4 h-4 mr-1.5" /> Ver Proyecto
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SKILLS & EDUCATION SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-16">
            
            {/* Skills */}
            {skills.length > 0 && (
              <section id="skills">
                <div className="flex items-center mb-8">
                  <Star className="w-6 h-6 text-blue-600 mr-3 hidden md:block" />
                  <h3 className="text-2xl font-bold text-gray-900">Habilidades</h3>
                </div>
                <div className="space-y-8">
                  {Object.entries(groupedSkills).map(([category, catSkills]) => (
                    <div key={category}>
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {catSkills.map((skill) => (
                          <div key={skill._id} className="group relative bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-300 hover:shadow-sm transition">
                            {skill.name}
                            {/* Barra de progreso sutil en el fondo (opcional) */}
                            {skill.proficiency && (
                              <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ width: `${skill.proficiency}%` }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <section id="education">
                <div className="flex items-center mb-8">
                  <BookOpen className="w-6 h-6 text-blue-600 mr-3 hidden md:block" />
                  <h3 className="text-2xl font-bold text-gray-900">Educación</h3>
                </div>
                <div className="space-y-6">
                  {educations.map((edu) => (
                    <div key={edu._id} className="relative pl-6 border-l-2 border-gray-200">
                      <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[7px] top-2 border-2 border-white"></div>
                      <h4 className="text-lg font-bold text-gray-900">{edu.degree}</h4>
                      <div className="text-gray-600 font-medium mb-1">{edu.institution}</div>
                      <div className="text-sm text-gray-500 mb-2 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> 
                        {new Date(edu.startDate).getFullYear()} - {edu.isCurrent ? 'Actualidad' : new Date(edu.endDate).getFullYear()}
                      </div>
                      {edu.description && <p className="text-sm text-gray-600">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            
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
