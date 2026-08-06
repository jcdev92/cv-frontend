export interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  title: string;
  summary: string;
  email?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}

export interface Education {
  _id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Experience {
  _id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  repoUrl?: string;
  frontendRepoUrl?: string;
  backendRepoUrl?: string;
  liveUrl?: string;
  technologies: string[];
  startDate?: string;
  endDate?: string;
  highlights?: string[];
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency?: number;
}
