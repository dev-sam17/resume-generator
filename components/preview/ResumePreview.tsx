"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

interface ResumeData {
  contact: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  skills: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
    cloud: string[];
    methodologies?: string[];
  };
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    achievements: string[];
    technologies?: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    role: string;
    technologies: string[];
    link?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  certifications: Array<{
    name: string;
    authority: string;
    date: string;
  }>;
}

interface ResumePreviewProps {
  data: ResumeData;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const hasContent = data.contact.fullName || data.contact.email;

  if (!hasContent) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Live Preview</p>
          <p className="text-sm">Start filling the form to see your resume</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-lg p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-4 border-gradient-to-r from-blue-600 to-purple-600 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {data.contact.fullName || "Your Name"}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {data.contact.title || "Your Professional Title"}
        </p>
        
        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          {data.contact.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{data.contact.email}</span>
            </div>
          )}
          {data.contact.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{data.contact.phone}</span>
            </div>
          )}
          {data.contact.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{data.contact.location}</span>
            </div>
          )}
          {data.contact.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              <span className="truncate max-w-[150px]">LinkedIn</span>
            </div>
          )}
          {data.contact.github && (
            <div className="flex items-center gap-1">
              <Github className="h-4 w-4" />
              <span className="truncate max-w-[150px]">GitHub</span>
            </div>
          )}
          {data.contact.portfolio && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="truncate max-w-[150px]">Portfolio</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 border-b-2 border-blue-600 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {data.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {(data.skills.languages.length > 0 || 
        data.skills.frameworks.length > 0 || 
        data.skills.databases.length > 0 ||
        data.skills.tools.length > 0 ||
        data.skills.cloud.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 border-b-2 border-purple-600 pb-1">
            Technical Skills
          </h2>
          <div className="space-y-2">
            {data.skills.languages.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">Languages: </span>
                <span className="text-gray-700 dark:text-gray-300">{data.skills.languages.join(", ")}</span>
              </div>
            )}
            {data.skills.frameworks.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">Frameworks: </span>
                <span className="text-gray-700 dark:text-gray-300">{data.skills.frameworks.join(", ")}</span>
              </div>
            )}
            {data.skills.databases.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">Databases: </span>
                <span className="text-gray-700 dark:text-gray-300">{data.skills.databases.join(", ")}</span>
              </div>
            )}
            {data.skills.tools.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">Tools: </span>
                <span className="text-gray-700 dark:text-gray-300">{data.skills.tools.join(", ")}</span>
              </div>
            )}
            {data.skills.cloud.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">Cloud: </span>
                <span className="text-gray-700 dark:text-gray-300">{data.skills.cloud.join(", ")}</span>
              </div>
            )}
            {data.skills.methodologies && data.skills.methodologies.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">Methodologies: </span>
                <span className="text-gray-700 dark:text-gray-300">{data.skills.methodologies.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 border-b-2 border-cyan-600 pb-1">
            Work Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {exp.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {exp.company} • {exp.location}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </span>
                </div>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span className="font-semibold">Technologies: </span>
                    {exp.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 border-b-2 border-violet-600 pb-1">
            Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {project.name}
                  {project.link && (
                    <a href={project.link} className="text-blue-600 dark:text-blue-400 text-sm ml-2">
                      🔗
                    </a>
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{project.role}</p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Technologies: </span>
                    {project.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 border-b-2 border-emerald-600 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {edu.degree}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {edu.institution} • {edu.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 border-b-2 border-amber-600 pb-1">
            Certifications
          </h2>
          <div className="space-y-3">
            {data.certifications.map((cert, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {cert.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {cert.authority} • {cert.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FileText({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
