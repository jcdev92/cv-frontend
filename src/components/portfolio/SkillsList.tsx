import { Star } from 'lucide-react';
import type { Skill } from '../../types/cv';

interface SkillsListProps {
  skills: Skill[];
}

const SkillsList = ({ skills }: SkillsListProps) => {
  if (!skills || skills.length === 0) return null;

  // Agrupar habilidades por categoría
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills">
      <div className="flex items-center mb-8">
        <Star className="w-6 h-6 text-blue-600 mr-3 hidden md:block" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Habilidades</h3>
      </div>
      <div className="space-y-8">
        {Object.entries(groupedSkills).map(([category, catSkills]) => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 dark:text-gray-100">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {catSkills.map((skill) => (
                <div key={skill._id} className="group relative bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-300 hover:shadow-sm transition dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-400">
                  {skill.name}
                  {skill.proficiency && (
                    <div 
                      className="absolute bottom-0 left-0 h-0.5 bg-blue-500 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity" 
                      style={{ width: `${skill.proficiency}%` }} 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsList;