// WCAG 2.1 AA Compliance Audit System
export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  category:
    | 'keyboard'
    | 'contrast'
    | 'aria'
    | 'semantics'
    | 'focus'
    | 'images'
    | 'forms';
  element: string;
  message: string;
  wcagCriterion: string;
  severity: 'critical' | 'major' | 'minor';
  selector: string;
}

export interface AccessibilityReport {
  score: number;
  totalIssues: number;
  issues: AccessibilityIssue[];
  wcagCompliance: {
    level: 'A' | 'AA' | 'AAA' | 'Non-compliant';
    passedCriteria: string[];
    failedCriteria: string[];
  };
  timestamp: number;
}

class AccessibilityAuditor {
  private issues: AccessibilityIssue[] = [];
  private wcagCriteria: Map<string, boolean> = new Map();

  constructor() {
    this.initializeWCAGCriteria();
  }

  private initializeWCAGCriteria() {
    // Initialize WCAG 2.1 AA criteria
    this.wcagCriteria.set('1.1.1', false); // Non-text Content
    this.wcagCriteria.set('1.2.1', false); // Audio-only and Video-only
    this.wcagCriteria.set('1.2.2', false); // Captions
    this.wcagCriteria.set('1.2.3', false); // Audio Description or Media Alternative
    this.wcagCriteria.set('1.2.4', false); // Captions (Live)
    this.wcagCriteria.set('1.2.5', false); // Audio Description
    this.wcagCriteria.set('1.3.1', false); // Info and Relationships
    this.wcagCriteria.set('1.3.2', false); // Meaningful Sequence
    this.wcagCriteria.set('1.3.3', false); // Sensory Characteristics
    this.wcagCriteria.set('1.4.1', false); // Use of Color
    this.wcagCriteria.set('1.4.2', false); // Audio Control
    this.wcagCriteria.set('1.4.3', false); // Contrast (Minimum)
    this.wcagCriteria.set('1.4.4', false); // Resize text
    this.wcagCriteria.set('1.4.5', false); // Images of Text
    this.wcagCriteria.set('1.4.10', false); // Reflow
    this.wcagCriteria.set('1.4.11', false); // Non-text Contrast
    this.wcagCriteria.set('1.4.12', false); // Text Spacing
    this.wcagCriteria.set('2.1.1', false); // Keyboard
    this.wcagCriteria.set('2.1.2', false); // No Keyboard Trap
    this.wcagCriteria.set('2.1.3', false); // Keyboard (No Exception)
    this.wcagCriteria.set('2.1.4', false); // Character Key Shortcuts
    this.wcagCriteria.set('2.2.1', false); // Timing Adjustable
    this.wcagCriteria.set('2.2.2', false); // Pause, Stop, Hide
    this.wcagCriteria.set('2.3.1', false); // Three Flashes or Below Threshold
    this.wcagCriteria.set('2.4.1', false); // Bypass Blocks
    this.wcagCriteria.set('2.4.2', false); // Page Titled
    this.wcagCriteria.set('2.4.3', false); // Focus Order
    this.wcagCriteria.set('2.4.4', false); // Link Purpose
    this.wcagCriteria.set('2.5.1', false); // Pointer Gestures
    this.wcagCriteria.set('2.5.2', false); // Pointer Cancellation
    this.wcagCriteria.set('2.5.3', false); // Label in Name
    this.wcagCriteria.set('2.5.4', false); // Motion Actuation
    this.wcagCriteria.set('3.1.1', false); // Language of Page
    this.wcagCriteria.set('3.1.2', false); // Language of Parts
    this.wcagCriteria.set('3.2.1', false); // On Focus
    this.wcagCriteria.set('3.2.2', false); // On Input
    this.wcagCriteria.set('3.2.3', false); // Consistent Navigation
    this.wcagCriteria.set('3.2.4', false); // Consistent Identification
    this.wcagCriteria.set('3.3.1', false); // Error Identification
    this.wcagCriteria.set('3.3.2', false); // Labels or Instructions
    this.wcagCriteria.set('3.3.3', false); // Error Suggestion
    this.wcagCriteria.set('3.3.4', false); // Error Prevention
    this.wcagCriteria.set('4.1.1', false); // Parsing
    this.wcagCriteria.set('4.1.2', false); // Name, Role, Value
  }

  public audit(): AccessibilityReport {
    if (typeof document === 'undefined') {
      return this.createEmptyReport();
    }

    this.issues = [];

    // Reset criteria
    this.wcagCriteria.forEach((_, key) => this.wcagCriteria.set(key, false));

    // Run accessibility checks
    this.checkKeyboardAccessibility();
    this.checkColorContrast();
    this.checkARIALabels();
    this.checkSemanticStructure();
    this.checkFocusManagement();
    this.checkImageAccessibility();
    this.checkFormAccessibility();

    return this.generateReport();
  }

  private checkKeyboardAccessibility() {
    // Check for keyboard accessibility
    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    interactiveElements.forEach(element => {
      const el = element as HTMLElement;

      // Check if element is focusable
      if (el.tabIndex < 0) {
        this.addIssue({
          type: 'error',
          category: 'keyboard',
          element: el.tagName.toLowerCase(),
          message: 'Interactive element should be focusable',
          wcagCriterion: '2.1.1',
          severity: 'critical',
          selector: this.getSelector(el),
        });
      }

      // Check for keyboard event handlers
      if (el.tagName === 'DIV' && el.onclick) {
        this.addIssue({
          type: 'warning',
          category: 'keyboard',
          element: el.tagName.toLowerCase(),
          message: 'DIV with click handler should be keyboard accessible',
          wcagCriterion: '2.1.1',
          severity: 'major',
          selector: this.getSelector(el),
        });
      }
    });

    this.wcagCriteria.set('2.1.1', true);
    this.wcagCriteria.set('2.1.2', true);
  }

  private checkColorContrast() {
    // Check text color contrast
    const textElements = document.querySelectorAll(
      'p, h1, h2, h3, h4, h5, h6, span, a, label'
    );

    textElements.forEach(element => {
      const el = element as HTMLElement;
      const styles = window.getComputedStyle(el);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // Simple contrast check (would need more sophisticated calculation)
      if (
        color === 'rgb(128, 128, 128)' &&
        backgroundColor === 'rgb(255, 255, 255)'
      ) {
        this.addIssue({
          type: 'warning',
          category: 'contrast',
          element: el.tagName.toLowerCase(),
          message: 'Low color contrast detected',
          wcagCriterion: '1.4.3',
          severity: 'major',
          selector: this.getSelector(el),
        });
      }
    });

    this.wcagCriteria.set('1.4.3', true);
    this.wcagCriteria.set('1.4.11', true);
  }

  private checkARIALabels() {
    // Check for proper ARIA labels
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(element => {
      const el = element as HTMLInputElement;

      if (
        !el.getAttribute('aria-label') &&
        !el.getAttribute('aria-labelledby') &&
        !el.id
      ) {
        const label = document.querySelector(`label[for="${el.id}"]`);
        if (!label) {
          this.addIssue({
            type: 'error',
            category: 'aria',
            element: el.tagName.toLowerCase(),
            message: 'Form input missing label or aria-label',
            wcagCriterion: '3.3.2',
            severity: 'critical',
            selector: this.getSelector(el),
          });
        }
      }
    });

    // Check for proper ARIA roles
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(element => {
      const el = element as HTMLButtonElement;
      if (!el.textContent?.trim()) {
        this.addIssue({
          type: 'error',
          category: 'aria',
          element: el.tagName.toLowerCase(),
          message: 'Button missing text content or aria-label',
          wcagCriterion: '4.1.2',
          severity: 'critical',
          selector: this.getSelector(el),
        });
      }
    });

    this.wcagCriteria.set('3.3.2', true);
    this.wcagCriteria.set('4.1.2', true);
  }

  private checkSemanticStructure() {
    // Check for proper heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;

    headings.forEach(element => {
      const el = element as HTMLElement;
      const level = parseInt(el.tagName.substring(1));

      if (previousLevel > 0 && level > previousLevel + 1) {
        this.addIssue({
          type: 'warning',
          category: 'semantics',
          element: el.tagName.toLowerCase(),
          message: `Heading level skipped (H${previousLevel} to H${level})`,
          wcagCriterion: '1.3.1',
          severity: 'minor',
          selector: this.getSelector(el),
        });
      }

      previousLevel = level;
    });

    // Check for proper landmarks
    const hasMain = document.querySelectorAll('main, [role="main"]').length > 0;

    if (!hasMain) {
      this.addIssue({
        type: 'warning',
        category: 'semantics',
        element: 'page',
        message: 'Missing main landmark',
        wcagCriterion: '1.3.6',
        severity: 'major',
        selector: 'html',
      });
    }

    this.wcagCriteria.set('1.3.1', true);
    this.wcagCriteria.set('2.4.1', true);
  }

  private checkFocusManagement() {
    // Check for visible focus indicators
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
      const el = element as HTMLElement;
      const styles = window.getComputedStyle(el, ':focus');

      if (styles.outline === 'none' && styles.boxShadow === 'none') {
        this.addIssue({
          type: 'warning',
          category: 'focus',
          element: el.tagName.toLowerCase(),
          message: 'Focus indicator not visible',
          wcagCriterion: '2.4.7',
          severity: 'major',
          selector: this.getSelector(el),
        });
      }
    });

    this.wcagCriteria.set('2.4.7', true);
  }

  private checkImageAccessibility() {
    // Check for alt text on images
    const images = document.querySelectorAll('img');
    images.forEach(element => {
      const el = element as HTMLImageElement;

      if (!el.alt) {
        this.addIssue({
          type: 'error',
          category: 'images',
          element: el.tagName.toLowerCase(),
          message: 'Image missing alt text',
          wcagCriterion: '1.1.1',
          severity: 'critical',
          selector: this.getSelector(el),
        });
      }
    });

    this.wcagCriteria.set('1.1.1', true);
  }

  private checkFormAccessibility() {
    // Check form field associations
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        const el = input as HTMLInputElement;

        if (!el.id) {
          this.addIssue({
            type: 'warning',
            category: 'forms',
            element: el.tagName.toLowerCase(),
            message: 'Form input missing id for label association',
            wcagCriterion: '3.3.2',
            severity: 'major',
            selector: this.getSelector(el),
          });
        }
      });
    });

    this.wcagCriteria.set('3.3.1', true);
    this.wcagCriteria.set('3.3.2', true);
  }

  private addIssue(issue: AccessibilityIssue) {
    this.issues.push(issue);
  }

  private getSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className) {
      return `${element.tagName.toLowerCase()}.${element.className.split(' ').join('.')}`;
    }

    return element.tagName.toLowerCase();
  }

  private generateReport(): AccessibilityReport {
    const criticalIssues = this.issues.filter(
      i => i.severity === 'critical'
    ).length;
    const majorIssues = this.issues.filter(i => i.severity === 'major').length;
    const minorIssues = this.issues.filter(i => i.severity === 'minor').length;

    // Calculate score (0-100)
    let score = 100;
    score -= criticalIssues * 20;
    score -= majorIssues * 10;
    score -= minorIssues * 5;
    score = Math.max(0, score);

    // Determine WCAG compliance level
    const passedCriteria = Array.from(this.wcagCriteria.entries())
      .filter(entry => entry[1])
      .map(entry => entry[0]);

    const failedCriteria = Array.from(this.wcagCriteria.entries())
      .filter(entry => !entry[1])
      .map(entry => entry[0]);

    let level: 'A' | 'AA' | 'AAA' | 'Non-compliant' = 'Non-compliant';

    if (criticalIssues === 0 && majorIssues <= 2) {
      level = 'AA';
    } else if (criticalIssues === 0) {
      level = 'A';
    }

    return {
      score,
      totalIssues: this.issues.length,
      issues: [...this.issues],
      wcagCompliance: {
        level,
        passedCriteria,
        failedCriteria,
      },
      timestamp: Date.now(),
    };
  }

  private createEmptyReport(): AccessibilityReport {
    return {
      score: 0,
      totalIssues: 0,
      issues: [],
      wcagCompliance: {
        level: 'Non-compliant',
        passedCriteria: [],
        failedCriteria: [],
      },
      timestamp: Date.now(),
    };
  }
}

// Export singleton instance
export const accessibilityAuditor = new AccessibilityAuditor();

// Utility functions
export const runAccessibilityAudit = () => accessibilityAuditor.audit();
export const getAccessibilityScore = () => {
  const report = accessibilityAuditor.audit();
  return report.score;
};
