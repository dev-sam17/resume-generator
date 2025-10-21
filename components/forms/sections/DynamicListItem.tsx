"use client";

import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { ReactNode } from "react";

interface DynamicListItemProps {
  index: number;
  title: string;
  onRemove: () => void;
  children: ReactNode;
  colorScheme?: "experience" | "projects" | "education" | "certifications";
}

const colorSchemes = {
  experience: {
    border: "border-cyan-500 dark:border-cyan-400",
    bg: "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30",
    hoverBg: "hover:bg-gradient-to-br hover:from-cyan-100 hover:to-blue-100 dark:hover:from-cyan-950/50 dark:hover:to-blue-950/50",
    badge: "bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/40 dark:to-blue-900/40 text-cyan-700 dark:text-cyan-300",
  },
  projects: {
    border: "border-violet-500 dark:border-violet-400",
    bg: "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
    hoverBg: "hover:bg-gradient-to-br hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-950/50 dark:hover:to-purple-950/50",
    badge: "bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 text-violet-700 dark:text-violet-300",
  },
  education: {
    border: "border-emerald-500 dark:border-emerald-400",
    bg: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    hoverBg: "hover:bg-gradient-to-br hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-950/50 dark:hover:to-teal-950/50",
    badge: "bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-700 dark:text-emerald-300",
  },
  certifications: {
    border: "border-amber-500 dark:border-amber-400",
    bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    hoverBg: "hover:bg-gradient-to-br hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-950/50 dark:hover:to-orange-950/50",
    badge: "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-700 dark:text-amber-300",
  },
};

export function DynamicListItem({
  index,
  title,
  onRemove,
  children,
  colorScheme = "experience",
}: DynamicListItemProps) {
  const colors = colorSchemes[colorScheme];

  return (
    <div
      className={`relative border-l-4 ${colors.border} pl-6 pr-4 py-5 space-y-4 ${colors.bg} ${colors.hoverBg} rounded-r-xl transition-all duration-300 shadow-sm hover:shadow-md`}
    >
      {/* Drag Handle */}
      <div className="absolute left-2 top-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-move transition-colors">
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span className={`text-sm ${colors.badge} px-2.5 py-1 rounded-full font-bold shadow-sm`}>
            #{index + 1}
          </span>
          {title}
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="hover:bg-red-100 dark:hover:bg-red-900/30 hover:scale-110 transition-all"
        >
          <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600 dark:hover:text-red-400" />
        </Button>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
