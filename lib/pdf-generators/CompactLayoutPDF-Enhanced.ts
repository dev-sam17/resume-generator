import { PDFBuilder } from "../pdf-utils";
import { ResumeData } from "@/types/resume";

export function generateCompactLayoutPDFEnhanced(data: ResumeData): PDFBuilder {
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

  // Colors - matching HTML Compact layout
  const primaryColor: [number, number, number] = [17, 24, 39]; // Gray-900
  const secondaryColor: [number, number, number] = [55, 65, 81]; // Gray-700
  const textColor: [number, number, number] = [75, 85, 99]; // Gray-600
  const accentColor: [number, number, number] = [29, 78, 216]; // Blue-700
  const borderColor: [number, number, number] = [31, 41, 55]; // Gray-800

  // Compact header (border-b border-gray-800)
  pdf.setFont("helvetica", "bold", 15); // text-xl (smaller than others)
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.getPDF().text(contact.fullName, 20, pdf.getCurrentY());

  // Contact info on right side (text-xs)
  pdf.setFont("helvetica", "normal", 9);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  const rightX = pdf.getPDF().internal.pageSize.getWidth() - 20;

  let contactY = pdf.getCurrentY() - 2;
  const emailText = `✉ ${contact.email}`;
  const emailWidth = pdf.getPDF().getTextWidth(emailText);
  pdf.getPDF().text(emailText, rightX - emailWidth, contactY);

  contactY += 3;
  const phoneText = `☎ ${contact.phone}`;
  const phoneWidth = pdf.getPDF().getTextWidth(phoneText);
  pdf.getPDF().text(phoneText, rightX - phoneWidth, contactY);

  contactY += 3;
  const locationText = `⌂ ${contact.location}`;
  const locationWidth = pdf.getPDF().getTextWidth(locationText);
  pdf.getPDF().text(locationText, rightX - locationWidth, contactY);

  pdf.addSpace(4);

  // Title
  pdf.setFont("helvetica", "bold", 10.5); // text-sm font-medium
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  pdf.getPDF().text(contact.title, 20, pdf.getCurrentY());
  pdf.addSpace(4);

  // Social links (text-xs text-blue-700)
  if (contact.linkedin || contact.github || contact.portfolio) {
    const socialItems: Array<{ text: string; link: string }> = [];
    if (contact.linkedin)
      socialItems.push({ text: "LinkedIn", link: contact.linkedin });
    if (contact.github)
      socialItems.push({ text: "GitHub", link: contact.github });
    if (contact.portfolio)
      socialItems.push({ text: "Portfolio", link: contact.portfolio });

    pdf.setFont("helvetica", "normal", 9);
    pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);

    let socialX = 20;
    socialItems.forEach((item, index) => {
      pdf
        .getPDF()
        .textWithLink(item.text, socialX, pdf.getCurrentY(), {
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

  // Bottom border
  pdf.addHorizontalLine(undefined, 0.5, borderColor);
  pdf.addSpace(5);

  // Two-column layout: Left (Skills, Education, Certifications) | Right (Summary, Experience, Projects)
  const leftColWidth = pdf.getContentWidth() / 3;
  const rightColWidth = (pdf.getContentWidth() * 2) / 3 - 10;

  pdf.addTwoColumns(
    () => {
      // LEFT COLUMN - Skills
      if (
        Object.keys(skills).some(
          (key) => skills[key as keyof typeof skills]?.length > 0
        )
      ) {
        pdf.setFont("helvetica", "bold", 9); // text-xs
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.getPDF().text("SKILLS", 20, pdf.getCurrentY());
        pdf.addSpace(2);
        pdf.addHorizontalLine(leftColWidth, 0.5, borderColor);
        pdf.addSpace(2);

        Object.entries(skills).forEach(([category, skillList]) => {
          if (!Array.isArray(skillList) || skillList.length === 0) return;

          const categoryName = category
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str: string) => str.toUpperCase())
            .trim();

          pdf.setFont("helvetica", "bold", 9);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.getPDF().text(categoryName + ":", 20, pdf.getCurrentY());
          pdf.addSpace(2);

          pdf.setFont("helvetica", "normal", 9);
          pdf.setTextColor(
            secondaryColor[0],
            secondaryColor[1],
            secondaryColor[2]
          );
          pdf.addText(skillList.join(", "), 20, 9, { maxWidth: leftColWidth });
          pdf.addSpace(2);
        });

        pdf.addSpace(4);
      }

      // Education
      if (education.length > 0) {
        pdf.setFont("helvetica", "bold", 9);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.getPDF().text("EDUCATION", 20, pdf.getCurrentY());
        pdf.addSpace(2);
        pdf.addHorizontalLine(leftColWidth, 0.5, borderColor);
        pdf.addSpace(2);

        education.forEach((edu, index) => {
          pdf.setFont("helvetica", "bold", 9);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.addText(edu.degree, 20, 9, { maxWidth: leftColWidth });
          pdf.addSpace(2);

          pdf.setFont("helvetica", "normal", 8);
          pdf.setTextColor(
            secondaryColor[0],
            secondaryColor[1],
            secondaryColor[2]
          );
          pdf.addText(edu.institution, 20, 8, { maxWidth: leftColWidth });
          pdf.addSpace(1);

          pdf.setFont("helvetica", "italic", 8);
          pdf.getPDF().text(edu.year, 20, pdf.getCurrentY());
          pdf.addSpace(index < education.length - 1 ? 3 : 2);
        });

        pdf.addSpace(4);
      }

      // Certifications
      if (certifications.length > 0) {
        pdf.setFont("helvetica", "bold", 9);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.getPDF().text("CERTIFICATIONS", 20, pdf.getCurrentY());
        pdf.addSpace(2);
        pdf.addHorizontalLine(leftColWidth, 0.5, borderColor);
        pdf.addSpace(2);

        certifications.forEach((cert, index) => {
          pdf.setFont("helvetica", "bold", 9);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.addText(cert.name, 20, 9, { maxWidth: leftColWidth });
          pdf.addSpace(2);

          pdf.setFont("helvetica", "normal", 8);
          pdf.setTextColor(
            secondaryColor[0],
            secondaryColor[1],
            secondaryColor[2]
          );
          pdf.addText(cert.authority, 20, 8, { maxWidth: leftColWidth });
          pdf.addSpace(1);

          pdf.setFont("helvetica", "italic", 8);
          pdf.getPDF().text(cert.date, 20, pdf.getCurrentY());
          pdf.addSpace(index < certifications.length - 1 ? 3 : 2);
        });
      }
    },
    () => {
      const rightStartX = 20 + leftColWidth + 10;

      // RIGHT COLUMN - Summary
      if (summary) {
        pdf.setFont("helvetica", "bold", 9);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.getPDF().text("SUMMARY", rightStartX, pdf.getCurrentY());
        pdf.addSpace(2);
        pdf.addHorizontalLine(rightColWidth, 0.5, borderColor);
        pdf.addSpace(2);

        pdf.setFont("helvetica", "normal", 9);
        pdf.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        pdf.addText(summary, rightStartX, 9, {
          lineHeight: 1.4,
          maxWidth: rightColWidth,
        });
        pdf.addSpace(4);
      }

      // Experience
      if (experience.length > 0) {
        pdf.setFont("helvetica", "bold", 9);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.getPDF().text("EXPERIENCE", rightStartX, pdf.getCurrentY());
        pdf.addSpace(2);
        pdf.addHorizontalLine(rightColWidth, 0.5, borderColor);
        pdf.addSpace(2);

        experience.forEach((exp, index) => {
          pdf.setFont("helvetica", "bold", 10);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.getPDF().text(exp.title, rightStartX, pdf.getCurrentY());
          pdf.addSpace(3);

          pdf.setFont("helvetica", "normal", 9);
          pdf.setTextColor(
            secondaryColor[0],
            secondaryColor[1],
            secondaryColor[2]
          );
          pdf
            .getPDF()
            .text(
              `${exp.company}, ${exp.location}`,
              rightStartX,
              pdf.getCurrentY()
            );
          pdf.addSpace(2);

          pdf.setFont("helvetica", "italic", 8);
          pdf
            .getPDF()
            .text(
              `${exp.startDate} - ${exp.endDate}`,
              rightStartX,
              pdf.getCurrentY()
            );
          pdf.addSpace(2);

          pdf.setFont("helvetica", "normal", 9);
          pdf.setTextColor(
            secondaryColor[0],
            secondaryColor[1],
            secondaryColor[2]
          );

          exp.achievements.forEach((achievement) => {
            const lineHeight = 9 * 0.3527 * 1.3;
            const maxWidth = rightColWidth - 6;
            const lines = pdf.getPDF().splitTextToSize(achievement, maxWidth);

            lines.forEach((line: string, lineIndex: number) => {
              pdf.checkPageBreak(lineHeight);

              if (lineIndex === 0) {
                pdf.getPDF().text("•", rightStartX + 2, pdf.getCurrentY());
                pdf.getPDF().text(line, rightStartX + 6, pdf.getCurrentY());
              } else {
                pdf.getPDF().text(line, rightStartX + 6, pdf.getCurrentY());
              }

              pdf.setCurrentY(pdf.getCurrentY() + lineHeight);
            });
          });

          if (index < experience.length - 1) {
            pdf.addSpace(3);
          }
        });

        pdf.addSpace(4);
      }

      // Projects
      if (projects.length > 0) {
        pdf.setFont("helvetica", "bold", 9);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.getPDF().text("PROJECTS", rightStartX, pdf.getCurrentY());
        pdf.addSpace(2);
        pdf.addHorizontalLine(rightColWidth, 0.5, borderColor);
        pdf.addSpace(2);

        projects.forEach((project, index) => {
          pdf.setFont("helvetica", "bold", 10);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.getPDF().text(project.name, rightStartX, pdf.getCurrentY());
          pdf.addSpace(3);

          pdf.setFont("helvetica", "italic", 9);
          pdf.setTextColor(
            secondaryColor[0],
            secondaryColor[1],
            secondaryColor[2]
          );
          pdf.getPDF().text(project.role, rightStartX, pdf.getCurrentY());
          pdf.addSpace(2);

          pdf.setFont("helvetica", "normal", 9);
          pdf.addText(project.description, rightStartX, 9, {
            lineHeight: 1.3,
            maxWidth: rightColWidth,
          });

          if (index < projects.length - 1) {
            pdf.addSpace(3);
          }
        });
      }
    },
    10
  );

  return pdf;
}
