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
    <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-xl dark:text-white truncate">{resume.title}</CardTitle>
            {resume.versionName && (
              <CardDescription className="mt-1 dark:text-gray-300 text-xs sm:text-sm truncate">
                {resume.versionName}
              </CardDescription>
            )}
          </div>
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="pb-3 sm:pb-6">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Last updated: {format(new Date(resume.updatedAt), "MMM d, yyyy")}
        </p>
      </CardContent>
      <CardFooter className="flex gap-1.5 sm:gap-2 pt-3 sm:pt-6">
        <Link href={`/resume/${resume.id}/view`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm h-8 sm:h-9">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            View
          </Button>
        </Link>
        <Link href={`/resume/${resume.id}/edit`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm h-8 sm:h-9">
            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Edit
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-8 sm:h-9 px-2 sm:px-3"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
        </Button>
      </CardFooter>
    </Card>
  )
}
