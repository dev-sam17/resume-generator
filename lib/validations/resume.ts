import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  title: z.string().min(1, "Professional title is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  location: z.string().min(1, "Location is required"),
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
});

export const skillsSchema = z.object({
  languages: z.array(z.string()),
  frameworks: z.array(z.string()),
  databases: z.array(z.string()),
  tools: z.array(z.string()),
  cloud: z.array(z.string()),
  methodologies: z.array(z.string()),
});

export const experienceSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  achievements: z
    .array(z.string())
    .min(1, "At least one achievement is required"),
  technologies: z.array(z.string()),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  role: z.string().min(1, "Your role is required"),
  technologies: z.array(z.string()),
  link: z.string().url().optional().or(z.literal("")),
});

export const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  year: z.string().min(1, "Year is required"),
});

export const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  authority: z.string().min(1, "Issuing authority is required"),
  date: z.string().min(1, "Date is required"),
  certificateId: z.string().optional(),
  certificateLink: z.string().url().optional().or(z.literal("")),
});

export const resumeDataSchema = z.object({
  layout: z
    .enum([
      "classic",
      "modern",
      "compact",
      "professional",
      "minimal",
      "executive",
    ])
    .optional(),
  contact: contactSchema,
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  skills: skillsSchema,
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  education: z.array(educationSchema),
  certifications: z.array(certificationSchema),
});

export const createResumeSchema = z.object({
  title: z.string().min(1, "Resume title is required"),
  versionName: z.string().optional(),
  data: resumeDataSchema,
});

export const updateResumeSchema = z.object({
  title: z.string().min(1).optional(),
  versionName: z.string().optional(),
  data: resumeDataSchema.optional(),
});
