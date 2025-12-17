"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { ResumeData } from "@/types/resume";

interface LayoutProps {
  data: ResumeData;
}

export function ProfessionalLayout({ data }: LayoutProps) {
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
      {/* Header - Professional with gray background */}
      <div className="bg-gray-100 -mx-12 -mt-12 px-12 pt-8 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {contact.fullName}
        </h1>
        <p className="text-lg text-gray-700 mb-3">{contact.title}</p>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-600" />
            <span>{contact.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-600" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span>{contact.location}</span>
          </div>
          {contact.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-blue-700" />
              <a href={contact.linkedin} className="text-blue-700">
                LinkedIn
              </a>
            </div>
          )}
          {contact.github && (
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-gray-700" />
              <a href={contact.github} className="text-gray-700">
                GitHub
              </a>
            </div>
          )}
          {contact.portfolio && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-700" />
              <a href={contact.portfolio} className="text-blue-700">
                Portfolio
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b-2 border-gray-900">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Core Competencies / Skills */}
      {(skills.languages.length > 0 || skills.frameworks.length > 0) && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b-2 border-gray-900">
            CORE COMPETENCIES
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
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
          <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b-2 border-gray-900">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {exp.title}
                    </h3>
                    <p className="text-gray-700">
                      {exp.company} | {exp.location}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
                {exp.technologies && exp.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Technologies Used: </span>
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
          <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b-2 border-gray-900">
            KEY PROJECTS
          </h2>
          <div className="space-y-3">
            {projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <a
                      href={project.link}
                      className="text-sm text-blue-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.link}
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

      <div className="grid grid-cols-2 gap-6">
        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b-2 border-gray-900">
              EDUCATION
            </h2>
            <div className="space-y-2">
              {education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-600">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b-2 border-gray-900">
              CERTIFICATIONS
            </h2>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-700">{cert.authority}</p>
                  <p className="text-sm text-gray-600">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
