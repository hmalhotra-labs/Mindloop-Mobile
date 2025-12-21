import { StyleSheet, PlatformColor, ColorValue } from 'react-native';

/**
 * High Contrast Utilities
 * Provides utilities for managing high contrast themes and styles
 */

// Define high contrast color palette
export interface HighContrastColors {
  background: string;
  text: string;
  border: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  focusIndicator: string;
}

// Standard high contrast color definitions
export const HIGH_CONTRAST_COLORS: HighContrastColors = {
  background: '#ffffff', // White background
  text: '#000000',       // Black text
  border: '#000000',     // Black borders
  primary: '#000000',    // Black primary
  secondary: '#808080',  // Gray secondary
  success: '#000000',    // Black on white for success
  warning: '#000000',    // Black on white for warning
  error: '#000000',      // Black on white for error
  focusIndicator: '#000000', // Black focus indicator
};

// Alternative high contrast theme (dark theme)
export const HIGH_CONTRAST_DARK_COLORS: HighContrastColors = {
  background: '#000000', // Black background
  text: '#ffffff',       // White text
  border: '#ffffff',     // White borders
  primary: '#ffffff',    // White primary
  secondary: '#808080',  // Gray secondary
  success: '#ffffff',    // White on black for success
  warning: '#ffffff',    // White on black for warning
  error: '#ffffff',      // White on black for error
  focusIndicator: '#ffffff', // White focus indicator
};

// Default color scheme
export const DEFAULT_COLORS: HighContrastColors = {
  background: '#ffffff',
  text: '#000000',
  border: '#cccccc',
  primary: '#007AFF',
  secondary: '#8E8E93',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  focusIndicator: '#007AFF',
};

/**
 * Get the appropriate color palette based on high contrast mode
 * @param isHighContrastMode - Whether high contrast mode is enabled
 * @param useDarkTheme - Whether to use the dark theme variant
 * @returns The appropriate color palette
 */
export const getHighContrastColors = (
  isHighContrastMode: boolean,
  useDarkTheme: boolean = false
): HighContrastColors => {
  if (!isHighContrastMode) {
    return DEFAULT_COLORS;
  }

  return useDarkTheme ? HIGH_CONTRAST_DARK_COLORS : HIGH_CONTRAST_COLORS;
};

/**
 * Create high contrast styles based on the current accessibility settings
 * @param isHighContrastMode - Whether high contrast mode is enabled
 * @param useDarkTheme - Whether to use the dark theme variant
 * @param customStyles - Optional custom styles to override defaults
 * @returns StyleSheet object with high contrast styles
 */
export const createHighContrastStyles = (
  isHighContrastMode: boolean,
  useDarkTheme: boolean = false,
  customStyles: Partial<HighContrastColors> = {}
): HighContrastColors => {
  const colors = getHighContrastColors(isHighContrastMode, useDarkTheme);
  
  return {
    background: customStyles.background || colors.background,
    text: customStyles.text || colors.text,
    border: customStyles.border || colors.border,
    primary: customStyles.primary || colors.primary,
    secondary: customStyles.secondary || colors.secondary,
    success: customStyles.success || colors.success,
    warning: customStyles.warning || colors.warning,
    error: customStyles.error || colors.error,
    focusIndicator: customStyles.focusIndicator || colors.focusIndicator,
  };
};

/**
 * Apply high contrast to a given color
 * @param color - The original color
 * @param isHighContrastMode - Whether high contrast mode is enabled
 * @returns High contrast version of the color if enabled, otherwise the original
 */
export const applyHighContrastToColor = (
  color: ColorValue,
  isHighContrastMode: boolean
): ColorValue => {
  if (!isHighContrastMode) {
    return color;
  }

  // For high contrast mode, we return either black or white depending on the original color
  // This is a simplified approach - in a real implementation, you might want more sophisticated logic
  return getLuminance(color) > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Calculate the luminance of a color to determine if it's light or dark
 * @param color - The color to analyze
 * @returns Luminance value between 0 (black) and 1 (white)
 */
export const getLuminance = (color: ColorValue): number => {
  // Convert color to RGB if it's in hex format
  if (typeof color === 'string' && color.startsWith('#')) {
    const hex = color.substring(1);
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Apply sRGB luminance formula
    const sRGB = [r, g, b].map(val => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  }
  
  // For simplicity, if not a hex color, assume it's light
  return 0.8;
};

/**
 * Create a high contrast border style
 * @param isHighContrastMode - Whether high contrast mode is enabled
 * @param width - Border width
 * @param color - Border color
 * @returns Style object for high contrast border
 */
export const createHighContrastBorder = (
  isHighContrastMode: boolean,
  width: number = 2,
  color?: ColorValue
) => {
  if (!isHighContrastMode) {
    return color ? { borderWidth: width, borderColor: color } : { borderWidth: width };
  }

  // In high contrast mode, ensure the border is clearly visible
  return {
    borderWidth: width,
    borderColor: color || '#000000', // Use black for high contrast if no color specified
    borderStyle: 'solid' as const,
  };
};

/**
 * Create high contrast text style
 * @param isHighContrastMode - Whether high contrast mode is enabled
 * @param useDarkTheme - Whether to use the dark theme variant
 * @param fontSize - Font size
 * @param fontWeight - Font weight
 * @returns Style object for high contrast text
 */
export const createHighContrastTextStyle = (
  isHighContrastMode: boolean,
  useDarkTheme: boolean = false,
  fontSize?: number,
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
) => {
  const colors = getHighContrastColors(isHighContrastMode, useDarkTheme);
  
  const style: any = {
    color: colors.text,
    backgroundColor: colors.background,
  };
  
  if (fontSize) {
    style.fontSize = fontSize;
  }
  
  if (fontWeight) {
    style.fontWeight = fontWeight;
  }
  
  // In high contrast mode, we might want to add additional visual indicators
  if (isHighContrastMode) {
    style.fontWeight = style.fontWeight || 'bold';
  }
  
  return style;
};

/**
 * Create high contrast button style
 * @param isHighContrastMode - Whether high contrast mode is enabled
 * @param useDarkTheme - Whether to use the dark theme variant
 * @returns Style object for high contrast button
 */
export const createHighContrastButtonStyle = (
  isHighContrastMode: boolean,
  useDarkTheme: boolean = false
) => {
  const colors = getHighContrastColors(isHighContrastMode, useDarkTheme);
  
  const style: any = {
    backgroundColor: colors.primary,
    borderColor: colors.border,
    borderWidth: isHighContrastMode ? 2 : 1,
    borderRadius: 8,
  };
  
  return style;
};

/**
 * Create high contrast focus style
 * @param isHighContrastMode - Whether high contrast mode is enabled
 * @returns Style object for high contrast focus indicator
 */
export const createHighContrastFocusStyle = (isHighContrastMode: boolean) => {
  if (!isHighContrastMode) {
    return {};
  }
  
  return {
    borderWidth: 3,
    borderColor: '#0000FF', // Blue border for focus in high contrast
    borderStyle: 'solid' as const,
  };
};

/**
 * Apply high contrast styles to an array of style objects
 * @param styles - Array of style objects to apply high contrast to
 * @param isHighContrastMode - Whether high contrast mode is enabled
 * @param useDarkTheme - Whether to use the dark theme variant
 * @returns Merged styles with high contrast applied
 */
export const applyHighContrastStyles = (
  styles: any[],
  isHighContrastMode: boolean,
  useDarkTheme: boolean = false
) => {
  // Simple manual flattening that works in test environments
  const flattenedStyles: any = {};
  for (const style of styles) {
    if (typeof style === 'object' && style !== null) {
      Object.assign(flattenedStyles, style);
    }
  }

  // If not in high contrast mode, return the original flattened styles
  if (!isHighContrastMode) {
    return flattenedStyles;
  }

  // Get the appropriate color palette
  const colors = getHighContrastColors(isHighContrastMode, useDarkTheme);

  // Apply high contrast modifications
  const highContrastStyles: any = { ...flattenedStyles };

  // Override colors with high contrast versions
  if (flattenedStyles.backgroundColor !== undefined) {
    highContrastStyles.backgroundColor = colors.background;
  }

  if (flattenedStyles.color !== undefined) {
    highContrastStyles.color = colors.text;
  }

  if (flattenedStyles.borderColor !== undefined) {
    highContrastStyles.borderColor = colors.border;
  }

  // Increase border width for better visibility in high contrast mode
  if (typeof flattenedStyles.borderWidth === 'number') {
    highContrastStyles.borderWidth = Math.max(flattenedStyles.borderWidth, 2);
  } else if (flattenedStyles.borderWidth === undefined) {
    // Add a default border to elements that don't have one for better visibility
    highContrastStyles.borderWidth = 1;
    highContrastStyles.borderColor = colors.border;
  }

  return highContrastStyles;
};