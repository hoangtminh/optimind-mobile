export const LightTheme = {
  isDark: false,
  // Canvas / Background
  background: "#F7F6F3",     // Warm Bone / Off-White
  surface: "#FFFFFF",        // Card Background
  surfaceMuted: "#F9F9F8",   // Muted Surface Background
  border: "#EAEAEA",         // Subtle Border Divider
  
  // Text Colors
  text: "#111111",           // Charcoal
  textMuted: "#787774",      // Muted Secondary Text
  
  // Interactive / Primary CTA
  primary: "#4F378A",        // Refined Purple
  primaryText: "#FFFFFF",
  primaryPastel: "#F2EDFA",    // Soft pastel purple background container
  primaryPastelText: "#5C4596", // Soft purple text for containers/badges
  
  // Accents / Muted Pastels
  accentBlue: "#E1F3FE",
  accentBlueText: "#1F6C9F",
  accentGreen: "#EDF3EC",
  accentGreenText: "#346538",
  accentRed: "#FDEBEC",
  accentRedText: "#9F2F2D",
  accentYellow: "#FBF3DB",
  accentYellowText: "#956400",
} as const;

export const DarkTheme = {
  isDark: true,
  // Canvas / Background
  background: "#121212",     // Dark Mode Background
  surface: "#1E1E1E",        // Dark Mode Card Background
  surfaceMuted: "#252525",   // Dark Mode Muted Surface
  border: "#2A2A2A",         // Dark Mode Subtle Border
  
  // Text Colors
  text: "#EEEEEE",           // Off-White / Light Gray Text
  textMuted: "#9A9A9A",      // Dark Mode Muted Text
  
  // Interactive / Primary CTA
  primary: "#BB86FC",        // Light Purple Accent
  primaryText: "#121212",    // Black text on primary in dark mode
  primaryPastel: "#2A223A",  // Soft purple container in dark mode
  primaryPastelText: "#E1D2FF",
  
  // Accents / Muted Pastels
  accentBlue: "#1C2F3C",
  accentBlueText: "#92C5F2",
  accentGreen: "#1B2E1E",
  accentGreenText: "#92D296",
  accentRed: "#321D1D",
  accentRedText: "#F29292",
  accentYellow: "#2D281D",
  accentYellowText: "#F2D092",
} as const;

// Mutable Theme object initialized with LightTheme properties
export const Theme = { ...LightTheme };

export const setTheme = (mode: "light" | "dark") => {
  const target = mode === "dark" ? DarkTheme : LightTheme;
  Object.assign(Theme, target);
};
