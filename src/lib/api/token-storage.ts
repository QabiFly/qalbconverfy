const ACCESS_TOKEN_KEY = "qalbconverfy_access_token";
const REFRESH_TOKEN_KEY = "qalbconverfy_refresh_token";

/**
 * Isolated localStorage access — SSR-guarded. Single point of change
 * if storage strategy ever moves to httpOnly cookies via a Next.js
 * route-handler proxy. Known tradeoff: readable by any script on the
 * page (standard SPA-JWT tradeoff) — sanitize all rendered
 * user-generated content to mitigate XSS exposure of these tokens.
 */
export const tokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setTokens(access: string, refresh: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, access);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  setAccessToken(access: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, access);
  },
  clearTokens(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  hasTokens(): boolean {
    return Boolean(this.getAccessToken() && this.getRefreshToken());
  },
};