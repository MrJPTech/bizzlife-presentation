/**
 * BizzLife Design System - Design Tokens
 * Record Label Aesthetic | Dark Theme | Neon Accents
 */

export const colors = {
  // Backgrounds
  bg: {
    primary: '#000000',      // Pure black
    secondary: '#0A0A0A',    // Near black
    elevated: '#111111',     // Cards, overlays
    glass: 'rgba(0, 0, 0, 0.8)',  // Glassmorphism
  },

  // Accent Colors (Neon)
  accent: {
    primary: '#FF0040',      // Hot pink/red
    secondary: '#FF6B35',    // Warm orange
    tertiary: '#FF1493',     // Deep pink
    gold: '#FFD700',         // Success/premium
  },

  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#808080',
    muted: '#4A4A4A',
  },

  // Status
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
} as const;

export const shadows = {
  glow: {
    primary: '0 0 30px rgba(255, 0, 64, 0.5)',
    secondary: '0 0 20px rgba(255, 107, 53, 0.4)',
    text: '0 0 10px rgba(255, 255, 255, 0.3)',
    gold: '0 0 25px rgba(255, 215, 0, 0.5)',
  },
  card: '0 4px 20px rgba(0, 0, 0, 0.5)',
  elevated: '0 8px 32px rgba(0, 0, 0, 0.6)',
} as const;

export const typography = {
  fontFamily: {
    display: "'Bebas Neue', 'Oswald', 'Impact', sans-serif",
    body: "'Inter', -apple-system, 'Helvetica Neue', sans-serif",
    accent: "'Monument Extended', 'Bebas Neue', sans-serif",
  },
  fontSize: {
    // Mobile / Desktop
    heroHeadline: ['48px', '120px'],
    sectionTitle: ['32px', '64px'],
    cardTitle: ['20px', '28px'],
    nav: ['14px', '16px'],
    body: ['16px', '18px'],
    caption: ['12px', '14px'],
    button: ['14px', '16px'],
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
} as const;

export const breakpoints = {
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large screens
} as const;

export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

export const touchTargets = {
  minimum: '44px',
  recommended: '48px',
  large: '56px',
} as const;

// Tailwind CSS config extension
export const tailwindExtend = {
  colors: {
    background: colors.bg.primary,
    foreground: colors.text.primary,
    accent: {
      DEFAULT: colors.accent.primary,
      secondary: colors.accent.secondary,
      gold: colors.accent.gold,
    },
    muted: colors.text.secondary,
  },
  fontFamily: {
    display: ['Bebas Neue', 'sans-serif'],
    body: ['Inter', 'sans-serif'],
  },
  boxShadow: {
    glow: shadows.glow.primary,
    'glow-sm': '0 0 15px rgba(255, 0, 64, 0.3)',
    'glow-gold': shadows.glow.gold,
  },
};
