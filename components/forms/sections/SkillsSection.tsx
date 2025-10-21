"use client";

import { FormSection } from "./FormSection";
import { Code2 } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { skillSuggestions } from "@/lib/skillSuggestions";

interface SkillsSectionProps {
  setValue: UseFormSetValue<any>;
  defaultData: any;
}

export function SkillsSection({ setValue, defaultData }: SkillsSectionProps) {
  const handleSkillChange = (category: string, value: string) => {
    const values = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    setValue(`data.skills.${category}`, values);
  };

  return (
    <FormSection
      title="Technical Skills"
      description="List your technical expertise by category"
      icon={<Code2 className="h-5 w-5" />}
      colorScheme="skills"
    >
      <div className="space-y-4">
        <AutocompleteInput
          label="Programming Languages"
          placeholder="Start typing to see suggestions..."
          suggestions={skillSuggestions.languages}
          defaultValue={defaultData.data.skills.languages.join(", ")}
          onChange={(value) => handleSkillChange("languages", value)}
          helpText="Type to search from 40+ popular languages, or add your own"
        />
        <AutocompleteInput
          label="Frameworks & Libraries"
          placeholder="Start typing to see suggestions..."
          suggestions={skillSuggestions.frameworks}
          defaultValue={defaultData.data.skills.frameworks.join(", ")}
          onChange={(value) => handleSkillChange("frameworks", value)}
          helpText="Type to search from 80+ popular frameworks, or add your own"
        />
        <AutocompleteInput
          label="Databases"
          placeholder="Start typing to see suggestions..."
          suggestions={skillSuggestions.databases}
          defaultValue={defaultData.data.skills.databases.join(", ")}
          onChange={(value) => handleSkillChange("databases", value)}
          helpText="Type to search from 30+ databases, or add your own"
        />
        <AutocompleteInput
          label="Tools & Technologies"
          placeholder="Start typing to see suggestions..."
          suggestions={skillSuggestions.tools}
          defaultValue={defaultData.data.skills.tools.join(", ")}
          onChange={(value) => handleSkillChange("tools", value)}
          helpText="Type to search from 100+ tools, or add your own"
        />
        <AutocompleteInput
          label="Cloud Platforms"
          placeholder="Start typing to see suggestions..."
          suggestions={skillSuggestions.cloud}
          defaultValue={defaultData.data.skills.cloud.join(", ")}
          onChange={(value) => handleSkillChange("cloud", value)}
          helpText="Type to search from 40+ cloud services, or add your own"
        />
        <AutocompleteInput
          label="Methodologies & Practices"
          placeholder="Start typing to see suggestions..."
          suggestions={skillSuggestions.methodologies}
          defaultValue={defaultData.data.skills.methodologies?.join(", ") || ""}
          onChange={(value) => handleSkillChange("methodologies", value)}
          helpText="Type to search from 50+ methodologies, or add your own"
        />
      </div>
    </FormSection>
  );
}
