"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Check, X, Plus, Database, FolderOpen } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from "./dialog";

interface SkillInputProps {
  label: string;
  placeholder?: string;
  suggestions: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  helpText?: string;
  id?: string;
  categoryKey?: string;
}

export function SkillInput({
  label,
  placeholder,
  suggestions,
  defaultValue = [],
  onChange,
  helpText,
  id,
  categoryKey,
}: SkillInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(defaultValue);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [isAddingToDb, setIsAddingToDb] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [pendingSkill, setPendingSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<
    Array<{ key: string; name: string }>
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    if (inputValue.trim()) {
      // Remove duplicates and filter
      const uniqueSuggestions = Array.from(new Set(suggestions));
      const filtered = uniqueSuggestions
        .filter(
          (suggestion) =>
            suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedSkills.includes(suggestion)
        )
        .slice(0, 10);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, selectedSkills]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setActiveSuggestionIndex(0);
  };

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill) && skill.trim()) {
      const newSkills = [...selectedSkills, skill.trim()];
      setSelectedSkills(newSkills);
      setInputValue("");

      if (onChange) {
        onChange(newSkills);
      }
    }
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = selectedSkills.filter((skill) => skill !== skillToRemove);
    setSelectedSkills(newSkills);

    if (onChange) {
      onChange(newSkills);
    }
  };

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch("/api/skills");
      if (response.ok) {
        const data = await response.json();
        const cats = data.categories.map((cat: any) => ({
          key: cat.key,
          name: cat.name,
        }));
        setCategories(cats);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleAddToDatabase = async (skillName: string, category: string) => {
    if (!skillName.trim() || !category) return;

    setIsAddingToDb(true);
    try {
      const response = await fetch("/api/skills/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: skillName.trim(),
          categoryKey: category,
        }),
      });

      if (response.ok) {
        addSkill(skillName.trim());
        setShowConfirmDialog(false);
        setShowCategoryDialog(false);
        setPendingSkill("");
        setSelectedCategory("");
      } else {
        const error = await response.json();
        console.error("Failed to add skill:", error.error);
      }
    } catch (error) {
      console.error("Error adding skill:", error);
    } finally {
      setIsAddingToDb(false);
    }
  };

  const promptAddToDatabase = async () => {
    setPendingSkill(inputValue.trim());

    // If categoryKey is provided, show confirmation dialog
    // Otherwise, show category selection dialog
    if (categoryKey) {
      setSelectedCategory(categoryKey);
      setShowConfirmDialog(true);
    } else {
      await fetchCategories();
      setShowCategoryDialog(true);
    }
  };

  const confirmAddToDatabase = () => {
    handleAddToDatabase(pendingSkill, selectedCategory);
  };

  const cancelAddToDatabase = () => {
    setShowConfirmDialog(false);
    setShowCategoryDialog(false);
    setPendingSkill("");
    setSelectedCategory("");
    inputRef.current?.focus();
  };

  const handleCategorySelected = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDialog(false);
    setShowConfirmDialog(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showSuggestions && filteredSuggestions.length > 0) {
        addSkill(filteredSuggestions[activeSuggestionIndex]);
      } else if (inputValue.trim()) {
        addSkill(inputValue.trim());
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const showAddToDbButton =
    inputValue.trim() &&
    !showSuggestions &&
    !selectedSkills.includes(inputValue.trim());

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>

      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          {selectedSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="flex items-center gap-1 bg-linear-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 border-0"
            >
              <Check className="h-3 w-3" />
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <Input
          ref={inputRef}
          id={inputId}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className="w-full"
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 rounded-lg shadow-xl max-h-60 overflow-y-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={`${suggestion}-${index}`}
                type="button"
                onClick={() => addSkill(suggestion)}
                className={`w-full text-left px-4 py-2.5 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                  index === activeSuggestionIndex
                    ? "bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {suggestion}
                  </span>
                  {index === activeSuggestionIndex && (
                    <span className="text-xs text-purple-600 dark:text-purple-400">
                      Press Enter
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {showAddToDbButton && !showConfirmDialog && (
          <div className="mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={promptAddToDatabase}
              disabled={isAddingToDb}
              className="w-full border-dashed border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add "{inputValue.trim()}" to database
            </Button>
          </div>
        )}

        {showConfirmDialog && (
          <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Add "{pendingSkill}" to the skills database?
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={confirmAddToDatabase}
                disabled={isAddingToDb}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAddingToDb ? (
                  <>
                    <Database className="h-4 w-4 mr-2 animate-pulse" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Confirm
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={cancelAddToDatabase}
                disabled={isAddingToDb}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}

      {/* Category Selection Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Select Category for "{pendingSkill}"
            </DialogTitle>
            <DialogDescription>
              Choose which category this skill belongs to
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            {isLoadingCategories ? (
              <div className="flex items-center justify-center py-8">
                <Database className="h-8 w-8 animate-pulse text-purple-600 dark:text-purple-400" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  Loading categories...
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => handleCategorySelected(category.key)}
                    className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {category.key}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={cancelAddToDatabase}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}
