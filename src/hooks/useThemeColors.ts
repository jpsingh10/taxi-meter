import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from '../theme/colors';

/**
 * Returns the color palette based on the device's current system appearance.
 */
export function useThemeColors() {
    const colorScheme = useColorScheme();
    return colorScheme === 'light' ? lightColors : darkColors;
}
