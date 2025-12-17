"use client";

import { useState, useEffect } from "react";
import { FormSection } from "./FormSection";
import { FormField } from "./FormField";
import { DynamicListItem } from "./DynamicListItem";
import { SkillInput } from "@/components/ui/skill-input";
import { Briefcase } from "lucide-react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface ExperienceSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  experiences: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function ExperienceSection({
  register,
  setValue,
  experiences,
  onAdd,
  onRemove,
}: ExperienceSectionProps) {
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
      title="Work Experience"
      description="Your professional work history"
      icon={<Briefcase className="h-5 w-5" />}
      colorScheme="experience"
      onAdd={onAdd}
      addButtonText="Add Experience"
    >
      <div className="space-y-6">
        {experiences.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No work experience added yet.</p>
            <p className="text-sm">Click "Add Experience" to get started.</p>
          </div>
        ) : (
          experiences.map((_, index) => (
            <DynamicListItem
              key={index}
              index={index}
              title="Work Experience"
              onRemove={() => onRemove(index)}
              colorScheme="experience"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="Job Title"
                  required
                  register={register(`data.experience.${index}.title`)}
                  placeholder="Senior Software Engineer"
                />
                <FormField
                  label="Company"
                  required
                  register={register(`data.experience.${index}.company`)}
                  placeholder="Tech Corp Inc."
                />
                <FormField
                  label="Location"
                  required
                  register={register(`data.experience.${index}.location`)}
                  placeholder="San Francisco, CA / Remote"
                />
                <FormField
                  label="Start Date"
                  type="date"
                  required
                  register={register(`data.experience.${index}.startDate`)}
                />
                <FormField
                  label="End Date"
                  register={register(`data.experience.${index}.endDate`)}
                  placeholder="Present"
                  helpText="Leave as 'Present' if currently working"
                />
                <div className="md:col-span-2">
                  <SkillInput
                    label="Technologies Used"
                    placeholder="Type and press Enter to add..."
                    suggestions={allSkills}
                    defaultValue={experiences[index]?.technologies || []}
                    onChange={(values) =>
                      setValue(`data.experience.${index}.technologies`, values)
                    }
                    helpText="Select from suggestions or add custom technologies"
                  />
                </div>
              </div>
              <FormField
                label="Key Achievements & Responsibilities"
                type="textarea"
                required
                register={register(`data.experience.${index}.achievements.0`)}
                placeholder="• Led development of scalable microservices architecture&#10;• Improved system performance by 40% through optimization&#10;• Mentored 5 junior developers"
                rows={4}
                onChange={(e) => {
                  const achievements = e.target.value
                    .split("\n")
                    .map((a) => a.trim())
                    .filter(Boolean);
                  setValue(
                    `data.experience.${index}.achievements`,
                    achievements
                  );
                }}
                helpText="One achievement per line, start with bullet points"
              />
            </DynamicListItem>
          ))
        )}
      </div>
    </FormSection>
  );
}
