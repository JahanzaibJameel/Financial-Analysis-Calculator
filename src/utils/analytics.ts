// Advanced Analytics and Production Monitoring
import { Analytics } from '@vercel/analytics/react';
import { PerformanceReport } from './web-vitals';

export interface UserEvent {
  type:
    | 'page_view'
    | 'click'
    | 'form_submit'
    | 'calculation'
    | 'chat_message'
    | 'theme_change'
    | 'language_change';
  category: string;
  action: string;
  label?: string;
  value?: number;
  sessionId: string;
  timestamp: number;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface PerformanceEvent {
  type: 'web_vitals' | 'bundle_size' | 'api_response' | 'error';
  metrics:
    | PerformanceReport
    | { size: number; time: number; status: number }
    | { error: string; stack: string };
  timestamp: number;
  userAgent: string;
  url: string;
}

export interface AnalyticsSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: number;
  events: UserEvent[];
  performanceEvents: PerformanceEvent[];
  userAgent: string;
  referrer?: string;
  landingPage: string;
  exitPage?: string;
  deviceInfo: {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    browser: string;
    os: string;
    screenResolution: string;
  };
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
}

class AdvancedAnalytics {
  private sessionId: string;
  private events: UserEvent[] = [];
  private performanceEvents: PerformanceEvent[] = [];
  private startTime: number;
  private pageViews: number = 0;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.init();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Track page view
    this.trackPageView();

    // Track performance metrics
    this.trackPerformance();

    // Track errors
    this.trackErrors();

    // Track user engagement
    this.trackEngagement();

    // Send session data on page unload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  private trackPageView() {
    this.pageViews++;

    this.trackEvent({
      type: 'page_view',
      category: 'navigation',
      action: 'page_view',
      label: window.location.pathname,
      metadata: {
        title: document.title,
        referrer: document.referrer,
      },
    });
  }

  private trackPerformance() {
    // Track Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      import('./web-vitals').then(({ onPerformanceReport }) => {
        onPerformanceReport((report: PerformanceReport) => {
          this.performanceEvents.push({
            type: 'web_vitals',
            metrics: report,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href,
          });
        });
      });
    }

    // Track bundle size (in development)
    if (process.env.NODE_ENV === 'development' && 'performance' in window) {
      setTimeout(() => {
        const resources = performance.getEntriesByType(
          'resource'
        ) as PerformanceResourceTiming[];
        const jsResources = resources.filter(r => r.name.endsWith('.js'));
        const totalSize = jsResources.reduce(
          (sum, r) => sum + (r.transferSize || 0),
          0
        );

        this.performanceEvents.push({
          type: 'bundle_size',
          metrics: {
            size: totalSize,
            time: Date.now() - this.startTime,
            status: 200,
          },
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        });
      }, 5000);
    }
  }

  private trackErrors() {
    window.addEventListener('error', event => {
      this.performanceEvents.push({
        type: 'error',
        metrics: {
          error: event.message,
          stack: event.error?.stack || '',
        },
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    });

    window.addEventListener('unhandledrejection', event => {
      this.performanceEvents.push({
        type: 'error',
        metrics: {
          error: 'Unhandled Promise Rejection',
          stack: event.reason?.stack || String(event.reason),
        },
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    });
  }

  private trackEngagement() {
    // Track user activity
    let lastActivity = Date.now();
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    // Check for session timeout every 30 seconds
    setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime > 30 * 60 * 1000) {
        // 30 minutes
        this.endSession();
      }
    }, 30000);
  }

  public trackEvent(event: Omit<UserEvent, 'sessionId' | 'timestamp'>) {
    const fullEvent: UserEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    this.events.push(fullEvent);

    // Send to analytics service
    this.sendEvent(fullEvent);
  }

  public trackCalculation(
    principal: number,
    rate: number,
    years: number,
    result: number
  ) {
    this.trackEvent({
      type: 'calculation',
      category: 'calculator',
      action: 'compound_interest',
      value: result,
      metadata: {
        principal,
        rate,
        years,
        result,
      },
    });
  }

  public trackChatMessage(message: string, isUser: boolean) {
    this.trackEvent({
      type: 'chat_message',
      category: 'chatbot',
      action: isUser ? 'user_message' : 'bot_response',
      label: message.substring(0, 50),
      metadata: {
        messageLength: message.length,
        isUser,
      },
    });
  }

  public trackThemeChange(theme: string) {
    this.trackEvent({
      type: 'theme_change',
      category: 'ui',
      action: 'theme_change',
      label: theme,
    });
  }

  public trackLanguageChange(language: string) {
    this.trackEvent({
      type: 'language_change',
      category: 'ui',
      action: 'language_change',
      label: language,
    });
  }

  private async sendEvent(event: UserEvent) {
    if (process.env.NODE_ENV === 'production') {
      try {
        await fetch('/api/analytics/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        });
      } catch (error) {
        console.error('Failed to send analytics event:', error);
      }
    }
  }

  private async endSession() {
    const session: AnalyticsSession = {
      sessionId: this.sessionId,
      startTime: this.startTime,
      endTime: Date.now(),
      duration: Date.now() - this.startTime,
      pageViews: this.pageViews,
      events: this.events,
      performanceEvents: this.performanceEvents,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      landingPage: window.location.pathname,
      exitPage: window.location.pathname,
      deviceInfo: this.getDeviceInfo(),
      location: this.getLocation(),
    };

    if (process.env.NODE_ENV === 'production') {
      try {
        await fetch('/api/analytics/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(session),
        });
      } catch (error) {
        console.error('Failed to send session data:', error);
      }
    }
  }

  private getDeviceInfo() {
    const ua = navigator.userAgent;

    return {
      isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          ua
        ),
      isTablet: /iPad|Android/i.test(ua) && window.innerWidth > 768,
      isDesktop:
        !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          ua
        ),
      browser: this.getBrowser(),
      os: this.getOS(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    };
  }

  private getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getLocation() {
    // This would typically use a geolocation service
    // For now, return timezone
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getEventCount(): number {
    return this.events.length;
  }

  public getSessionDuration(): number {
    return Date.now() - this.startTime;
  }
}

// Singleton instance
export const analytics = new AdvancedAnalytics();

// Export Analytics component for Vercel
export { Analytics };

// Utility functions
export const trackEvent = (
  event: Omit<UserEvent, 'sessionId' | 'timestamp'>
) => {
  analytics.trackEvent(event);
};

export const trackCalculation = (
  principal: number,
  rate: number,
  years: number,
  result: number
) => {
  analytics.trackCalculation(principal, rate, years, result);
};

export const trackChatMessage = (message: string, isUser: boolean) => {
  analytics.trackChatMessage(message, isUser);
};

export const trackThemeChange = (theme: string) => {
  analytics.trackThemeChange(theme);
};

export const trackLanguageChange = (language: string) => {
  analytics.trackLanguageChange(language);
};
