"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { ResumeData } from "@/types/resume";

interface LayoutProps {
  data: ResumeData;
}

export function ClassicLayout({ data }: LayoutProps) {
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
      {/* Header - Traditional centered */}
      <div className="text-center border-b-2 border-gray-900 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 uppercase tracking-wide">
          {contact.fullName}
        </h1>
        <p className="text-base text-gray-700 mb-3">{contact.title}</p>

        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            <span>{contact.email}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            <span>{contact.phone}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{contact.location}</span>
          </div>
        </div>

        {(contact.linkedin || contact.github || contact.portfolio) && (
          <div className="flex flex-wrap justify-center gap-3 text-xs text-blue-700 mt-2">
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

      {/* Professional Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-400 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      {Object.keys(skills).some(
        (key) => skills[key as keyof typeof skills]?.length > 0
      ) && (
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-400 pb-1">
            Technical Skills
          </h2>
          <div className="space-y-1 text-sm">
            {Object.entries(skills).map(([category, skillList]) => {
              if (!Array.isArray(skillList) || skillList.length === 0)
                return null;

              const categoryName = category
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
                .trim();

              return (
                <div key={category}>
                  <span className="font-semibold text-gray-900">
                    {categoryName}:{" "}
                  </span>
                  <span className="text-gray-700">{skillList.join(", ")}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-400 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {exp.title}
                    </h3>
                    <p className="text-gray-700 text-sm italic">
                      {exp.company}, {exp.location}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 whitespace-nowrap ml-2">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-0.5 text-gray-700 text-sm">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
                {exp.technologies && exp.technologies.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1 italic">
                    Technologies: {exp.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-400 pb-1">
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
                      {project.link}
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-600 italic mb-1">
                  {project.role}
                </p>
                <p className="text-gray-700 text-sm">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1 italic">
                    Technologies: {project.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-400 pb-1">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {edu.degree}
                  </h3>
                  <p className="text-gray-700 text-sm">{edu.institution}</p>
                </div>
                <span className="text-sm text-gray-600 ml-2">{edu.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-400 pb-1">
            Certifications
          </h2>
          <div className="space-y-1">
            {certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {cert.name}
                  </h3>
                  <p className="text-gray-700 text-xs">{cert.authority}</p>
                </div>
                <span className="text-xs text-gray-600 ml-2">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
