export interface Contact {
  fullName: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export type Skills = Record<string, string[]>;

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  achievements: string[];
  technologies: string[];
}

export interface Project {
  name: string;
  description: string;
  role: string;
  technologies: string[];
  link?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Certification {
  name: string;
  authority: string;
  date: string;
  certificateId?: string;
  certificateLink?: string;
}

export type LayoutType =
  | "classic"
  | "modern"
  | "compact"
  | "professional"
  | "minimal"
  | "executive";

export interface ResumeData {
  layout?: LayoutType;
  contact: Contact;
  summary: string;
  skills: Skills;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  versionName?: string;
  data: ResumeData;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
