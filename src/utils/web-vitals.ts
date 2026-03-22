// Real-time Core Web Vitals monitoring
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

export interface WebVitalsMetrics {
  cls: number; // Cumulative Layout Shift
  inp: number; // Interaction to Next Paint (replaces FID)
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  ttfb: number; // Time to First Byte
  timestamp: number;
}

export interface PerformanceReport {
  url: string;
  userAgent: string;
  metrics: WebVitalsMetrics;
  deviceInfo: {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    connectionType?: string;
    effectiveConnectionType?: string;
  };
  timestamp: number;
}

class WebVitalsMonitor {
  private metrics: Partial<WebVitalsMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private reportCallback?: (report: PerformanceReport) => void;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();

    // Monitor additional performance metrics
    this.monitorAdditionalMetrics();

    // Monitor resource loading
    this.monitorResourceLoading();
  }

  private monitorCoreWebVitals() {
    // Cumulative Layout Shift
    onCLS(metric => {
      this.metrics.cls = metric.value;
      this.checkAndReport();
    });

    // Interaction to Next Paint (replaces First Input Delay)
    onINP(metric => {
      this.metrics.inp = metric.value;
      this.checkAndReport();
    });

    // First Contentful Paint
    onFCP(metric => {
      this.metrics.fcp = metric.value;
      this.checkAndReport();
    });

    // Largest Contentful Paint
    onLCP(metric => {
      this.metrics.lcp = metric.value;
      this.checkAndReport();
    });

    // Time to First Byte
    onTTFB(metric => {
      this.metrics.ttfb = metric.value;
      this.checkAndReport();
    });
  }

  private monitorAdditionalMetrics() {
    // Monitor Long Tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
            });
          }
        }
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    }

    // Monitor Navigation Timing
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType(
        'navigation'
      ) as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0];
        console.info('Navigation Timing:', {
          domContentLoaded:
            navEntry.domContentLoadedEventEnd -
            navEntry.domContentLoadedEventStart,
          loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
          dnsLookup: navEntry.domainLookupEnd - navEntry.domainLookupStart,
          tcpConnection: navEntry.connectEnd - navEntry.connectStart,
          serverResponse: navEntry.responseEnd - navEntry.requestStart,
        });
      }
    }
  }

  private monitorResourceLoading() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver(list => {
        const resources = list.getEntries();
        const slowResources = resources.filter(entry => entry.duration > 1000);

        if (slowResources.length > 0) {
          console.warn(
            'Slow resources detected:',
            slowResources.map(resource => ({
              name: resource.name,
              duration: resource.duration,
              size: (resource as PerformanceResourceTiming).transferSize,
            }))
          );
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    }
  }

  private checkAndReport() {
    // Check if all metrics are collected
    if (
      this.metrics.cls !== undefined &&
      this.metrics.inp !== undefined &&
      this.metrics.fcp !== undefined &&
      this.metrics.lcp !== undefined &&
      this.metrics.ttfb !== undefined
    ) {
      this.generateReport();
    }
  }

  private generateReport() {
    if (typeof window === 'undefined') return;

    const report: PerformanceReport = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: {
        cls: this.metrics.cls!,
        inp: this.metrics.inp!,
        fcp: this.metrics.fcp!,
        lcp: this.metrics.lcp!,
        ttfb: this.metrics.ttfb!,
        timestamp: Date.now(),
      },
      deviceInfo: this.getDeviceInfo(),
      timestamp: Date.now(),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Core Web Vitals Report');
      console.table(report.metrics);
      console.log('Device Info:', report.deviceInfo);
      console.groupEnd();
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(report);
    }

    // Call custom callback if provided
    if (this.reportCallback) {
      this.reportCallback(report);
    }
  }

  private getDeviceInfo() {
    const connection =
      (
        navigator as unknown as {
          connection?: { type?: string; effectiveType?: string };
        }
      ).connection || {};

    return {
      isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ),
      isTablet:
        /iPad|Android/i.test(navigator.userAgent) && window.innerWidth > 768,
      isDesktop:
        !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ),
      connectionType: connection.type,
      effectiveConnectionType: connection.effectiveType,
    };
  }

  private async sendToAnalytics(report: PerformanceReport) {
    try {
      // Send to your analytics service
      await fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });
    } catch (error) {
      console.error('Failed to send web vitals to analytics:', error);
    }
  }

  public onReport(callback: (report: PerformanceReport) => void) {
    this.reportCallback = callback;
  }

  public getMetrics(): Partial<WebVitalsMetrics> {
    return { ...this.metrics };
  }

  public getPerformanceScore(): number {
    const metrics = this.metrics;
    if (
      !metrics.cls ||
      !metrics.inp ||
      !metrics.fcp ||
      !metrics.lcp ||
      !metrics.ttfb
    ) {
      return 0;
    }

    let score = 100;

    // CLS scoring (0.1 is good)
    if (metrics.cls > 0.25) score -= 25;
    else if (metrics.cls > 0.1) score -= 10;

    // INP scoring (200ms is good, replaces FID)
    if (metrics.inp > 500) score -= 25;
    else if (metrics.inp > 200) score -= 10;

    // FCP scoring (1.8s is good)
    if (metrics.fcp > 3000) score -= 25;
    else if (metrics.fcp > 1800) score -= 10;

    // LCP scoring (2.5s is good)
    if (metrics.lcp > 4000) score -= 25;
    else if (metrics.lcp > 2500) score -= 10;

    // TTFB scoring (800ms is good)
    if (metrics.ttfb > 1800) score -= 25;
    else if (metrics.ttfb > 800) score -= 10;

    return Math.max(0, score);
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const webVitalsMonitor = new WebVitalsMonitor();

// Export utility functions
export const getPerformanceMetrics = () => webVitalsMonitor.getMetrics();
export const getPerformanceScore = () => webVitalsMonitor.getPerformanceScore();
export const onPerformanceReport = (
  callback: (report: PerformanceReport) => void
) => {
  webVitalsMonitor.onReport(callback);
};
