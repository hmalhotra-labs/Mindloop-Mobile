import React from 'react';
import { AccessibilityTester, AccessibilityTestMock, AccessibilityEventTracker, accessibilityTestUtils, setupAccessibilityTest, cleanupAccessibilityTest } from '../src/utils/accessibilityTestUtils';

describe('Accessibility Testing Utilities', () => {
  beforeEach(() => {
    cleanupAccessibilityTest();
  });

  describe('AccessibilityTestMock', () => {
    it('should manage accessibility settings correctly', () => {
      const mock = AccessibilityTestMock.getInstance();
      mock.reset();
      
      // Initially should have default values
      expect(mock.getSettings()).toEqual({});
      
      // Set some settings
      mock.setSettings({
        isScreenReaderEnabled: true,
        isHighContrastEnabled: false
      });
      
      expect(mock.getSettings()).toEqual({
        isScreenReaderEnabled: true,
        isHighContrastEnabled: false
      });
      
      // Test individual methods
      expect(mock.isScreenReaderEnabled()).resolves.toBe(true);
      expect(mock.isHighContrastEnabled()).resolves.toBe(false);
    });

    it('should reset settings correctly', () => {
      const mock = AccessibilityTestMock.getInstance();
      
      mock.setSettings({ isScreenReaderEnabled: true });
      expect(mock.getSettings()).toEqual({ isScreenReaderEnabled: true });
      
      mock.reset();
      expect(mock.getSettings()).toEqual({});
    });
  });

  describe('AccessibilityTester', () => {
    it('should assert accessible element properties correctly', () => {
      const element = {
        props: {
          accessible: true,
          accessibilityLabel: 'Test Label',
          accessibilityRole: 'button',
          accessibilityState: { selected: true },
          accessibilityHint: 'Test Hint'
        }
      };

      // This should not throw any errors
      expect(() => {
        AccessibilityTester.assertAccessibleElement(element, {
          accessible: true,
          accessibilityLabel: 'Test Label',
          accessibilityRole: 'button',
          accessibilityState: { selected: true },
          accessibilityHint: 'Test Hint'
        });
      }).not.toThrow();
    });

    it('should fail assertion when properties do not match', () => {
      const element = {
        props: {
          accessible: true,
          accessibilityLabel: 'Test Label'
        }
      };

      expect(() => {
        AccessibilityTester.assertAccessibleElement(element, {
          accessibilityLabel: 'Different Label'
        });
      }).toThrow();
    });

    it('should assert focusable components correctly', () => {
      const element = {
        props: {
          focusable: true,
          accessible: true,
          accessibilityLabel: 'Test Label'
        }
      };

      expect(() => {
        AccessibilityTester.assertFocusableComponent(element, true);
      }).not.toThrow();
    });

    it('should assert accessible button correctly', () => {
      const element = {
        props: {
          accessible: true,
          accessibilityLabel: 'Button Label',
          accessibilityRole: 'button',
          accessibilityHint: 'Button Hint',
          focusable: true
        }
      };

      expect(() => {
        AccessibilityTester.assertAccessibleButton(element, 'Button Label', 'Button Hint');
      }).not.toThrow();
    });

    it('should assert accessible text correctly', () => {
      const element = {
        props: {
          accessible: true,
          accessibilityLabel: 'Text Content',
          accessibilityRole: 'text'
        }
      };

      expect(() => {
        AccessibilityTester.assertAccessibleText(element, 'Text Content', 'text');
      }).not.toThrow();
    });

    it('should validate WCAG compliance correctly', () => {
      const element = {
        props: {
          accessibilityRole: 'button',
          accessibilityLabel: 'Accessible Button',
          focusable: true,
          onFocus: () => {},
          onBlur: () => {}
        }
      };

      expect(() => {
        AccessibilityTester.validateWCAGCompliance(element, 'AA');
      }).not.toThrow();
    });
  });

  describe('AccessibilityEventTracker', () => {
    it('should track announcements correctly', () => {
      const tracker = AccessibilityEventTracker.getInstance();
      tracker.clearAnnouncements();
      
      expect(tracker.getAnnouncementCount()).toBe(0);
      expect(tracker.getAnnouncements()).toEqual([]);
      expect(tracker.getLastAnnouncement()).toBeNull();
      
      tracker.addAnnouncement('First announcement');
      expect(tracker.getAnnouncementCount()).toBe(1);
      expect(tracker.getAnnouncements()).toEqual(['First announcement']);
      expect(tracker.getLastAnnouncement()).toBe('First announcement');
      
      tracker.addAnnouncement('Second announcement');
      expect(tracker.getAnnouncementCount()).toBe(2);
      expect(tracker.getAnnouncements()).toEqual(['First announcement', 'Second announcement']);
      expect(tracker.getLastAnnouncement()).toBe('Second announcement');
    });

    it('should clear announcements correctly', () => {
      const tracker = AccessibilityEventTracker.getInstance();
      tracker.addAnnouncement('Test announcement');
      
      expect(tracker.getAnnouncementCount()).toBe(1);
      
      tracker.clearAnnouncements();
      expect(tracker.getAnnouncementCount()).toBe(0);
      expect(tracker.getAnnouncements()).toEqual([]);
      expect(tracker.getLastAnnouncement()).toBeNull();
    });
  });

  describe('accessibilityTestUtils', () => {
    it('should validate accessibility props correctly', () => {
      // Valid element
      const validProps = {
        accessible: true,
        accessibilityLabel: 'Valid label',
        accessibilityRole: 'button'
      };
      
      const validResult = accessibilityTestUtils.validateAccessibilityProps(validProps);
      expect(validResult.valid).toBe(true);
      expect(validResult.errors).toEqual([]);
      
      // Invalid element - accessible without label
      const invalidProps = {
        accessible: true
        // Missing accessibilityLabel
      };
      
      const invalidResult = accessibilityTestUtils.validateAccessibilityProps(invalidProps);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors).toContain('accessible element missing accessibilityLabel');
      
      // Invalid element - button without label
      const buttonProps = {
        accessibilityRole: 'button'
        // Missing accessibilityLabel
      };
      
      const buttonResult = accessibilityTestUtils.validateAccessibilityProps(buttonProps);
      expect(buttonResult.valid).toBe(false);
      expect(buttonResult.errors).toContain('button role requires accessibilityLabel');
      
      // Invalid element - focusable without accessible
      const focusableProps = {
        focusable: true
        // Missing accessible: true
      };
      
      const focusableResult = accessibilityTestUtils.validateAccessibilityProps(focusableProps);
      expect(focusableResult.valid).toBe(false);
      expect(focusableResult.errors).toContain('focusable element should be accessible');
    });

    it('should check if element is accessible correctly', () => {
      const accessibleElement = {
        props: {
          accessible: true,
          accessibilityLabel: 'Test label'
        }
      };
      
      const inaccessibleElement = {
        props: {
          accessible: false,
          accessibilityLabel: 'Test label'
        }
      };
      
      const noLabelElement = {
        props: {
          accessible: true
          // No accessibilityLabel
        }
      };
      
      expect(accessibilityTestUtils.isElementAccessible(accessibleElement)).toBe(true);
      expect(accessibilityTestUtils.isElementAccessible(inaccessibleElement)).toBe(false);
      expect(accessibilityTestUtils.isElementAccessible(noLabelElement)).toBe(false);
    });

    it('should generate accessibility tree correctly', () => {
      const element = {
        type: 'View',
        props: {
          accessibilityLabel: 'Parent View',
          accessibilityRole: 'section',
          children: [
            {
              type: 'Text',
              props: {
                accessibilityLabel: 'Child Text',
                accessibilityRole: 'text'
              }
            }
          ]
        }
      };
      
      const tree = accessibilityTestUtils.getAccessibilityTree(element);
      
      expect(tree).toContain('Parent View');
      expect(tree).toContain('Child Text');
      expect(tree).toContain('role="section"');
      expect(tree).toContain('role="text"');
    });
  });

  describe('setup and cleanup functions', () => {
    it('should setup accessibility test with settings', () => {
      const settings = {
        isScreenReaderEnabled: true,
        isHighContrastEnabled: false
      };
      
      setupAccessibilityTest(settings);
      
      const mock = AccessibilityTestMock.getInstance();
      expect(mock.getSettings()).toEqual(settings);
      
      cleanupAccessibilityTest();
    });

    it('should setup accessibility test without settings', () => {
      setupAccessibilityTest();
      
      const mock = AccessibilityTestMock.getInstance();
      expect(mock.getSettings()).toEqual({});
      
      cleanupAccessibilityTest();
    });
  });
});