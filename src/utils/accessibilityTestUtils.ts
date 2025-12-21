import { AccessibilityInfo } from 'react-native';

/**
 * Accessibility Testing Utilities
 * 
 * These utilities provide functions to test accessibility features
 * in components, including screen reader announcements, focus management,
 * and accessibility property validation.
 */

/**
 * Mock accessibility settings for testing
 */
export interface AccessibilityTestSettings {
  isScreenReaderEnabled?: boolean;
  isReduceMotionEnabled?: boolean;
  isHighContrastEnabled?: boolean;
  isBoldTextEnabled?: boolean;
  isGrayscaleEnabled?: boolean;
  isInvertColorsEnabled?: boolean;
  isClosedCaptioningEnabled?: boolean;
}

/**
 * Mock AccessibilityInfo for testing environments
 */
export class AccessibilityTestMock {
  private static instance: AccessibilityTestMock;
  private settings: AccessibilityTestSettings = {};
  
  private constructor() {}
  
  public static getInstance(): AccessibilityTestMock {
    if (!AccessibilityTestMock.instance) {
      AccessibilityTestMock.instance = new AccessibilityTestMock();
    }
    return AccessibilityTestMock.instance;
  }
  
  public setSettings(settings: AccessibilityTestSettings): void {
    this.settings = settings;
  }
  
  public getSettings(): AccessibilityTestSettings {
    return { ...this.settings };
  }
  
  public reset(): void {
    this.settings = {};
  }
  
  // Mock methods to simulate AccessibilityInfo
  public isScreenReaderEnabled(): Promise<boolean> {
    return Promise.resolve(this.settings.isScreenReaderEnabled || false);
  }
  
  public isReduceMotionEnabled(): Promise<boolean> {
    return Promise.resolve(this.settings.isReduceMotionEnabled || false);
  }
  
  public isHighContrastEnabled(): Promise<boolean> {
    return Promise.resolve(this.settings.isHighContrastEnabled || false);
  }
  
  public isBoldTextEnabled(): Promise<boolean> {
    return Promise.resolve(this.settings.isBoldTextEnabled || false);
  }
  
  public isGrayscaleEnabled(): Promise<boolean> {
    return Promise.resolve(this.settings.isGrayscaleEnabled || false);
  }
  
  public isInvertColorsEnabled(): Promise<boolean> {
    return Promise.resolve(this.settings.isInvertColorsEnabled || false);
  }
  
  public isClosedCaptioningEnabled(): Promise<boolean> {
    return Promise.resolve(this.settings.isClosedCaptioningEnabled || false);
  }
}

/**
 * Accessibility assertion utilities for testing
 */
export class AccessibilityTester {
  /**
   * Assert that an element has proper accessibility properties
   */
  public static assertAccessibleElement(
    element: any,
    expectedProps: {
      accessible?: boolean;
      accessibilityLabel?: string;
      accessibilityRole?: string;
      accessibilityState?: any;
      accessibilityHint?: string;
    }
  ): void {
    if (expectedProps.accessible !== undefined) {
      expect(element.props.accessible).toBe(expectedProps.accessible);
    }
    
    if (expectedProps.accessibilityLabel) {
      expect(element.props.accessibilityLabel).toBe(expectedProps.accessibilityLabel);
    }
    
    if (expectedProps.accessibilityRole) {
      expect(element.props.accessibilityRole).toBe(expectedProps.accessibilityRole);
    }
    
    if (expectedProps.accessibilityState) {
      expect(element.props.accessibilityState).toEqual(expectedProps.accessibilityState);
    }
    
    if (expectedProps.accessibilityHint) {
      expect(element.props.accessibilityHint).toBe(expectedProps.accessibilityHint);
    }
  }
  
  /**
   * Assert that a component has proper focus management
   */
  public static assertFocusableComponent(
    element: any,
    expectedFocusable: boolean = true
  ): void {
    expect(element.props.focusable).toBe(expectedFocusable);
    
    // If focusable, ensure it has proper accessibility properties
    if (expectedFocusable) {
      expect(element.props.accessible).toBe(true);
      expect(element.props.accessibilityLabel).toBeDefined();
    }
  }
  
  /**
   * Assert that a button component has proper accessibility
   */
  public static assertAccessibleButton(
    element: any,
    label: string,
    hint?: string
  ): void {
    this.assertAccessibleElement(element, {
      accessible: true,
      accessibilityLabel: label,
      accessibilityRole: 'button',
      accessibilityHint: hint
    });
    
    this.assertFocusableComponent(element, true);
  }
  
  /**
   * Assert that a text component has proper accessibility
   */
  public static assertAccessibleText(
    element: any,
    text: string,
    role: string = 'text'
  ): void {
    this.assertAccessibleElement(element, {
      accessible: true,
      accessibilityLabel: text,
      accessibilityRole: role
    });
  }
  
  /**
   * Assert that a form component has proper accessibility
   */
  public static assertAccessibleFormElement(
    element: any,
    label: string,
    role: string,
    isRequired: boolean = false
  ): void {
    const expectedState = isRequired ? { disabled: false, selected: false, checked: false } : {};
    
    this.assertAccessibleElement(element, {
      accessible: true,
      accessibilityLabel: label,
      accessibilityRole: role,
      accessibilityState: expectedState
    });
    
    this.assertFocusableComponent(element, true);
  }
  
  /**
   * Validate WCAG 2.1 AA compliance for a component
   */
  public static validateWCAGCompliance(
    element: any,
    level: 'A' | 'AA' | 'AAA' = 'AA'
  ): void {
    // Check for proper semantic roles
    expect(element.props.accessibilityRole).toBeDefined();
    
    // Check for proper labels
    expect(element.props.accessibilityLabel).toBeDefined();
    expect(element.props.accessibilityLabel.length).toBeGreaterThan(0);
    
    // For AA level, ensure sufficient color contrast (this would be checked visually)
    if (level === 'AA') {
      // Additional AA-specific checks would go here
      // For example, checking that interactive elements have focus indicators
      if (element.props.focusable) {
        // Ensure focusable elements have proper focus management
        expect(element.props.onFocus).toBeDefined();
        expect(element.props.onBlur).toBeDefined();
      }
    }
  }
}

/**
 * Accessibility event tracking for testing
 */
export class AccessibilityEventTracker {
  private static instance: AccessibilityEventTracker;
  private announcements: string[] = [];
  private lastAnnouncement: string | null = null;
  
  private constructor() {}
  
  public static getInstance(): AccessibilityEventTracker {
    if (!AccessibilityEventTracker.instance) {
      AccessibilityEventTracker.instance = new AccessibilityEventTracker();
    }
    return AccessibilityEventTracker.instance;
  }
  
  public addAnnouncement(announcement: string): void {
    this.announcements.push(announcement);
    this.lastAnnouncement = announcement;
  }
  
  public getAnnouncements(): string[] {
    return [...this.announcements];
  }
  
  public getLastAnnouncement(): string | null {
    return this.lastAnnouncement;
  }
  
  public clearAnnouncements(): void {
    this.announcements = [];
    this.lastAnnouncement = null;
  }
  
  public getAnnouncementCount(): number {
    return this.announcements.length;
  }
}

/**
 * Utility functions for accessibility testing
 */
export const accessibilityTestUtils = {
  /**
   * Wait for screen reader announcement
   */
  waitForAnnouncement: async (timeout: number = 1000): Promise<string | null> => {
    const tracker = AccessibilityEventTracker.getInstance();
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const lastAnnouncement = tracker.getLastAnnouncement();
      if (lastAnnouncement) {
        return lastAnnouncement;
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    return null;
  },
  
  /**
   * Simulate screen reader announcement for testing
   */
  simulateAnnouncement: (announcement: string): void => {
    const tracker = AccessibilityEventTracker.getInstance();
    tracker.addAnnouncement(announcement);
  },
  
  /**
   * Check if element is accessible
   */
  isElementAccessible: (element: any): boolean => {
    return element.props.accessible === true && 
           element.props.accessibilityLabel !== undefined;
  },
  
  /**
   * Get accessibility tree for debugging
   */
  getAccessibilityTree: (element: any, depth: number = 0): string => {
    const indent = '  '.repeat(depth);
    let tree = `${indent}- ${element.type || 'Unknown'}: `;
    
    if (element.props.accessibilityLabel) {
      tree += `label="${element.props.accessibilityLabel}" `;
    }
    
    if (element.props.accessibilityRole) {
      tree += `role="${element.props.accessibilityRole}" `;
    }
    
    if (element.props.accessibilityState) {
      tree += `state=${JSON.stringify(element.props.accessibilityState)} `;
    }
    
    if (element.props.focusable) {
      tree += 'focusable ';
    }
    
    tree += '\n';
    
    if (element.props.children) {
      const children = Array.isArray(element.props.children) ? 
        element.props.children : [element.props.children];
      
      for (const child of children) {
        if (child && typeof child === 'object') {
          tree += accessibilityTestUtils.getAccessibilityTree(child, depth + 1);
        }
      }
    }
    
    return tree;
  },
  
  /**
   * Validate accessibility props
   */
  validateAccessibilityProps: (props: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check for required accessibility props
    if (props.accessible && !props.accessibilityLabel) {
      errors.push('accessible element missing accessibilityLabel');
    }
    
    // Check for proper role usage
    if (props.accessibilityRole === 'button' && !props.accessibilityLabel) {
      errors.push('button role requires accessibilityLabel');
    }
    
    // Check for focusable elements
    if (props.focusable && !props.accessible) {
      errors.push('focusable element should be accessible');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
};

/**
 * Accessibility testing setup function
 */
export const setupAccessibilityTest = (settings?: AccessibilityTestSettings): void => {
  const mock = AccessibilityTestMock.getInstance();
  if (settings) {
    mock.setSettings(settings);
  }
  
  // Mock AccessibilityInfo methods if needed
  if (typeof jest !== 'undefined') {
    // Check if the methods exist before trying to mock them
    if (AccessibilityInfo && 'isScreenReaderEnabled' in AccessibilityInfo) {
      jest.spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
        .mockImplementation(() => mock.isScreenReaderEnabled());
    }
    if (AccessibilityInfo && 'isReduceMotionEnabled' in AccessibilityInfo) {
      jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
        .mockImplementation(() => mock.isReduceMotionEnabled());
    }
    // Note: isHighContrastEnabled, isBoldTextEnabled, isGrayscaleEnabled,
    // isInvertColorsEnabled, and isClosedCaptioningEnabled may not be available
    // in all React Native versions, so we'll conditionally mock them
    if (AccessibilityInfo && 'isHighContrastEnabled' in AccessibilityInfo) {
      jest.spyOn(AccessibilityInfo, 'isHighContrastEnabled' as any)
        .mockImplementation(() => mock.isHighContrastEnabled());
    }
    if (AccessibilityInfo && 'isBoldTextEnabled' in AccessibilityInfo) {
      jest.spyOn(AccessibilityInfo, 'isBoldTextEnabled' as any)
        .mockImplementation(() => mock.isBoldTextEnabled());
    }
    if (AccessibilityInfo && 'isGrayscaleEnabled' in AccessibilityInfo) {
      jest.spyOn(AccessibilityInfo, 'isGrayscaleEnabled' as any)
        .mockImplementation(() => mock.isGrayscaleEnabled());
    }
    if (AccessibilityInfo && 'isInvertColorsEnabled' in AccessibilityInfo) {
      jest.spyOn(AccessibilityInfo, 'isInvertColorsEnabled' as any)
        .mockImplementation(() => mock.isInvertColorsEnabled());
    }
    if (AccessibilityInfo && 'isClosedCaptioningEnabled' in AccessibilityInfo) {
      jest.spyOn(AccessibilityInfo, 'isClosedCaptioningEnabled' as any)
        .mockImplementation(() => mock.isClosedCaptioningEnabled());
    }
  }
};

/**
 * Cleanup function for accessibility tests
 */
export const cleanupAccessibilityTest = (): void => {
  const mock = AccessibilityTestMock.getInstance();
  mock.reset();
  
  const tracker = AccessibilityEventTracker.getInstance();
  tracker.clearAnnouncements();
};