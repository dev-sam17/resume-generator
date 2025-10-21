import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, LogOut } from "lucide-react"
import Link from "next/link"
import { ResumeCard } from "@/components/dashboard/ResumeCard"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  const resumes = await prisma.resume.findMany({
    where: {
      userId: session.user.id!,
      isActive: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">ResumeGen</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">{session.user.email}</span>
              <ThemeToggle />
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}
              >
                <Button type="submit" variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Resumes</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage and create multiple versions of your resume
            </p>
          </div>
          <Link href="/resume/new">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create New Resume
            </Button>
          </Link>
        </div>

        {resumes.length === 0 ? (
          <Card className="max-w-2xl mx-auto mt-12 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="text-center">
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="dark:text-white">No resumes yet</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Get started by creating your first resume
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Link href="/resume/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
