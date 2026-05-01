/**
 * @file index.js (Theme)
 * @description Defines the global design system tokens including colors, typography,
 * and spacing, ensuring High-Contrast AA compliance.
 */

// --- Theme Definition ---

/**
 * High-Contrast AA Compliant Theme
 */
export const theme = {
  colors: {
    background: '#0F172A',      // Dark Navy
    surface: '#1E293B',         // Slate
    primary: '#FBBF24',         // Accessible High-Contrast Yellow
    secondary: '#38BDF8',       // Accessible Light Blue
    textPrimary: '#F8FAFC',     // Off-White
    textSecondary: '#94A3B8',   // Light Gray
    danger: '#EF4444',          // Standard Red
    success: '#10B981',         // Standard Green
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    // Ensuring basic system fonts fall back properly but emulate Grade-8 friendly layouts
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      lineHeight: 36,
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: 0.3,
    },
    body: {
      fontSize: 18, // Minimum 18pt for older users/accessibility guidelines
      fontWeight: '400',
      lineHeight: 26,
    },
    button: {
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: 0.5,
    }
  }
};
