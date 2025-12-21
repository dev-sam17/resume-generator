import jsPDF from "jspdf";

export interface PDFConfig {
  pageWidth: number;
  pageHeight: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
  lineHeight: number;
}

export class PDFBuilder {
  private pdf: jsPDF;
  private config: PDFConfig;
  private currentY: number;
  private currentPage: number;

  constructor(orientation: "portrait" | "landscape" = "portrait") {
    this.pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: "a4",
      compress: true,
    });

    this.config = {
      pageWidth: this.pdf.internal.pageSize.getWidth(),
      pageHeight: this.pdf.internal.pageSize.getHeight(),
      marginLeft: 20,
      marginRight: 20,
      marginTop: 20,
      marginBottom: 20,
      lineHeight: 1.15,
    };

    this.currentY = this.config.marginTop;
    this.currentPage = 1;

    // Add custom fonts support
    this.addCustomFonts();
  }

  // Add custom fonts (can be extended with actual font files)
  private addCustomFonts(): void {
    // jsPDF comes with helvetica, times, courier
    // For now, we'll use built-in fonts with better styling
  }

  // Get available content width
  getContentWidth(): number {
    return (
      this.config.pageWidth - this.config.marginLeft - this.config.marginRight
    );
  }

  // Get remaining space on current page
  getRemainingSpace(): number {
    return this.config.pageHeight - this.config.marginBottom - this.currentY;
  }

  // Check if we need a new page
  checkPageBreak(requiredHeight: number): boolean {
    if (
      this.currentY + requiredHeight >
      this.config.pageHeight - this.config.marginBottom
    ) {
      this.addPage();
      return true;
    }
    return false;
  }

  // Add a new page
  addPage(): void {
    this.pdf.addPage();
    this.currentPage++;
    this.currentY = this.config.marginTop;
  }

  // Set font
  setFont(family: string, style: string, size: number): void {
    this.pdf.setFont(family, style);
    this.pdf.setFontSize(size);
  }

  // Set text color
  setTextColor(r: number, g: number, b: number): void {
    this.pdf.setTextColor(r, g, b);
  }

  // Add text with automatic wrapping and page breaks
  addText(
    text: string,
    x: number,
    fontSize: number = 11,
    options: {
      align?: "left" | "center" | "right";
      maxWidth?: number;
      fontStyle?: string;
      color?: [number, number, number];
      lineHeight?: number;
    } = {}
  ): number {
    const {
      align = "left",
      maxWidth = this.getContentWidth(),
      fontStyle = "normal",
      color = [0, 0, 0],
      lineHeight = this.config.lineHeight,
    } = options;

    this.setFont("helvetica", fontStyle, fontSize);
    this.setTextColor(color[0], color[1], color[2]);

    const lines = this.pdf.splitTextToSize(text, maxWidth);
    const lineHeightMM = fontSize * 0.3527 * lineHeight; // Convert pt to mm

    for (let i = 0; i < lines.length; i++) {
      this.checkPageBreak(lineHeightMM);

      let xPos = x;
      if (align === "center") {
        const textWidth = this.pdf.getTextWidth(lines[i]);
        xPos = (this.config.pageWidth - textWidth) / 2;
      } else if (align === "right") {
        const textWidth = this.pdf.getTextWidth(lines[i]);
        xPos = this.config.pageWidth - this.config.marginRight - textWidth;
      }

      this.pdf.text(lines[i], xPos, this.currentY);
      this.currentY += lineHeightMM;
    }

    return this.currentY;
  }

  // Add heading with underline
  addHeading(
    text: string,
    fontSize: number = 14,
    options: {
      underline?: boolean;
      underlineWidth?: number;
      spaceAfter?: number;
      uppercase?: boolean;
      color?: [number, number, number];
    } = {}
  ): void {
    const {
      underline = true,
      underlineWidth = 0.5,
      spaceAfter = 3,
      uppercase = true,
      color = [0, 0, 0],
    } = options;

    const displayText = uppercase ? text.toUpperCase() : text;
    const lineHeightMM = fontSize * 0.3527 * this.config.lineHeight;

    this.checkPageBreak(lineHeightMM + spaceAfter + 2);

    this.setFont("helvetica", "bold", fontSize);
    this.setTextColor(color[0], color[1], color[2]);
    this.pdf.text(displayText, this.config.marginLeft, this.currentY);

    if (underline) {
      const textWidth = this.pdf.getTextWidth(displayText);
      this.pdf.setLineWidth(underlineWidth);
      this.pdf.setDrawColor(color[0], color[1], color[2]);
      this.pdf.line(
        this.config.marginLeft,
        this.currentY + 1,
        this.config.marginLeft + textWidth,
        this.currentY + 1
      );
    }

    this.currentY += lineHeightMM + spaceAfter;
  }

  // Add section heading with full-width underline
  addSectionHeading(
    text: string,
    fontSize: number = 14,
    options: {
      spaceAfter?: number;
      uppercase?: boolean;
      color?: [number, number, number];
    } = {}
  ): void {
    const { spaceAfter = 3, uppercase = true, color = [0, 0, 0] } = options;

    const displayText = uppercase ? text.toUpperCase() : text;
    const lineHeightMM = fontSize * 0.3527 * this.config.lineHeight;

    this.checkPageBreak(lineHeightMM + spaceAfter + 2);

    this.setFont("helvetica", "bold", fontSize);
    this.setTextColor(color[0], color[1], color[2]);
    this.pdf.text(displayText, this.config.marginLeft, this.currentY);

    // Full-width underline
    this.pdf.setLineWidth(0.5);
    this.pdf.setDrawColor(128, 128, 128);
    this.pdf.line(
      this.config.marginLeft,
      this.currentY + 1,
      this.config.pageWidth - this.config.marginRight,
      this.currentY + 1
    );

    this.currentY += lineHeightMM + spaceAfter;
  }

  // Add bullet list
  addBulletList(
    items: string[],
    fontSize: number = 11,
    options: {
      bulletChar?: string;
      indent?: number;
      spaceAfter?: number;
    } = {}
  ): void {
    const { bulletChar = "•", indent = 5, spaceAfter = 2 } = options;

    this.setFont("helvetica", "normal", fontSize);
    this.setTextColor(0, 0, 0);

    const lineHeightMM = fontSize * 0.3527 * this.config.lineHeight;
    const maxWidth = this.getContentWidth() - indent;

    for (const item of items) {
      const lines = this.pdf.splitTextToSize(item, maxWidth);

      for (let i = 0; i < lines.length; i++) {
        this.checkPageBreak(lineHeightMM);

        if (i === 0) {
          // First line with bullet
          this.pdf.text(bulletChar, this.config.marginLeft, this.currentY);
          this.pdf.text(
            lines[i],
            this.config.marginLeft + indent,
            this.currentY
          );
        } else {
          // Continuation lines
          this.pdf.text(
            lines[i],
            this.config.marginLeft + indent,
            this.currentY
          );
        }

        this.currentY += lineHeightMM;
      }
    }

    this.currentY += spaceAfter;
  }

  // Add horizontal line
  addHorizontalLine(
    width?: number,
    lineWidth: number = 0.5,
    color: [number, number, number] = [0, 0, 0]
  ): void {
    const lineLength = width || this.getContentWidth();

    this.checkPageBreak(2);

    this.pdf.setLineWidth(lineWidth);
    this.pdf.setDrawColor(color[0], color[1], color[2]);
    this.pdf.line(
      this.config.marginLeft,
      this.currentY,
      this.config.marginLeft + lineLength,
      this.currentY
    );

    this.currentY += 2;
  }

  // Add filled rectangle
  addFilledRect(
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor: [number, number, number],
    borderColor?: [number, number, number],
    borderWidth: number = 0
  ): void {
    this.pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);

    if (borderColor && borderWidth > 0) {
      this.pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      this.pdf.setLineWidth(borderWidth);
      this.pdf.rect(x, y, width, height, "FD");
    } else {
      this.pdf.rect(x, y, width, height, "F");
    }
  }

  // Add rounded rectangle
  addRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor?: [number, number, number],
    borderColor?: [number, number, number],
    borderWidth: number = 0.5
  ): void {
    if (fillColor) {
      this.pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    }
    if (borderColor) {
      this.pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      this.pdf.setLineWidth(borderWidth);
    }

    const style = fillColor && borderColor ? "FD" : fillColor ? "F" : "S";
    this.pdf.roundedRect(x, y, width, height, radius, radius, style);
  }

  // Add background section with optional border
  addBackgroundSection(
    height: number,
    fillColor: [number, number, number],
    options: {
      borderColor?: [number, number, number];
      borderWidth?: number;
      padding?: number;
    } = {}
  ): void {
    const { borderColor, borderWidth = 0, padding = 0 } = options;

    this.checkPageBreak(height);

    this.addFilledRect(
      this.config.marginLeft - padding,
      this.currentY - padding,
      this.getContentWidth() + padding * 2,
      height + padding * 2,
      fillColor,
      borderColor,
      borderWidth
    );
  }

  // Add colored badge/label
  addBadge(
    text: string,
    x: number,
    y: number,
    options: {
      backgroundColor?: [number, number, number];
      textColor?: [number, number, number];
      fontSize?: number;
      padding?: number;
      rounded?: boolean;
    } = {}
  ): void {
    const {
      backgroundColor = [37, 99, 235],
      textColor = [255, 255, 255],
      fontSize = 11,
      padding = 2,
      rounded = true,
    } = options;

    this.setFont("helvetica", "bold", fontSize);
    const textWidth = this.pdf.getTextWidth(text);
    const badgeWidth = textWidth + padding * 2;
    const badgeHeight = fontSize * 0.3527 + padding;

    if (rounded) {
      this.addRoundedRect(
        x,
        y - badgeHeight + 2,
        badgeWidth,
        badgeHeight,
        2,
        backgroundColor
      );
    } else {
      this.addFilledRect(
        x,
        y - badgeHeight + 2,
        badgeWidth,
        badgeHeight,
        backgroundColor
      );
    }

    this.setTextColor(textColor[0], textColor[1], textColor[2]);
    this.pdf.text(text, x + padding, y);
  }

  // Add icon/symbol (using Unicode characters)
  addIcon(
    icon: string,
    x: number,
    y: number,
    size: number = 11,
    color: [number, number, number] = [100, 100, 100]
  ): void {
    this.setFont("helvetica", "normal", size);
    this.setTextColor(color[0], color[1], color[2]);
    this.pdf.text(icon, x, y);
  }

  // Add text with background highlight
  addHighlightedText(
    text: string,
    x: number,
    fontSize: number,
    highlightColor: [number, number, number],
    textColor: [number, number, number] = [0, 0, 0],
    padding: number = 1
  ): void {
    this.setFont("helvetica", "normal", fontSize);
    const textWidth = this.pdf.getTextWidth(text);
    const textHeight = fontSize * 0.3527;

    this.checkPageBreak(textHeight + padding * 2);

    // Draw highlight background
    this.addFilledRect(
      x - padding,
      this.currentY - textHeight + 1,
      textWidth + padding * 2,
      textHeight + padding,
      highlightColor
    );

    // Draw text
    this.setTextColor(textColor[0], textColor[1], textColor[2]);
    this.pdf.text(text, x, this.currentY);
    this.currentY += textHeight + padding * 2;
  }

  // Add link (clickable)
  addLink(
    text: string,
    url: string,
    x: number,
    fontSize: number = 11,
    color: [number, number, number] = [0, 0, 255]
  ): void {
    this.setFont("helvetica", "normal", fontSize);
    this.setTextColor(color[0], color[1], color[2]);

    const lineHeightMM = fontSize * 0.3527 * this.config.lineHeight;
    this.checkPageBreak(lineHeightMM);

    const textWidth = this.pdf.getTextWidth(text);
    this.pdf.textWithLink(text, x, this.currentY, { url });

    this.currentY += lineHeightMM;
  }

  // Add space
  addSpace(height: number): void {
    this.currentY += height;
    this.checkPageBreak(0);
  }

  // Add two-column layout
  addTwoColumns(
    leftContent: () => void,
    rightContent: () => void,
    columnGap: number = 10
  ): void {
    const startY = this.currentY;
    const columnWidth = (this.getContentWidth() - columnGap) / 2;

    // Save original margin
    const originalMarginLeft = this.config.marginLeft;
    const originalMarginRight = this.config.marginRight;

    // Left column
    this.config.marginRight =
      this.config.pageWidth - this.config.marginLeft - columnWidth;
    leftContent();
    const leftEndY = this.currentY;

    // Right column
    this.currentY = startY;
    this.config.marginLeft = originalMarginLeft + columnWidth + columnGap;
    this.config.marginRight = originalMarginRight;
    rightContent();
    const rightEndY = this.currentY;

    // Restore margins
    this.config.marginLeft = originalMarginLeft;
    this.config.marginRight = originalMarginRight;

    // Set Y to the maximum of both columns
    this.currentY = Math.max(leftEndY, rightEndY);
  }

  // Add vertical line
  addVerticalLine(
    x: number,
    startY: number,
    endY: number,
    lineWidth: number = 0.5,
    color: [number, number, number] = [0, 0, 0]
  ): void {
    this.pdf.setLineWidth(lineWidth);
    this.pdf.setDrawColor(color[0], color[1], color[2]);
    this.pdf.line(x, startY, x, endY);
  }

  // Add contact info with icons
  addContactInfo(
    items: Array<{ icon: string; text: string; link?: string }>,
    options: {
      layout?: "horizontal" | "vertical";
      iconSize?: number;
      textSize?: number;
      gap?: number;
      iconColor?: [number, number, number];
      textColor?: [number, number, number];
    } = {}
  ): void {
    const {
      layout = "horizontal",
      iconSize = 10,
      textSize = 11,
      gap = 2,
      iconColor = [100, 100, 100],
      textColor = [0, 0, 0],
    } = options;

    if (layout === "horizontal") {
      let currentX = this.config.marginLeft;
      const lineHeight = Math.max(iconSize, textSize) * 0.3527;

      this.checkPageBreak(lineHeight + 2);

      items.forEach((item, index) => {
        // Icon
        this.addIcon(item.icon, currentX, this.currentY, iconSize, iconColor);
        currentX += iconSize * 0.3527 + gap;

        // Text
        this.setFont("helvetica", "normal", textSize);
        this.setTextColor(textColor[0], textColor[1], textColor[2]);

        if (item.link) {
          this.pdf.textWithLink(item.text, currentX, this.currentY, {
            url: item.link,
          });
        } else {
          this.pdf.text(item.text, currentX, this.currentY);
        }

        currentX += this.pdf.getTextWidth(item.text) + 8;

        // Add separator
        if (index < items.length - 1) {
          this.pdf.text("•", currentX - 4, this.currentY);
        }
      });

      this.currentY += lineHeight + 2;
    } else {
      // Vertical layout
      items.forEach((item) => {
        const lineHeight = Math.max(iconSize, textSize) * 0.3527;
        this.checkPageBreak(lineHeight + 2);

        this.addIcon(
          item.icon,
          this.config.marginLeft,
          this.currentY,
          iconSize,
          iconColor
        );

        this.setFont("helvetica", "normal", textSize);
        this.setTextColor(textColor[0], textColor[1], textColor[2]);

        if (item.link) {
          this.pdf.textWithLink(
            item.text,
            this.config.marginLeft + iconSize * 0.3527 + gap,
            this.currentY,
            { url: item.link }
          );
        } else {
          this.pdf.text(
            item.text,
            this.config.marginLeft + iconSize * 0.3527 + gap,
            this.currentY
          );
        }

        this.currentY += lineHeight + 2;
      });
    }
  }

  // Get current Y position
  getCurrentY(): number {
    return this.currentY;
  }

  // Set current Y position
  setCurrentY(y: number): void {
    this.currentY = y;
  }

  // Get PDF instance
  getPDF(): jsPDF {
    return this.pdf;
  }

  // Save PDF
  save(filename: string): void {
    this.pdf.save(filename);
  }
}
