"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createResumeSchema } from "@/lib/validations/resume";
import { Button } from "@/components/ui/button";
import { FormSection } from "./sections/FormSection";
import { FormField } from "./sections/FormField";
import { ContactSection } from "./sections/ContactSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { EducationSection } from "./sections/EducationSection";
import { CertificationsSection } from "./sections/CertificationsSection";
import { LayoutSection } from "./sections/LayoutSection";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { ToastContainer, ToastType } from "@/components/ui/toast";
import {
  Save,
  FileText,
  AlignLeft,
  Loader2,
  Eye,
  EyeOff,
  Layout,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { convert } from "colorizr";

type FormData = z.infer<typeof createResumeSchema>;

interface ResumeFormProps {
  initialData?: FormData;
  resumeId?: string;
  mode: "create" | "edit";
}

export function ResumeForm({ initialData, resumeId, mode }: ResumeFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastType }>
  >([]);
  const previewRef = useRef<HTMLDivElement>(null);
  // Hide preview on mobile by default, show on desktop
  const [showPreview, setShowPreview] = useState(false);

  // Show preview by default on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      setShowPreview(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const defaultData: FormData = initialData || {
    title: "",
    versionName: "",
    data: {
      layout: "modern",
      contact: {
        fullName: "",
        title: "",
        phone: "",
        email: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",
      },
      summary: "",
      skills: {
        languages: [],
        frameworks: [],
        databases: [],
        tools: [],
        cloud: [],
        methodologies: [],
        dataScience: [],
        blockchain: [],
        security: [],
        mobile: [],
        uiux: [],
      },
      experience: [],
      projects: [],
      education: [],
      certifications: [],
    },
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createResumeSchema),
    defaultValues: defaultData,
    mode: "onChange",
  });

  const watchedData = watch();

  // Force re-render on form changes for live preview
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const subscription = watch(() => forceUpdate({}));
    return () => subscription.unsubscribe();
  }, [watch]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsSaving(true);
    try {
      const url = mode === "create" ? "/api/resume" : `/api/resume/${resumeId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const resume = await response.json();
        showToast(
          mode === "create"
            ? "Resume created successfully!"
            : "Resume updated successfully!",
          "success"
        );
        // Update resumeId if creating new resume
        if (mode === "create" && resume.id) {
          router.replace(`/resume/${resume.id}/edit`);
        }
      } else {
        showToast("Failed to save resume", "error");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      showToast("Failed to save resume", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      const element = previewRef.current;
      if (!element) return;

      console.log("[PDF] Starting PDF download...");
      console.log("[PDF] Converting to canvas...");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          console.log("[PDF] onclone callback started");
          // Convert all color values to RGB format using colorizr
          const allElements = clonedDoc.querySelectorAll("*");
          const clonedWindow = clonedDoc.defaultView || window;
          console.log(`[PDF] Processing ${allElements.length} elements`);

          let labColorCount = 0;
          let oklchColorCount = 0;
          let conversionErrors = 0;

          allElements.forEach((el: any, index: number) => {
            const computed = clonedWindow.getComputedStyle(el);

            // Helper to convert any color to RGB using colorizr
            const toRGB = (color: string, propertyName: string) => {
              if (!color || color === "transparent" || color === "none")
                return color;

              // Check if color contains lab or oklch
              if (color.includes("lab(")) {
                labColorCount++;
                console.log(
                  `[PDF] Found lab() color in ${propertyName} at element ${index}:`,
                  color
                );
              }
              if (color.includes("oklch(")) {
                oklchColorCount++;
                console.log(
                  `[PDF] Found oklch() color in ${propertyName} at element ${index}:`,
                  color
                );
              }

              try {
                // Use colorizr to convert any color format to RGB
                const converted = convert(color, "rgb");
                if (color.includes("lab(") || color.includes("oklch(")) {
                  console.log(`[PDF] Converted ${color} -> ${converted}`);
                }
                return converted;
              } catch (error) {
                conversionErrors++;
                console.error(
                  `[PDF] Failed to convert color "${color}" in ${propertyName}:`,
                  error
                );
                // Fallback to original color if conversion fails
                return color;
              }
            };

            // Override all color properties with RGB values
            if (computed.color) el.style.color = toRGB(computed.color, "color");
            if (computed.backgroundColor)
              el.style.backgroundColor = toRGB(
                computed.backgroundColor,
                "backgroundColor"
              );
            if (computed.borderColor)
              el.style.borderColor = toRGB(computed.borderColor, "borderColor");
            if (computed.borderTopColor)
              el.style.borderTopColor = toRGB(
                computed.borderTopColor,
                "borderTopColor"
              );
            if (computed.borderRightColor)
              el.style.borderRightColor = toRGB(
                computed.borderRightColor,
                "borderRightColor"
              );
            if (computed.borderBottomColor)
              el.style.borderBottomColor = toRGB(
                computed.borderBottomColor,
                "borderBottomColor"
              );
            if (computed.borderLeftColor)
              el.style.borderLeftColor = toRGB(
                computed.borderLeftColor,
                "borderLeftColor"
              );
            if (computed.outlineColor)
              el.style.outlineColor = toRGB(
                computed.outlineColor,
                "outlineColor"
              );

            // Remove any gradient backgrounds that might use lab/oklch
            if (
              computed.backgroundImage &&
              computed.backgroundImage !== "none"
            ) {
              if (
                computed.backgroundImage.includes("lab(") ||
                computed.backgroundImage.includes("oklch(")
              ) {
                console.log(
                  `[PDF] Removing gradient with lab/oklch at element ${index}:`,
                  computed.backgroundImage
                );
              }
              el.style.backgroundImage = "none";
            }
          });

          console.log(`[PDF] Color conversion summary:`);
          console.log(`  - lab() colors found: ${labColorCount}`);
          console.log(`  - oklch() colors found: ${oklchColorCount}`);
          console.log(`  - Conversion errors: ${conversionErrors}`);
          console.log("[PDF] onclone callback completed");
        },
      });

      console.log({ canvas });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      console.log({ imgData });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      const fileName = watchedData.title || "resume";

      console.log({ fileName });
      pdf.save(`${fileName}.pdf`);
      showToast("PDF downloaded successfully!", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast("Failed to generate PDF", "error");
    } finally {
      setIsExporting(false);
    }
  };

  // Array manipulation functions
  const addExperience = () => {
    const current = watchedData.data.experience || [];
    setValue("data.experience", [
      ...current,
      {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        achievements: [""],
        technologies: [],
      },
    ]);
  };

  const removeExperience = (index: number) => {
    const current = watchedData.data.experience || [];
    setValue(
      "data.experience",
      current.filter((_, i) => i !== index)
    );
  };

  const addProject = () => {
    const current = watchedData.data.projects || [];
    setValue("data.projects", [
      ...current,
      {
        name: "",
        description: "",
        role: "",
        technologies: [],
        link: "",
      },
    ]);
  };

  const removeProject = (index: number) => {
    const current = watchedData.data.projects || [];
    setValue(
      "data.projects",
      current.filter((_, i) => i !== index)
    );
  };

  const addEducation = () => {
    const current = watchedData.data.education || [];
    setValue("data.education", [
      ...current,
      {
        degree: "",
        institution: "",
        year: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    const current = watchedData.data.education || [];
    setValue(
      "data.education",
      current.filter((_, i) => i !== index)
    );
  };

  const addCertification = () => {
    const current = watchedData.data.certifications || [];
    setValue("data.certifications", [
      ...current,
      {
        name: "",
        authority: "",
        date: "",
      },
    ]);
  };

  const removeCertification = (index: number) => {
    const current = watchedData.data.certifications || [];
    setValue(
      "data.certifications",
      current.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Form Section - Left Side */}
      <div
        className={`transition-all duration-300 ${
          showPreview ? "hidden lg:block lg:w-1/2" : "w-full"
        } overflow-y-auto px-3 sm:px-6`}
      >
        <form
          onSubmit={handleSubmit(onSubmit as any)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
              e.preventDefault();
            }
          }}
          className="space-y-6 py-6 pb-24"
        >
          {/* Header */}
          <div className="relative overflow-hidden bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl shadow-xl top-0 z-10">
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 shrink-0" />
                  <span className="truncate">
                    {mode === "create" ? "Create New Resume" : "Edit Resume"}
                  </span>
                </h2>
                <p className="text-white/90 text-xs sm:text-sm lg:text-lg hidden sm:block">
                  Fill in your information to build a professional resume. All
                  fields marked with * are required.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-0 shrink-0"
              >
                {showPreview ? (
                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm hidden sm:inline">
                  {showPreview ? "Hide" : "Show"}
                </span>
              </Button>
            </div>
          </div>

          {/* Resume Metadata */}
          <FormSection
            title="Resume Information"
            description="Basic details about this resume version"
            icon={<FileText className="h-5 w-5" />}
            colorScheme="default"
          >
            <div className="space-y-4">
              <FormField
                label="Resume Title"
                required
                register={register("title")}
                placeholder="e.g., Software Engineer Resume - FAANG"
                error={errors.title?.message}
                helpText="Give this resume a descriptive name for easy identification"
              />
              <FormField
                label="Version Name"
                register={register("versionName")}
                placeholder="e.g., Frontend Focused, Backend Specialist"
                helpText="Optional: Specify what makes this version unique"
              />
            </div>
          </FormSection>

          {/* Layout Selection */}
          <FormSection
            title="Resume Layout"
            description="Choose the visual style for your resume"
            icon={<Layout className="h-5 w-5" />}
            colorScheme="default"
          >
            <LayoutSection
              currentLayout={watchedData.data.layout || "modern"}
              setValue={setValue}
            />
          </FormSection>

          {/* Contact Information */}
          <ContactSection register={register} errors={errors} />

          {/* Professional Summary */}
          <FormSection
            title="Professional Summary"
            description="A brief overview of your professional background"
            icon={
              <AlignLeft className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            }
          >
            <FormField
              label="Summary"
              type="textarea"
              register={register("data.summary")}
              placeholder="Experienced Full Stack Developer with 5+ years building scalable web applications. Specialized in React, Node.js, and cloud technologies. Passionate about clean code and user experience."
              rows={5}
              error={errors.data?.summary?.message}
              helpText="Write 3-5 sentences highlighting your expertise and value proposition"
            />
          </FormSection>

          {/* Skills */}
          <SkillsSection setValue={setValue} defaultData={defaultData} />

          {/* Work Experience */}
          <ExperienceSection
            register={register}
            setValue={setValue}
            experiences={watchedData.data.experience}
            onAdd={addExperience}
            onRemove={removeExperience}
          />

          {/* Projects */}
          <ProjectsSection
            register={register}
            setValue={setValue}
            projects={watchedData.data.projects}
            onAdd={addProject}
            onRemove={removeProject}
          />

          {/* Education */}
          <EducationSection
            register={register}
            education={watchedData.data.education}
            onAdd={addEducation}
            onRemove={removeEducation}
          />

          {/* Certifications */}
          <CertificationsSection
            register={register}
            certifications={watchedData.data.certifications}
            onAdd={addCertification}
            onRemove={removeCertification}
          />

          {/* Submit Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 p-6 -mx-4 mt-8">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                size="lg"
                className="min-w-[200px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    {mode === "create" ? "Create Resume" : "Update Resume"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Preview Section - Right Side */}
      {showPreview && (
        <div className="w-full lg:w-1/2 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 lg:p-6 border-t-2 lg:border-t-0 lg:border-l-2 border-gray-200 dark:border-gray-700">
          <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 pb-3 sm:pb-4 mb-3 sm:mb-4 z-10 border-b border-gray-200 dark:border-gray-700 lg:border-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                  Live Preview
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Click "Update Resume" to see changes in real-time if it
                  doesn't update automatically
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div ref={previewRef}>
            <ResumePreview data={watchedData.data} />
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
