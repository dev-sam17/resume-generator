"use client"

import { ResumeData } from "@/types/resume"
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"

interface ResumePreviewProps {
  data: ResumeData
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const { contact, summary, skills, experience, projects, education, certifications } = data

  return (
    <div id="resume-preview" className="bg-white p-12 shadow-lg max-w-[210mm] mx-auto">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {contact.fullName}
        </h1>
        <p className="text-xl text-gray-700 mb-3">{contact.title}</p>
        
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
              <a href={contact.linkedin} className="flex items-center gap-1 hover:underline">
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {contact.github && (
              <a href={contact.github} className="flex items-center gap-1 hover:underline">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            )}
            {contact.portfolio && (
              <a href={contact.portfolio} className="flex items-center gap-1 hover:underline">
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
          <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      {(skills.languages.length > 0 || skills.frameworks.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase border-b border-gray-300 pb-1">
            Technical Skills
          </h2>
          <div className="space-y-2">
            {skills.languages.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800">Languages: </span>
                <span className="text-gray-700">{skills.languages.join(", ")}</span>
              </div>
            )}
            {skills.frameworks.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800">Frameworks: </span>
                <span className="text-gray-700">{skills.frameworks.join(", ")}</span>
              </div>
            )}
            {skills.databases.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800">Databases: </span>
                <span className="text-gray-700">{skills.databases.join(", ")}</span>
              </div>
            )}
            {skills.tools.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800">Tools: </span>
                <span className="text-gray-700">{skills.tools.join(", ")}</span>
              </div>
            )}
            {skills.cloud.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800">Cloud: </span>
                <span className="text-gray-700">{skills.cloud.join(", ")}</span>
              </div>
            )}
            {skills.methodologies.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800">Methodologies: </span>
                <span className="text-gray-700">{skills.methodologies.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-gray-700">{exp.company} • {exp.location}</p>
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
                {exp.technologies.length > 0 && (
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
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <a
                      href={project.link}
                      className="text-sm text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{project.role}</p>
                <p className="text-gray-700">{project.description}</p>
                {project.technologies.length > 0 && (
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
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">
            Education
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
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">
            Certifications
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
  )
}
