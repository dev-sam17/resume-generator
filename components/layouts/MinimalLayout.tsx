"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { ResumeData } from "@/types/resume";

interface LayoutProps {
  data: ResumeData;
}

export function MinimalLayout({ data }: LayoutProps) {
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
      {/* Header - Ultra minimal */}
      <div className="mb-8">
        <h1 className="text-5xl font-light text-gray-900 mb-1">
          {contact.fullName}
        </h1>
        <p className="text-xl text-gray-600 mb-4">{contact.title}</p>

        <div className="flex flex-wrap gap-3 text-sm text-gray-600 border-t border-gray-200 pt-3">
          <span>{contact.email}</span>
          <span>•</span>
          <span>{contact.phone}</span>
          <span>•</span>
          <span>{contact.location}</span>
          {contact.linkedin && (
            <>
              <span>•</span>
              <a href={contact.linkedin} className="text-gray-900">
                LinkedIn
              </a>
            </>
          )}
          {contact.github && (
            <>
              <span>•</span>
              <a href={contact.github} className="text-gray-900">
                GitHub
              </a>
            </>
          )}
          {contact.portfolio && (
            <>
              <span>•</span>
              <a href={contact.portfolio} className="text-gray-900">
                Portfolio
              </a>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">
            About
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {exp.title}
                  </h3>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  {exp.company}, {exp.location}
                </p>
                <ul className="space-y-1 text-gray-700">
                  {exp.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="pl-4 relative before:content-['—'] before:absolute before:left-0"
                    >
                      {achievement}
                    </li>
                  ))}
                </ul>
                {exp.technologies && exp.technologies.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {exp.technologies.join(" • ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-medium text-gray-900">
                    {project.name}
                  </h3>
                  {project.link && (
                    <a
                      href={project.link}
                      className="text-sm text-gray-900 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{project.role}</p>
                <p className="text-gray-700">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {project.technologies.join(" • ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {(skills.languages.length > 0 || skills.frameworks.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">
            Skills
          </h2>
          <div className="space-y-2">
            {skills.languages.length > 0 && (
              <div>
                <span className="font-medium text-gray-900">Languages: </span>
                <span className="text-gray-700">
                  {skills.languages.join(" • ")}
                </span>
              </div>
            )}
            {skills.frameworks.length > 0 && (
              <div>
                <span className="font-medium text-gray-900">Frameworks: </span>
                <span className="text-gray-700">
                  {skills.frameworks.join(" • ")}
                </span>
              </div>
            )}
            {skills.databases.length > 0 && (
              <div>
                <span className="font-medium text-gray-900">Databases: </span>
                <span className="text-gray-700">
                  {skills.databases.join(" • ")}
                </span>
              </div>
            )}
            {skills.tools.length > 0 && (
              <div>
                <span className="font-medium text-gray-900">Tools: </span>
                <span className="text-gray-700">
                  {skills.tools.join(" • ")}
                </span>
              </div>
            )}
            {skills.cloud.length > 0 && (
              <div>
                <span className="font-medium text-gray-900">Cloud: </span>
                <span className="text-gray-700">
                  {skills.cloud.join(" • ")}
                </span>
              </div>
            )}
            {skills.methodologies.length > 0 && (
              <div>
                <span className="font-medium text-gray-900">
                  Methodologies:{" "}
                </span>
                <span className="text-gray-700">
                  {skills.methodologies.join(" • ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Education & Certifications in a grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div key={index}>
                  <h3 className="font-medium text-gray-900">{cert.name}</h3>
                  <p className="text-gray-700">{cert.authority}</p>
                  <p className="text-sm text-gray-500">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
