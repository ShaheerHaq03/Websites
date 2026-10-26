import { site } from '../config/site';
export type AnalyticsEvent =
  | 'calculator_viewed'
  | 'calculator_used'
  | 'validation_failed'
  | 'result_copied'
  | 'related_tool_opened';
// This abstraction deliberately sends no network requests. A consent-aware provider
// may subscribe to these local events after the owner supplies real configuration.
export function track(event: AnalyticsEvent, slug: string) {
  if (typeof window === 'undefined' || !site.analytics.provider || !site.analytics.id) return;
  window.dispatchEvent(new CustomEvent('student-hub:analytics', { detail: { event, slug } }));
}
