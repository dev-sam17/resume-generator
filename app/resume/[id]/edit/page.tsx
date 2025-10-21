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
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Full Width Split Screen */}
      <div className="flex-1 overflow-hidden">
        <ResumeForm mode="edit" resumeId={id} initialData={initialData} />
      </div>
    </div>
  )
}
