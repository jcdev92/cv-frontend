import { BookOpen, Calendar } from 'lucide-react';

interface EducationListProps {
  educations: any[];
}

const EducationList = ({ educations }: EducationListProps) => {
  if (!educations || educations.length === 0) return null;

  return (
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
  );
};

export default EducationList;