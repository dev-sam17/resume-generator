import { PDFBuilder } from "../pdf-utils";
import { ResumeData } from "@/types/resume";

export function generateModernLayoutPDF(data: ResumeData): PDFBuilder {
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

  // Colors - matching HTML Modern layout
  const primaryColor: [number, number, number] = [17, 24, 39]; // Gray-900
  const secondaryColor: [number, number, number] = [75, 85, 99]; // Gray-600
  const textColor: [number, number, number] = [55, 65, 81]; // Gray-700
  const accentColor: [number, number, number] = [37, 99, 235]; // Blue-600
  const white: [number, number, number] = [255, 255, 255];

  // Header - Left aligned with blue left border (border-l-4 border-blue-600)
  const headerStartY = pdf.getCurrentY();

  // Draw left border
  pdf.addVerticalLine(20, headerStartY, headerStartY + 35, 3, accentColor);

  // Name
  pdf.setFont("helvetica", "bold", 18); // text-2xl
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.getPDF().text(contact.fullName, 26, pdf.getCurrentY());
  pdf.addSpace(3);

  // Title with blue color
  pdf.setFont("helvetica", "bold", 12); // text-base font-medium
  pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.getPDF().text(contact.title, 26, pdf.getCurrentY());
  pdf.addSpace(5);

  // Contact info (text-sm text-gray-600)
  pdf.setFont("helvetica", "normal", 10.5);
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

  const contactLine = `${contact.email}    ${contact.phone}    ${contact.location}`;
  pdf.getPDF().text(contactLine, 26, pdf.getCurrentY());
  pdf.addSpace(3);

  // Social links (text-sm text-blue-600)
  if (contact.linkedin || contact.github || contact.portfolio) {
    const socialItems: Array<{ text: string; link: string }> = [];
    if (contact.linkedin)
      socialItems.push({ text: "LinkedIn", link: contact.linkedin });
    if (contact.github)
      socialItems.push({ text: "GitHub", link: contact.github });
    if (contact.portfolio)
      socialItems.push({ text: "Portfolio", link: contact.portfolio });

    pdf.setFont("helvetica", "normal", 10.5);
    pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);

    let socialX = 26;
    socialItems.forEach((item, index) => {
      pdf.getPDF().textWithLink(item.text, socialX, pdf.getCurrentY(), {
        url: item.link,
      });
      socialX += pdf.getPDF().getTextWidth(item.text);
      if (index < socialItems.length - 1) {
        pdf.getPDF().text("    ", socialX, pdf.getCurrentY());
        socialX += pdf.getPDF().getTextWidth("    ");
      }
    });
    pdf.addSpace(3);
  }

  pdf.addSpace(6);

  // Professional Summary with blue badge heading
  if (summary) {
    // Blue badge (bg-blue-600 text-white px-3 py-1 text-sm uppercase)
    const badgeY = pdf.getCurrentY();
    const badgeText = "PROFESSIONAL SUMMARY";
    pdf.setFont("helvetica", "bold", 10.5);
    const badgeWidth = pdf.getPDF().getTextWidth(badgeText) + 6;

    pdf.addFilledRect(20, badgeY - 4, badgeWidth, 6, accentColor);
    pdf.setTextColor(white[0], white[1], white[2]);
    pdf.getPDF().text(badgeText, 23, badgeY);
    pdf.addSpace(5);

    // Summary text (text-sm text-gray-700)
    pdf.setFont("helvetica", "normal", 10.5);
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.addText(summary, 20, 10.5, { lineHeight: 1.5 });
    pdf.addSpace(6);
  }

  // Technical Skills with blue badge
  if (
    Object.keys(skills).some(
      (key) => skills[key as keyof typeof skills]?.length > 0
    )
  ) {
    const badgeY = pdf.getCurrentY();
    const badgeText = "TECHNICAL SKILLS";
    pdf.setFont("helvetica", "bold", 10.5);
    const badgeWidth = pdf.getPDF().getTextWidth(badgeText) + 6;

    pdf.addFilledRect(20, badgeY - 4, badgeWidth, 6, accentColor);
    pdf.setTextColor(white[0], white[1], white[2]);
    pdf.getPDF().text(badgeText, 23, badgeY);
    pdf.addSpace(5);

    Object.entries(skills).forEach(([category, skillList]) => {
      if (!Array.isArray(skillList) || skillList.length === 0) return;

      const categoryName = category
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str: string) => str.toUpperCase())
        .trim();

      // Category in bold
      pdf.setFont("helvetica", "bold", 10.5);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      const labelWidth = pdf.getPDF().getTextWidth(categoryName + ": ");
      pdf.getPDF().text(categoryName + ": ", 20, pdf.getCurrentY());

      // Skills
      pdf.setFont("helvetica", "normal", 10.5);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.addText(skillList.join(", "), 20 + labelWidth, 10.5, {
        maxWidth: pdf.getContentWidth() - labelWidth,
      });
      pdf.addSpace(3);
    });

    pdf.addSpace(4);
  }

  // Professional Experience with blue badge
  if (experience.length > 0) {
    const badgeY = pdf.getCurrentY();
    const badgeText = "PROFESSIONAL EXPERIENCE";
    pdf.setFont("helvetica", "bold", 10.5);
    const badgeWidth = pdf.getPDF().getTextWidth(badgeText) + 6;

    pdf.addFilledRect(20, badgeY - 4, badgeWidth, 6, accentColor);
    pdf.setTextColor(white[0], white[1], white[2]);
    pdf.getPDF().text(badgeText, 23, badgeY);
    pdf.addSpace(5);

    experience.forEach((exp, index) => {
      // Job title
      pdf.setFont("helvetica", "bold", 12);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.getPDF().text(exp.title, 20, pdf.getCurrentY());

      // Date (right-aligned)
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

      // Company and location
      pdf.setFont("helvetica", "normal", 10.5);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf
        .getPDF()
        .text(`${exp.company}, ${exp.location}`, 20, pdf.getCurrentY());
      pdf.addSpace(3);

      // Achievements with bullets
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

      // Technologies
      if (exp.technologies && exp.technologies.length > 0) {
        pdf.addSpace(2);
        pdf.setFont("helvetica", "italic", 9);
        pdf.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        const techText = "Tech: " + exp.technologies.join(", ");
        pdf.addText(techText, 22, 9, { maxWidth: pdf.getContentWidth() - 2 });
      }

      if (index < experience.length - 1) {
        pdf.addSpace(5);
      }
    });

    pdf.addSpace(4);
  }

  // Projects with blue badge
  if (projects.length > 0) {
    const badgeY = pdf.getCurrentY();
    const badgeText = "PROJECTS";
    pdf.setFont("helvetica", "bold", 10.5);
    const badgeWidth = pdf.getPDF().getTextWidth(badgeText) + 6;

    pdf.addFilledRect(20, badgeY - 4, badgeWidth, 6, accentColor);
    pdf.setTextColor(white[0], white[1], white[2]);
    pdf.getPDF().text(badgeText, 23, badgeY);
    pdf.addSpace(5);

    projects.forEach((project, index) => {
      // Project name
      pdf.setFont("helvetica", "bold", 12);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.getPDF().text(project.name, 20, pdf.getCurrentY());

      // Link
      if (project.link) {
        pdf.setFont("helvetica", "normal", 10);
        pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        const linkText = "View Project";
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

      // Role
      pdf.setFont("helvetica", "italic", 10);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.getPDF().text(project.role, 20, pdf.getCurrentY());
      pdf.addSpace(3);

      // Description
      pdf.setFont("helvetica", "normal", 10.5);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.addText(project.description, 20, 10.5, { lineHeight: 1.4 });
      pdf.addSpace(2);

      // Technologies
      if (project.technologies && project.technologies.length > 0) {
        pdf.setFont("helvetica", "italic", 9);
        pdf.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        const techText = "Tech: " + project.technologies.join(", ");
        pdf.addText(techText, 20, 9, { maxWidth: pdf.getContentWidth() });
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
          const badgeY = pdf.getCurrentY();
          const badgeText = "EDUCATION";
          pdf.setFont("helvetica", "bold", 10.5);
          const badgeWidth = pdf.getPDF().getTextWidth(badgeText) + 6;

          pdf.addFilledRect(20, badgeY - 4, badgeWidth, 6, accentColor);
          pdf.setTextColor(white[0], white[1], white[2]);
          pdf.getPDF().text(badgeText, 23, badgeY);
          pdf.addSpace(5);

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

          const badgeY = pdf.getCurrentY();
          const badgeText = "CERTIFICATIONS";
          pdf.setFont("helvetica", "bold", 10.5);
          const badgeWidth = pdf.getPDF().getTextWidth(badgeText) + 6;

          pdf.addFilledRect(startX, badgeY - 4, badgeWidth, 6, accentColor);
          pdf.setTextColor(white[0], white[1], white[2]);
          pdf.getPDF().text(badgeText, startX + 3, badgeY);
          pdf.addSpace(5);

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
