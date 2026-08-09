import type { Profile, Education, Experience, Project, Skill } from '../types/cv';

interface CvData {
  profile: Profile;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
}

const formatDateRange = (startDate: string, endDate: string | undefined, isCurrent: boolean): string => {
  const start = new Date(startDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
  if (isCurrent || !endDate) return `${start} — Presente`;
  const end = new Date(endDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
  return `${start} — ${end}`;
};

export const generateCvPdf = ({ profile, experiences, educations, skills, projects }: CvData): void => {
  const sortedExperience = [...experiences].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  const sortedEducation = [...educations].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  const experienceSection = sortedExperience.map((exp) => `
    <div class="cv-item">
      <div class="flex justify-between">
        <div>
          <div class="cv-item-title">${exp.jobTitle}</div>
          <div class="cv-item-sub">${exp.company}${exp.location ? ', ' + exp.location : ''}</div>
        </div>
        <div class="cv-dates">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</div>
      </div>
      <p class="cv-item-meta mt-1">${exp.description}</p>
      ${exp.highlights && exp.highlights.length > 0 ? `
        <ul class="mt-1">
          ${exp.highlights.map((h) => `<li>${h}</li>`).join('')}
        </ul>
      ` : ''}
      ${exp.technologies && exp.technologies.length > 0 ? `<div class="cv-tech">Tecnologías: ${exp.technologies.join(', ')}</div>` : ''}
    </div>
  `).join('');

  const educationSection = sortedEducation.map((edu) => `
    <div class="cv-item">
      <div class="flex justify-between">
        <div>
          <div class="cv-item-title">${edu.degree}</div>
          <div class="cv-item-sub">${edu.institution}${edu.location ? ', ' + edu.location : ''}</div>
        </div>
        <div class="cv-dates">${formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}</div>
      </div>
      ${edu.description ? `<p class="cv-item-meta mt-1">${edu.description}</p>` : ''}
    </div>
  `).join('');

  const skillsSection = Object.entries(groupedSkills).map(([category, skillNames]) => `
    <div class="mb-2">
      <div class="cv-item-title">${category}:</div>
      <div class="cv-item-meta">${skillNames.join(', ')}</div>
    </div>
  `).join('');

  const projectsSection = projects.slice(0, 6).map((proj) => `
    <div class="cv-item">
      <div class="flex justify-between">
        <div class="cv-item-title">${proj.title}</div>
        ${(proj.startDate || proj.endDate) ? `<div class="cv-dates">${proj.startDate ? new Date(proj.startDate).getFullYear() : ''}${proj.endDate && !proj.startDate ? ' — ' + new Date(proj.endDate).getFullYear() : ''}</div>` : ''}
      </div>
      <p class="cv-item-meta mt-1">${proj.description}</p>
      ${proj.highlights && proj.highlights.length > 0 ? `
        <ul class="mt-1">
          ${proj.highlights.map((h) => `<li>${h}</li>`).join('')}
        </ul>
      ` : ''}
      ${proj.technologies && proj.technologies.length > 0 ? `<div class="cv-tech">Tecnologías: ${proj.technologies.join(', ')}</div>` : ''}
    </div>
  `).join('');

  const socialLinks = [];
  if (profile.socialLinks?.github) socialLinks.push(`GitHub: ${profile.socialLinks.github}`);
  if (profile.socialLinks?.linkedin) socialLinks.push(`LinkedIn: ${profile.socialLinks.linkedin}`);
  if (profile.socialLinks?.website) socialLinks.push(`Web: ${profile.socialLinks.website}`);

  const contactInfo = [profile.email, profile.location, ...socialLinks].filter(Boolean).join(' • ');

  const printWindow = window.open('', '_blank', 'width=1000,height=1200');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <title>Currículum Vitae - ${profile.firstName} ${profile.lastName}</title>
      <style>
        @page { margin: 1.5cm; size: A4; }
        body { font-family: 'Calibri', 'Arial', sans-serif; margin: 0; padding: 0; color: #000; line-height: 1.4; font-size: 11pt; }
        .cv-container { max-width: 800px; margin: 0 auto; padding: 1cm; }
        .cv-header { text-align: center; margin-bottom: 1.5em; border-bottom: 2px solid #000; padding-bottom: 0.5em; }
        .cv-header h1 { font-size: 22pt; font-weight: bold; margin: 0; letter-spacing: -0.5px; }
        .cv-header h2 { font-size: 12pt; font-weight: normal; margin: 0.2em 0 0; color: #333; }
        .cv-contact { font-size: 9pt; margin-top: 0.5em; color: #333; word-break: break-all; }
        .cv-section { margin-bottom: 1em; }
        .cv-section h3 { font-size: 12pt; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 0.2em; margin-bottom: 0.6em; text-transform: uppercase; letter-spacing: 0.5px; break-after: avoid; }
        .cv-item { margin-bottom: 0.7em; break-inside: avoid; }
        .cv-item-title { font-weight: bold; font-size: 10pt; margin-bottom: 0.1em; }
        .cv-item-sub { font-style: italic; font-size: 9pt; margin: 0.1em 0; color: #555; }
        .cv-item-meta { font-size: 9pt; margin: 0.2em 0; color: #333; }
        .cv-dates { font-size: 9pt; color: #333; font-weight: 500; }
        .cv-tech { font-size: 9pt; color: #666; margin-top: 0.2em; }
        ul { margin: 0.2em 0 0.2em 1.2em; padding: 0; }
        li { margin-bottom: 0.2em; font-size: 9pt; }
        .no-print { display: none; }
        .footer { text-align: center; margin-top: 2em; padding-top: 0.5em; border-top: 1px solid #333; font-size: 8pt; color: #666; }
      </style>
    </head>
    <body>
      <div class="cv-container">
        <div class="cv-header">
          <h1>${profile.firstName} ${profile.lastName}</h1>
          <h2>${profile.title}</h2>
          ${contactInfo ? `<div class="cv-contact">${contactInfo}</div>` : ''}
        </div>

        ${profile.summary ? `
          <div class="cv-section">
            <h3>Perfil Profesional</h3>
            <p class="cv-item-meta">${profile.summary}</p>
          </div>
        ` : ''}

        ${experienceSection ? `<div class="cv-section"><h3>Experiencia Laboral</h3>${experienceSection}</div>` : ''}
        ${educationSection ? `<div class="cv-section"><h3>Educación</h3>${educationSection}</div>` : ''}
        ${skillsSection ? `<div class="cv-section"><h3>Habilidades</h3>${skillsSection}</div>` : ''}
        ${projectsSection ? `<div class="cv-section"><h3>Proyectos</h3>${projectsSection}</div>` : ''}

        <div class="footer">
          Currículum generado el ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}. Referencias disponibles a solicitud.
        </div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};