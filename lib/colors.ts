/**
 * Professional Multi-Color Palette
 * A vibrant, accessible color system for the resume generator
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Main blue
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Secondary - Purple/Violet
  secondary: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7", // Main purple
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
  },

  // Accent - Emerald/Green
  accent: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981", // Main green
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },

  // Warning - Amber/Orange
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Main amber
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Success - Teal
  success: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6", // Main teal
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
  },

  // Error - Rose/Red
  error: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e", // Main rose
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
  },

  // Info - Cyan
  info: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4", // Main cyan
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
  },
};

/**
 * Semantic color mappings for specific use cases
 */
export const semanticColors = {
  contact: {
    light: colors.primary[500],
    dark: colors.primary[400],
    bg: colors.primary[50],
    bgDark: colors.primary[900],
  },
  skills: {
    light: colors.secondary[500],
    dark: colors.secondary[400],
    bg: colors.secondary[50],
    bgDark: colors.secondary[900],
  },
  experience: {
    light: colors.info[600],
    dark: colors.info[400],
    bg: colors.info[50],
    bgDark: colors.info[900],
  },
  projects: {
    light: colors.secondary[600],
    dark: colors.secondary[400],
    bg: colors.secondary[50],
    bgDark: colors.secondary[900],
  },
  education: {
    light: colors.accent[600],
    dark: colors.accent[400],
    bg: colors.accent[50],
    bgDark: colors.accent[900],
  },
  certifications: {
    light: colors.warning[500],
    dark: colors.warning[400],
    bg: colors.warning[50],
    bgDark: colors.warning[900],
  },
};

/**
 * Gradient combinations for headers and special sections
 */
export const gradients = {
  primary: "from-blue-500 via-purple-500 to-pink-500",
  secondary: "from-cyan-500 via-blue-500 to-purple-500",
  accent: "from-emerald-500 via-teal-500 to-cyan-500",
  warm: "from-orange-500 via-red-500 to-pink-500",
  cool: "from-blue-500 via-indigo-500 to-purple-500",
  sunset: "from-yellow-400 via-orange-500 to-red-500",
  ocean: "from-blue-400 via-cyan-500 to-teal-500",
  forest: "from-green-400 via-emerald-500 to-teal-500",
};

/**
 * Border color classes for different sections
 */
export const borderColors = {
  contact: "border-blue-500 dark:border-blue-400",
  skills: "border-purple-500 dark:border-purple-400",
  experience: "border-cyan-600 dark:border-cyan-400",
  projects: "border-violet-600 dark:border-violet-400",
  education: "border-emerald-600 dark:border-emerald-400",
  certifications: "border-amber-500 dark:border-amber-400",
};

/**
 * Background color classes for different sections
 */
export const bgColors = {
  contact: "bg-blue-50 dark:bg-blue-950/30",
  skills: "bg-purple-50 dark:bg-purple-950/30",
  experience: "bg-cyan-50 dark:bg-cyan-950/30",
  projects: "bg-violet-50 dark:bg-violet-950/30",
  education: "bg-emerald-50 dark:bg-emerald-950/30",
  certifications: "bg-amber-50 dark:bg-amber-950/30",
};

/**
 * Icon color classes for different sections
 */
export const iconColors = {
  contact: "text-blue-600 dark:text-blue-400",
  skills: "text-purple-600 dark:text-purple-400",
  experience: "text-cyan-600 dark:text-cyan-400",
  projects: "text-violet-600 dark:text-violet-400",
  education: "text-emerald-600 dark:text-emerald-400",
  certifications: "text-amber-600 dark:text-amber-400",
};

/**
 * Button variant colors
 */
export const buttonColors = {
  primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
  secondary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
  success: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700",
  warning: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
  info: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700",
};
