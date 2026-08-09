import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Download, FileText } from 'lucide-react';
import type { Profile, Education, Experience, Project, Skill } from '../types/cv';
import { Button, SectionHeader, DashboardSkeleton } from '../components/admin/ui';
import { generateCvPdf } from '../utils/generateCvPdf';
import { useColdStart } from '../hooks/useColdStart';

const CVDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?._id],
    queryFn: async (): Promise<Profile | null> => {
      const res = await api.get(`/profile?user=${user?._id}`);
      return res.data ?? null;
    },
    enabled: !!user?._id,
  });

  const { data: experiences = [] as Experience[], isLoading: expLoading } = useQuery({
    queryKey: ['experiences', user?._id],
    queryFn: async () => {
      const res = await api.get(`/experiences?user=${user?._id}`);
      return res.data as Experience[];
    },
    enabled: !!user?._id,
  });

  const { data: projects = [] as Project[], isLoading: projLoading } = useQuery({
    queryKey: ['projects', user?._id],
    queryFn: async () => {
      const res = await api.get(`/projects?user=${user?._id}`);
      return res.data as Project[];
    },
    enabled: !!user?._id,
  });

  const { data: skills = [] as Skill[], isLoading: skillLoading } = useQuery({
    queryKey: ['skills', user?._id],
    queryFn: async () => {
      const res = await api.get(`/skills?user=${user?._id}`);
      return res.data as Skill[];
    },
    enabled: !!user?._id,
  });

  const { data: educations = [] as Education[], isLoading: eduLoading } = useQuery({
    queryKey: ['educations', user?._id],
    queryFn: async () => {
      const res = await api.get(`/educations?user=${user?._id}`);
      return res.data as Education[];
    },
    enabled: !!user?._id,
  });

  const isLoading = profileLoading || expLoading || projLoading || skillLoading || eduLoading;

  const showColdStartMessage = useColdStart(isLoading);

  const formatDateRange = (startDate: string, endDate: string | undefined, isCurrent: boolean): string => {
    const start = new Date(startDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
    if (isCurrent || !endDate) return `${start} — Presente`;
    const end = new Date(endDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
    return `${start} — ${end}`;
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  const handleDownloadPDF = () => {
    if (!profile) return;
    generateCvPdf({ profile, experiences, educations, skills, projects });
  };

  if (isLoading) {
    return <DashboardSkeleton showColdStartMessage={showColdStartMessage} variant="form" />;
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No se encontró el perfil</h3>
        <p className="text-gray-500 dark:text-gray-400">Asegúrate de completar tu perfil antes de generar el CV.</p>
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Currículum Vitae (CV)"
        subtitle="Genera y descarga tu CV en formato PDF siguiendo el estándar Harvard."
      />

      <div className="flex gap-3 mb-6 print:hidden">
        <Button onClick={handleDownloadPDF} size="sm">
          <Download className="h-4 w-4 mr-2" /> Descargar PDF
        </Button>
      </div>

      <style>{`
        @media print {
          header, nav, .no-print { display: none !important; }
        }
      `}</style>

      <div id="cv-content" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="text-center p-8 border-b-2 border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{fullName}</h1>
          <h2 className="text-lg font-medium text-gray-600 mt-1 dark:text-gray-400">{profile.title}</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-0.5">
            {profile.email && <div>✉ {profile.email}</div>}
            {profile.location && <div>📍 {profile.location}</div>}
            {(profile.socialLinks?.github || profile.socialLinks?.linkedin || profile.socialLinks?.website) && (
              <div className="flex justify-center gap-4 mt-1">
                {profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400">@github</a>}
                {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400">@linkedin</a>}
                {profile.socialLinks?.website && <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400">@website</a>}
              </div>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {profile.summary && (
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Perfil Profesional</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profile.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          {/* Left Column: Skills */}
          <div className="lg:col-span-1 space-y-6">
            {skills.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Habilidades</h3>
                <div className="space-y-4">
                  {Object.entries(groupedSkills).map(([category, skillNames]) => (
                    <div key={category}>
                      <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">{category}</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
                        {skillNames.map((skillName, i) => (
                          <li key={i}>{skillName}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Experience, Education, Projects */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience */}
            {experiences.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Experiencia Laboral</h3>
                <div className="space-y-6">
                  {experiences
                    .slice()
                    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .map((exp) => (
                      <div key={exp._id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">{exp.jobTitle}</h4>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">{exp.company}</p>
                            {exp.location && <p className="text-sm text-gray-500 dark:text-gray-400">{exp.location}</p>}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">{exp.description}</p>
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mt-1 space-y-0.5">
                            {exp.highlights.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Tecnologías: {exp.technologies.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Educación</h3>
                <div className="space-y-6">
                  {educations
                    .slice()
                    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .map((edu) => (
                      <div key={edu._id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">{edu.degree}</h4>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">{edu.institution}</p>
                            {edu.location && <p className="text-sm text-gray-500 dark:text-gray-400">{edu.location}</p>}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                          </span>
                        </div>
                        {edu.description && <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">{edu.description}</p>}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Proyectos</h3>
                <div className="space-y-5">
                  {projects.slice(0, 6).map((proj) => (
                    <div key={proj._id}>
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">{proj.title}</h4>
                        {(proj.startDate || proj.endDate) && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {proj.startDate && new Date(proj.startDate).getFullYear()}
                            {proj.endDate && !proj.startDate && ' — ' + new Date(proj.endDate).getFullYear()}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">{proj.description}</p>
                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mt-1 space-y-0.5">
                          {proj.highlights.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Tecnologías: {proj.technologies.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Currículum generado en {new Date().toLocaleDateString('es-ES')}. Referencias disponibles a solicitud.</p>
        </div>
      </div>
    </div>
  );
};

export default CVDashboard;
