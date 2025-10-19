import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ResumeForm } from "@/components/forms/ResumeForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditResumePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params

  if (!session?.user) {
    redirect("/")
  }

  const resume = await prisma.resume.findFirst({
    where: {
      id,
      userId: session.user.id!,
      isActive: true,
    },
  })

  if (!resume) {
    redirect("/dashboard")
  }

  const initialData = {
    title: resume.title,
    versionName: resume.versionName || "",
    data: resume.data as any,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Resume</h1>
            <p className="text-gray-600 mt-2">
              Update your resume information
            </p>
          </div>

          <ResumeForm mode="edit" resumeId={id} initialData={initialData} />
        </div>
      </div>
    </div>
  )
}
