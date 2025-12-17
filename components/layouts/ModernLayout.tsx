"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { ResumeData } from "@/types/resume";

interface LayoutProps {
  data: ResumeData;
}

export function ModernLayout({ data }: LayoutProps) {
  const {
    contact,
    summary,
    skills,
    experience,
    projects,
    education,
    certifications,
  } = data;

  return (
    <div className="bg-white p-12 shadow-lg max-w-[210mm] mx-auto">
      {/* Header - Left aligned with accent */}
      <div className="border-l-4 border-blue-600 pl-4 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">
          {contact.fullName}
        </h1>
        <p className="text-xl text-blue-600 mb-3 font-medium">
          {contact.title}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <span>{contact.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{contact.location}</span>
          </div>
        </div>

        {(contact.linkedin || contact.github || contact.portfolio) && (
          <div className="flex flex-wrap gap-4 text-sm text-blue-600 mt-2">
            {contact.linkedin && (
              <a href={contact.linkedin} className="flex items-center gap-1">
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {contact.github && (
              <a href={contact.github} className="flex items-center gap-1">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            )}
            {contact.portfolio && (
              <a href={contact.portfolio} className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
            <span className="bg-blue-600 text-white px-3 py-1 text-sm uppercase tracking-wide">
              Professional Summary
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      {(skills.languages.length > 0 || skills.frameworks.length > 0) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
            <span className="bg-blue-600 text-white px-3 py-1 text-sm uppercase tracking-wide">
              Technical Skills
            </span>
          </h2>
          <div className="space-y-2">
            {skills.languages.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900">Languages: </span>
                <span className="text-gray-700">
                  {skills.languages.join(", ")}
                </span>
              </div>
            )}
            {skills.frameworks.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900">
                  Frameworks:{" "}
                </span>
                <span className="text-gray-700">
                  {skills.frameworks.join(", ")}
                </span>
              </div>
            )}
            {skills.databases.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900">Databases: </span>
                <span className="text-gray-700">
                  {skills.databases.join(", ")}
                </span>
              </div>
            )}
            {skills.tools.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900">Tools: </span>
                <span className="text-gray-700">{skills.tools.join(", ")}</span>
              </div>
            )}
            {skills.cloud.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900">Cloud: </span>
                <span className="text-gray-700">{skills.cloud.join(", ")}</span>
              </div>
            )}
            {skills.methodologies.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900">
                  Methodologies:{" "}
                </span>
                <span className="text-gray-700">
                  {skills.methodologies.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
            <span className="bg-blue-600 text-white px-3 py-1 text-sm uppercase tracking-wide">
              Work Experience
            </span>
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-blue-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {exp.title}
                    </h3>
                    <p className="text-gray-700 font-medium">
                      {exp.company} • {exp.location}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
                {exp.technologies && exp.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
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
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
            <span className="bg-blue-600 text-white px-3 py-1 text-sm uppercase tracking-wide">
              Projects
            </span>
          </h2>
          <div className="space-y-3">
            {projects.map((project, index) => (
              <div key={index} className="border-l-2 border-blue-200 pl-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.name}
                  </h3>
                  {project.link && (
                    <a
                      href={project.link}
                      className="text-sm text-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{project.role}</p>
                <p className="text-gray-700">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
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
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
            <span className="bg-blue-600 text-white px-3 py-1 text-sm uppercase tracking-wide">
              Education
            </span>
          </h2>
          <div className="space-y-2">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.institution}</p>
                </div>
                <span className="text-gray-600">{edu.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
            <span className="bg-blue-600 text-white px-3 py-1 text-sm uppercase tracking-wide">
              Certifications
            </span>
          </h2>
          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-700">{cert.authority}</p>
                </div>
                <span className="text-gray-600">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
