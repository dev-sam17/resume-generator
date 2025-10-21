"use client";

import { FormSection } from "./FormSection";
import { FormField } from "./FormField";
import { DynamicListItem } from "./DynamicListItem";
import { GraduationCap } from "lucide-react";
import { UseFormRegister } from "react-hook-form";

interface EducationSectionProps {
  register: UseFormRegister<any>;
  education: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function EducationSection({
  register,
  education,
  onAdd,
  onRemove,
}: EducationSectionProps) {
  return (
    <FormSection
      title="Education"
      description="Your academic background and qualifications"
      icon={<GraduationCap className="h-5 w-5" />}
      colorScheme="education"
      onAdd={onAdd}
      addButtonText="Add Education"
    >
      <div className="space-y-6">
        {education.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No education added yet.</p>
            <p className="text-sm">Click "Add Education" to include your degrees.</p>
          </div>
        ) : (
          education.map((_, index) => (
            <DynamicListItem
              key={index}
              index={index}
              title="Education"
              onRemove={() => onRemove(index)}
              colorScheme="education"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="Degree"
                  required
                  register={register(`data.education.${index}.degree`)}
                  placeholder="B.S. Computer Science"
                />
                <FormField
                  label="Institution"
                  required
                  register={register(`data.education.${index}.institution`)}
                  placeholder="Stanford University"
                />
                <FormField
                  label="Graduation Year"
                  required
                  register={register(`data.education.${index}.year`)}
                  placeholder="2020"
                  helpText="Year of graduation or expected graduation"
                />
              </div>
            </DynamicListItem>
          ))
        )}
      </div>
    </FormSection>
  );
}
