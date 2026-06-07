export const Theme = {
  // Canvas / Background
  background: "#F7F6F3",     // Warm Bone / Off-White
  surface: "#FFFFFF",        // Card Background
  surfaceMuted: "#F9F9F8",   // Muted Surface Background
  border: "#EAEAEA",         // Subtle Border Divider
  
  // Text Colors
  text: "#111111",           // Charcoal
  textMuted: "#787774",      // Muted Secondary Text
  
  // Interactive / Primary CTA (adapted from old purple branding)
  primary: "#4F378A",        // Refined Purple
  primaryText: "#FFFFFF",
  primaryPastel: "#F2EDFA",    // Soft pastel purple background container
  primaryPastelText: "#5C4596", // Soft purple text for containers/badges
  
  // Accents / Muted Pastels (highly desaturated, accessible)
  accentBlue: "#E1F3FE",
  accentBlueText: "#1F6C9F",
  accentGreen: "#EDF3EC",
  accentGreenText: "#346538",
  accentRed: "#FDEBEC",
  accentRedText: "#9F2F2D",
  accentYellow: "#FBF3DB",
  accentYellowText: "#956400",
} as const;
