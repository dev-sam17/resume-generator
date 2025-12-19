"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { ResumeData } from "@/types/resume";

interface LayoutProps {
  data: ResumeData;
}

export function ExecutiveLayout({ data }: LayoutProps) {
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
      {/* Header - Executive style with sidebar */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-1 border-b-4 border-black pb-2">
          {contact.fullName}
        </h1>
        <p className="text-xl text-gray-700 font-semibold mt-3">
          {contact.title}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Contact in columns */}
        <div className="text-sm text-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4 text-gray-600" />
            <span>{contact.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-600" />
            <span>{contact.phone}</span>
          </div>
        </div>

        <div className="text-sm text-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span>{contact.location}</span>
          </div>
          {contact.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-blue-700" />
              <a
                href={contact.linkedin}
                className="text-blue-700 hover:underline"
              >
                LinkedIn Profile
              </a>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-700">
          {contact.github && (
            <div className="flex items-center gap-2 mb-1">
              <Github className="h-4 w-4 text-gray-700" />
              <a
                href={contact.github}
                className="text-gray-700 hover:underline"
              >
                GitHub Profile
              </a>
            </div>
          )}
          {contact.portfolio && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-700" />
              <a
                href={contact.portfolio}
                className="text-blue-700 hover:underline"
              >
                Portfolio
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-6 bg-gray-50 p-4 border-l-4 border-black">
          <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
            Executive Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider pb-2 border-b-2 border-black">
            Professional Experience
          </h2>
          <div className="space-y-5">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {exp.title}
                    </h3>
                    <p className="text-gray-700 font-semibold">{exp.company}</p>
                    <p className="text-sm text-gray-600">{exp.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                </div>
                <ul className="list-none space-y-1 text-gray-700">
                  {exp.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="pl-4 relative before:content-['▪'] before:absolute before:left-0 before:text-black before:font-bold"
                    >
                      {achievement}
                    </li>
                  ))}
                </ul>
                {exp.technologies && exp.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2 pl-4">
                    <span className="font-semibold">Key Technologies: </span>
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
          <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider pb-2 border-b-2 border-black">
            Notable Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-base font-bold text-gray-900">
                    {project.name}
                  </h3>
                  {project.link && (
                    <a
                      href={project.link}
                      className="text-sm text-blue-700 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-semibold mb-1">
                  {project.role}
                </p>
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

      {/* Technical Skills */}
      {Object.keys(skills).some(
        (key) => skills[key as keyof typeof skills]?.length > 0
      ) && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider pb-2 border-b-2 border-black">
            Technical Expertise
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {Object.entries(skills).map(([category, skillList]) => {
              if (!Array.isArray(skillList) || skillList.length === 0)
                return null;

              const categoryName = category
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
                .trim();

              return (
                <div key={category}>
                  <span className="font-bold text-gray-900">
                    {categoryName}:{" "}
                  </span>
                  <span className="text-gray-700">{skillList.join(", ")}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider pb-2 border-b-2 border-black">
              Education
            </h2>
            <div className="space-y-3">
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
            <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider pb-2 border-b-2 border-black">
              Certifications
            </h2>
            <div className="space-y-3">
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
