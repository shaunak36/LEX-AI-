/**
 * Analytics Tracking Utility
 * 
 * Provides stub methods for tracking events and pageviews.
 * When ready, simply drop the Google Analytics or PostHog script 
 * in index.html and update these functions to call window.gtag() or posthog.capture()
 */

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  // In production, uncomment the below line if using GA:
  // if (typeof window !== 'undefined' && (window as any).gtag) {
  //   (window as any).gtag('event', eventName, eventParams);
  // }
  
  console.log(`[Analytics Track] Event: ${eventName}`, eventParams || '');
};

export const trackPageview = (pageUrl: string) => {
  // In production, uncomment the below line if using GA:
  // if (typeof window !== 'undefined' && (window as any).gtag) {
  //   (window as any).gtag('config', 'GA_MEASUREMENT_ID', { page_path: pageUrl });
  // }
  
  console.log(`[Analytics Pageview] URL: ${pageUrl}`);
};
