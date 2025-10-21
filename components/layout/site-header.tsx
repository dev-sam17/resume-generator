"use client"

import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface SiteHeaderProps {
  onSignIn?: () => void
}

export function SiteHeader({ onSignIn }: SiteHeaderProps) {
  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">ResumeGen</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {onSignIn && (
            <Button type="button" variant="outline" onClick={onSignIn}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
