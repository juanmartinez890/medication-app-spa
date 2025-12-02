export const colors = {
  // Text colors
  headline: '#0A0A0A',
  body: '#1a1a1a',
  bodyDark: '#333333',
  secondary: '#666666',
  white: '#ffffff',

  // Primary brand colors
  primary: '#4F72FF',
  primaryHover: '#3d5ce6',
  primaryLight: '#4F72FF',
  
  // Gradient colors
  gradientStart: '#DDE3F9',
  gradientMid: '#C7D2F0',
  gradientEnd: '#A7BCE8',
  
  // UI colors
  toggleInactive: '#e2e8f0', // slate-200
} as const

export const gradients = {
  background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientMid} 50%, ${colors.gradientEnd} 100%)`,
} as const

