import { Github, Linkedin, Twitter, Globe, MapPin, Download, Mail } from 'lucide-react';
import type { Profile } from '../../types/cv';

interface HeroSectionProps {
  profile: Profile;
  onDownloadCv: () => void;
}

const HeroSection = ({ profile, onDownloadCv }: HeroSectionProps) => {
  return (
    <section id="about" className="py-12 md:py-20 flex flex-col-reverse md:flex-row items-center md:justify-between gap-10 border-b border-line">
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-extrabold text-ink tracking-tight mb-4">
          Hola, soy <span className="text-accent">{profile.firstName}</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-medium text-muted mb-6">
          {profile.title}
        </h2>
        <p className="text-muted text-lg leading-relaxed mb-8 max-w-2xl">
          {profile.summary}
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
          <button onClick={onDownloadCv} className="flex items-center px-6 py-3 bg-inverse text-on-inverse font-medium rounded-lg hover:bg-inverse-hover transition shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Descargar CV
          </button>
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="flex items-center px-6 py-3 bg-field text-ink-soft font-medium rounded-lg border border-line hover:bg-surface-soft transition shadow-sm">
              <Mail className="w-4 h-4 mr-2" /> Contáctame
            </a>
          )}
        </div>

        <div className="flex items-center justify-center md:justify-start space-x-5 text-muted">
          {profile.socialLinks?.github && (
            <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-ink transition"><Github className="w-6 h-6" /></a>
          )}
          {profile.socialLinks?.linkedin && (
            <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent transition"><Linkedin className="w-6 h-6" /></a>
          )}
          {profile.socialLinks?.twitter && (
            <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-accent transition"><Twitter className="w-6 h-6" /></a>
          )}
          {profile.socialLinks?.website && (
            <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="hover:text-ink transition"><Globe className="w-6 h-6" /></a>
          )}
          {profile.location && (
            <span className="flex items-center text-sm font-medium border-l border-line-strong pl-5"><MapPin className="w-4 h-4 mr-1" /> {profile.location}</span>
          )}
        </div>
      </div>

      {profile.avatarUrl && (
        <div className="w-48 h-48 md:w-72 md:h-72 shrink-0">
          <img src={profile.avatarUrl} alt={profile.firstName} className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-raised" />
        </div>
      )}
    </section>
  );
};

export default HeroSection;