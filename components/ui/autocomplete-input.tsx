"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Check, X } from "lucide-react";
import { Badge } from "./badge";

interface AutocompleteInputProps {
  label: string;
  placeholder?: string;
  suggestions: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  helpText?: string;
  id?: string;
}

export function AutocompleteInput({
  label,
  placeholder,
  suggestions,
  defaultValue = "",
  onChange,
  helpText,
  id,
}: AutocompleteInputProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    defaultValue ? defaultValue.split(",").map((s) => s.trim()).filter(Boolean) : []
  );
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  // Update filtered suggestions when input changes
  useEffect(() => {
    if (inputValue.trim()) {
      const lastItem = inputValue.split(",").pop()?.trim() || "";
      if (lastItem) {
        const filtered = suggestions
          .filter(
            (suggestion) =>
              suggestion.toLowerCase().includes(lastItem.toLowerCase()) &&
              !selectedSkills.includes(suggestion)
          )
          .slice(0, 10); // Limit to 10 suggestions
        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, selectedSkills]);

  // Close dropdown when clicking outside
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
    if (!selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      
      // Update input value
      const items = inputValue.split(",").map((s) => s.trim());
      items.pop(); // Remove the last incomplete item
      const newValue = newSkills.join(", ");
      setInputValue(newValue);
      
      // Notify parent
      if (onChange) {
        onChange(newValue);
      }
    }
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = selectedSkills.filter((skill) => skill !== skillToRemove);
    setSelectedSkills(newSkills);
    const newValue = newSkills.join(", ");
    setInputValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
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
    } else if (e.key === "Enter" && showSuggestions && filteredSuggestions.length > 0) {
      e.preventDefault();
      addSkill(filteredSuggestions[activeSuggestionIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      
      {/* Selected Skills Badges */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          {selectedSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="flex items-center gap-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 border-0"
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

      {/* Input Field */}
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

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 rounded-lg shadow-xl max-h-60 overflow-y-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addSkill(suggestion)}
                className={`w-full text-left px-4 py-2.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                  index === activeSuggestionIndex
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
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
      </div>

      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  );
}
