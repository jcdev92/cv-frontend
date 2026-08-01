import { Github, Linkedin, Twitter, Globe, MapPin, Download, Mail } from 'lucide-react';

interface Profile {
  firstName: string;
  title: string;
  summary: string;
  email?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

interface HeroSectionProps {
  profile: Profile;
}

const HeroSection = ({ profile }: HeroSectionProps) => {
  return (
    <section id="about" className="py-12 md:py-20 flex flex-col-reverse md:flex-row items-center md:justify-between gap-10 border-b border-gray-200">
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
          Hola, soy <span className="text-blue-600">{profile.firstName}</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-medium text-gray-600 mb-6">
          {profile.title}
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl">
          {profile.summary}
        </p>
        
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
          {profile.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition shadow-sm">
              <Download className="w-4 h-4 mr-2" /> Descargar CV
            </a>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition shadow-sm">
              <Mail className="w-4 h-4 mr-2" /> Contáctame
            </a>
          )}
        </div>

        <div className="flex items-center justify-center md:justify-start space-x-5 text-gray-500">
          {profile.socialLinks?.github && (
            <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-gray-900 transition"><Github className="w-6 h-6" /></a>
          )}
          {profile.socialLinks?.linkedin && (
            <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-700 transition"><Linkedin className="w-6 h-6" /></a>
          )}
          {profile.socialLinks?.twitter && (
            <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition"><Twitter className="w-6 h-6" /></a>
          )}
          {profile.socialLinks?.website && (
            <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="hover:text-gray-900 transition"><Globe className="w-6 h-6" /></a>
          )}
          {profile.location && (
            <span className="flex items-center text-sm font-medium border-l border-gray-300 pl-5"><MapPin className="w-4 h-4 mr-1" /> {profile.location}</span>
          )}
        </div>
      </div>

      {profile.avatarUrl && (
        <div className="w-48 h-48 md:w-72 md:h-72 shrink-0">
          <img src={profile.avatarUrl} alt={profile.firstName} className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white" />
        </div>
      )}
    </section>
  );
};

export default HeroSection;