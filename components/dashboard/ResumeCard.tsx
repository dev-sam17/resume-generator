"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Edit, Trash2, Download, Eye } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Resume {
  id: string
  title: string
  versionName?: string | null
  updatedAt: Date
  pdfUrl?: string | null
}

export function ResumeCard({ resume }: { resume: Resume }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resume?")) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/resume/${resume.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to delete resume")
      }
    } catch (error) {
      console.error("Error deleting resume:", error)
      alert("Failed to delete resume")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{resume.title}</CardTitle>
            {resume.versionName && (
              <CardDescription className="mt-1">
                {resume.versionName}
              </CardDescription>
            )}
          </div>
          <FileText className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Last updated: {format(new Date(resume.updatedAt), "MMM d, yyyy")}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/resume/${resume.id}/view`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        </Link>
        <Link href={`/resume/${resume.id}/edit`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </CardFooter>
    </Card>
  )
}
