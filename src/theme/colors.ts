export const darkColors = {
    // Backgrounds
    background: {
        primary: '#0A0A0F',
        secondary: '#14141F',
        card: '#1A1A2E',
        elevated: '#222236',
    },

    // Primary accent — teal
    primary: {
        default: '#00E5A0',
        light: '#33ECBA',
        dark: '#00B87D',
        muted: 'rgba(0, 229, 160, 0.15)',
    },

    // Status colors
    status: {
        moving: '#00E5A0', // green — actively moving
        waiting: '#FFB800', // amber — stopped at light
        idle: '#6B7280', // gray — no ride
        stopped: '#FF4757', // red — ride ended
    },

    // Text
    text: {
        primary: '#FFFFFF',
        secondary: '#A0A0B8',
        muted: '#6B7280',
        inverse: '#0A0A0F',
    },

    // Borders & dividers
    border: {
        default: '#1E1E2E',
        light: '#2A2A3E',
        accent: '#00E5A0',
    },

    // Semantic
    danger: '#FF4757',
    dangerMuted: 'rgba(255, 71, 87, 0.15)',
    warning: '#FFB800',
    warningMuted: 'rgba(255, 184, 0, 0.15)',
    success: '#00E5A0',
    successMuted: 'rgba(0, 229, 160, 0.15)',
} as const;

export const lightColors = {
    // Backgrounds
    background: {
        primary: '#F0F2F5',
        secondary: '#FFFFFF',
        card: '#FFFFFF',
        elevated: '#FFFFFF',
    },

    // Primary accent — deeper teal for better contrast
    primary: {
        default: '#00A876',
        light: '#33BD91',
        dark: '#007A55',
        muted: 'rgba(0, 168, 118, 0.15)',
    },

    // Status colors
    status: {
        moving: '#00A876',
        waiting: '#F59E0B',
        idle: '#9CA3AF',
        stopped: '#EF4444',
    },

    // Text
    text: {
        primary: '#111827',
        secondary: '#4B5563',
        muted: '#9CA3AF',
        inverse: '#FFFFFF',
    },

    // Borders & dividers
    border: {
        default: '#E5E7EB',
        light: '#F3F4F6',
        accent: '#00A876',
    },

    // Semantic
    danger: '#EF4444',
    dangerMuted: 'rgba(239, 68, 68, 0.15)',
    warning: '#F59E0B',
    warningMuted: 'rgba(245, 158, 11, 0.15)',
    success: '#10B981',
    successMuted: 'rgba(16, 185, 129, 0.15)',
} as const;

export type ThemeColors = typeof darkColors;
