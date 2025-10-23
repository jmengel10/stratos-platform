// Production monitoring and error tracking
export class MonitoringService {
  private static instance: MonitoringService;
  private appInsights: any = null;

  private constructor() {
    this.initializeAppInsights();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private initializeAppInsights() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      try {
        // Initialize Application Insights
        const appInsights = require('@microsoft/applicationinsights-web');
        const { ApplicationInsights } = appInsights;
        
        this.appInsights = new ApplicationInsights({
          config: {
            connectionString: process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING,
            enableAutoRouteTracking: true,
            enableCorsCorrelation: true,
            enableRequestHeaderTracking: true,
            enableResponseHeaderTracking: true,
            enableAjaxErrorTracking: true,
            enableUnhandledPromiseRejectionTracking: true,
            autoTrackPageVisitTime: true,
            enableSessionStorageBuffer: true,
            isRetryDisabled: false,
            maxBatchSizeInBytes: 100000,
            maxBatchInterval: 15000,
            disableTelemetry: false,
            enableDebug: false,
            enableAjaxPerfTracking: true,
            enablePerfMgr: true,
            enablePerfCounterCollection: true
          }
        });
        
        this.appInsights.loadAppInsights();
        this.appInsights.trackPageView();
      } catch (error) {
        console.warn('Failed to initialize Application Insights:', error);
      }
    }
  }

  public trackEvent(eventName: string, properties?: Record<string, any>) {
    if (this.appInsights) {
      this.appInsights.trackEvent({ name: eventName }, properties);
    }
    console.log(`Event tracked: ${eventName}`, properties);
  }

  public trackException(error: Error, properties?: Record<string, any>) {
    if (this.appInsights) {
      this.appInsights.trackException({ exception: error }, properties);
    }
    console.error('Exception tracked:', error, properties);
  }

  public trackPageView(pageName?: string, url?: string) {
    if (this.appInsights) {
      this.appInsights.trackPageView({ name: pageName, uri: url });
    }
    console.log(`Page view tracked: ${pageName || url}`);
  }

  public trackMetric(metricName: string, value: number, properties?: Record<string, any>) {
    if (this.appInsights) {
      this.appInsights.trackMetric({ name: metricName, average: value }, properties);
    }
    console.log(`Metric tracked: ${metricName} = ${value}`, properties);
  }

  public trackDependency(name: string, commandName: string, duration: number, success: boolean, properties?: Record<string, any>) {
    if (this.appInsights) {
      this.appInsights.trackDependencyData({
        name,
        commandName,
        duration,
        success,
        data: properties
      });
    }
    console.log(`Dependency tracked: ${name} (${commandName}) - ${duration}ms - ${success ? 'success' : 'failed'}`);
  }

  public setUserContext(userId: string, accountId?: string, sessionId?: string) {
    if (this.appInsights) {
      this.appInsights.setAuthenticatedUserContext(userId, accountId, sessionId);
    }
    console.log(`User context set: ${userId}`);
  }

  public clearUserContext() {
    if (this.appInsights) {
      this.appInsights.clearAuthenticatedUserContext();
    }
    console.log('User context cleared');
  }
}

// Global error handler
export function setupGlobalErrorHandling() {
  if (typeof window !== 'undefined') {
    const monitoring = MonitoringService.getInstance();

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      monitoring.trackException(new Error(event.reason), {
        type: 'unhandledPromiseRejection',
        reason: event.reason
      });
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      monitoring.trackException(new Error(event.message), {
        type: 'globalError',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
  }
}

// Performance monitoring
export function trackPerformance() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const monitoring = MonitoringService.getInstance();
    
    // Track page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      monitoring.trackMetric('pageLoadTime', navigation.loadEventEnd - navigation.loadEventStart);
      monitoring.trackMetric('domContentLoaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
      monitoring.trackMetric('firstPaint', navigation.loadEventEnd - navigation.fetchStart);
    });

    // Track Core Web Vitals
    if ('web-vital' in window) {
      // This would require the web-vitals library
      // getCLS, getFID, getFCP, getLCP, getTTFB
    }
  }
}

export default MonitoringService;

