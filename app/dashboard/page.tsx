import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { ResumeCard } from "@/components/dashboard/ResumeCard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const resumes = await prisma.resume.findMany({
    where: {
      userId: session.user.id!,
      isActive: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              <span className="text-lg sm:text-2xl font-bold text-white">
                ResumeGen
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-300 hidden md:inline truncate max-w-[150px] lg:max-w-none">
                {session.user.email}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              My Resumes
            </h1>
            <p className="text-sm sm:text-base text-gray-300 mt-1">
              Manage and create multiple versions of your resume
            </p>
          </div>
          <Link href="/resume/new" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="hidden xs:inline">Create New </span>Resume
            </Button>
          </Link>
        </div>

        {resumes.length === 0 ? (
          <Card className="max-w-2xl mx-auto mt-8 sm:mt-12 bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <div className="mx-auto bg-blue-900/30 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              </div>
              <CardTitle className="text-white text-lg sm:text-xl">
                No resumes yet
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm">
                Get started by creating your first resume
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Link href="/resume/new" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
