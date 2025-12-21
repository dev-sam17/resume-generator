import { ResumeData } from "@/types/resume";
import { PDFBuilder } from "../pdf-utils";
import { generateClassicLayoutPDFEnhanced } from "./ClassicLayoutPDF-Enhanced";
import { generateModernLayoutPDFEnhanced } from "./ModernLayoutPDF-Enhanced";
import { generateProfessionalLayoutPDFEnhanced } from "./ProfessionalLayoutPDF-Enhanced";
import { generateMinimalLayoutPDFEnhanced } from "./MinimalLayoutPDF-Enhanced";
import { generateExecutiveLayoutPDFEnhanced } from "./ExecutiveLayoutPDF-Enhanced";
import { generateCompactLayoutPDFEnhanced } from "./CompactLayoutPDF-Enhanced";

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
      return generateClassicLayoutPDFEnhanced(data);
    case "modern":
      return generateModernLayoutPDFEnhanced(data);
    case "professional":
      return generateProfessionalLayoutPDFEnhanced(data);
    case "minimal":
      return generateMinimalLayoutPDFEnhanced(data);
    case "executive":
      return generateExecutiveLayoutPDFEnhanced(data);
    case "compact":
      return generateCompactLayoutPDFEnhanced(data);
    default:
      return generateClassicLayoutPDFEnhanced(data);
  }
}

export {
  generateClassicLayoutPDFEnhanced,
  generateModernLayoutPDFEnhanced,
  generateProfessionalLayoutPDFEnhanced,
  generateMinimalLayoutPDFEnhanced,
  generateExecutiveLayoutPDFEnhanced,
  generateCompactLayoutPDFEnhanced,
};
