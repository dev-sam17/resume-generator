"use client";

import { useState } from "react";
import { FormSection } from "./FormSection";
import { Code2, Eye } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { skillSuggestions } from "@/lib/skillSuggestions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface SkillsSectionProps {
  setValue: UseFormSetValue<any>;
  defaultData: any;
}

export function SkillsSection({ setValue, defaultData }: SkillsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSkillChange = (category: string, value: string) => {
    const values = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    setValue(`data.skills.${category}`, values);
  };

  const allSkillSuggestions = {
    "Programming Languages": skillSuggestions.languages || [],
    "Frameworks & Libraries": skillSuggestions.frameworks || [],
    "Databases & ORMs": skillSuggestions.databases || [],
    "Tools & Technologies": skillSuggestions.tools || [],
    "Cloud Platforms": skillSuggestions.cloud || [],
    "Methodologies & Practices": skillSuggestions.methodologies || [],
  };

  const totalSuggestions = Object.values(allSkillSuggestions).reduce((acc, skills) => acc + skills.length, 0);

  return (
    <>
      <FormSection
        title="Technical Skills"
        description="List your technical expertise by category"
        icon={<Code2 className="h-5 w-5" />}
        colorScheme="skills"
        headerActions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform"
          >
            <Eye className="h-4 w-4 mr-2" />
            View All ({totalSuggestions})
          </Button>
        }
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
          label="Databases & ORMs"
          placeholder="Start typing to see suggestions..."
          suggestions={skillSuggestions.databases}
          defaultValue={defaultData.data.skills.databases.join(", ")}
          onChange={(value) => handleSkillChange("databases", value)}
          helpText="Type to search from 50+ databases and ORMs, or add your own"
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

      {/* Skills Overview Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Available Skill Suggestions
            </DialogTitle>
            <DialogDescription>
              Browse all available skill suggestions ({totalSuggestions} total)
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-6">
              {Object.entries(allSkillSuggestions).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {category} ({(skills as string[]).length})
                  </h3>
                  {(skills as string[]).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(skills as string[]).map((skill: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 border-0"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No suggestions available
                    </p>
                  )}
                </div>
              ))}
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}
