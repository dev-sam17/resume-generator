import { PDFBuilder } from "../pdf-utils";
import { ResumeData } from "@/types/resume";

export function generateExecutiveLayoutPDF(data: ResumeData): PDFBuilder {
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

  // Colors - matching HTML Executive layout
  const primaryColor: [number, number, number] = [17, 24, 39]; // Gray-900
  const black: [number, number, number] = [0, 0, 0]; // Black
  const secondaryColor: [number, number, number] = [55, 65, 81]; // Gray-700
  const iconColor: [number, number, number] = [75, 85, 99]; // Gray-600
  const accentColor: [number, number, number] = [29, 78, 216]; // Blue-700
  const grayBg: [number, number, number] = [249, 250, 251]; // Gray-50

  // Header - Executive style with thick bottom border (border-b-4 border-black)
  pdf.setFont("helvetica", "bold", 18); // text-2xl
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.getPDF().text(contact.fullName, 20, pdf.getCurrentY());
  pdf.addSpace(3);
  pdf.addHorizontalLine(undefined, 3, black); // border-b-4
  pdf.addSpace(5);

  // Title
  pdf.setFont("helvetica", "bold", 12); // text-base font-semibold
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  pdf.getPDF().text(contact.title, 20, pdf.getCurrentY());
  pdf.addSpace(6);

  // Contact info in 3 columns (grid-cols-3)
  pdf.setFont("helvetica", "normal", 10.5); // text-sm
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

  const col1X = 20;
  const col2X = 20 + pdf.getContentWidth() / 3;
  const col3X = 20 + (pdf.getContentWidth() * 2) / 3;
  let contactY = pdf.getCurrentY();

  // Column 1
  pdf.getPDF().text(`✉ ${contact.email}`, col1X, contactY);
  contactY += 4;
  pdf.getPDF().text(`☎ ${contact.phone}`, col1X, contactY);

  // Column 2
  contactY = pdf.getCurrentY();
  pdf.getPDF().text(`⌂ ${contact.location}`, col2X, contactY);
  contactY += 4;
  if (contact.linkedin) {
    pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.getPDF().textWithLink("LinkedIn Profile", col2X + 10, contactY, {
      url: contact.linkedin,
    });
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.getPDF().text("▶ ", col2X, contactY);
  }

  // Column 3
  contactY = pdf.getCurrentY();
  if (contact.github) {
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.getPDF().textWithLink("GitHub Profile", col3X + 10, contactY, {
      url: contact.github,
    });
    pdf.getPDF().text("▶ ", col3X, contactY);
    contactY += 4;
  }
  if (contact.portfolio) {
    pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.getPDF().textWithLink("Portfolio", col3X + 10, contactY, {
      url: contact.portfolio,
    });
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.getPDF().text("▶ ", col3X, contactY);
  }

  pdf.addSpace(8);

  // Executive Summary with gray background and left border (bg-gray-50 border-l-4 border-black)
  if (summary) {
    const summaryStartY = pdf.getCurrentY();

    // Measure summary height
    pdf.setFont("helvetica", "normal", 10.5);
    const summaryLines = pdf
      .getPDF()
      .splitTextToSize(summary, pdf.getContentWidth() - 12);
    const summaryHeight = summaryLines.length * 10.5 * 0.3527 * 1.5 + 10;

    // Draw background
    pdf.addFilledRect(
      20,
      summaryStartY - 3,
      pdf.getContentWidth(),
      summaryHeight,
      grayBg
    );

    // Draw left border
    pdf.addVerticalLine(
      20,
      summaryStartY - 3,
      summaryStartY + summaryHeight - 3,
      3,
      black
    );

    // Heading
    pdf.setFont("helvetica", "bold", 10); // text-sm
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.getPDF().text("EXECUTIVE SUMMARY", 26, pdf.getCurrentY());
    pdf.addSpace(3);

    // Summary text
    pdf.setFont("helvetica", "normal", 10.5);
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.addText(summary, 26, 10.5, {
      lineHeight: 1.5,
      maxWidth: pdf.getContentWidth() - 12,
    });
    pdf.addSpace(6);
  }

  // Work Experience (text-sm font-bold uppercase)
  if (experience.length > 0) {
    pdf.setFont("helvetica", "bold", 10);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.getPDF().text("PROFESSIONAL EXPERIENCE", 20, pdf.getCurrentY());
    pdf.addSpace(4);

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

      pdf.setFont("helvetica", "bold", 10.5);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf
        .getPDF()
        .text(`${exp.company} | ${exp.location}`, 20, pdf.getCurrentY());
      pdf.addSpace(3);

      pdf.setFont("helvetica", "normal", 10.5);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

      exp.achievements.forEach((achievement) => {
        const lineHeight = 10.5 * 0.3527 * 1.4;
        const maxWidth = pdf.getContentWidth() - 8;
        const lines = pdf.getPDF().splitTextToSize(achievement, maxWidth);

        lines.forEach((line: string, lineIndex: number) => {
          pdf.checkPageBreak(lineHeight);

          if (lineIndex === 0) {
            pdf.getPDF().text("▪", 22, pdf.getCurrentY());
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
        pdf.addText("Key Technologies: " + exp.technologies.join(", "), 22, 9);
      }

      if (index < experience.length - 1) {
        pdf.addSpace(5);
      }
    });

    pdf.addSpace(6);
  }

  // Projects
  if (projects.length > 0) {
    pdf.setFont("helvetica", "bold", 10);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.getPDF().text("KEY PROJECTS", 20, pdf.getCurrentY());
    pdf.addSpace(4);

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
      pdf.addText(project.description, 20, 10.5, { lineHeight: 1.4 });

      if (project.technologies && project.technologies.length > 0) {
        pdf.addSpace(2);
        pdf.setFont("helvetica", "italic", 9);
        pdf.addText("Technologies: " + project.technologies.join(", "), 20, 9);
      }

      if (index < projects.length - 1) {
        pdf.addSpace(5);
      }
    });

    pdf.addSpace(6);
  }

  // Skills
  if (
    Object.keys(skills).some(
      (key) => skills[key as keyof typeof skills]?.length > 0
    )
  ) {
    pdf.setFont("helvetica", "bold", 10);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.getPDF().text("CORE COMPETENCIES", 20, pdf.getCurrentY());
    pdf.addSpace(4);

    Object.entries(skills).forEach(([category, skillList]) => {
      if (!Array.isArray(skillList) || skillList.length === 0) return;

      const categoryName = category
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str: string) => str.toUpperCase())
        .trim();

      pdf.setFont("helvetica", "bold", 10.5);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      const labelWidth = pdf.getPDF().getTextWidth(categoryName + ": ");
      pdf.getPDF().text(categoryName + ": ", 20, pdf.getCurrentY());

      pdf.setFont("helvetica", "normal", 10.5);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.addText(skillList.join(", "), 20 + labelWidth, 10.5, {
        maxWidth: pdf.getContentWidth() - labelWidth,
      });
      pdf.addSpace(2);
    });

    pdf.addSpace(6);
  }

  // Education and Certifications
  const hasEducation = education.length > 0;
  const hasCertifications = certifications.length > 0;

  if (hasEducation || hasCertifications) {
    pdf.addTwoColumns(
      () => {
        if (hasEducation) {
          pdf.setFont("helvetica", "bold", 10);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.getPDF().text("EDUCATION", 20, pdf.getCurrentY());
          pdf.addSpace(4);

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

          pdf.setFont("helvetica", "bold", 10);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.getPDF().text("CERTIFICATIONS", startX, pdf.getCurrentY());
          pdf.addSpace(4);

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
