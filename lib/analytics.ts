type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsProps = Record<string, AnalyticsValue>;

type AnalyticsWindow = Window & {
  gtag?: (command: "event", eventName: string, params?: AnalyticsProps) => void;
  plausible?: (eventName: string, options?: { props?: Record<string, string> }) => void;
  clarity?: (command: "event", value: string) => void;
};

function toPlausibleProps(params: AnalyticsProps): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }
    mapped[key] = String(value);
  }
  return mapped;
}

export function trackEvent(eventName: string, params: AnalyticsProps = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.gtag?.("event", eventName, params);

  const plausibleProps = toPlausibleProps(params);
  analyticsWindow.plausible?.(
    eventName,
    Object.keys(plausibleProps).length > 0 ? { props: plausibleProps } : undefined
  );

  analyticsWindow.clarity?.("event", eventName);
}
