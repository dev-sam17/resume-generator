import { PDFBuilder } from "../pdf-utils";
import { ResumeData } from "@/types/resume";

export function generateProfessionalLayoutPDF(data: ResumeData): PDFBuilder {
  const pdf = new PDFBuilder("portrait");
  const {
    contact,
    summary,
    skills,
    experience,
    projects,
    education,
    certifications,
  } = data;

  // Colors - matching HTML Professional layout
  const primaryColor: [number, number, number] = [17, 24, 39]; // Gray-900
  const secondaryColor: [number, number, number] = [55, 65, 81]; // Gray-700
  const textColor: [number, number, number] = [55, 65, 81]; // Gray-700
  const accentColor: [number, number, number] = [29, 78, 216]; // Blue-700
  const grayBg: [number, number, number] = [243, 244, 246]; // Gray-100
  const iconColor: [number, number, number] = [75, 85, 99]; // Gray-600

  // Header with gray background (bg-gray-100)
  const headerHeight = 50;
  pdf.addFilledRect(
    0,
    0,
    pdf.getPDF().internal.pageSize.getWidth(),
    headerHeight,
    grayBg
  );

  // Name
  pdf.setFont("helvetica", "bold", 18); // text-2xl
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.getPDF().text(contact.fullName, 20, 18);

  // Title
  pdf.setFont("helvetica", "normal", 12); // text-base
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.getPDF().text(contact.title, 20, 25);

  // Contact info in grid layout (grid-cols-2)
  pdf.setFont("helvetica", "normal", 10.5); // text-sm
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);

  const leftColX = 20;
  const rightColX = 20 + pdf.getContentWidth() / 2;
  let contactY = 33;

  // Left column
  pdf.getPDF().text(`✉ ${contact.email}`, leftColX, contactY);
  contactY += 4;
  pdf.getPDF().text(`☎ ${contact.phone}`, leftColX, contactY);

  // Right column
  contactY = 33;
  pdf.getPDF().text(`⌂ ${contact.location}`, rightColX, contactY);
  contactY += 4;

  if (contact.linkedin) {
    pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.getPDF().textWithLink("LinkedIn", rightColX + 10, contactY, {
      url: contact.linkedin,
    });
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.getPDF().text("▶ ", rightColX, contactY);
  }

  pdf.setCurrentY(headerHeight + 8);

  // Professional Summary (border-b-2 border-gray-900)
  if (summary) {
    pdf.setFont("helvetica", "bold", 12); // text-base
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.getPDF().text("PROFESSIONAL SUMMARY", 20, pdf.getCurrentY());
    pdf.addSpace(2);
    pdf.addHorizontalLine(undefined, 1.5, primaryColor); // border-b-2
    pdf.addSpace(3);

    pdf.setFont("helvetica", "normal", 10.5); // text-sm
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.addText(summary, 20, 10.5, { lineHeight: 1.5 });
    pdf.addSpace(6);
  }

  // Core Competencies (border-b-2 border-gray-900, grid-cols-2)
  if (
    Object.keys(skills).some(
      (key) => skills[key as keyof typeof skills]?.length > 0
    )
  ) {
    pdf.setFont("helvetica", "bold", 12);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.getPDF().text("CORE COMPETENCIES", 20, pdf.getCurrentY());
    pdf.addSpace(2);
    pdf.addHorizontalLine(undefined, 1.5, primaryColor);
    pdf.addSpace(3);

    const skillEntries = Object.entries(skills).filter(
      ([_, skillList]) => Array.isArray(skillList) && skillList.length > 0
    );

    // Two-column layout for skills
    const midPoint = Math.ceil(skillEntries.length / 2);
    const leftSkills = skillEntries.slice(0, midPoint);
    const rightSkills = skillEntries.slice(midPoint);

    pdf.addTwoColumns(
      () => {
        leftSkills.forEach(([category, skillList]) => {
          const categoryName = category
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str: string) => str.toUpperCase())
            .trim();

          pdf.setFont("helvetica", "bold", 10.5);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.getPDF().text(categoryName + ":", 20, pdf.getCurrentY());
          pdf.addSpace(2);

          pdf.setFont("helvetica", "normal", 10.5);
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
          pdf.addText((skillList as string[]).join(", "), 20, 10.5, {
            maxWidth: (pdf.getContentWidth() - 10) / 2,
          });
          pdf.addSpace(2);
        });
      },
      () => {
        rightSkills.forEach(([category, skillList]) => {
          const categoryName = category
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str: string) => str.toUpperCase())
            .trim();

          const startX = 20 + (pdf.getContentWidth() + 10) / 2;

          pdf.setFont("helvetica", "bold", 10.5);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.getPDF().text(categoryName + ":", startX, pdf.getCurrentY());
          pdf.addSpace(2);

          pdf.setFont("helvetica", "normal", 10.5);
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
          pdf.addText((skillList as string[]).join(", "), startX, 10.5, {
            maxWidth: (pdf.getContentWidth() - 10) / 2,
          });
          pdf.addSpace(2);
        });
      },
      10
    );

    pdf.addSpace(4);
  }

  // Professional Experience
  if (experience.length > 0) {
    pdf.setFont("helvetica", "bold", 12);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.getPDF().text("PROFESSIONAL EXPERIENCE", 20, pdf.getCurrentY());
    pdf.addSpace(2);
    pdf.addHorizontalLine(undefined, 1.5, primaryColor);
    pdf.addSpace(3);

    experience.forEach((exp, index) => {
      pdf.setFont("helvetica", "bold", 12);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.getPDF().text(exp.title, 20, pdf.getCurrentY());

      pdf.setFont("helvetica", "normal", 10);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      const dateText = `${exp.startDate} - ${exp.endDate}`;
      const dateWidth = pdf.getPDF().getTextWidth(dateText);
      pdf
        .getPDF()
        .text(
          dateText,
          pdf.getPDF().internal.pageSize.getWidth() - 20 - dateWidth,
          pdf.getCurrentY()
        );
      pdf.addSpace(4);

      pdf.setFont("helvetica", "italic", 10.5);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf
        .getPDF()
        .text(`${exp.company}, ${exp.location}`, 20, pdf.getCurrentY());
      pdf.addSpace(3);

      pdf.setFont("helvetica", "normal", 10.5);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);

      exp.achievements.forEach((achievement) => {
        const lineHeight = 10.5 * 0.3527 * 1.4;
        const maxWidth = pdf.getContentWidth() - 8;
        const lines = pdf.getPDF().splitTextToSize(achievement, maxWidth);

        lines.forEach((line: string, lineIndex: number) => {
          pdf.checkPageBreak(lineHeight);

          if (lineIndex === 0) {
            pdf.getPDF().text("•", 22, pdf.getCurrentY());
            pdf.getPDF().text(line, 28, pdf.getCurrentY());
          } else {
            pdf.getPDF().text(line, 28, pdf.getCurrentY());
          }

          pdf.setCurrentY(pdf.getCurrentY() + lineHeight);
        });
      });

      if (exp.technologies && exp.technologies.length > 0) {
        pdf.addSpace(2);
        pdf.setFont("helvetica", "italic", 9);
        pdf.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        pdf.addText("Technologies: " + exp.technologies.join(", "), 22, 9);
      }

      if (index < experience.length - 1) {
        pdf.addSpace(5);
      }
    });

    pdf.addSpace(4);
  }

  // Projects
  if (projects.length > 0) {
    pdf.setFont("helvetica", "bold", 12);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.getPDF().text("PROJECTS", 20, pdf.getCurrentY());
    pdf.addSpace(2);
    pdf.addHorizontalLine(undefined, 1.5, primaryColor);
    pdf.addSpace(3);

    projects.forEach((project, index) => {
      pdf.setFont("helvetica", "bold", 12);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.getPDF().text(project.name, 20, pdf.getCurrentY());

      if (project.link) {
        pdf.setFont("helvetica", "normal", 10);
        pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        const linkText = "View";
        const linkWidth = pdf.getPDF().getTextWidth(linkText);
        pdf
          .getPDF()
          .textWithLink(
            linkText,
            pdf.getPDF().internal.pageSize.getWidth() - 20 - linkWidth,
            pdf.getCurrentY(),
            { url: project.link }
          );
      }
      pdf.addSpace(4);

      pdf.setFont("helvetica", "italic", 10);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.getPDF().text(project.role, 20, pdf.getCurrentY());
      pdf.addSpace(3);

      pdf.setFont("helvetica", "normal", 10.5);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.addText(project.description, 20, 10.5, { lineHeight: 1.4 });

      if (project.technologies && project.technologies.length > 0) {
        pdf.addSpace(2);
        pdf.setFont("helvetica", "italic", 9);
        pdf.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        pdf.addText("Tech: " + project.technologies.join(", "), 20, 9);
      }

      if (index < projects.length - 1) {
        pdf.addSpace(5);
      }
    });

    pdf.addSpace(4);
  }

  // Education and Certifications
  const hasEducation = education.length > 0;
  const hasCertifications = certifications.length > 0;

  if (hasEducation || hasCertifications) {
    pdf.addTwoColumns(
      () => {
        if (hasEducation) {
          pdf.setFont("helvetica", "bold", 12);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.getPDF().text("EDUCATION", 20, pdf.getCurrentY());
          pdf.addSpace(2);
          pdf.addHorizontalLine(
            (pdf.getContentWidth() - 10) / 2,
            1.5,
            primaryColor
          );
          pdf.addSpace(3);

          education.forEach((edu, index) => {
            pdf.setFont("helvetica", "bold", 11);
            pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            pdf.getPDF().text(edu.degree, 20, pdf.getCurrentY());
            pdf.addSpace(3);

            pdf.setFont("helvetica", "normal", 10);
            pdf.setTextColor(
              secondaryColor[0],
              secondaryColor[1],
              secondaryColor[2]
            );
            pdf.getPDF().text(edu.institution, 20, pdf.getCurrentY());
            pdf.addSpace(2);

            pdf.setFont("helvetica", "italic", 9);
            pdf.getPDF().text(edu.year, 20, pdf.getCurrentY());
            pdf.addSpace(index < education.length - 1 ? 4 : 2);
          });
        }
      },
      () => {
        if (hasCertifications) {
          const startX = 20 + (pdf.getContentWidth() + 10) / 2;

          pdf.setFont("helvetica", "bold", 12);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.getPDF().text("CERTIFICATIONS", startX, pdf.getCurrentY());
          pdf.addSpace(2);
          pdf.addHorizontalLine(
            (pdf.getContentWidth() - 10) / 2,
            1.5,
            primaryColor
          );
          pdf.addSpace(3);

          certifications.forEach((cert, index) => {
            pdf.setFont("helvetica", "bold", 11);
            pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            pdf.getPDF().text(cert.name, startX, pdf.getCurrentY());
            pdf.addSpace(3);

            pdf.setFont("helvetica", "normal", 10);
            pdf.setTextColor(
              secondaryColor[0],
              secondaryColor[1],
              secondaryColor[2]
            );
            pdf.getPDF().text(cert.authority, startX, pdf.getCurrentY());
            pdf.addSpace(2);

            pdf.setFont("helvetica", "italic", 9);
            pdf.getPDF().text(cert.date, startX, pdf.getCurrentY());
            pdf.addSpace(index < certifications.length - 1 ? 4 : 2);
          });
        }
      },
      10
    );
  }

  return pdf;
}
