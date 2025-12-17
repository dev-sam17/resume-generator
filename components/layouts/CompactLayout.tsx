"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { ResumeData } from "@/types/resume";

interface LayoutProps {
  data: ResumeData;
}

export function CompactLayout({ data }: LayoutProps) {
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
    <div className="bg-white p-8 shadow-lg max-w-[210mm] mx-auto text-sm">
      {/* Header - Compact with side-by-side layout */}
      <div className="border-b border-gray-800 pb-3 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {contact.fullName}
            </h1>
            <p className="text-base text-gray-700 font-medium">
              {contact.title}
            </p>
          </div>
          <div className="text-right text-xs text-gray-600 space-y-0.5">
            <div className="flex items-center justify-end gap-1">
              <Mail className="h-3 w-3" />
              <span>{contact.email}</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              <Phone className="h-3 w-3" />
              <span>{contact.phone}</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              <MapPin className="h-3 w-3" />
              <span>{contact.location}</span>
            </div>
          </div>
        </div>

        {(contact.linkedin || contact.github || contact.portfolio) && (
          <div className="flex flex-wrap gap-3 text-xs text-blue-700 mt-2">
            {contact.linkedin && (
              <a href={contact.linkedin} className="flex items-center gap-1">
                <Linkedin className="h-3 w-3" />
                <span>LinkedIn</span>
              </a>
            )}
            {contact.github && (
              <a href={contact.github} className="flex items-center gap-1">
                <Github className="h-3 w-3" />
                <span>GitHub</span>
              </a>
            )}
            {contact.portfolio && (
              <a href={contact.portfolio} className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column - Skills, Education, Certifications */}
        <div className="space-y-4">
          {/* Technical Skills */}
          {(skills.languages.length > 0 || skills.frameworks.length > 0) && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase border-b border-gray-400">
                Skills
              </h2>
              <div className="space-y-1 text-xs">
                {skills.languages.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-900">
                      Languages:
                    </span>
                    <div className="text-gray-700">
                      {skills.languages.join(", ")}
                    </div>
                  </div>
                )}
                {skills.frameworks.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-900">
                      Frameworks:
                    </span>
                    <div className="text-gray-700">
                      {skills.frameworks.join(", ")}
                    </div>
                  </div>
                )}
                {skills.databases.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-900">
                      Databases:
                    </span>
                    <div className="text-gray-700">
                      {skills.databases.join(", ")}
                    </div>
                  </div>
                )}
                {skills.tools.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-900">Tools:</span>
                    <div className="text-gray-700">
                      {skills.tools.join(", ")}
                    </div>
                  </div>
                )}
                {skills.cloud.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-900">Cloud:</span>
                    <div className="text-gray-700">
                      {skills.cloud.join(", ")}
                    </div>
                  </div>
                )}
                {skills.methodologies.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-900">
                      Methods:
                    </span>
                    <div className="text-gray-700">
                      {skills.methodologies.join(", ")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase border-b border-gray-400">
                Education
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-gray-700">{edu.institution}</p>
                    <p className="text-gray-600">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase border-b border-gray-400">
                Certifications
              </h2>
              <div className="space-y-1 text-xs">
                {certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-gray-700">{cert.authority}</p>
                    <p className="text-gray-600">{cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary, Experience, Projects */}
        <div className="col-span-2 space-y-4">
          {/* Professional Summary */}
          {summary && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase border-b border-gray-400">
                Summary
              </h2>
              <p className="text-gray-700 leading-relaxed text-xs">{summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase border-b border-gray-400">
                Experience
              </h2>
              <div className="space-y-3">
                {experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-gray-900 text-sm">
                        {exp.title}
                      </h3>
                      <span className="text-xs text-gray-600 whitespace-nowrap">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="text-gray-700 text-xs mb-1">
                      {exp.company} • {exp.location}
                    </p>
                    <ul className="list-disc list-outside ml-4 space-y-0.5 text-gray-700 text-xs">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                    {exp.technologies && exp.technologies.length > 0 && (
                      <p className="text-xs text-gray-600 mt-0.5">
                        <span className="font-semibold">Tech: </span>
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
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase border-b border-gray-400">
                Projects
              </h2>
              <div className="space-y-2">
                {projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-gray-900 text-sm">
                        {project.name}
                      </h3>
                      {project.link && (
                        <a
                          href={project.link}
                          className="text-xs text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Link
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{project.role}</p>
                    <p className="text-gray-700 text-xs">
                      {project.description}
                    </p>
                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          <span className="font-semibold">Tech: </span>
                          {project.technologies.join(", ")}
                        </p>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
