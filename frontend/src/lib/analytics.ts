/**
 * Analytics Service
 * 
 * Comprehensive analytics tracking for user behavior, feature usage, and errors
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: string;
}

class AnalyticsService {
  private enabled: boolean;
  private userId: string | null = null;

  constructor() {
    // Enable analytics in production only
    this.enabled = process.env.NODE_ENV === 'production';
  }

  /**
   * Initialize analytics with user ID
   */
  initialize(userId: string): void {
    this.userId = userId;
    
    if (!this.enabled) {
      console.log('[Analytics] Initialized in development mode for user:', userId);
      return;
    }

    // Initialize third-party analytics if available
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.identify(userId);
    }

    console.log('[Analytics] Initialized for user:', userId);
  }

  /**
   * Track a custom event
   */
  track(event: string, properties?: Record<string, any>): void {
    if (!this.enabled) {
      console.log('[Analytics]', event, properties);
      return;
    }

    const eventData: AnalyticsEvent = {
      name: event,
      properties: {
        ...properties,
        platform: 'web',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        screen: typeof window !== 'undefined' ? {
          width: window.innerWidth,
          height: window.innerHeight
        } : undefined
      },
      userId: this.userId || undefined,
      timestamp: new Date().toISOString()
    };

    this.sendEvent(eventData);
  }

  /**
   * Track a page view
   */
  page(pageName: string, properties?: Record<string, any>): void {
    this.track('Page Viewed', {
      page: pageName,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      ...properties
    });
  }

  /**
   * Identify a user with traits
   */
  identify(userId: string, traits?: Record<string, any>): void {
    this.userId = userId;

    if (!this.enabled) {
      console.log('[Analytics] Identify:', userId, traits);
      return;
    }

    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.identify(userId, traits);
    }

    // Send to Application Insights if available
    if (typeof window !== 'undefined' && (window as any).appInsights) {
      (window as any).appInsights.setAuthenticatedUserContext(userId);
    }
  }

  /**
   * Send event to analytics service
   */
  private sendEvent(event: AnalyticsEvent): void {
    // Send to Segment/Analytics.js
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track(event.name, event.properties);
    }

    // Send to Application Insights
    if (typeof window !== 'undefined' && (window as any).appInsights) {
      (window as any).appInsights.trackEvent({
        name: event.name,
        properties: event.properties
      });
    }

    // Send to custom analytics endpoint if needed
    if (typeof window !== 'undefined' && this.enabled) {
      try {
        navigator.sendBeacon('/api/analytics', JSON.stringify(event));
      } catch (error) {
        console.error('[Analytics] Failed to send event:', error);
      }
    }
  }

  // ===== Specific Event Tracking Methods =====

  /**
   * Track when an agent is selected
   */
  trackAgentSelected(agentName: string): void {
    this.track('Agent Selected', {
      agentName,
      category: 'Console'
    });
  }

  /**
   * Track when a message is sent
   */
  trackMessageSent(agentName: string, messageLength: number): void {
    this.track('Message Sent', {
      agentName,
      messageLength,
      category: 'Console'
    });
  }

  /**
   * Track when a file is uploaded
   */
  trackFileUploaded(fileType: string, fileSize: number): void {
    this.track('File Uploaded', {
      fileType,
      fileSizeKB: Math.round(fileSize / 1024),
      category: 'Data Analysis'
    });
  }

  /**
   * Track when an export is generated
   */
  trackExportGenerated(exportType: string): void {
    this.track('Export Generated', {
      exportType,
      category: 'Exports'
    });
  }

  /**
   * Track errors
   */
  trackError(error: Error, context?: string): void {
    this.track('Error Occurred', {
      errorMessage: error.message,
      errorStack: error.stack,
      context,
      category: 'Errors'
    });

    // Also send to Application Insights
    if (typeof window !== 'undefined' && (window as any).appInsights) {
      (window as any).appInsights.trackException({
        exception: error,
        properties: { context }
      });
    }
  }

  /**
   * Track feature usage
   */
  trackFeatureUsed(feature: string, details?: Record<string, any>): void {
    this.track('Feature Used', {
      feature,
      ...details,
      category: 'Features'
    });
  }

  /**
   * Track conversation created
   */
  trackConversationCreated(): void {
    this.track('Conversation Created', {
      category: 'Console'
    });
  }

  /**
   * Track conversation deleted
   */
  trackConversationDeleted(conversationId: string): void {
    this.track('Conversation Deleted', {
      conversationId,
      category: 'Console'
    });
  }

  /**
   * Track regenerate message
   */
  trackMessageRegenerated(agentName: string): void {
    this.track('Message Regenerated', {
      agentName,
      category: 'Console'
    });
  }

  /**
   * Track feedback given
   */
  trackFeedbackGiven(messageId: string, feedbackType: 'positive' | 'negative'): void {
    this.track('Feedback Given', {
      messageId,
      feedbackType,
      category: 'Console'
    });
  }

  /**
   * Track suggestion clicked
   */
  trackSuggestionClicked(suggestion: string, agentName: string): void {
    this.track('Suggestion Clicked', {
      suggestion,
      agentName,
      category: 'Console'
    });
  }

  /**
   * Track user signup
   */
  trackSignup(method: string): void {
    this.track('User Signed Up', {
      method,
      category: 'Authentication'
    });
  }

  /**
   * Track user login
   */
  trackLogin(method: string): void {
    this.track('User Logged In', {
      method,
      category: 'Authentication'
    });
  }

  /**
   * Track user logout
   */
  trackLogout(): void {
    this.track('User Logged Out', {
      category: 'Authentication'
    });
  }

  /**
   * Track settings changed
   */
  trackSettingsChanged(setting: string, newValue: any): void {
    this.track('Settings Changed', {
      setting,
      newValue,
      category: 'Settings'
    });
  }

  /**
   * Track upgrade plan clicked
   */
  trackUpgradePlanClicked(currentPlan: string, targetPlan?: string): void {
    this.track('Upgrade Plan Clicked', {
      currentPlan,
      targetPlan,
      category: 'Billing'
    });
  }

  /**
   * Track team member invited
   */
  trackTeamMemberInvited(role: string): void {
    this.track('Team Member Invited', {
      role,
      category: 'Team'
    });
  }

  /**
   * Track search performed
   */
  trackSearch(query: string, resultsCount: number): void {
    this.track('Search Performed', {
      query: query.substring(0, 100), // Limit query length for privacy
      resultsCount,
      category: 'Search'
    });
  }

  /**
   * Track time spent on page
   */
  trackTimeOnPage(pageName: string, durationSeconds: number): void {
    this.track('Time On Page', {
      pageName,
      durationSeconds,
      category: 'Engagement'
    });
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Convenient method to initialize on app load
export function initializeAnalytics(userId?: string): void {
  if (userId) {
    analytics.initialize(userId);
  }
}

// Type definitions for window analytics
declare global {
  interface Window {
    analytics?: {
      track: (event: string, properties?: Record<string, any>) => void;
      identify: (userId: string, traits?: Record<string, any>) => void;
      page: (pageName?: string) => void;
    };
    appInsights?: {
      trackEvent: (event: { name: string; properties?: Record<string, any> }) => void;
      trackException: (error: { exception: Error; properties?: Record<string, any> }) => void;
      setAuthenticatedUserContext: (userId: string) => void;
    };
  }
}

