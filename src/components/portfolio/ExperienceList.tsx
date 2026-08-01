import { Briefcase, MapPin, Building2, ChevronRight } from 'lucide-react';

interface ExperienceListProps {
  experiences: any[];
}

const ExperienceList = ({ experiences }: ExperienceListProps) => {
  if (!experiences || experiences.length === 0) return null;

  return (
    <section id="experience" className="py-16 border-b border-gray-200">
      <div className="flex items-center mb-10">
        <Briefcase className="w-6 h-6 text-blue-600 mr-3" />
        <h3 className="text-2xl font-bold text-gray-900">Experiencia Laboral</h3>
      </div>
      
      <div className="space-y-12">
        {experiences.map((exp) => (
          <div key={exp._id} className="relative pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-4 md:gap-8 items-start">
              <div className="hidden md:block col-span-1 text-gray-500 text-sm mt-1">
                <div className="font-medium text-gray-900 mb-1">
                  {new Date(exp.startDate).getFullYear()} — {exp.isCurrent ? 'Actualidad' : new Date(exp.endDate).getFullYear()}
                </div>
                {exp.location && (
                  <div className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {exp.location}</div>
                )}
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
  );
};

export default ExperienceList;