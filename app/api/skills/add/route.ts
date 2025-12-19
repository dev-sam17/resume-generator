import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { skillName, categoryKey } = body;

    if (!skillName || !categoryKey) {
      return NextResponse.json(
        { error: "Skill name and category are required" },
        { status: 400 }
      );
    }

    // Category name mapping based on key
    const categoryNameMap: Record<string, string> = {
      languages: "Programming Languages",
      frameworks: "Frameworks & Libraries",
      databases: "Databases & ORMs",
      tools: "Tools & Technologies",
      cloud: "Cloud Platforms",
      methodologies: "Methodologies & Practices",
      dataScience: "Data Science & ML",
      blockchain: "Blockchain",
      security: "Security",
      mobile: "Mobile Development",
      uiux: "UI/UX Design",
    };

    // Find or create the category
    let category = await prisma.skillCategory.findUnique({
      where: { key: categoryKey },
    });

    if (!category) {
      // Create the category if it doesn't exist
      const categoryName =
        categoryNameMap[categoryKey] ||
        categoryKey
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str: string) => str.toUpperCase())
          .trim();

      category = await prisma.skillCategory.create({
        data: {
          name: categoryName,
          key: categoryKey,
          description: `Skills related to ${categoryName.toLowerCase()}`,
          displayOrder:
            Object.keys(categoryNameMap).indexOf(categoryKey) + 1 || 99,
        },
      });
    }

    // Check if skill already exists in this category
    const existingSkill = await prisma.skill.findUnique({
      where: {
        name_categoryId: {
          name: skillName,
          categoryId: category.id,
        },
      },
    });

    if (existingSkill) {
      // If it exists but is inactive, reactivate it
      if (!existingSkill.isActive) {
        const updatedSkill = await prisma.skill.update({
          where: { id: existingSkill.id },
          data: { isActive: true },
        });
        return NextResponse.json({
          skill: updatedSkill,
          message: "Skill reactivated",
        });
      }

      return NextResponse.json(
        { error: "Skill already exists in this category" },
        { status: 409 }
      );
    }

    // Create new skill
    const newSkill = await prisma.skill.create({
      data: {
        name: skillName,
        categoryId: category.id,
      },
    });

    return NextResponse.json({
      skill: newSkill,
      message: "Skill added successfully",
    });
  } catch (error) {
    console.error("Error adding skill:", error);
    return NextResponse.json({ error: "Failed to add skill" }, { status: 500 });
  }
}
