// Dana Font Weight Types
export type DanaFontWeight = 
  | 10    // Hairline
  | 100   // Thin
  | 200   // UltraLight
  | 300   // Light
  | 400   // Regular
  | 500   // Medium
  | 600   // DemiBold
  | 700   // Bold
  | 800   // ExtraBold
  | 900   // Black
  | 930   // ExtraBlack
  | 960   // Heavy
  | 990;  // Fat

// Font weight constants
export const DANA_FONT_WEIGHTS = {
  HAIRLINE: 10,
  THIN: 100,
  ULTRA_LIGHT: 200,
  LIGHT: 300,
  REGULAR: 400,
  MEDIUM: 500,
  DEMI_BOLD: 600,
  BOLD: 700,
  EXTRA_BOLD: 800,
  BLACK: 900,
  EXTRA_BLACK: 930,
  HEAVY: 960,
  FAT: 990,
} as const;

// Font weight names for semantic usage
export const DANA_FONT_WEIGHT_NAMES = {
  hairline: 10,
  thin: 100,
  ultraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  demiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
  extraBlack: 930,
  heavy: 960,
  fat: 990,
} as const;
