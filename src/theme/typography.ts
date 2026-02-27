import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
    // Large fare display
    display: {
        fontSize: 56,
        fontWeight: '700',
        letterSpacing: -1,
    },

    // Section headers
    h1: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: -0.5,
    },

    // Card titles
    h2: {
        fontSize: 22,
        fontWeight: '600',
    },

    // Stat values
    h3: {
        fontSize: 18,
        fontWeight: '600',
    },

    // Body text
    body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },

    // Stat labels, secondary text
    label: {
        fontSize: 13,
        fontWeight: '500',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    // Small text
    caption: {
        fontSize: 12,
        fontWeight: '400',
    },

    // Button text
    button: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
} as const;
