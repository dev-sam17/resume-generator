import { ResumeData } from "@/types/resume";
import { PDFBuilder } from "../pdf-utils";
import { generateClassicLayoutPDF } from "./ClassicLayoutPDF";
import { generateModernLayoutPDF } from "./ModernLayoutPDF";
import { generateProfessionalLayoutPDF } from "./ProfessionalLayoutPDF";
import { generateMinimalLayoutPDF } from "./MinimalLayoutPDF";
import { generateExecutiveLayoutPDF } from "./ExecutiveLayoutPDF";
import { generateCompactLayoutPDF } from "./CompactLayoutPDF";

export type LayoutType =
  | "classic"
  | "modern"
  | "professional"
  | "minimal"
  | "executive"
  | "compact";

export function generatePDF(data: ResumeData, layout: LayoutType): PDFBuilder {
  switch (layout) {
    case "classic":
      return generateClassicLayoutPDF(data);
    case "modern":
      return generateModernLayoutPDF(data);
    case "professional":
      return generateProfessionalLayoutPDF(data);
    case "minimal":
      return generateMinimalLayoutPDF(data);
    case "executive":
      return generateExecutiveLayoutPDF(data);
    case "compact":
      return generateCompactLayoutPDF(data);
    default:
      return generateClassicLayoutPDF(data);
  }
}

export {
  generateClassicLayoutPDF,
  generateModernLayoutPDF,
  generateProfessionalLayoutPDF,
  generateMinimalLayoutPDF,
  generateExecutiveLayoutPDF,
  generateCompactLayoutPDF,
};
