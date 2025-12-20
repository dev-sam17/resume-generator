"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sparkles, Share2, Download, FileText } from "lucide-react";

export default function Home() {
  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen  bg-gray-900">
      {/* Header */}
      <header className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 group">
            <div className="p-1.5 sm:p-2 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-lg sm:text-2xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ResumeGen
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={handleSignIn}
              size="sm"
              className="rounded-4xl w-full p-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm"
            >
              SIGN IN
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-3 sm:px-4 py-10 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/60 dark:bg-blue-900/40 px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold mb-6 sm:mb-8 border-2 border-blue-200 dark:border-purple-800 shadow-lg">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
            <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Build Professional Resumes in Minutes
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-2">
            Create, Manage & Share
            <br />
            <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Multiple Resume Versions
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-4"></p>

          <Button
            onClick={handleSignIn}
            size="lg"
            className="rounded-4xl text-sm sm:text-base lg:text-lg px-8 sm:px-10 py-6 sm:py-7 w-full sm:w-auto border-2 border-blue-500 dark:border-purple-500 shadow-2xl hover:shadow-blue-500/50 dark:hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 animate-pulse hover:animate-none bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Create Your First Resume
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-24 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Multiple Versions
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Create different resume versions tailored for specific job roles
              and industries.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="bg-purple-100 dark:bg-purple-900/30 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <Download className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              PDF Export
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Export your resume as a professional PDF with clean, print-ready
              formatting.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sm:col-span-2 md:col-span-1">
            <div className="bg-green-100 dark:bg-green-900/30 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <Share2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Cloud Sharing
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Share your resume via secure cloud links with recruiters and
              employers.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 mt-12 sm:mt-16 lg:mt-20 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Built with Next.js, Prisma, and Google Cloud Storage
        </p>
      </footer>
    </div>
  );
}
