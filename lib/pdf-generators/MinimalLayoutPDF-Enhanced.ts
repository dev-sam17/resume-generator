import { PDFBuilder } from "../pdf-utils";
import { ResumeData } from "@/types/resume";

export function generateMinimalLayoutPDFEnhanced(data: ResumeData): PDFBuilder {
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

  // Colors - matching HTML Minimal layout
  const primaryColor: [number, number, number] = [17, 24, 39]; // Gray-900
  const secondaryColor: [number, number, number] = [75, 85, 99]; // Gray-600
  const textColor: [number, number, number] = [55, 65, 81]; // Gray-700
  const borderColor: [number, number, number] = [229, 231, 235]; // Gray-200

  // Header - Ultra minimal
  pdf.setFont("helvetica", "normal", 18); // text-2xl font-light
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.getPDF().text(contact.fullName, 20, pdf.getCurrentY());
  pdf.addSpace(3);

  // Title
  pdf.setFont("helvetica", "normal", 12); // text-base
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  pdf.getPDF().text(contact.title, 20, pdf.getCurrentY());
  pdf.addSpace(6);

  // Top border (border-t border-gray-200)
  pdf.addHorizontalLine(undefined, 0.5, borderColor);
  pdf.addSpace(4);

  // Contact info - simple line
  pdf.setFont("helvetica", "normal", 10.5); // text-sm
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

  let contactLine = `${contact.email} • ${contact.phone} • ${contact.location}`;
  if (contact.linkedin) contactLine += ` • LinkedIn`;
  if (contact.github) contactLine += ` • GitHub`;
  if (contact.portfolio) contactLine += ` • Portfolio`;

  // Handle links
  let currentX = 20;
  const parts: Array<{ text: string; link: string | null }> = [
    { text: contact.email, link: null },
    { text: " • ", link: null },
    { text: contact.phone, link: null },
    { text: " • ", link: null },
    { text: contact.location, link: null },
  ];

  if (contact.linkedin) {
    parts.push({ text: " • ", link: null });
    parts.push({ text: "LinkedIn", link: contact.linkedin });
  }
  if (contact.github) {
    parts.push({ text: " • ", link: null });
    parts.push({ text: "GitHub", link: contact.github });
  }
  if (contact.portfolio) {
    parts.push({ text: " • ", link: null });
    parts.push({ text: "Portfolio", link: contact.portfolio });
  }

  parts.forEach((part) => {
    if (part.link) {
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.getPDF().textWithLink(part.text, currentX, pdf.getCurrentY(), {
        url: part.link,
      });
    } else {
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.getPDF().text(part.text, currentX, pdf.getCurrentY());
    }
    currentX += pdf.getPDF().getTextWidth(part.text);
  });

  pdf.addSpace(8);

  // Professional Summary (text-xs font-bold uppercase tracking-widest)
  if (summary) {
    pdf.setFont("helvetica", "bold", 9); // text-sm
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.getPDF().text("ABOUT", 20, pdf.getCurrentY());
    pdf.addSpace(4);

    pdf.setFont("helvetica", "normal", 10.5); // text-sm
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.addText(summary, 20, 10.5, { lineHeight: 1.5 });
    pdf.addSpace(8);
  }

  // Work Experience
  if (experience.length > 0) {
    pdf.setFont("helvetica", "bold", 9);
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.getPDF().text("EXPERIENCE", 20, pdf.getCurrentY());
    pdf.addSpace(4);

    experience.forEach((exp, index) => {
      // Title and date on same line
      pdf.setFont("helvetica", "normal", 10.5);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.getPDF().text(exp.title, 20, pdf.getCurrentY());

      // Date (right-aligned)
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      const dateText = `${exp.startDate} — ${exp.endDate}`;
      const dateWidth = pdf.getPDF().getTextWidth(dateText);
      pdf
        .getPDF()
        .text(
          dateText,
          pdf.getPDF().internal.pageSize.getWidth() - 20 - dateWidth,
          pdf.getCurrentY()
        );
      pdf.addSpace(3);

      // Company and location
      pdf.setFont("helvetica", "normal", 10.5);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf
        .getPDF()
        .text(`${exp.company}, ${exp.location}`, 20, pdf.getCurrentY());
      pdf.addSpace(3);

      // Achievements with em dash
      pdf.setFont("helvetica", "normal", 10.5);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);

      exp.achievements.forEach((achievement) => {
        const lineHeight = 10.5 * 0.3527 * 1.4;
        const maxWidth = pdf.getContentWidth() - 8;
        const lines = pdf.getPDF().splitTextToSize(achievement, maxWidth);

        lines.forEach((line: string, lineIndex: number) => {
          pdf.checkPageBreak(lineHeight);

          if (lineIndex === 0) {
            pdf.getPDF().text("—", 22, pdf.getCurrentY());
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
        pdf.addText(exp.technologies.join(" • "), 22, 9);
      }

      if (index < experience.length - 1) {
        pdf.addSpace(6);
      }
    });

    pdf.addSpace(8);
  }

  // Projects
  if (projects.length > 0) {
    pdf.setFont("helvetica", "bold", 9);
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.getPDF().text("PROJECTS", 20, pdf.getCurrentY());
    pdf.addSpace(4);

    projects.forEach((project, index) => {
      pdf.setFont("helvetica", "normal", 10.5);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.getPDF().text(project.name, 20, pdf.getCurrentY());

      if (project.link) {
        const linkText = "→";
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
      pdf.addSpace(3);

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
        pdf.addText(project.technologies.join(" • "), 20, 9);
      }

      if (index < projects.length - 1) {
        pdf.addSpace(6);
      }
    });

    pdf.addSpace(8);
  }

  // Skills
  if (
    Object.keys(skills).some(
      (key) => skills[key as keyof typeof skills]?.length > 0
    )
  ) {
    pdf.setFont("helvetica", "bold", 9);
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.getPDF().text("SKILLS", 20, pdf.getCurrentY());
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
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
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
          pdf.setFont("helvetica", "bold", 9);
          pdf.setTextColor(
            secondaryColor[0],
            secondaryColor[1],
            secondaryColor[2]
          );
          pdf.getPDF().text("EDUCATION", 20, pdf.getCurrentY());
          pdf.addSpace(4);

          education.forEach((edu, index) => {
            pdf.setFont("helvetica", "normal", 10.5);
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

          pdf.setFont("helvetica", "bold", 9);
          pdf.setTextColor(
            secondaryColor[0],
            secondaryColor[1],
            secondaryColor[2]
          );
          pdf.getPDF().text("CERTIFICATIONS", startX, pdf.getCurrentY());
          pdf.addSpace(4);

          certifications.forEach((cert, index) => {
            pdf.setFont("helvetica", "normal", 10.5);
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
