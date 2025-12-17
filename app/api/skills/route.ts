import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (category) {
      // Fetch skills for a specific category
      const skills = await prisma.skill.findMany({
        where: {
          category: {
            key: category,
          },
          isActive: true,
        },
        orderBy: [
          { usageCount: "desc" }, // Most used first
          { name: "asc" },
        ],
        select: {
          id: true,
          name: true,
          usageCount: true,
        },
      });

      return NextResponse.json({
        skills: skills.map((s) => s.name),
        count: skills.length,
      });
    } else {
      // Fetch all categories with their skills
      const categories = await prisma.skillCategory.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
        include: {
          skills: {
            where: {
              isActive: true,
            },
            orderBy: [{ usageCount: "desc" }, { name: "asc" }],
            select: {
              id: true,
              name: true,
              usageCount: true,
            },
          },
        },
      });

      return NextResponse.json({
        categories: categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          key: cat.key,
          description: cat.description,
          skills: cat.skills.map((s) => s.name),
          count: cat.skills.length,
        })),
      });
    }
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}
