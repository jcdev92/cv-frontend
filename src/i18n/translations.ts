export type Lang = 'es' | 'en';

export interface Dict {
  nav: {
    about: string;
    experience: string;
    projects: string;
    skills: string;
    education: string;
    adminLogin: string;
    viewDemo: string;
    viewMain: string;
  };
  hero: {
    hello: string;
    downloadCv: string;
    contact: string;
  };
  section: {
    experience: string;
    projects: string;
    skills: string;
    education: string;
  };
  current: string;
  project: {
    code: string;
    frontend: string;
    backend: string;
    live: string;
  };
  footer: {
    rights: string;
    built: string;
  };
  error: {
    title: string;
    body: string;
    retry: string;
    adminPanel: string;
  };
  notFound: {
    title: string;
    body: string;
    adminPanel: string;
  };
  coldStart: {
    title: string;
    body: string;
  };
  pdf: {
    title: string;
    present: string;
    technologies: string;
    profile: string;
    workExperience: string;
    education: string;
    skills: string;
    projects: string;
    footer: string;
  };
}

export const translations: Record<Lang, Dict> = {
  es: {
    nav: {
      about: 'Sobre mí',
      experience: 'Experiencia',
      projects: 'Proyectos',
      skills: 'Habilidades',
      education: 'Educación',
      adminLogin: 'Ir a Admin Login',
      viewDemo: 'Ver Demo',
      viewMain: 'Ver CV principal',
    },
    hero: {
      hello: 'Hola, soy',
      downloadCv: 'Descargar CV',
      contact: 'Contáctame',
    },
    section: {
      experience: 'Experiencia Laboral',
      projects: 'Proyectos Destacados',
      skills: 'Habilidades',
      education: 'Educación',
    },
    current: 'Actualidad',
    project: {
      code: 'Código',
      frontend: 'Frontend',
      backend: 'Backend',
      live: 'Ver Proyecto',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      built: 'Desarrollado con React, Node.js & MongoDB.',
    },
    error: {
      title: 'No pudimos conectar con el servidor',
      body: 'La API está alojada en un hosting gratuito que se suspende por inactividad y tarda en arrancar de nuevo. Inténtalo de nuevo en unos segundos.',
      retry: 'Reintentar',
      adminPanel: 'Ir al Panel de Administración',
    },
    notFound: {
      title: 'Perfil no encontrado',
      body: 'Parece que aún no hay datos en la base de datos.',
      adminPanel: 'Ir al Panel de Administración',
    },
    coldStart: {
      title: 'El servidor está arrancando',
      body: 'La API está alojada en un hosting gratuito que se suspende por inactividad. La primera carga puede tardar entre 15 y 60 segundos. Se cargará automáticamente.',
    },
    pdf: {
      title: 'Currículum Vitae',
      present: 'Presente',
      technologies: 'Tecnologías',
      profile: 'Perfil Profesional',
      workExperience: 'Experiencia Laboral',
      education: 'Educación',
      skills: 'Habilidades',
      projects: 'Proyectos',
      footer: 'Currículum generado el',
    },
  },
  en: {
    nav: {
      about: 'About',
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Skills',
      education: 'Education',
      adminLogin: 'Go to Admin Login',
      viewDemo: 'View Demo',
      viewMain: 'View main CV',
    },
    hero: {
      hello: "Hi, I'm",
      downloadCv: 'Download CV',
      contact: 'Contact me',
    },
    section: {
      experience: 'Work Experience',
      projects: 'Featured Projects',
      skills: 'Skills',
      education: 'Education',
    },
    current: 'Present',
    project: {
      code: 'Code',
      frontend: 'Frontend',
      backend: 'Backend',
      live: 'View Project',
    },
    footer: {
      rights: 'All rights reserved.',
      built: 'Built with React, Node.js & MongoDB.',
    },
    error: {
      title: "We couldn't connect to the server",
      body: 'The API is hosted on a free service that sleeps when idle and takes a moment to start again. Please try again in a few seconds.',
      retry: 'Retry',
      adminPanel: 'Go to Admin Panel',
    },
    notFound: {
      title: 'Profile not found',
      body: 'Looks like there is no data in the database yet.',
      adminPanel: 'Go to Admin Panel',
    },
    coldStart: {
      title: 'Server is starting up',
      body: 'The API is hosted on a free service that sleeps when idle. First load can take 15 to 60 seconds. It will load automatically.',
    },
    pdf: {
      title: 'Resume',
      present: 'Present',
      technologies: 'Technologies',
      profile: 'Professional Profile',
      workExperience: 'Work Experience',
      education: 'Education',
      skills: 'Skills',
      projects: 'Projects',
      footer: 'Resume generated on',
    },
  },
};
