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

    // Find the category
    const category = await prisma.skillCategory.findUnique({
      where: { key: categoryKey },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
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
