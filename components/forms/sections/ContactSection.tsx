"use client";

import { FormSection } from "./FormSection";
import { FormField } from "./FormField";
import { User } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface ContactSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function ContactSection({ register, errors }: ContactSectionProps) {
  // Helper to safely access nested error messages
  const getErrorMessage = (path: string) => {
    const parts = path.split('.');
    let current: any = errors;
    for (const part of parts) {
      if (!current) return undefined;
      current = current[part];
    }
    return current?.message as string | undefined;
  };

  return (
    <FormSection
      title="Contact Information"
      description="Your professional contact details"
      icon={<User className="h-5 w-5" />}
      colorScheme="contact"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label="Full Name"
          required
          register={register("data.contact.fullName")}
          placeholder="John Doe"
          error={getErrorMessage("data.contact.fullName")}
        />
        <FormField
          label="Professional Title"
          required
          register={register("data.contact.title")}
          placeholder="Full Stack Developer"
          error={getErrorMessage("data.contact.title")}
        />
        <FormField
          label="Email"
          type="email"
          required
          register={register("data.contact.email")}
          placeholder="john@example.com"
          error={getErrorMessage("data.contact.email")}
        />
        <FormField
          label="Phone"
          type="tel"
          required
          register={register("data.contact.phone")}
          placeholder="+1-234-567-8900"
          error={getErrorMessage("data.contact.phone")}
        />
        <FormField
          label="Location"
          required
          register={register("data.contact.location")}
          placeholder="San Francisco, CA"
          error={getErrorMessage("data.contact.location")}
        />
        <FormField
          label="LinkedIn"
          type="url"
          register={register("data.contact.linkedin")}
          placeholder="https://linkedin.com/in/johndoe"
          helpText="Optional: Your LinkedIn profile URL"
        />
        <FormField
          label="GitHub"
          type="url"
          register={register("data.contact.github")}
          placeholder="https://github.com/johndoe"
          helpText="Optional: Your GitHub profile URL"
        />
        <FormField
          label="Portfolio"
          type="url"
          register={register("data.contact.portfolio")}
          placeholder="https://johndoe.dev"
          helpText="Optional: Your personal website"
        />
      </div>
    </FormSection>
  );
}
