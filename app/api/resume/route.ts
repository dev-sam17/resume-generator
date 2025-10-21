import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { createResumeSchema } from "@/lib/validations/resume"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    console.log("Session in GET /api/resume:", JSON.stringify(session, null, 2))
    
    if (!session?.user?.id) {
      console.log("No user ID in session. Session:", session)
      return NextResponse.json({ 
        error: "Unauthorized", 
        debug: { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          userId: session?.user?.id 
        } 
      }, { status: 401 })
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(resumes)
  } catch (error) {
    console.error("Error fetching resumes:", error)
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createResumeSchema.parse(body)

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        versionName: validatedData.versionName,
        data: validatedData.data as any,
      },
    })

    return NextResponse.json(resume, { status: 201 })
  } catch (error: any) {
    console.error("Error creating resume:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    )
  }
}
