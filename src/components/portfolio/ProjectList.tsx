import { Code2, Github, ExternalLink } from 'lucide-react';
import type { Project } from '../../types/cv';

interface ProjectListProps {
  projects: Project[];
}

const ProjectList = ({ projects }: ProjectListProps) => {
  if (!projects || projects.length === 0) return null;

  return (
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
  );
};

export default ProjectList;