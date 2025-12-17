"use client";

import { LayoutType } from "@/types/resume";
import { Check } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";

interface LayoutSectionProps {
  currentLayout: LayoutType;
  setValue: UseFormSetValue<any>;
}

const layouts = [
  {
    id: "classic" as LayoutType,
    name: "Classic",
    description:
      "Traditional centered header with bold section headers. Perfect for conservative industries.",
    features: ["Centered header", "Traditional formatting", "Clean typography"],
  },
  {
    id: "modern" as LayoutType,
    name: "Modern",
    description:
      "Contemporary design with blue accent colors and left-aligned header with border.",
    features: ["Blue accent bars", "Left border header", "Modern spacing"],
  },
  {
    id: "compact" as LayoutType,
    name: "Compact",
    description:
      "Two-column layout maximizing content density. Ideal for extensive experience.",
    features: ["Two-column design", "Space-efficient", "Skills sidebar"],
  },
  {
    id: "professional" as LayoutType,
    name: "Professional",
    description:
      "Gray header background with grid layout. Corporate and polished appearance.",
    features: ["Gray header section", "Grid contact layout", "Bold headers"],
  },
  {
    id: "minimal" as LayoutType,
    name: "Minimal",
    description:
      "Ultra-clean design with light typography and maximum whitespace.",
    features: ["Light font weights", "Minimal borders", "Elegant spacing"],
  },
  {
    id: "executive" as LayoutType,
    name: "Executive",
    description:
      "Senior-level design with prominent header border and bold typography.",
    features: ["Bold black borders", "Executive styling", "Prominent sections"],
  },
];

export function LayoutSection({ currentLayout, setValue }: LayoutSectionProps) {
  const handleLayoutChange = (layoutId: LayoutType) => {
    setValue("data.layout", layoutId, { shouldDirty: true });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Choose a layout style for your resume. All layouts are ATS-friendly and
        optimized for both digital viewing and PDF export.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            type="button"
            onClick={() => handleLayoutChange(layout.id)}
            className={`
              relative p-4 rounded-lg border-2 text-left transition-all
              ${
                currentLayout === layout.id
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-400 bg-white dark:bg-gray-800"
              }
            `}
          >
            {currentLayout === layout.id && (
              <div className="absolute top-2 right-2">
                <div className="bg-blue-600 text-white rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              </div>
            )}

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {layout.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {layout.description}
            </p>

            <ul className="space-y-1">
              {layout.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="text-xs text-gray-500 dark:text-gray-500 flex items-center"
                >
                  <span className="mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
}
