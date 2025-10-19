"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createResumeSchema } from "@/lib/validations/resume"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ResumeData } from "@/types/resume"
import { z } from "zod"

type FormData = z.infer<typeof createResumeSchema>

interface ResumeFormProps {
  initialData?: FormData
  resumeId?: string
  mode: "create" | "edit"
}

export function ResumeForm({ initialData, resumeId, mode }: ResumeFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const defaultData: FormData = initialData || {
    title: "",
    versionName: "",
    data: {
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
      },
      experience: [],
      projects: [],
      education: [],
      certifications: [],
    },
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createResumeSchema),
    defaultValues: defaultData,
  })

  const watchedData = watch()

  const onSubmit = async (data: FormData) => {
    setIsSaving(true)
    try {
      const url = mode === "create" ? "/api/resume" : `/api/resume/${resumeId}`
      const method = mode === "create" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const resume = await response.json()
        router.push(`/resume/${resume.id}/view`)
      } else {
        alert("Failed to save resume")
      }
    } catch (error) {
      console.error("Error saving resume:", error)
      alert("Failed to save resume")
    } finally {
      setIsSaving(false)
    }
  }

  const addExperience = () => {
    const current = watchedData.data.experience || []
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
    ])
  }

  const removeExperience = (index: number) => {
    const current = watchedData.data.experience || []
    setValue(
      "data.experience",
      current.filter((_, i) => i !== index)
    )
  }

  const addProject = () => {
    const current = watchedData.data.projects || []
    setValue("data.projects", [
      ...current,
      {
        name: "",
        description: "",
        role: "",
        technologies: [],
        link: "",
      },
    ])
  }

  const removeProject = (index: number) => {
    const current = watchedData.data.projects || []
    setValue(
      "data.projects",
      current.filter((_, i) => i !== index)
    )
  }

  const addEducation = () => {
    const current = watchedData.data.education || []
    setValue("data.education", [
      ...current,
      {
        degree: "",
        institution: "",
        year: "",
      },
    ])
  }

  const removeEducation = (index: number) => {
    const current = watchedData.data.education || []
    setValue(
      "data.education",
      current.filter((_, i) => i !== index)
    )
  }

  const addCertification = () => {
    const current = watchedData.data.certifications || []
    setValue("data.certifications", [
      ...current,
      {
        name: "",
        authority: "",
        date: "",
      },
    ])
  }

  const removeCertification = (index: number) => {
    const current = watchedData.data.certifications || []
    setValue(
      "data.certifications",
      current.filter((_, i) => i !== index)
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Resume Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Resume Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., Software Engineer Resume"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="versionName">Version Name (Optional)</Label>
            <Input
              id="versionName"
              {...register("versionName")}
              placeholder="e.g., Frontend Focused"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                {...register("data.contact.fullName")}
                placeholder="John Doe"
              />
              {errors.data?.contact?.fullName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.data.contact.fullName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="jobTitle">Professional Title *</Label>
              <Input
                id="jobTitle"
                {...register("data.contact.title")}
                placeholder="Full Stack Developer"
              />
              {errors.data?.contact?.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.data.contact.title.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("data.contact.email")}
                placeholder="john@example.com"
              />
              {errors.data?.contact?.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.data.contact.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                {...register("data.contact.phone")}
                placeholder="+1-234-567-8900"
              />
              {errors.data?.contact?.phone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.data.contact.phone.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...register("data.contact.location")}
                placeholder="San Francisco, CA"
              />
              {errors.data?.contact?.location && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.data.contact.location.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                {...register("data.contact.linkedin")}
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                {...register("data.contact.github")}
                placeholder="https://github.com/johndoe"
              />
            </div>
            <div>
              <Label htmlFor="portfolio">Portfolio</Label>
              <Input
                id="portfolio"
                {...register("data.contact.portfolio")}
                placeholder="https://johndoe.dev"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            {...register("data.summary")}
            placeholder="Write a brief professional summary (3-4 sentences)..."
            rows={4}
          />
          {errors.data?.summary && (
            <p className="text-sm text-red-500 mt-1">
              {errors.data.summary.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Languages (comma-separated)</Label>
            <Input
              placeholder="JavaScript, TypeScript, Python"
              onChange={(e) => {
                const values = e.target.value.split(",").map((v) => v.trim()).filter(Boolean)
                setValue("data.skills.languages", values)
              }}
              defaultValue={defaultData.data.skills.languages.join(", ")}
            />
          </div>
          <div>
            <Label>Frameworks (comma-separated)</Label>
            <Input
              placeholder="React, Next.js, Node.js"
              onChange={(e) => {
                const values = e.target.value.split(",").map((v) => v.trim()).filter(Boolean)
                setValue("data.skills.frameworks", values)
              }}
              defaultValue={defaultData.data.skills.frameworks.join(", ")}
            />
          </div>
          <div>
            <Label>Databases (comma-separated)</Label>
            <Input
              placeholder="PostgreSQL, MongoDB, Redis"
              onChange={(e) => {
                const values = e.target.value.split(",").map((v) => v.trim()).filter(Boolean)
                setValue("data.skills.databases", values)
              }}
              defaultValue={defaultData.data.skills.databases.join(", ")}
            />
          </div>
          <div>
            <Label>Tools (comma-separated)</Label>
            <Input
              placeholder="Docker, Git, Jenkins"
              onChange={(e) => {
                const values = e.target.value.split(",").map((v) => v.trim()).filter(Boolean)
                setValue("data.skills.tools", values)
              }}
              defaultValue={defaultData.data.skills.tools.join(", ")}
            />
          </div>
          <div>
            <Label>Cloud Platforms (comma-separated)</Label>
            <Input
              placeholder="AWS, GCP, Azure"
              onChange={(e) => {
                const values = e.target.value.split(",").map((v) => v.trim()).filter(Boolean)
                setValue("data.skills.cloud", values)
              }}
              defaultValue={defaultData.data.skills.cloud.join(", ")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Work Experience</CardTitle>
            <Button type="button" onClick={addExperience} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {watchedData.data.experience.map((_, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">Experience #{index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Job Title *</Label>
                  <Input
                    {...register(`data.experience.${index}.title`)}
                    placeholder="Senior Software Engineer"
                  />
                </div>
                <div>
                  <Label>Company *</Label>
                  <Input
                    {...register(`data.experience.${index}.company`)}
                    placeholder="Tech Corp"
                  />
                </div>
                <div>
                  <Label>Location *</Label>
                  <Input
                    {...register(`data.experience.${index}.location`)}
                    placeholder="Remote"
                  />
                </div>
                <div>
                  <Label>Start Date *</Label>
                  <Input
                    {...register(`data.experience.${index}.startDate`)}
                    placeholder="2021-01-01"
                    type="date"
                  />
                </div>
                <div>
                  <Label>End Date *</Label>
                  <Input
                    {...register(`data.experience.${index}.endDate`)}
                    placeholder="Present"
                  />
                </div>
                <div>
                  <Label>Technologies (comma-separated)</Label>
                  <Input
                    placeholder="React, Node.js, AWS"
                    onChange={(e) => {
                      const values = e.target.value.split(",").map((v) => v.trim()).filter(Boolean)
                      setValue(`data.experience.${index}.technologies`, values)
                    }}
                  />
                </div>
              </div>
              <div>
                <Label>Achievements (one per line) *</Label>
                <Textarea
                  {...register(`data.experience.${index}.achievements.0`)}
                  placeholder="• Led development of scalable microservices&#10;• Improved performance by 40%&#10;• Mentored junior developers"
                  rows={3}
                  onChange={(e) => {
                    const achievements = e.target.value
                      .split("\n")
                      .map((a) => a.trim())
                      .filter(Boolean)
                    setValue(`data.experience.${index}.achievements`, achievements)
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Projects</CardTitle>
            <Button type="button" onClick={addProject} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {watchedData.data.projects.map((_, index) => (
            <div key={index} className="border-l-4 border-purple-500 pl-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">Project #{index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Project Name *</Label>
                  <Input
                    {...register(`data.projects.${index}.name`)}
                    placeholder="E-commerce Platform"
                  />
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    {...register(`data.projects.${index}.description`)}
                    placeholder="Built a full-stack e-commerce platform..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Your Role *</Label>
                  <Input
                    {...register(`data.projects.${index}.role`)}
                    placeholder="Full Stack Developer"
                  />
                </div>
                <div>
                  <Label>Technologies (comma-separated)</Label>
                  <Input
                    placeholder="Next.js, PostgreSQL, Stripe"
                    onChange={(e) => {
                      const values = e.target.value.split(",").map((v) => v.trim()).filter(Boolean)
                      setValue(`data.projects.${index}.technologies`, values)
                    }}
                  />
                </div>
                <div>
                  <Label>Project Link</Label>
                  <Input
                    {...register(`data.projects.${index}.link`)}
                    placeholder="https://github.com/user/project"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Education</CardTitle>
            <Button type="button" onClick={addEducation} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {watchedData.data.education.map((_, index) => (
            <div key={index} className="border-l-4 border-green-500 pl-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">Education #{index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Degree *</Label>
                  <Input
                    {...register(`data.education.${index}.degree`)}
                    placeholder="B.S. Computer Science"
                  />
                </div>
                <div>
                  <Label>Institution *</Label>
                  <Input
                    {...register(`data.education.${index}.institution`)}
                    placeholder="Stanford University"
                  />
                </div>
                <div>
                  <Label>Year *</Label>
                  <Input
                    {...register(`data.education.${index}.year`)}
                    placeholder="2020"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Certifications</CardTitle>
            <Button type="button" onClick={addCertification} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {watchedData.data.certifications.map((_, index) => (
            <div key={index} className="border-l-4 border-yellow-500 pl-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">Certification #{index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertification(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Certification Name *</Label>
                  <Input
                    {...register(`data.certifications.${index}.name`)}
                    placeholder="AWS Certified Developer"
                  />
                </div>
                <div>
                  <Label>Issuing Authority *</Label>
                  <Input
                    {...register(`data.certifications.${index}.authority`)}
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div>
                  <Label>Date *</Label>
                  <Input
                    {...register(`data.certifications.${index}.date`)}
                    placeholder="2023-06-10"
                    type="date"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving} size="lg">
          <Save className="h-5 w-5 mr-2" />
          {isSaving ? "Saving..." : mode === "create" ? "Create Resume" : "Update Resume"}
        </Button>
      </div>
    </form>
  )
}
