import { BookOpen, Calendar } from 'lucide-react';
import type { Education } from '../../types/cv';
import { useLanguage } from '../../i18n/languageContext';

interface EducationListProps {
  educations: Education[];
}

const EducationList = ({ educations }: EducationListProps) => {
  const { t } = useLanguage();
  if (!educations || educations.length === 0) return null;

  return (
    <section id="education">
      <div className="flex items-center mb-8">
        <BookOpen className="w-6 h-6 text-accent mr-3 hidden md:block" />
        <h3 className="text-2xl font-bold text-ink">{t.section.education}</h3>
      </div>
      <div className="space-y-6">
        {educations.map((edu) => (
          <div key={edu._id} className="relative pl-6 border-l-2 border-line">
            <div className="absolute w-3 h-3 bg-accent rounded-full -left-1.75 top-2 border-2 border-raised"></div>
            <h4 className="text-lg font-bold text-ink">{edu.degree}</h4>
            <div className="text-muted font-medium mb-1">{edu.institution}</div>
            <div className="text-sm text-muted mb-2 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(edu.startDate).getFullYear()} - {edu.isCurrent ? t.current : edu.endDate ? new Date(edu.endDate).getFullYear() : 'N/A'}
            </div>
            {edu.description && <p className="text-sm text-muted">{edu.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationList;