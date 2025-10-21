"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  id?: string;
  error?: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "url" | "date" | "textarea";
  placeholder?: string;
  rows?: number;
  register?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  defaultValue?: string;
  helpText?: string;
}

export function FormField({
  label,
  id,
  error,
  required,
  type = "text",
  placeholder,
  rows = 3,
  register,
  onChange,
  defaultValue,
  helpText,
}: FormFieldProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {type === "textarea" ? (
        <Textarea
          id={inputId}
          {...register}
          placeholder={placeholder}
          rows={rows}
          onChange={onChange}
          defaultValue={defaultValue}
          className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
      ) : (
        <Input
          id={inputId}
          type={type}
          {...register}
          placeholder={placeholder}
          onChange={onChange}
          defaultValue={defaultValue}
          className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
      )}
      {helpText && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-500">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
