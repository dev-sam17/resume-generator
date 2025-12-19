/**
 * Manual color conversion utilities for PDF export
 * Converts lab() and oklab() colors to RGB format that html2canvas can parse
 */

// Manual lab to RGB conversion (CIE Lab D50)
export const labToRgb = (
  l: number,
  a: number,
  b: number,
  alpha?: number
): string => {
  // Lab to XYZ (D50)
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const xr = fx ** 3 > 0.008856 ? fx ** 3 : (116 * fx - 16) / 903.3;
  const yr = l > 903.3 * 0.008856 ? ((l + 16) / 116) ** 3 : l / 903.3;
  const zr = fz ** 3 > 0.008856 ? fz ** 3 : (116 * fz - 16) / 903.3;

  // D50 white point
  const x = xr * 0.9642;
  const y = yr * 1.0;
  const z = zr * 0.8251;

  // XYZ to sRGB
  let r = x * 3.1338561 + y * -1.6168667 + z * -0.4906146;
  let g = x * -0.9787684 + y * 1.9161415 + z * 0.033454;
  let bl = x * 0.0719453 + y * -0.2289914 + z * 1.4052427;

  // Gamma correction
  r = r > 0.0031308 ? 1.055 * r ** (1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * g ** (1 / 2.4) - 0.055 : 12.92 * g;
  bl = bl > 0.0031308 ? 1.055 * bl ** (1 / 2.4) - 0.055 : 12.92 * bl;

  // Clamp and convert to 0-255
  r = Math.max(0, Math.min(255, Math.round(r * 255)));
  g = Math.max(0, Math.min(255, Math.round(g * 255)));
  bl = Math.max(0, Math.min(255, Math.round(bl * 255)));

  return alpha !== undefined && alpha < 1
    ? `rgba(${r}, ${g}, ${bl}, ${alpha})`
    : `rgb(${r}, ${g}, ${bl})`;
};

// Manual oklab to RGB conversion
export const oklabToRgb = (
  l: number,
  a: number,
  b: number,
  alpha?: number
): string => {
  // OKLab to linear RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;

  let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Gamma correction
  r = r > 0.0031308 ? 1.055 * r ** (1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * g ** (1 / 2.4) - 0.055 : 12.92 * g;
  bl = bl > 0.0031308 ? 1.055 * bl ** (1 / 2.4) - 0.055 : 12.92 * bl;

  // Clamp and convert to 0-255
  r = Math.max(0, Math.min(255, Math.round(r * 255)));
  g = Math.max(0, Math.min(255, Math.round(g * 255)));
  bl = Math.max(0, Math.min(255, Math.round(bl * 255)));

  return alpha !== undefined && alpha < 1
    ? `rgba(${r}, ${g}, ${bl}, ${alpha})`
    : `rgb(${r}, ${g}, ${bl})`;
};

/**
 * Convert lab() and oklab() colors to RGB format
 * Parses raw numeric values from getComputedStyle() output
 */
export const convertLabColorsToRgb = (color: string): string => {
  if (!color || color === "transparent" || color === "none") {
    return color;
  }

  // Parse lab() format: lab(L a b) or lab(L a b / alpha)
  const labMatch = color.match(/lab\(([^)]+)\)/);
  if (labMatch) {
    const parts = labMatch[1].split(/\s+\/\s+/);
    const values = parts[0].trim().split(/\s+/).map(Number);
    const alpha = parts[1] ? parseFloat(parts[1]) : undefined;
    return labToRgb(values[0], values[1], values[2], alpha);
  }

  // Parse oklab() format: oklab(L a b) or oklab(L a b / alpha)
  const oklabMatch = color.match(/oklab\(([^)]+)\)/);
  if (oklabMatch) {
    const parts = oklabMatch[1].split(/\s+\/\s+/);
    const values = parts[0].trim().split(/\s+/).map(Number);
    const alpha = parts[1] ? parseFloat(parts[1]) : undefined;
    return oklabToRgb(values[0], values[1], values[2], alpha);
  }

  // Return as-is for rgb, rgba, hex, etc.
  return color;
};
