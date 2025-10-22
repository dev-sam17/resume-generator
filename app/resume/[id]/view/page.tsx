"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ResumePreview } from "@/components/viewer/ResumePreview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, Edit } from "lucide-react"
import Link from "next/link"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import type { ResumeData } from "@/types/resume"

interface Resume {
  id: string
  title: string
  versionName?: string
  data: ResumeData
  pdfUrl?: string
}

export default function ViewResumePage() {
  const params = useParams()
  const router = useRouter()
  const [resume, setResume] = useState<Resume | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchResume()
  }, [params.id])

  const fetchResume = async () => {
    try {
      const response = await fetch(`/api/resume/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setResume(data)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error fetching resume:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!resume) return

    setIsExporting(true)
    try {
      const element = document.getElementById("resume-preview")
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Force all elements to use computed RGB values instead of oklch
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el: any) => {
            const computed = window.getComputedStyle(el);
            // Override with computed RGB values
            el.style.color = computed.color;
            el.style.backgroundColor = computed.backgroundColor;
            el.style.borderColor = computed.borderColor;
            el.style.borderTopColor = computed.borderTopColor;
            el.style.borderRightColor = computed.borderRightColor;
            el.style.borderBottomColor = computed.borderBottomColor;
            el.style.borderLeftColor = computed.borderLeftColor;
          });
        },
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      )

      pdf.save(`${resume.title}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF")
    } finally {
      setIsExporting(false)
    }
  }

  const handleShareToCloud = async () => {
    if (!resume) return

    setIsExporting(true)
    try {
      const element = document.getElementById("resume-preview")
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Force all elements to use computed RGB values instead of oklch
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el: any) => {
            const computed = window.getComputedStyle(el);
            // Override with computed RGB values
            el.style.color = computed.color;
            el.style.backgroundColor = computed.backgroundColor;
            el.style.borderColor = computed.borderColor;
            el.style.borderTopColor = computed.borderTopColor;
            el.style.borderRightColor = computed.borderRightColor;
            el.style.borderBottomColor = computed.borderBottomColor;
            el.style.borderLeftColor = computed.borderLeftColor;
          });
        },
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      )

      const pdfBlob = pdf.output("blob")
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        const base64data = reader.result?.toString().split(",")[1]
        
        const response = await fetch(`/api/resume/${params.id}/export`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfBase64: base64data }),
        })

        if (response.ok) {
          const data = await response.json()
          alert(`Resume uploaded! Share this link:\n${data.pdfUrl}`)
          fetchResume() // Refresh to get the updated pdfUrl
        } else {
          alert("Failed to upload to cloud. Make sure GCS is configured.")
        }
      }

      reader.readAsDataURL(pdfBlob)
    } catch (error) {
      console.error("Error uploading to cloud:", error)
      alert("Failed to upload to cloud")
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading resume...</p>
      </div>
    )
  }

  if (!resume) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Actions */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex gap-2">
            <Link href={`/resume/${params.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Generating..." : "Download PDF"}
            </Button>
            <Button
              onClick={handleShareToCloud}
              disabled={isExporting}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share to Cloud
            </Button>
          </div>
        </div>

        {/* Resume Info */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{resume.title}</h1>
          {resume.versionName && (
            <p className="text-gray-600 dark:text-gray-300">{resume.versionName}</p>
          )}
          {resume.pdfUrl && (
            <a
              href={resume.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
            >
              View Shared PDF →
            </a>
          )}
        </div>

        {/* Resume Preview */}
        <ResumePreview data={resume.data} />
      </div>
    </div>
  )
}
