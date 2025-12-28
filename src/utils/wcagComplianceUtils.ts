/**
 * WCAG Compliance Utilities
 * 
 * These utilities provide functions to check WCAG 2.1 AA compliance
 * for React Native components and applications.
 */

/**
 * WCAG 2.1 AA Compliance Levels
 */
export enum WCAGLevel {
  A = 'A',
  AA = 'AA',
  AAA = 'AAA'
}

/**
 * WCAG 2.1 Success Criteria
 */
export interface WCAGSuccessCriteria {
  id: string;
  title: string;
  level: WCAGLevel;
  description: string;
  testable: boolean;
}

/**
 * WCAG Compliance Check Result
 */
export interface ComplianceCheckResult {
  passed: boolean;
  criteriaId: string;
  message: string;
  suggestions?: string[];
}

/**
 * Component accessibility properties to check
 */
export interface ComponentAccessibilityProps {
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityState?: any;
  accessibilityHint?: string;
  accessibilityLiveRegion?: 'none' | 'polite' | 'assertive';
  accessibilityDescribedBy?: string;
  accessible?: boolean;
  focusable?: boolean;
  testID?: string;
}

/**
 * WCAG Compliance Checker Class
 */
export class WCAGComplianceChecker {
  /**
   * Check if text has sufficient contrast ratio (minimum 4.5:1 for normal text, 3:1 for large text)
   */
  public static checkColorContrast(
    foregroundColor: string, 
    backgroundColor: string, 
    isLargeText: boolean = false
  ): ComplianceCheckResult {
    const contrastRatio = this.calculateContrastRatio(
      this.hexToRgb(foregroundColor), 
      this.hexToRgb(backgroundColor)
    );
    
    const requiredRatio = isLargeText ? 3.0 : 4.5;
    
    if (contrastRatio >= requiredRatio) {
      return {
        passed: true,
        criteriaId: '1.4.3',
        message: `Sufficient contrast ratio: ${contrastRatio.toFixed(2)}:1 (required: ${requiredRatio}:1)`
      };
    } else {
      return {
        passed: false,
        criteriaId: '1.4.3',
        message: `Insufficient contrast ratio: ${contrastRatio.toFixed(2)}:1 (required: ${requiredRatio}:1)`,
        suggestions: [
          `Increase contrast between text (${foregroundColor}) and background (${backgroundColor})`,
          `Use a darker text color or lighter background color`
        ]
      };
    }
  }

  /**
   * Check if component has proper accessibility properties
   */
  public static checkComponentAccessibility(
    props: ComponentAccessibilityProps,
    componentType: string = 'generic'
  ): ComplianceCheckResult[] {
    const results: ComplianceCheckResult[] = [];
    
    // Check 1.1.1 Non-text Content - Provide text alternative
    if (props.accessible !== false && !props.accessibilityLabel) {
      results.push({
        passed: false,
        criteriaId: '1.1.1',
        message: `${componentType} component missing accessibilityLabel`,
        suggestions: [`Add an accessibilityLabel to describe the ${componentType} purpose`]
      });
    } else if (props.accessibilityLabel) {
      results.push({
        passed: true,
        criteriaId: '1.1.1',
        message: `${componentType} has accessibilityLabel: "${props.accessibilityLabel}"`
      });
    }
    
    // Check 4.1.2 Name, Role, Value - Components have complete information
    if (props.accessible !== false) {
      if (!props.accessibilityRole) {
        results.push({
          passed: false,
          criteriaId: '4.1.2',
          message: `${componentType} component missing accessibilityRole`,
          suggestions: [`Add an appropriate accessibilityRole for ${componentType}`]
        });
      } else {
        results.push({
          passed: true,
          criteriaId: '4.1.2',
          message: `${componentType} has accessibilityRole: "${props.accessibilityRole}"`
        });
      }
    }
    
    // Check if element is focusable but not accessible
    if (props.focusable && props.accessible === false) {
      results.push({
        passed: false,
        criteriaId: '4.1.2',
        message: `Focusable element is not accessible`,
        suggestions: [`Set accessible property to true for focusable elements`]
      });
    } else if (props.focusable && props.accessible !== true) {
      // If focusable but accessible is not explicitly set to true
      results.push({
        passed: false,
        criteriaId: '4.1.2',
        message: `Focusable element is not accessible`,
        suggestions: [`Set accessible property to true for focusable elements`]
      });
    }
    
    return results;
  }

  /**
   * Check if touch target size is WCAG compliant (minimum 44x44 pixels)
   */
  public static checkTouchTargetSize(
    width: number, 
    height: number
  ): ComplianceCheckResult {
    const minSize = 44; // WCAG 2.1 AA requirement
    
    if (width >= minSize && height >= minSize) {
      return {
        passed: true,
        criteriaId: '2.5.5',
        message: `Touch target size compliant: ${width}x${height} (minimum: ${minSize}x${minSize})`
      };
    } else {
      return {
        passed: false,
        criteriaId: '2.5.5',
        message: `Touch target size insufficient: ${width}x${height} (minimum: ${minSize}x${minSize})`,
        suggestions: [
          `Increase touch target size to at least ${minSize}x${minSize} pixels`,
          `Add padding around the touch target to meet minimum size`
        ]
      };
    }
  }

  /**
   * Check if form element has proper labeling
   */
  public static checkFormElementLabeling(
    label: string | undefined,
    componentType: string,
    describedBy?: string
  ): ComplianceCheckResult {
    if (!label && !describedBy) {
      return {
        passed: false,
        criteriaId: '3.3.2',
        message: `${componentType} missing accessible label or description`,
        suggestions: [
          `Add an accessibilityLabel to the ${componentType}`,
          `Use accessibilityDescribedBy if a separate description exists`
        ]
      };
    }
    
    return {
      passed: true,
      criteriaId: '3.3.2',
      message: `${componentType} has proper labeling`
    };
  }

  /**
   * Check if error messages are accessible
   */
  public static checkErrorAccessibility(
    errorMessage: string | null,
    errorVisible: boolean,
    errorAccessibilityProps?: ComponentAccessibilityProps
  ): ComplianceCheckResult {
    if (errorVisible && !errorMessage) {
      return {
        passed: false,
        criteriaId: '3.3.1',
        message: 'Error is not accessible to screen readers',
        suggestions: [
          'Provide text content for the error message',
          'Ensure error messages have descriptive text'
        ]
      };
    } else if (errorVisible && errorMessage) {
      // Error message exists and is visible, check if it has proper accessibility properties
      if (errorAccessibilityProps) {
        // Check if error message is properly associated with input
        const hasAccessibilityLabel = errorAccessibilityProps.accessibilityLabel;
        const hasLiveRegion = errorAccessibilityProps.accessibilityLiveRegion;
        const hasDescribedBy = errorAccessibilityProps.accessibilityDescribedBy;
        
        if (hasAccessibilityLabel || hasLiveRegion || hasDescribedBy) {
          return {
            passed: true,
            criteriaId: '3.3.1',
            message: 'Error message has proper accessibility properties'
          };
        } else {
          return {
            passed: true,  // The error has text content, so it passes the basic requirement
            criteriaId: '3.3.1',
            message: 'Error message has text content but could have enhanced accessibility properties'
          };
        }
      } else {
        // Error message exists but has no accessibility props
        return {
          passed: true,  // The error has text content, so it passes the basic requirement
          criteriaId: '3.3.1',
          message: 'Error message has text content'
        };
      }
    } else {
      return {
        passed: true,
        criteriaId: '3.3.1',
        message: 'No error to check'
      };
    }
  }

  /**
   * Calculate luminance of a color
   */
  private static getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
      val /= 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  private static calculateContrastRatio(
    color1: { r: number; g: number; b: number }, 
    color2: { r: number; g: number; b: number }
  ): number {
    const lum1 = this.getRelativeLuminance(color1);
    const lum2 = this.getRelativeLuminance(color2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Convert hex color to RGB
   */
  private static hexToRgb(hex: string): { r: number; g: number; b: number } {
    // Handle shorthand hex (e.g., #fff)
    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    
    if (!result) {
      // Default to black if invalid hex
      return { r: 0, g: 0, b: 0 };
    }
    
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }

  /**
   * Check overall WCAG compliance for a component
   */
  public static checkOverallCompliance(
    props: ComponentAccessibilityProps,
    width?: number,
    height?: number,
    foregroundColor?: string,
    backgroundColor?: string,
    isLargeText: boolean = false
  ): ComplianceCheckResult[] {
    const results: ComplianceCheckResult[] = [];
    
    // Check component accessibility
    results.push(...this.checkComponentAccessibility(props));
    
    // Check touch target size if dimensions provided
    if (width !== undefined && height !== undefined) {
      results.push(this.checkTouchTargetSize(width, height));
    }
    
    // Check color contrast if colors provided
    if (foregroundColor && backgroundColor) {
      results.push(this.checkColorContrast(foregroundColor, backgroundColor, isLargeText));
    }
    
    return results;
  }
}

/**
 * Common WCAG 2.1 AA Success Criteria
 */
export const WCAG_SUCCESS_CRITERIA: WCAGSuccessCriteria[] = [
  {
    id: '1.1.1',
    title: 'Non-text Content',
    level: WCAGLevel.A,
    description: 'All non-text content that is presented to the user has a text alternative that serves the equivalent purpose.',
    testable: true
  },
  {
    id: '1.2.1',
    title: 'Audio-only and Video-only (Prerecorded)',
    level: WCAGLevel.A,
    description: 'For prerecorded audio-only and prerecorded video-only media, the following are true, except when the audio or video is a media alternative for text and is clearly labeled as such.',
    testable: true
  },
  {
    id: '1.3.1',
    title: 'Info and Relationships',
    level: WCAGLevel.A,
    description: 'Information, structures, and relationships conveyed through presentation can be programmatically determined or are available in text.',
    testable: true
  },
  {
    id: '1.3.4',
    title: 'Orientation',
    level: WCAGLevel.AA,
    description: 'Content does not restrict its view and operation to a single display orientation, such as portrait or landscape, unless a specific display orientation is essential.',
    testable: true
  },
  {
    id: '1.4.3',
    title: 'Contrast (Minimum)',
    level: WCAGLevel.AA,
    description: 'The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for large-scale text which requires 3:1.',
    testable: true
  },
  {
    id: '1.4.4',
    title: 'Resize text',
    level: WCAGLevel.AA,
    description: 'Except for captions and images of text, text can be resized without assistive technology up to 200 percent without loss of content or functionality.',
    testable: true
  },
  {
    id: '2.1.1',
    title: 'Keyboard',
    level: WCAGLevel.A,
    description: 'All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes.',
    testable: true
  },
  {
    id: '2.1.4',
    title: 'Character Key Shortcuts',
    level: WCAGLevel.AA,
    description: 'If a keyboard shortcut is implemented in content using only letter keys, punctuation, number, or symbol characters from the keyboard, then a mechanism is available to turn it off.',
    testable: true
  },
  {
    id: '2.4.3',
    title: 'Focus Order',
    level: WCAGLevel.A,
    description: 'If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability.',
    testable: true
  },
  {
    id: '2.5.3',
    title: 'Label in Name',
    level: WCAGLevel.AA,
    description: 'For user interface components with labels that include text or images of text, the name contains the text that is presented visually.',
    testable: true
  },
  {
    id: '2.5.5',
    title: 'Target Size',
    level: WCAGLevel.AA,
    description: 'The size of the target for pointer inputs is at least 44 by 44 CSS pixels except when the target is available through an equivalent link or control on the same page.',
    testable: true
  },
  {
    id: '3.1.1',
    title: 'Language of Page',
    level: WCAGLevel.A,
    description: 'The default human language of each Web page can be programmatically determined.',
    testable: true
  },
  {
    id: '3.2.4',
    title: 'Consistent Identification',
    level: WCAGLevel.AA,
    description: 'Components that have the same functionality within a set of Web pages are identified consistently.',
    testable: true
  },
  {
    id: '3.3.1',
    title: 'Error Identification',
    level: WCAGLevel.A,
    description: 'If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text.',
    testable: true
  },
  {
    id: '3.3.2',
    title: 'Labels or Instructions',
    level: WCAGLevel.A,
    description: 'Labels or instructions are provided when content requires user input.',
    testable: true
  },
  {
    id: '4.1.2',
    title: 'Name, Role, Value',
    level: WCAGLevel.A,
    description: 'For all user interface components, the name and role can be programmatically determined; states, properties, and values that can be set by the user can be programmatically set; and notification of changes to these items is available to user agents, including assistive technologies.',
    testable: true
  }
];

/**
 * Utility functions for WCAG compliance
 */
export const wcagUtils = {
  /**
   * Get WCAG success criteria by ID
   */
  getCriteriaById: (id: string): WCAGSuccessCriteria | undefined => {
    return WCAG_SUCCESS_CRITERIA.find(criteria => criteria.id === id);
  },

  /**
   * Get all criteria at specified level
   */
  getCriteriaByLevel: (level: WCAGLevel): WCAGSuccessCriteria[] => {
    return WCAG_SUCCESS_CRITERIA.filter(criteria => criteria.level === level);
  },

  /**
   * Check if all results passed
   */
  allPassed: (results: ComplianceCheckResult[]): boolean => {
    return results.every(result => result.passed);
  },

  /**
   * Get only failed results
   */
  getFailedResults: (results: ComplianceCheckResult[]): ComplianceCheckResult[] => {
    return results.filter(result => !result.passed);
  },

  /**
   * Get only passed results
   */
  getPassedResults: (results: ComplianceCheckResult[]): ComplianceCheckResult[] => {
    return results.filter(result => result.passed);
  },

  /**
   * Generate WCAG compliance report
   */
  generateReport: (results: ComplianceCheckResult[]): string => {
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const total = results.length;
    
    let report = `WCAG Compliance Report\n`;
    report += `=====================\n`;
    report += `Total checks: ${total}\n`;
    report += `Passed: ${passed}\n`;
    report += `Failed: ${failed}\n`;
    report += `Compliance: ${total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0'}%\n\n`;
    
    if (failed > 0) {
      report += `Failed Criteria:\n`;
      report += `----------------\n`;
      results
        .filter(r => !r.passed)
        .forEach(r => {
          const criteria = wcagUtils.getCriteriaById(r.criteriaId);
          report += `- ${r.criteriaId}: ${criteria?.title || 'Unknown Criteria'}\n`;
          report += `  ${r.message}\n`;
          if (r.suggestions) {
            r.suggestions.forEach(s => report += `  - ${s}\n`);
          }
          report += `\n`;
        });
    }
    
    return report;
  }
};