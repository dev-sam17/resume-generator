"use client";

import { useState, useEffect } from "react";
import { FormSection } from "./FormSection";
import { Code2, Eye, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { SkillInput } from "@/components/ui/skill-input";
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
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [categoryPanelCollapsed, setCategoryPanelCollapsed] = useState(false);

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
        // Initialize selected categories with default visible ones
        const defaultCategories = new Set([
          "languages",
          "frameworks",
          "databases",
          "tools",
          "cloud",
          "methodologies",
        ]);
        setSelectedCategories(defaultCategories);
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
        // Initialize selected categories with default visible ones
        const defaultCategories = new Set([
          "languages",
          "frameworks",
          "databases",
          "tools",
          "cloud",
          "methodologies",
        ]);
        setSelectedCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const toggleCategory = (categoryKey: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryKey)) {
        newSet.delete(categoryKey);
      } else {
        newSet.add(categoryKey);
      }
      return newSet;
    });
  };

  const handleSkillChange = (category: string, values: string[]) => {
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
        {/* Category Selection Checkboxes */}
        <div className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setCategoryPanelCollapsed(!categoryPanelCollapsed)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors"
          >
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Select Categories to Include
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                ({selectedCategories.size} selected)
              </span>
            </h4>
            {categoryPanelCollapsed ? (
              <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          {!categoryPanelCollapsed && (
            <div className="p-4 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <label
                    key={category.key}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-white/50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(category.key)}
                      onChange={() => toggleCategory(category.key)}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.name}
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                        ({category.count})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {categories
            .filter((category) => selectedCategories.has(category.key))
            .map((category) => (
              <SkillInput
                key={category.key}
                label={category.name}
                placeholder="Type and press Enter to add..."
                suggestions={category.skills}
                defaultValue={defaultData.data.skills[category.key] || []}
                onChange={(values) => handleSkillChange(category.key, values)}
                categoryKey={category.key}
                helpText={`${category.count}+ suggestions available. Press Enter to add.`}
              />
            ))}
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
