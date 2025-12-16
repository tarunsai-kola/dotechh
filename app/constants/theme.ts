/**
 * Dark theme color palette for doltech app
 */

import { Platform } from 'react-native';

// New Dark Theme Colors
export const AppColors = {
  // Primary colors
  primaryDark: '#020617',
  primaryBlue: '#0EA5E9',

  // Backgrounds
  background: '#020617',
  surface: '#0F172A',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',

  // Accents
  accent: '#F97316',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',

  // Borders
  border: '#1E293B',

  // Status colors (keeping some existing for compatibility)
  green: '#22C55E',
  red: '#EF4444',
  purple: '#8B5CF6',
  gray: '#9CA3AF',
};

// Legacy color scheme (keeping for backward compatibility during migration)
const tintColorLight = '#0a7ea4';
const tintColorDark = '#0EA5E9';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#020617',
    tint: tintColorDark,
    icon: '#9CA3AF',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
