export type BrandPalette = {
  primaryPurple: string;
  secondaryMagenta: string;
  accentGold: string;
  darkNeutral: string;
  lightNeutral: string;
};

export const brandColors: BrandPalette = {
  primaryPurple: '#621063',
  secondaryMagenta: '#8A298B',
  accentGold: '#E79E23',
  darkNeutral: '#080808',
  lightNeutral: '#F8F9FA',
};

export const brandPalette = brandColors;

export const themeTokens = {
  colors: {
    primary: brandColors.primaryPurple,
    secondary: brandColors.secondaryMagenta,
    accent: brandColors.accentGold,
    dark: brandColors.darkNeutral,
    light: brandColors.lightNeutral,
  },
} as const;

export const tailwindColorMapping = {
  primary: brandColors.primaryPurple,
  secondary: brandColors.secondaryMagenta,
  accent: brandColors.accentGold,
  dark: brandColors.darkNeutral,
  light: brandColors.lightNeutral,
} as const;
