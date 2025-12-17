"use client";

import { useState, useEffect } from "react";
import { FormSection } from "./FormSection";
import { FormField } from "./FormField";
import { DynamicListItem } from "./DynamicListItem";
import { SkillInput } from "@/components/ui/skill-input";
import { FolderGit2 } from "lucide-react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface ProjectsSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  projects: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function ProjectsSection({
  register,
  setValue,
  projects,
  onAdd,
  onRemove,
}: ProjectsSectionProps) {
  const [allSkills, setAllSkills] = useState<string[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills");
        if (response.ok) {
          const data = await response.json();
          const skills = data.categories.flatMap((cat: any) => cat.skills);
          setAllSkills(skills);
        }
      } catch (error) {
        console.warn("Failed to fetch skills:", error);
      }
    };
    fetchSkills();
  }, []);

  return (
    <FormSection
      title="Projects"
      description="Showcase your notable projects and contributions"
      icon={<FolderGit2 className="h-5 w-5" />}
      colorScheme="projects"
      onAdd={onAdd}
      addButtonText="Add Project"
    >
      <div className="space-y-6">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FolderGit2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No projects added yet.</p>
            <p className="text-sm">
              Click "Add Project" to showcase your work.
            </p>
          </div>
        ) : (
          projects.map((_, index) => (
            <DynamicListItem
              key={index}
              index={index}
              title="Project"
              onRemove={() => onRemove(index)}
              colorScheme="projects"
            >
              <div className="space-y-4">
                <FormField
                  label="Project Name"
                  required
                  register={register(`data.projects.${index}.name`)}
                  placeholder="E-commerce Platform"
                />
                <FormField
                  label="Description"
                  type="textarea"
                  required
                  register={register(`data.projects.${index}.description`)}
                  placeholder="Built a full-stack e-commerce platform with real-time inventory management..."
                  rows={3}
                  helpText="Describe what the project does and its impact"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    label="Your Role"
                    required
                    register={register(`data.projects.${index}.role`)}
                    placeholder="Full Stack Developer"
                  />
                  <FormField
                    label="Project Link"
                    type="url"
                    register={register(`data.projects.${index}.link`)}
                    placeholder="https://github.com/user/project"
                    helpText="GitHub, live demo, or portfolio link"
                  />
                </div>
                <SkillInput
                  label="Technologies Used"
                  placeholder="Type and press Enter to add..."
                  suggestions={allSkills}
                  defaultValue={projects[index]?.technologies || []}
                  onChange={(values) =>
                    setValue(`data.projects.${index}.technologies`, values)
                  }
                  helpText="Select from suggestions or add custom technologies"
                />
              </div>
            </DynamicListItem>
          ))
        )}
      </div>
    </FormSection>
  );
}
