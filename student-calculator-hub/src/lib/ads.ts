import { site } from '../config/site';
export interface AdEligibility {
  adRequestsAllowed: boolean;
}
let loading: Promise<void> | undefined;
/** Call only from the real CMP adapter after its complete eligibility decision.
 * No CMP is simulated here; no caller is installed in the default application.
 * Do not equate this decision to merely closing a banner or accepting a boolean.
 */
export async function activateEligibleAds(decision: AdEligibility): Promise<void> {
  if (
    typeof window === 'undefined' ||
    !decision.adRequestsAllowed ||
    !site.ads.enabled ||
    !/^ca-pub-\d{16}$/.test(site.ads.publisher) ||
    !/^\d+$/.test(site.ads.slot)
  )
    return;
  const slots = [...document.querySelectorAll<HTMLElement>('[data-ad-slot]:not([data-active])')];
  if (!slots.length) return;
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(site.ads.publisher)}`;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = undefined;
      script.remove();
      reject(new Error('Ad provider could not load.'));
    };
    document.head.append(script);
  });
  await loading;
  for (const slot of slots) {
    if (slot.dataset.active) continue;
    slot.dataset.active = 'true';
    slot.hidden = false;
    slot.style.minHeight = '280px';
    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'block';
    ad.dataset.adClient = site.ads.publisher;
    ad.dataset.adSlot = site.ads.slot;
    ad.dataset.adFormat = 'auto';
    ad.dataset.fullWidthResponsive = 'true';
    slot.append(ad);
    const host = window as Window & { adsbygoogle?: Record<string, never>[] };
    (host.adsbygoogle ??= []).push({});
  }
}
