import { Briefcase, MapPin, Building2, ChevronRight } from 'lucide-react';
import type { Experience } from '../../types/cv';
import { useLanguage } from '../../i18n/languageContext';

interface ExperienceListProps {
  experiences: Experience[];
}

const ExperienceList = ({ experiences }: ExperienceListProps) => {
  const { t } = useLanguage();
  if (!experiences || experiences.length === 0) return null;

  return (
    <section id="experience" className="py-16 border-b border-line">
      <div className="flex items-center mb-10">
        <Briefcase className="w-6 h-6 text-accent mr-3" />
        <h3 className="text-2xl font-bold text-ink">{t.section.experience}</h3>
      </div>

      <div className="space-y-12">
        {experiences.map((exp) => (
          <div key={exp._id} className="relative pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-4 md:gap-8 items-start">
              <div className="hidden md:block col-span-1 text-muted text-sm mt-1">
                <div className="font-medium text-ink mb-1">
                  {new Date(exp.startDate).getFullYear()} — {exp.isCurrent ? t.current : exp.endDate ? new Date(exp.endDate).getFullYear() : 'N/A'}
                </div>
                {exp.location && (
                  <div className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {exp.location}</div>
                )}
              </div>

              <div className="col-span-3">
                <div className="md:hidden text-sm font-medium text-accent mb-2">
                  {new Date(exp.startDate).getFullYear()} — {exp.isCurrent ? t.current : exp.endDate ? new Date(exp.endDate).getFullYear() : 'N/A'}
                </div>
                <h4 className="text-xl font-bold text-ink">{exp.jobTitle}</h4>
                <div className="text-lg text-muted mb-4 flex items-center font-medium">
                  <Building2 className="w-4 h-4 mr-1.5" /> {exp.company}
                </div>
                <p className="text-muted mb-4">{exp.description}</p>

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {exp.highlights.map((item: string, i: number) => (
                      <li key={i} className="flex items-start text-muted">
                        <ChevronRight className="w-4 h-4 text-accent mr-2 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {exp.technologies.map((tech: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-surface-soft text-ink-soft text-xs font-medium rounded-full">
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