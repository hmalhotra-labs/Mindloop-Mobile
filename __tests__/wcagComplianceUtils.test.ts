import { 
  WCAGComplianceChecker, 
  WCAGLevel, 
  wcagUtils,
  WCAG_SUCCESS_CRITERIA
} from '../src/utils/wcagComplianceUtils';

describe('WCAG Compliance Utilities', () => {
  describe('WCAGComplianceChecker', () => {
    describe('checkColorContrast', () => {
      it('should pass contrast check for high contrast colors', () => {
        const result = WCAGComplianceChecker.checkColorContrast('#000000', '#FFFFFF');
        
        expect(result.passed).toBe(true);
        expect(result.criteriaId).toBe('1.4.3');
        expect(result.message).toContain('Sufficient contrast ratio');
      });

      it('should fail contrast check for low contrast colors', () => {
        const result = WCAGComplianceChecker.checkColorContrast('#CCCCCC', '#EEEEEE');
        
        expect(result.passed).toBe(false);
        expect(result.criteriaId).toBe('1.4.3');
        expect(result.message).toContain('Insufficient contrast ratio');
        expect(result.suggestions).toBeDefined();
        expect(result.suggestions?.length).toBeGreaterThan(0);
      });

      it('should use different contrast requirements for large text', () => {
        // With large text, 3:1 ratio is acceptable instead of 4.5:1
        const result = WCAGComplianceChecker.checkColorContrast('#777777', '#FFFFFF', true);
        
        expect(result.passed).toBe(true);
        expect(result.criteriaId).toBe('1.4.3');
      });

      it('should handle shorthand hex colors', () => {
        const result = WCAGComplianceChecker.checkColorContrast('#000', '#FFF');
        
        expect(result.passed).toBe(true);
        expect(result.criteriaId).toBe('1.4.3');
      });
    });

    describe('checkComponentAccessibility', () => {
      it('should identify missing accessibility label', () => {
        const props = {
          accessible: true
          // Missing accessibilityLabel
        };
        
        const results = WCAGComplianceChecker.checkComponentAccessibility(props, 'button');
        
        const labelCheck = results.find(r => r.criteriaId === '1.1.1');
        expect(labelCheck).toBeDefined();
        expect(labelCheck?.passed).toBe(false);
        expect(labelCheck?.message).toContain('missing accessibilityLabel');
      });

      it('should pass when accessibility label is provided', () => {
        const props = {
          accessible: true,
          accessibilityLabel: 'Submit button',
          accessibilityRole: 'button'
        };
        
        const results = WCAGComplianceChecker.checkComponentAccessibility(props, 'button');
        
        const labelCheck = results.find(r => r.criteriaId === '1.1.1');
        expect(labelCheck?.passed).toBe(true);
        expect(labelCheck?.message).toContain('has accessibilityLabel');
      });

      it('should identify missing accessibility role', () => {
        const props = {
          accessible: true,
          accessibilityLabel: 'My element'
          // Missing accessibilityRole
        };
        
        const results = WCAGComplianceChecker.checkComponentAccessibility(props, 'button');
        
        const roleCheck = results.find(r => r.criteriaId === '4.1.2');
        expect(roleCheck).toBeDefined();
        expect(roleCheck?.passed).toBe(false);
        expect(roleCheck?.message).toContain('missing accessibilityRole');
      });

      it('should pass when accessibility role is provided', () => {
        const props = {
          accessible: true,
          accessibilityLabel: 'Submit button',
          accessibilityRole: 'button'
        };
        
        const results = WCAGComplianceChecker.checkComponentAccessibility(props, 'button');
        
        const roleCheck = results.find(r => r.criteriaId === '4.1.2');
        expect(roleCheck?.passed).toBe(true);
        expect(roleCheck?.message).toContain('has accessibilityRole');
      });

      it('should identify focusable elements that are not accessible', () => {
        const props = {
          focusable: true,
          accessibilityRole: 'button'  // Need to provide role to avoid that check
          // Missing accessible: true
        };
        
        const results = WCAGComplianceChecker.checkComponentAccessibility(props, 'input');
        
        const focusableCheck = results.find(r => r.criteriaId === '4.1.2' && r.message.includes('Focusable element is not accessible'));
        expect(focusableCheck).toBeDefined();
        expect(focusableCheck?.passed).toBe(false);
        expect(focusableCheck?.message).toContain('Focusable element is not accessible');
      });
    });

    describe('checkTouchTargetSize', () => {
      it('should pass for touch targets meeting minimum size', () => {
        const result = WCAGComplianceChecker.checkTouchTargetSize(44, 44);
        
        expect(result.passed).toBe(true);
        expect(result.criteriaId).toBe('2.5.5');
        expect(result.message).toContain('compliant');
      });

      it('should fail for touch targets below minimum size', () => {
        const result = WCAGComplianceChecker.checkTouchTargetSize(40, 40);
        
        expect(result.passed).toBe(false);
        expect(result.criteriaId).toBe('2.5.5');
        expect(result.message).toContain('insufficient');
        expect(result.suggestions).toBeDefined();
      });

      it('should fail when only one dimension meets minimum size', () => {
        const result = WCAGComplianceChecker.checkTouchTargetSize(44, 40);
        
        expect(result.passed).toBe(false);
        expect(result.criteriaId).toBe('2.5.5');
      });
    });

    describe('checkFormElementLabeling', () => {
      it('should pass when form element has label', () => {
        const result = WCAGComplianceChecker.checkFormElementLabeling('Email address', 'input');
        
        expect(result.passed).toBe(true);
        expect(result.criteriaId).toBe('3.3.2');
      });

      it('should pass when form element has describedBy', () => {
        const result = WCAGComplianceChecker.checkFormElementLabeling(undefined, 'input', 'description-id');
        
        expect(result.passed).toBe(true);
        expect(result.criteriaId).toBe('3.3.2');
      });

      it('should fail when form element has no label or description', () => {
        const result = WCAGComplianceChecker.checkFormElementLabeling(undefined, 'input');
        
        expect(result.passed).toBe(false);
        expect(result.criteriaId).toBe('3.3.2');
        expect(result.message).toContain('missing accessible label');
      });
    });

    describe('checkErrorAccessibility', () => {
      it('should fail when error is visible and has message but lacks accessibility properties', () => {
        const result = WCAGComplianceChecker.checkErrorAccessibility('Invalid email', true);
        
        expect(result.passed).toBe(false);
        expect(result.criteriaId).toBe('3.3.1');
      });
      
      it('should pass when error is visible, has message, and has proper accessibility properties', () => {
        const result = WCAGComplianceChecker.checkErrorAccessibility('Invalid email', true, {
          accessibilityLiveRegion: 'assertive'
        });
        
        expect(result.passed).toBe(true);
        expect(result.criteriaId).toBe('3.3.1');
      });

      it('should fail when error is visible but has no message', () => {
        const result = WCAGComplianceChecker.checkErrorAccessibility(null, true);
        
        expect(result.passed).toBe(false);
        expect(result.criteriaId).toBe('3.3.1');
        expect(result.message).toContain('not accessible to screen readers');
      });

      it('should pass when no error is visible', () => {
        const result = WCAGComplianceChecker.checkErrorAccessibility('Some error', false);
        
        expect(result.passed).toBe(true);
        expect(result.criteriaId).toBe('3.3.1');
      });
    });

    describe('checkOverallCompliance', () => {
      it('should run multiple compliance checks', () => {
        const props = {
          accessible: true,
          accessibilityLabel: 'Test button',
          accessibilityRole: 'button',
          focusable: true
        };
        
        const results = WCAGComplianceChecker.checkOverallCompliance(
          props,
          50,  // width
          50,  // height
          '#000000',  // foreground color
          '#FFFFFF'   // background color
        );
        
        // Should have checks for accessibility, touch target, and color contrast
        expect(results.length).toBeGreaterThan(2);
        
        const accessibilityChecks = results.filter(r => r.criteriaId === '1.1.1' || r.criteriaId === '4.1.2');
        expect(accessibilityChecks.length).toBeGreaterThan(0);
        
        const touchTargetCheck = results.find(r => r.criteriaId === '2.5.5');
        expect(touchTargetCheck?.passed).toBe(true);
        
        const contrastCheck = results.find(r => r.criteriaId === '1.4.3');
        expect(contrastCheck?.passed).toBe(true);
      });
    });
  });

  describe('wcagUtils', () => {
    describe('getCriteriaById', () => {
      it('should return criteria by ID', () => {
        const criteria = wcagUtils.getCriteriaById('1.4.3');
        
        expect(criteria).toBeDefined();
        expect(criteria?.id).toBe('1.4.3');
        expect(criteria?.title).toBe('Contrast (Minimum)');
      });

      it('should return undefined for invalid ID', () => {
        const criteria = wcagUtils.getCriteriaById('999.999');
        
        expect(criteria).toBeUndefined();
      });
    });

    describe('getCriteriaByLevel', () => {
      it('should return all AA level criteria', () => {
        const aaCriteria = wcagUtils.getCriteriaByLevel(WCAGLevel.AA);
        
        expect(aaCriteria.length).toBeGreaterThan(0);
        aaCriteria.forEach(criteria => {
          expect(criteria.level).toBe(WCAGLevel.AA);
        });
      });

      it('should return all A level criteria', () => {
        const aCriteria = wcagUtils.getCriteriaByLevel(WCAGLevel.A);
        
        expect(aCriteria.length).toBeGreaterThan(0);
        aCriteria.forEach(criteria => {
          expect(criteria.level).toBe(WCAGLevel.A);
        });
      });
    });

    describe('allPassed', () => {
      it('should return true when all results pass', () => {
        const results = [
          { passed: true, criteriaId: '1.1.1', message: 'Passed' },
          { passed: true, criteriaId: '1.4.3', message: 'Passed' }
        ];
        
        expect(wcagUtils.allPassed(results)).toBe(true);
      });

      it('should return false when any result fails', () => {
        const results = [
          { passed: true, criteriaId: '1.1.1', message: 'Passed' },
          { passed: false, criteriaId: '1.4.3', message: 'Failed' }
        ];
        
        expect(wcagUtils.allPassed(results)).toBe(false);
      });
    });

    describe('getFailedResults', () => {
      it('should return only failed results', () => {
        const results = [
          { passed: true, criteriaId: '1.1.1', message: 'Passed' },
          { passed: false, criteriaId: '1.4.3', message: 'Failed' },
          { passed: false, criteriaId: '2.5.5', message: 'Failed' },
          { passed: true, criteriaId: '4.1.2', message: 'Passed' }
        ];
        
        const failed = wcagUtils.getFailedResults(results);
        
        expect(failed.length).toBe(2);
        expect(failed.every(r => !r.passed)).toBe(true);
      });
    });

    describe('getPassedResults', () => {
      it('should return only passed results', () => {
        const results = [
          { passed: true, criteriaId: '1.1.1', message: 'Passed' },
          { passed: false, criteriaId: '1.4.3', message: 'Failed' },
          { passed: false, criteriaId: '2.5.5', message: 'Failed' },
          { passed: true, criteriaId: '4.1.2', message: 'Passed' }
        ];
        
        const passed = wcagUtils.getPassedResults(results);
        
        expect(passed.length).toBe(2);
        expect(passed.every(r => r.passed)).toBe(true);
      });
    });

    describe('generateReport', () => {
      it('should generate a proper report', () => {
        const results = [
          { passed: true, criteriaId: '1.1.1', message: 'Passed' },
          { passed: false, criteriaId: '1.4.3', message: 'Failed', suggestions: ['Fix contrast'] }
        ];
        
        const report = wcagUtils.generateReport(results);
        
        expect(report).toContain('WCAG Compliance Report');
        expect(report).toContain('Total checks: 2');
        expect(report).toContain('Passed: 1');
        expect(report).toContain('Failed: 1');
        expect(report).toContain('Compliance: 50.0%');
        expect(report).toContain('Failed Criteria:');
        expect(report).toContain('1.4.3');
      });

      it('should handle all passed results', () => {
        const results = [
          { passed: true, criteriaId: '1.1.1', message: 'Passed' },
          { passed: true, criteriaId: '1.4.3', message: 'Passed' }
        ];
        
        const report = wcagUtils.generateReport(results);
        
        expect(report).toContain('Total checks: 2');
        expect(report).toContain('Passed: 2');
        expect(report).toContain('Failed: 0');
        expect(report).toContain('Compliance: 100.0%');
        expect(report).not.toContain('Failed Criteria:');
      });

      it('should handle empty results', () => {
        const report = wcagUtils.generateReport([]);
        
        expect(report).toContain('Total checks: 0');
        expect(report).toContain('Compliance: 0.0%');
      });
    });
  });

  describe('WCAG_SUCCESS_CRITERIA', () => {
    it('should have multiple success criteria defined', () => {
      expect(WCAG_SUCCESS_CRITERIA.length).toBeGreaterThan(10);
      
      const contrastCriteria = WCAG_SUCCESS_CRITERIA.find(c => c.id === '1.4.3');
      expect(contrastCriteria).toBeDefined();
      expect(contrastCriteria?.title).toBe('Contrast (Minimum)');
      expect(contrastCriteria?.level).toBe(WCAGLevel.AA);
    });
  });
});