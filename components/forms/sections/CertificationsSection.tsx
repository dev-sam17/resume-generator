"use client";

import { FormSection } from "./FormSection";
import { FormField } from "./FormField";
import { DynamicListItem } from "./DynamicListItem";
import { Award } from "lucide-react";
import { UseFormRegister } from "react-hook-form";

interface CertificationsSectionProps {
  register: UseFormRegister<any>;
  certifications: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function CertificationsSection({
  register,
  certifications,
  onAdd,
  onRemove,
}: CertificationsSectionProps) {
  return (
    <FormSection
      title="Certifications"
      description="Professional certifications and credentials"
      icon={<Award className="h-5 w-5" />}
      colorScheme="certifications"
      onAdd={onAdd}
      addButtonText="Add Certification"
    >
      <div className="space-y-6">
        {certifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No certifications added yet.</p>
            <p className="text-sm">Click "Add Certification" to showcase your credentials.</p>
          </div>
        ) : (
          certifications.map((_, index) => (
            <DynamicListItem
              key={index}
              index={index}
              title="Certification"
              onRemove={() => onRemove(index)}
              colorScheme="certifications"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="Certification Name"
                  required
                  register={register(`data.certifications.${index}.name`)}
                  placeholder="AWS Certified Solutions Architect"
                />
                <FormField
                  label="Issuing Authority"
                  required
                  register={register(`data.certifications.${index}.authority`)}
                  placeholder="Amazon Web Services"
                />
                <FormField
                  label="Issue Date"
                  type="date"
                  required
                  register={register(`data.certifications.${index}.date`)}
                  helpText="When you received this certification"
                />
                <FormField
                  label="Certificate ID"
                  register={register(`data.certifications.${index}.certificateId`)}
                  placeholder="ABC123XYZ"
                  helpText="Optional credential ID or number"
                />
                <div className="md:col-span-2">
                  <FormField
                    label="Certificate Link"
                    type="url"
                    register={register(`data.certifications.${index}.certificateLink`)}
                    placeholder="https://verify.example.com/cert/123"
                    helpText="Optional verification or credential URL"
                  />
                </div>
              </div>
            </DynamicListItem>
          ))
        )}
      </div>
    </FormSection>
  );
}
