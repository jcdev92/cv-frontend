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
        <Star className="w-6 h-6 text-accent mr-3 hidden md:block" />
        <h3 className="text-2xl font-bold text-ink">Habilidades</h3>
      </div>
      <div className="space-y-8">
        {Object.entries(groupedSkills).map(([category, catSkills]) => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-ink uppercase tracking-wider mb-4">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {catSkills.map((skill) => (
                <div key={skill._id} className="group relative bg-field border border-line px-4 py-2 rounded-lg text-sm font-medium text-ink-soft hover:border-accent hover:shadow-sm transition">
                  {skill.name}
                  {skill.proficiency && (
                    <div 
                      className="absolute bottom-0 left-0 h-0.5 bg-accent rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity" 
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