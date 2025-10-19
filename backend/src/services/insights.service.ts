/**
 * StratOS Platform - Application Insights Service
 * 
 * Provides comprehensive telemetry, logging, and monitoring
 * with distributed tracing and custom metrics.
 */

import { trace, context, SpanStatusCode, Span } from '@opentelemetry/api';

export interface EventProperties {
  [key: string]: string | number | boolean;
}

export interface MetricProperties {
  count?: number;
  sum?: number;
  min?: number;
  max?: number;
  stdDev?: number;
}

export class AppInsightsService {
  private static instance: AppInsightsService;
  private tracer: any;
  private enabled: boolean;

  private constructor() {
    this.enabled = process.env.ENABLE_TELEMETRY === 'true';
    
    if (this.enabled) {
      this.tracer = trace.getTracer('stratos-platform');
    }
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AppInsightsService {
    if (!AppInsightsService.instance) {
      AppInsightsService.instance = new AppInsightsService();
    }
    return AppInsightsService.instance;
  }

  /**
   * Track a custom event
   * 
   * @param name - Event name
   * @param properties - Custom properties
   * @param metrics - Custom metrics
   */
  trackEvent(
    name: string,
    properties?: EventProperties,
    metrics?: Record<string, number>
  ): void {
    if (!this.enabled) return;

    try {
      const span = this.tracer?.startSpan(name);
      
      if (span) {
        // Add properties as attributes
        if (properties) {
          Object.entries(properties).forEach(([key, value]) => {
            span.setAttribute(key, value);
          });
        }

        // Add metrics as attributes
        if (metrics) {
          Object.entries(metrics).forEach(([key, value]) => {
            span.setAttribute(`metric.${key}`, value);
          });
        }

        span.end();
      }

      console.log(`[Event] ${name}`, { properties, metrics });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  /**
   * Track a custom metric
   * 
   * @param name - Metric name
   * @param value - Metric value
   * @param properties - Additional properties
   */
  trackMetric(
    name: string,
    value: number,
    properties?: EventProperties
  ): void {
    if (!this.enabled) return;

    try {
      const span = this.tracer?.startSpan(`metric:${name}`);
      
      if (span) {
        span.setAttribute('value', value);
        
        if (properties) {
          Object.entries(properties).forEach(([key, val]) => {
            span.setAttribute(key, val);
          });
        }

        span.end();
      }

      console.log(`[Metric] ${name}: ${value}`, properties);
    } catch (error) {
      console.error('Failed to track metric:', error);
    }
  }

  /**
   * Track an exception
   * 
   * @param error - Error object
   * @param properties - Additional properties
   * @param severity - Severity level
   */
  trackException(
    error: Error,
    properties?: EventProperties,
    severity: 'critical' | 'error' | 'warning' | 'info' = 'error'
  ): void {
    if (!this.enabled) {
      console.error(`[Exception] ${error.message}`, error.stack, properties);
      return;
    }

    try {
      const span = this.tracer?.startSpan('exception');
      
      if (span) {
        span.setAttribute('error.type', error.name);
        span.setAttribute('error.message', error.message);
        span.setAttribute('error.stack', error.stack || '');
        span.setAttribute('severity', severity);
        
        if (properties) {
          Object.entries(properties).forEach(([key, value]) => {
            span.setAttribute(key, value);
          });
        }

        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        span.recordException(error);
        span.end();
      }

      console.error(`[Exception] ${error.message}`, error.stack, properties);
    } catch (err) {
      console.error('Failed to track exception:', err);
    }
  }

  /**
   * Track an HTTP request
   * 
   * @param name - Request name
   * @param url - Request URL
   * @param duration - Duration in milliseconds
   * @param resultCode - HTTP status code
   * @param success - Success boolean
   * @param properties - Additional properties
   */
  trackRequest(
    name: string,
    url: string,
    duration: number,
    resultCode: number,
    success: boolean,
    properties?: EventProperties
  ): void {
    if (!this.enabled) return;

    try {
      const span = this.tracer?.startSpan(name);
      
      if (span) {
        span.setAttribute('http.url', url);
        span.setAttribute('http.status_code', resultCode);
        span.setAttribute('http.duration_ms', duration);
        span.setAttribute('success', success);
        
        if (properties) {
          Object.entries(properties).forEach(([key, value]) => {
            span.setAttribute(key, value);
          });
        }

        span.setStatus({
          code: success ? SpanStatusCode.OK : SpanStatusCode.ERROR,
        });
        
        span.end();
      }

      console.log(`[Request] ${name} ${url} - ${resultCode} (${duration}ms)`, properties);
    } catch (error) {
      console.error('Failed to track request:', error);
    }
  }

  /**
   * Track a dependency call (external service)
   * 
   * @param name - Dependency name
   * @param type - Type (HTTP, Azure, Database, etc.)
   * @param target - Target service
   * @param duration - Duration in milliseconds
   * @param success - Success boolean
   * @param resultCode - Result code
   * @param properties - Additional properties
   */
  trackDependency(
    name: string,
    type: string,
    target: string,
    duration: number,
    success: boolean,
    resultCode?: string | number,
    properties?: EventProperties
  ): void {
    if (!this.enabled) return;

    try {
      const span = this.tracer?.startSpan(`dependency:${name}`);
      
      if (span) {
        span.setAttribute('dependency.type', type);
        span.setAttribute('dependency.target', target);
        span.setAttribute('dependency.duration_ms', duration);
        span.setAttribute('dependency.success', success);
        
        if (resultCode !== undefined) {
          span.setAttribute('dependency.result_code', resultCode.toString());
        }
        
        if (properties) {
          Object.entries(properties).forEach(([key, value]) => {
            span.setAttribute(key, value);
          });
        }

        span.setStatus({
          code: success ? SpanStatusCode.OK : SpanStatusCode.ERROR,
        });
        
        span.end();
      }

      console.log(
        `[Dependency] ${type}:${name} -> ${target} (${duration}ms) ${success ? '✓' : '✗'}`,
        properties
      );
    } catch (error) {
      console.error('Failed to track dependency:', error);
    }
  }

  /**
   * Start an operation for distributed tracing
   * 
   * @param name - Operation name
   * @param properties - Operation properties
   * @returns Operation object with end() method
   */
  startOperation(
    name: string,
    properties?: EventProperties
  ): { end: (success?: boolean) => void; span: Span | null } {
    if (!this.enabled) {
      return {
        span: null,
        end: () => {},
      };
    }

    try {
      const span = this.tracer?.startSpan(name);
      const startTime = Date.now();
      
      if (span && properties) {
        Object.entries(properties).forEach(([key, value]) => {
          span.setAttribute(key, value);
        });
      }

      return {
        span,
        end: (success: boolean = true) => {
          if (span) {
            const duration = Date.now() - startTime;
            span.setAttribute('duration_ms', duration);
            span.setAttribute('success', success);
            span.setStatus({
              code: success ? SpanStatusCode.OK : SpanStatusCode.ERROR,
            });
            span.end();
          }
        },
      };
    } catch (error) {
      console.error('Failed to start operation:', error);
      return {
        span: null,
        end: () => {},
      };
    }
  }

  /**
   * Track agent execution metrics
   * 
   * @param agentName - Name of the agent
   * @param duration - Execution duration
   * @param tokensUsed - Tokens consumed
   * @param success - Success status
   * @param properties - Additional properties
   */
  trackAgentExecution(
    agentName: string,
    duration: number,
    tokensUsed: number,
    success: boolean,
    properties?: EventProperties
  ): void {
    this.trackEvent('AgentExecution', {
      agentName,
      duration,
      tokensUsed,
      success,
      ...properties,
    });

    this.trackMetric('AgentDuration', duration, { agentName });
    this.trackMetric('TokensUsed', tokensUsed, { agentName });
  }

  /**
   * Track user activity
   * 
   * @param action - User action
   * @param userId - User ID
   * @param tenantId - Tenant ID
   * @param properties - Additional properties
   */
  trackUserActivity(
    action: string,
    userId: string,
    tenantId: string,
    properties?: EventProperties
  ): void {
    this.trackEvent('UserActivity', {
      action,
      userId,
      tenantId,
      ...properties,
    });
  }

  /**
   * Track API usage for quota management
   * 
   * @param tenantId - Tenant ID
   * @param endpoint - API endpoint
   * @param tokensUsed - Tokens consumed
   */
  trackApiUsage(tenantId: string, endpoint: string, tokensUsed: number): void {
    this.trackEvent('ApiUsage', {
      tenantId,
      endpoint,
      tokensUsed,
      timestamp: new Date().toISOString(),
    });

    this.trackMetric('ApiCalls', 1, { tenantId, endpoint });
    this.trackMetric('TokensConsumed', tokensUsed, { tenantId });
  }

  /**
   * Track performance metrics
   * 
   * @param operation - Operation name
   * @param duration - Duration in milliseconds
   * @param properties - Additional properties
   */
  trackPerformance(
    operation: string,
    duration: number,
    properties?: EventProperties
  ): void {
    this.trackMetric(`Performance.${operation}`, duration, properties);

    // Log warning if operation is slow
    if (duration > 5000) {
      console.warn(`Slow operation detected: ${operation} took ${duration}ms`, properties);
    }
  }
}

// Export singleton instance
export const insights = AppInsightsService.getInstance();

