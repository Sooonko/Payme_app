/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1F2937', // Slate 800 - readable black
    textSecondary: '#4B5563', // Slate 600
    background: '#F5F3FF', // Very pale violet
    backgroundGradient: ['#F5F3FF', '#EDE9FE', '#E0E7FF'], // Icy Lavender gradient (Violet 50 -> Indigo 100)
    glassBackground: 'rgba(255, 255, 255, 0.60)', // High transparency for frosted look
    glassBorder: 'rgba(255, 255, 255, 0.8)', // Sharp white borders
    cardBackground: 'rgba(255, 255, 255, 0.65)', // Milky white cards
    tint: '#7C3AED', // Violet 600 - Primary brand color
    icon: '#6B7280', // Slate 500
    tabIconDefault: '#94A3B8', // Slate 400
    tabIconSelected: '#7C3AED',
    glows: ['#A5B4FC', '#DDD6FE', '#F5D0FE'], // Soft Indigo/Violet glows
    card: '#FFFFFF', // Pure white for content containers
    border: '#E2E8F0', // Slate 200
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
