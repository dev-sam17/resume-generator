"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  onAdd?: () => void;
  addButtonText?: string;
  icon?: ReactNode;
  colorScheme?: "contact" | "skills" | "experience" | "projects" | "education" | "certifications" | "default";
  headerActions?: ReactNode;
}

const colorSchemes = {
  contact: {
    border: "border-blue-200 dark:border-blue-800",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
    iconBg: "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  skills: {
    border: "border-purple-200 dark:border-purple-800",
    hoverBorder: "hover:border-purple-300 dark:hover:border-purple-700",
    iconBg: "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  experience: {
    border: "border-cyan-200 dark:border-cyan-800",
    hoverBorder: "hover:border-cyan-300 dark:hover:border-cyan-700",
    iconBg: "bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/40 dark:to-blue-900/40",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  projects: {
    border: "border-violet-200 dark:border-violet-800",
    hoverBorder: "hover:border-violet-300 dark:hover:border-violet-700",
    iconBg: "bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  education: {
    border: "border-emerald-200 dark:border-emerald-800",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
    iconBg: "bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  certifications: {
    border: "border-amber-200 dark:border-amber-800",
    hoverBorder: "hover:border-amber-300 dark:hover:border-amber-700",
    iconBg: "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  default: {
    border: "border-gray-200 dark:border-gray-800",
    hoverBorder: "hover:border-gray-300 dark:hover:border-gray-700",
    iconBg: "bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-900/40 dark:to-slate-900/40",
    iconColor: "text-gray-600 dark:text-gray-400",
  },
};

export function FormSection({
  title,
  description,
  children,
  onAdd,
  addButtonText = "Add",
  icon,
  colorScheme = "default",
  headerActions,
}: FormSectionProps) {
  const colors = colorSchemes[colorScheme];

  return (
    <Card className={`border-2 ${colors.border} ${colors.hoverBorder} transition-all duration-300 hover:shadow-lg`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={`p-2.5 ${colors.iconBg} rounded-xl shadow-sm`}>
                <div className={colors.iconColor}>{icon}</div>
              </div>
            )}
            <div>
              <CardTitle className="text-xl font-bold">{title}</CardTitle>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {headerActions}
            {onAdd && (
              <Button 
                type="button" 
                onClick={onAdd} 
                size="sm" 
                className={`${colors.iconBg} ${colors.iconColor} border-0 hover:scale-105 transition-transform`}
              >
                <Plus className="h-4 w-4 mr-2" />
                {addButtonText}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
