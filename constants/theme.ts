/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1F2937', // Slightly softer black (Slate 800)
    textSecondary: '#4B5563',
    background: '#F1F5F9', // Softer background (Slate 100)
    backgroundGradient: ['#F8FAFC', '#F1F5F9', '#E2E8F0'], // Muted gradient (Slate 50-200)
    glassBackground: 'rgba(255, 255, 255, 0.7)', // Slightly more transparent glass
    glassBorder: 'rgba(255, 255, 255, 0.4)',
    cardBackground: 'rgba(241, 245, 249, 0.6)', // Muted card background
    tint: '#7C3AED',
    icon: '#4B5563',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#7C3AED',
    glows: ['#A5B4FC', '#C4B5FD', '#F5D0FE'],
    card: '#F8FAFC', // Off-white card (Slate 50)
    border: '#CBD5E1', // Softer border (Slate 300)
    notification: '#EF4444',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    background: '#1a1642',
    backgroundGradient: ['#1a1642', '#221a52', '#311a63', '#421a52', '#4a1a4a'],
    glassBackground: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.3)',
    cardBackground: 'rgba(255, 255, 255, 0.02)',
    tint: '#A78BFA',
    icon: '#9CA3AF',
    tabIconDefault: 'rgba(255, 255, 255, 0.5)',
    tabIconSelected: '#FFFFFF',
    glows: ['#4F46E5', '#4f7abdff', '#ae4479ff'],
    card: '#1E1B4B',
    border: 'rgba(255, 255, 255, 0.1)',
    notification: '#F87171',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
