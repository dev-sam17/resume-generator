"use client";

import { useState, useEffect } from "react";
import { FormSection } from "./FormSection";
import { Code2, Eye, Loader2 } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { skillSuggestions } from "@/lib/skillSuggestions";

interface SkillCategory {
  id: string;
  name: string;
  key: string;
  description: string | null;
  skills: string[];
  count: number;
}

interface SkillsSectionProps {
  setValue: UseFormSetValue<any>;
  defaultData: any;
}

export function SkillsSection({ setValue, defaultData }: SkillsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/skills");
        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.warn("Database not available, using fallback skills:", err);
        // Fallback to hardcoded skills if database is not ready
        const fallbackCategories: SkillCategory[] = [
          {
            id: "fallback-1",
            name: "Programming Languages",
            key: "languages",
            description: "Programming and scripting languages",
            skills: skillSuggestions.languages,
            count: skillSuggestions.languages.length,
          },
          {
            id: "fallback-2",
            name: "Frameworks & Libraries",
            key: "frameworks",
            description: "Frontend, backend, and testing frameworks",
            skills: skillSuggestions.frameworks,
            count: skillSuggestions.frameworks.length,
          },
          {
            id: "fallback-3",
            name: "Databases & ORMs",
            key: "databases",
            description: "SQL, NoSQL databases and ORMs",
            skills: skillSuggestions.databases,
            count: skillSuggestions.databases.length,
          },
          {
            id: "fallback-4",
            name: "Tools & Technologies",
            key: "tools",
            description: "Development tools, IDEs, and utilities",
            skills: skillSuggestions.tools,
            count: skillSuggestions.tools.length,
          },
          {
            id: "fallback-5",
            name: "Cloud Platforms",
            key: "cloud",
            description: "Cloud services and infrastructure",
            skills: skillSuggestions.cloud,
            count: skillSuggestions.cloud.length,
          },
          {
            id: "fallback-6",
            name: "Methodologies & Practices",
            key: "methodologies",
            description: "Development methodologies and best practices",
            skills: skillSuggestions.methodologies,
            count: skillSuggestions.methodologies.length,
          },
        ];
        setCategories(fallbackCategories);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleSkillChange = (category: string, value: string) => {
    const values = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    setValue(`data.skills.${category}`, values);
  };

  const getCategoryByKey = (key: string) => {
    return categories.find((cat) => cat.key === key);
  };

  const totalSuggestions = categories.reduce((acc, cat) => acc + cat.count, 0);

  if (loading) {
    return (
      <FormSection
        title="Technical Skills"
        description="List your technical expertise by category"
        icon={<Code2 className="h-5 w-5" />}
        colorScheme="skills"
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading skills...
          </span>
        </div>
      </FormSection>
    );
  }

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
            className="bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform"
          >
            <Eye className="h-4 w-4 mr-2" />
            View All ({totalSuggestions})
          </Button>
        }
      >
        <div className="space-y-4">
          {getCategoryByKey("languages") && (
            <AutocompleteInput
              label={getCategoryByKey("languages")!.name}
              placeholder="Start typing to see suggestions..."
              suggestions={getCategoryByKey("languages")!.skills}
              defaultValue={defaultData.data.skills.languages.join(", ")}
              onChange={(value) => handleSkillChange("languages", value)}
              helpText={`Type to search from ${
                getCategoryByKey("languages")!.count
              }+ skills, or add your own`}
            />
          )}
          {getCategoryByKey("frameworks") && (
            <AutocompleteInput
              label={getCategoryByKey("frameworks")!.name}
              placeholder="Start typing to see suggestions..."
              suggestions={getCategoryByKey("frameworks")!.skills}
              defaultValue={defaultData.data.skills.frameworks.join(", ")}
              onChange={(value) => handleSkillChange("frameworks", value)}
              helpText={`Type to search from ${
                getCategoryByKey("frameworks")!.count
              }+ skills, or add your own`}
            />
          )}
          {getCategoryByKey("databases") && (
            <AutocompleteInput
              label={getCategoryByKey("databases")!.name}
              placeholder="Start typing to see suggestions..."
              suggestions={getCategoryByKey("databases")!.skills}
              defaultValue={defaultData.data.skills.databases.join(", ")}
              onChange={(value) => handleSkillChange("databases", value)}
              helpText={`Type to search from ${
                getCategoryByKey("databases")!.count
              }+ skills, or add your own`}
            />
          )}
          {getCategoryByKey("tools") && (
            <AutocompleteInput
              label={getCategoryByKey("tools")!.name}
              placeholder="Start typing to see suggestions..."
              suggestions={getCategoryByKey("tools")!.skills}
              defaultValue={defaultData.data.skills.tools.join(", ")}
              onChange={(value) => handleSkillChange("tools", value)}
              helpText={`Type to search from ${
                getCategoryByKey("tools")!.count
              }+ skills, or add your own`}
            />
          )}
          {getCategoryByKey("cloud") && (
            <AutocompleteInput
              label={getCategoryByKey("cloud")!.name}
              placeholder="Start typing to see suggestions..."
              suggestions={getCategoryByKey("cloud")!.skills}
              defaultValue={defaultData.data.skills.cloud.join(", ")}
              onChange={(value) => handleSkillChange("cloud", value)}
              helpText={`Type to search from ${
                getCategoryByKey("cloud")!.count
              }+ skills, or add your own`}
            />
          )}
          {getCategoryByKey("methodologies") && (
            <AutocompleteInput
              label={getCategoryByKey("methodologies")!.name}
              placeholder="Start typing to see suggestions..."
              suggestions={getCategoryByKey("methodologies")!.skills}
              defaultValue={
                defaultData.data.skills.methodologies?.join(", ") || ""
              }
              onChange={(value) => handleSkillChange("methodologies", value)}
              helpText={`Type to search from ${
                getCategoryByKey("methodologies")!.count
              }+ skills, or add your own`}
            />
          )}
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
              {categories.map((category) => (
                <div key={category.id}>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {category.name} ({category.count})
                  </h3>
                  {category.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 border-0"
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
