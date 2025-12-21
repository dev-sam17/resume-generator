import { PDFBuilder } from "../pdf-utils";
import { ResumeData } from "@/types/resume";

export function generateClassicLayoutPDFEnhanced(data: ResumeData): PDFBuilder {
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

  // Colors - matching HTML
  const primaryColor: [number, number, number] = [17, 24, 39]; // Gray-900
  const secondaryColor: [number, number, number] = [75, 85, 99]; // Gray-600
  const textColor: [number, number, number] = [55, 65, 81]; // Gray-700
  const accentColor: [number, number, number] = [29, 78, 216]; // Blue-700
  const borderColor: [number, number, number] = [156, 163, 175]; // Gray-400

  // Header - Traditional centered with bottom border (matching HTML: border-b-2 border-gray-900)
  pdf.setFont("helvetica", "bold", 18); // text-2xl = 24px = ~18pt
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  const nameWidth = pdf.getPDF().getTextWidth(contact.fullName.toUpperCase());
  const centerX = (pdf.getPDF().internal.pageSize.getWidth() - nameWidth) / 2;
  pdf.getPDF().text(contact.fullName.toUpperCase(), centerX, pdf.getCurrentY());
  pdf.addSpace(3);

  // Title
  pdf.setFont("helvetica", "normal", 12); // text-base = 16px = ~12pt
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  const titleWidth = pdf.getPDF().getTextWidth(contact.title);
  const titleX = (pdf.getPDF().internal.pageSize.getWidth() - titleWidth) / 2;
  pdf.getPDF().text(contact.title, titleX, pdf.getCurrentY());
  pdf.addSpace(5);

  // Contact info - centered (matching HTML: text-sm text-gray-600)
  pdf.setFont("helvetica", "normal", 10.5); // text-sm = 14px = ~10.5pt
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

  const contactLine = `${contact.email} • ${contact.phone} • ${contact.location}`;
  const contactWidth = pdf.getPDF().getTextWidth(contactLine);
  const contactX =
    (pdf.getPDF().internal.pageSize.getWidth() - contactWidth) / 2;
  pdf.getPDF().text(contactLine, contactX, pdf.getCurrentY());
  pdf.addSpace(3);

  // Social links (matching HTML: text-xs text-blue-700)
  if (contact.linkedin || contact.github || contact.portfolio) {
    const socialItems: Array<{ text: string; link: string }> = [];
    if (contact.linkedin)
      socialItems.push({ text: "LinkedIn", link: contact.linkedin });
    if (contact.github)
      socialItems.push({ text: "GitHub", link: contact.github });
    if (contact.portfolio)
      socialItems.push({ text: "Portfolio", link: contact.portfolio });

    pdf.setFont("helvetica", "normal", 9); // text-xs = 12px = ~9pt
    pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);

    let socialX = 0;
    const socialLine = socialItems.map((s) => s.text).join("  |  ");
    const socialWidth = pdf.getPDF().getTextWidth(socialLine);
    socialX = (pdf.getPDF().internal.pageSize.getWidth() - socialWidth) / 2;

    socialItems.forEach((item, index) => {
      pdf.getPDF().textWithLink(item.text, socialX, pdf.getCurrentY(), {
        url: item.link,
      });
      socialX += pdf.getPDF().getTextWidth(item.text);
      if (index < socialItems.length - 1) {
        pdf.getPDF().text("  |  ", socialX, pdf.getCurrentY());
        socialX += pdf.getPDF().getTextWidth("  |  ");
      }
    });
    pdf.addSpace(3);
  }

  // Bottom border of header (border-b-2 border-gray-900)
  pdf.addHorizontalLine(undefined, 1.5, primaryColor);
  pdf.addSpace(6);

  // Professional Summary with styled heading (matching HTML: border-b border-gray-400)
  if (summary) {
    pdf.setFont("helvetica", "bold", 12); // text-base = 16px = ~12pt
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.getPDF().text("Professional Summary", 20, pdf.getCurrentY());
    pdf.addSpace(2);
    pdf.addHorizontalLine(undefined, 0.5, borderColor);
    pdf.addSpace(3);

    // Summary text (matching HTML: text-sm text-gray-700)
    pdf.setFont("helvetica", "normal", 10.5);
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.addText(summary, 20, 10.5, { lineHeight: 1.5 });
    pdf.addSpace(5);
  }

  // Technical Skills (matching HTML: border-b border-gray-400)
  if (
    Object.keys(skills).some(
      (key) => skills[key as keyof typeof skills]?.length > 0
    )
  ) {
    pdf.setFont("helvetica", "bold", 12);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.getPDF().text("Technical Skills", 20, pdf.getCurrentY());
    pdf.addSpace(2);
    pdf.addHorizontalLine(undefined, 0.5, borderColor);
    pdf.addSpace(4);

    Object.entries(skills).forEach(([category, skillList]) => {
      if (!Array.isArray(skillList) || skillList.length === 0) return;

      const categoryName = category
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str: string) => str.toUpperCase())
        .trim();

      // Category name in bold
      pdf.setFont("helvetica", "bold", 11);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      const labelWidth = pdf.getPDF().getTextWidth(categoryName + ": ");
      pdf.getPDF().text(categoryName + ": ", 20, pdf.getCurrentY());

      // Skills in regular font
      pdf.setFont("helvetica", "normal", 11);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.addText(skillList.join(", "), 20 + labelWidth, 11, {
        maxWidth: pdf.getContentWidth() - labelWidth,
      });
      pdf.addSpace(2);
    });

    pdf.addSpace(4);
  }

  // Professional Experience (matching HTML)
  if (experience.length > 0) {
    pdf.setFont("helvetica", "bold", 12);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.getPDF().text("Professional Experience", 20, pdf.getCurrentY());
    pdf.addSpace(2);
    pdf.addHorizontalLine(undefined, 0.5, borderColor);
    pdf.addSpace(3);

    experience.forEach((exp, index) => {
      const sectionStartY = pdf.getCurrentY();

      // Job title in bold
      pdf.setFont("helvetica", "bold", 12);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.getPDF().text(exp.title, 20, pdf.getCurrentY());

      // Date (right-aligned) in accent color
      pdf.setFont("helvetica", "normal", 10);
      pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      const dateText = `${exp.startDate} - ${exp.endDate}`;
      const dateWidth = pdf.getPDF().getTextWidth(dateText);
      pdf
        .getPDF()
        .text(
          dateText,
          pdf.getPDF().internal.pageSize.getWidth() - 20 - dateWidth,
          pdf.getCurrentY()
        );
      pdf.addSpace(5);

      // Company and location
      pdf.setFont("helvetica", "italic", 11);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf
        .getPDF()
        .text(`${exp.company} • ${exp.location}`, 20, pdf.getCurrentY());
      pdf.addSpace(4);

      // Achievements with custom bullets
      pdf.setFont("helvetica", "normal", 11);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

      exp.achievements.forEach((achievement) => {
        const lineHeight = 11 * 0.3527 * 1.4;
        const maxWidth = pdf.getContentWidth() - 8;
        const lines = pdf.getPDF().splitTextToSize(achievement, maxWidth);

        lines.forEach((line: string, lineIndex: number) => {
          pdf.checkPageBreak(lineHeight);

          if (lineIndex === 0) {
            // First line with bullet
            pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
            pdf.getPDF().text("▸", 22, pdf.getCurrentY());
            pdf.setTextColor(
              secondaryColor[0],
              secondaryColor[1],
              secondaryColor[2]
            );
            pdf.getPDF().text(line, 28, pdf.getCurrentY());
          } else {
            // Continuation lines
            pdf.getPDF().text(line, 28, pdf.getCurrentY());
          }

          pdf.setCurrentY(pdf.getCurrentY() + lineHeight);
        });
      });

      // Technologies with badge style
      if (exp.technologies && exp.technologies.length > 0) {
        pdf.addSpace(2);
        pdf.setFont("helvetica", "bold", 9);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.getPDF().text("Technologies:", 22, pdf.getCurrentY());

        pdf.setFont("helvetica", "normal", 9);
        pdf.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        const techText = exp.technologies.join(" • ");
        pdf.addText(techText, 50, 9, { maxWidth: pdf.getContentWidth() - 30 });
      }

      if (index < experience.length - 1) {
        pdf.addSpace(5);
      }
    });

    pdf.addSpace(4);
  }

  // Projects section
  if (projects.length > 0) {
    pdf.setFont("helvetica", "bold", 12);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.getPDF().text("Projects", 20, pdf.getCurrentY());
    pdf.addSpace(2);
    pdf.addHorizontalLine(undefined, 0.5, borderColor);
    pdf.addSpace(3);

    projects.forEach((project, index) => {
      // Project name
      pdf.setFont("helvetica", "bold", 12);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.getPDF().text(project.name, 20, pdf.getCurrentY());

      // Link (right-aligned)
      if (project.link) {
        pdf.setFont("helvetica", "normal", 10);
        pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        const linkText = "View Project →";
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
      pdf.addSpace(5);

      // Role
      pdf.setFont("helvetica", "italic", 10);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.getPDF().text(project.role, 20, pdf.getCurrentY());
      pdf.addSpace(3);

      // Description
      pdf.setFont("helvetica", "normal", 11);
      pdf.addText(project.description, 20, 11, { lineHeight: 1.4 });
      pdf.addSpace(2);

      // Technologies
      if (project.technologies && project.technologies.length > 0) {
        pdf.setFont("helvetica", "bold", 9);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.getPDF().text("Technologies:", 20, pdf.getCurrentY());

        pdf.setFont("helvetica", "normal", 9);
        pdf.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        const techText = project.technologies.join(" • ");
        pdf.addText(techText, 48, 9, { maxWidth: pdf.getContentWidth() - 28 });
      }

      if (index < projects.length - 1) {
        pdf.addSpace(5);
      }
    });

    pdf.addSpace(4);
  }

  // Education and Certifications in two columns
  const hasEducation = education.length > 0;
  const hasCertifications = certifications.length > 0;

  if (hasEducation || hasCertifications) {
    pdf.addTwoColumns(
      () => {
        if (hasEducation) {
          pdf.setFont("helvetica", "bold", 12);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.getPDF().text("Education", 20, pdf.getCurrentY());
          pdf.addSpace(2);
          pdf.addHorizontalLine(
            (pdf.getContentWidth() - 10) / 2,
            0.5,
            borderColor
          );
          pdf.addSpace(3);

          education.forEach((edu, index) => {
            pdf.setFont("helvetica", "bold", 11);
            pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            pdf.getPDF().text(edu.degree, 20, pdf.getCurrentY());
            pdf.addSpace(4);

            pdf.setFont("helvetica", "normal", 10);
            pdf.setTextColor(
              secondaryColor[0],
              secondaryColor[1],
              secondaryColor[2]
            );
            pdf.getPDF().text(edu.institution, 20, pdf.getCurrentY());
            pdf.addSpace(3);

            pdf.setFont("helvetica", "italic", 9);
            pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
            pdf.getPDF().text(edu.year, 20, pdf.getCurrentY());
            pdf.addSpace(index < education.length - 1 ? 5 : 2);
          });
        }
      },
      () => {
        if (hasCertifications) {
          const startX = 20 + (pdf.getContentWidth() + 10) / 2;

          pdf.setFont("helvetica", "bold", 12);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.getPDF().text("Certifications", startX, pdf.getCurrentY());
          pdf.addSpace(2);
          pdf.addHorizontalLine(
            (pdf.getContentWidth() - 10) / 2,
            0.5,
            borderColor
          );
          pdf.addSpace(3);

          certifications.forEach((cert, index) => {
            pdf.setFont("helvetica", "bold", 11);
            pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            pdf.getPDF().text(cert.name, startX, pdf.getCurrentY());
            pdf.addSpace(4);

            pdf.setFont("helvetica", "normal", 10);
            pdf.setTextColor(
              secondaryColor[0],
              secondaryColor[1],
              secondaryColor[2]
            );
            pdf.getPDF().text(cert.authority, startX, pdf.getCurrentY());
            pdf.addSpace(3);

            pdf.setFont("helvetica", "italic", 9);
            pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
            pdf.getPDF().text(cert.date, startX, pdf.getCurrentY());
            pdf.addSpace(index < certifications.length - 1 ? 5 : 2);
          });
        }
      },
      10
    );
  }

  return pdf;
}
