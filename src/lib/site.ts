export const SITE_URL = "https://www.ntgesports.com";

export const SITE_NAME = "NTG Lounge";

export const SITE_TITLE = "NTG Lounge - Namma Tulunad Gaming";

export const SITE_DESCRIPTION =
  "Mangaluru's premier esports lounge. Ryzen 5 7600X, RTX 5060, 300Hz. Home to VAL CUP, CS CUP and AUC CUP tournaments.";

/** First valid absolute URL from env, else production default. */
export function resolveSiteUrl(): string {
  for (const value of [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.AUTH_URL,
    SITE_URL,
  ]) {
    const trimmed = value?.trim();
    if (!trimmed) continue;
    try {
      return new URL(trimmed).toString().replace(/\/$/, "");
    } catch {
      // ignore invalid env values
    }
  }
  return SITE_URL;
}
