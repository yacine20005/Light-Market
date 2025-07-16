const tintColorLight = '#00D4FF'; // Bright cyan blue
const tintColorDark = '#00A8CC';  // Darker cyan

export default {
  light: {
    text: '#0A0A0A',
    background: '#F0F4F8',
    tint: tintColorLight,
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#E2E8F0',
    background: '#0F0F23', // Deep space dark
    tint: tintColorDark,
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
  },
  // Destiny 2 themed colors
  destiny: {
    primary: '#00D4FF',      // Traveler light blue
    secondary: '#FF6B35',    // Solar orange
    accent: '#9333EA',       // Void purple
    dark: '#0F0F23',         // Deep space
    surface: '#1E293B',      // Dark surface
    surfaceLight: 'rgba(30, 41, 59, 0.8)', // Transparent surface
    ghost: '#F1F5F9',        // Ghost white
    legendary: '#522F9A',    // Legendary purple
    exotic: '#FBBF24',       // Exotic gold
    success: '#10B981',      // Arc green
  },
};
