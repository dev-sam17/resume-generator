export interface Contact {
  fullName: string
  title: string
  phone: string
  email: string
  location: string
  linkedin?: string
  github?: string
  portfolio?: string
}

export interface Skills {
  languages: string[]
  frameworks: string[]
  databases: string[]
  tools: string[]
  cloud: string[]
  methodologies: string[]
}

export interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  achievements: string[]
  technologies: string[]
}

export interface Project {
  name: string
  description: string
  role: string
  technologies: string[]
  link?: string
}

export interface Education {
  degree: string
  institution: string
  year: string
}

export interface Certification {
  name: string
  authority: string
  date: string
}

export interface ResumeData {
  contact: Contact
  summary: string
  skills: Skills
  experience: Experience[]
  projects: Project[]
  education: Education[]
  certifications: Certification[]
}

export interface Resume {
  id: string
  userId: string
  title: string
  versionName?: string
  data: ResumeData
  pdfUrl?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}
