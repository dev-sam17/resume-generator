import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { uploadPdfToGCS } from "@/lib/storage"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId: session.user.id,
        isActive: true,
      },
    })

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    // Get PDF buffer from request body
    const body = await request.json()
    const { pdfBase64 } = body

    if (!pdfBase64) {
      return NextResponse.json(
        { error: "PDF data is required" },
        { status: 400 }
      )
    }

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64')

    // Generate unique filename
    const filename = `${resume.id}-${Date.now()}.pdf`

    // Upload to Google Cloud Storage
    const pdfUrl = await uploadPdfToGCS(pdfBuffer, filename)

    if (!pdfUrl) {
      return NextResponse.json(
        { error: "Failed to upload PDF. Storage not configured." },
        { status: 500 }
      )
    }

    // Update resume with PDF URL
    const updatedResume = await prisma.resume.update({
      where: { id },
      data: { pdfUrl },
    })

    return NextResponse.json({
      message: "PDF exported successfully",
      pdfUrl,
      resume: updatedResume,
    })
  } catch (error) {
    console.error("Error exporting resume:", error)
    return NextResponse.json(
      { error: "Failed to export resume" },
      { status: 500 }
    )
  }
}
