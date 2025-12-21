import {
  getHighContrastColors,
  createHighContrastStyles,
  applyHighContrastToColor,
  getLuminance,
  createHighContrastBorder,
  createHighContrastTextStyle,
  createHighContrastButtonStyle,
  createHighContrastFocusStyle,
  applyHighContrastStyles,
  HIGH_CONTRAST_COLORS,
  HIGH_CONTRAST_DARK_COLORS,
  DEFAULT_COLORS
} from '../src/utils/highContrastUtils';

describe('High Contrast Utilities', () => {
  describe('getHighContrastColors', () => {
    it('should return default colors when high contrast mode is disabled', () => {
      const colors = getHighContrastColors(false);
      
      expect(colors).toEqual(DEFAULT_COLORS);
    });

    it('should return high contrast colors when high contrast mode is enabled and dark theme is disabled', () => {
      const colors = getHighContrastColors(true, false);
      
      expect(colors).toEqual(HIGH_CONTRAST_COLORS);
    });

    it('should return high contrast dark colors when high contrast mode and dark theme are enabled', () => {
      const colors = getHighContrastColors(true, true);
      
      expect(colors).toEqual(HIGH_CONTRAST_DARK_COLORS);
    });
  });

  describe('createHighContrastStyles', () => {
    it('should return appropriate styles based on high contrast mode and theme', () => {
      // Test with high contrast disabled
      let styles = createHighContrastStyles(false);
      expect(styles).toEqual(DEFAULT_COLORS);
      
      // Test with high contrast enabled, light theme
      styles = createHighContrastStyles(true, false);
      expect(styles).toEqual(HIGH_CONTRAST_COLORS);
      
      // Test with high contrast enabled, dark theme
      styles = createHighContrastStyles(true, true);
      expect(styles).toEqual(HIGH_CONTRAST_DARK_COLORS);
    });

    it('should apply custom styles overrides', () => {
      const customStyles = {
        background: '#FF0000',
        text: '#00FF00'
      };
      
      const styles = createHighContrastStyles(true, false, customStyles);
      
      expect(styles.background).toBe('#FF0000');
      expect(styles.text).toBe('#00FF00');
      // Other properties should remain from the high contrast palette
      expect(styles.border).toBe(HIGH_CONTRAST_COLORS.border);
    });
  });

  describe('applyHighContrastToColor', () => {
    it('should return the original color when high contrast mode is disabled', () => {
      const result = applyHighContrastToColor('#FF0000', false);
      
      expect(result).toBe('#FF0000');
    });

    it('should return black for light colors in high contrast mode', () => {
      const result = applyHighContrastToColor('#FFFFFF', true);
      
      expect(result).toBe('#000000'); // Black
    });

    it('should return white for dark colors in high contrast mode', () => {
      const result = applyHighContrastToColor('#000000', true);
      
      expect(result).toBe('#FFFFFF'); // White
    });
  });

  describe('getLuminance', () => {
    it('should calculate luminance for hex colors', () => {
      // White color should have high luminance
      expect(getLuminance('#FFFFFF')).toBeGreaterThan(0.5);
      
      // Black color should have low luminance
      expect(getLuminance('#000000')).toBeLessThan(0.5);
    });

    it('should handle non-hex colors', () => {
      // This is a simplified test since our implementation defaults to 0.8 for non-hex
      const result = getLuminance('red');
      
      // The current implementation returns 0.8 for non-hex colors
      expect(result).toBe(0.8);
    });
  });

  describe('createHighContrastBorder', () => {
    it('should return normal border when high contrast mode is disabled', () => {
      const border = createHighContrastBorder(false, 2, '#FF0000');
      
      expect(border).toEqual({
        borderWidth: 2,
        borderColor: '#FF0000'
      });
    });

    it('should return high contrast border when high contrast mode is enabled', () => {
      const border = createHighContrastBorder(true, 2, '#FF0000');
      
      expect(border).toEqual({
        borderWidth: 2,
        borderColor: '#FF0000',
        borderStyle: 'solid'
      });
    });

    it('should use black border color when not specified in high contrast mode', () => {
      const border = createHighContrastBorder(true, 3);
      
      expect(border).toEqual({
        borderWidth: 3,
        borderColor: '#000000',
        borderStyle: 'solid'
      });
    });
  });

  describe('createHighContrastTextStyle', () => {
    it('should return basic text style when high contrast is disabled', () => {
      const style = createHighContrastTextStyle(false);
      
      expect(style.color).toBe(DEFAULT_COLORS.text);
      expect(style.backgroundColor).toBe(DEFAULT_COLORS.background);
    });

    it('should return high contrast text style when enabled', () => {
      const style = createHighContrastTextStyle(true, false);
      
      expect(style.color).toBe(HIGH_CONTRAST_COLORS.text);
      expect(style.backgroundColor).toBe(HIGH_CONTRAST_COLORS.background);
      expect(style.fontWeight).toBe('bold'); // Should be bold in high contrast
    });

    it('should return high contrast dark text style when enabled with dark theme', () => {
      const style = createHighContrastTextStyle(true, true);
      
      expect(style.color).toBe(HIGH_CONTRAST_DARK_COLORS.text);
      expect(style.backgroundColor).toBe(HIGH_CONTRAST_DARK_COLORS.background);
      expect(style.fontWeight).toBe('bold'); // Should be bold in high contrast
    });

    it('should apply custom font size and weight', () => {
      const style = createHighContrastTextStyle(true, false, 18, 'bold');
      
      expect(style.fontSize).toBe(18);
      expect(style.fontWeight).toBe('bold');
    });
  });

  describe('createHighContrastButtonStyle', () => {
    it('should return normal button style when high contrast is disabled', () => {
      const style = createHighContrastButtonStyle(false);
      
      expect(style.backgroundColor).toBe(DEFAULT_COLORS.primary);
      expect(style.borderColor).toBe(DEFAULT_COLORS.border);
      expect(style.borderWidth).toBe(1); // Normal border width
      expect(style.borderRadius).toBe(8);
    });

    it('should return high contrast button style when enabled', () => {
      const style = createHighContrastButtonStyle(true, false);
      
      expect(style.backgroundColor).toBe(HIGH_CONTRAST_COLORS.primary);
      expect(style.borderColor).toBe(HIGH_CONTRAST_COLORS.border);
      expect(style.borderWidth).toBe(2); // Thicker border in high contrast
      expect(style.borderRadius).toBe(8);
    });

    it('should return high contrast dark button style when enabled with dark theme', () => {
      const style = createHighContrastButtonStyle(true, true);
      
      expect(style.backgroundColor).toBe(HIGH_CONTRAST_DARK_COLORS.primary);
      expect(style.borderColor).toBe(HIGH_CONTRAST_DARK_COLORS.border);
      expect(style.borderWidth).toBe(2); // Thicker border in high contrast
      expect(style.borderRadius).toBe(8);
    });
  });

  describe('createHighContrastFocusStyle', () => {
    it('should return empty object when high contrast is disabled', () => {
      const style = createHighContrastFocusStyle(false);
      
      expect(style).toEqual({});
    });

    it('should return focus style when high contrast is enabled', () => {
      const style = createHighContrastFocusStyle(true);
      
      expect(style).toEqual({
        borderWidth: 3,
        borderColor: '#0000FF', // Blue border for focus
        borderStyle: 'solid'
      });
    });
  });
  
  describe('applyHighContrastStyles', () => {
    it('should return original styles when high contrast mode is disabled', () => {
      const originalStyles = [
        { backgroundColor: '#f0f0f0', color: '#333333' },
        { padding: 10, margin: 5 }
      ];
      
      const result = applyHighContrastStyles(originalStyles, false);
      
      // Should return flattened version of original styles
      expect(result.backgroundColor).toBe('#f0f0f0');
      expect(result.color).toBe('#333333');
      expect(result.padding).toBe(10);
      expect(result.margin).toBe(5);
    });

    it('should apply high contrast colors when high contrast mode is enabled', () => {
      const originalStyles = [
        { backgroundColor: '#f0f0f0', color: '#333333', borderColor: '#cccccc' },
        { padding: 10 }
      ];
      
      const result = applyHighContrastStyles(originalStyles, true, false);
      
      // Colors should be replaced with high contrast colors
      expect(result.backgroundColor).toBe(HIGH_CONTRAST_COLORS.background);
      expect(result.color).toBe(HIGH_CONTRAST_COLORS.text);
      expect(result.borderColor).toBe(HIGH_CONTRAST_COLORS.border);
      expect(result.padding).toBe(10); // Non-color properties should remain
    });

    it('should apply high contrast dark colors when high contrast mode and dark theme are enabled', () => {
      const originalStyles = [
        { backgroundColor: '#f0f0f0', color: '#333333' }
      ];
      
      const result = applyHighContrastStyles(originalStyles, true, true);
      
      // Colors should be replaced with high contrast dark colors
      expect(result.backgroundColor).toBe(HIGH_CONTRAST_DARK_COLORS.background);
      expect(result.color).toBe(HIGH_CONTRAST_DARK_COLORS.text);
    });

    it('should increase border width for better visibility in high contrast mode', () => {
      const originalStyles = [
        { borderWidth: 1, borderColor: '#000000' }
      ];
      
      const result = applyHighContrastStyles(originalStyles, true);
      
      // Border width should be increased to at least 2 in high contrast mode
      expect(result.borderWidth).toBeGreaterThanOrEqual(2);
    });

    it('should add a default border to elements without one in high contrast mode', () => {
      const originalStyles = [
        { backgroundColor: '#ffffff', padding: 10 }
      ];
      
      const result = applyHighContrastStyles(originalStyles, true);
      
      // Should add a default border to elements that don't have one
      expect(result.borderWidth).toBe(1);
      expect(result.borderColor).toBe(HIGH_CONTRAST_COLORS.border);
    });

    it('should not add a default border if one already exists', () => {
      const originalStyles = [
        { borderWidth: 2, backgroundColor: '#ffffff' }
      ];
      
      const result = applyHighContrastStyles(originalStyles, true);
      
      // Should keep the existing border width (but may increase it to minimum 2)
      expect(result.borderWidth).toBeGreaterThanOrEqual(2);
    });
  });
});