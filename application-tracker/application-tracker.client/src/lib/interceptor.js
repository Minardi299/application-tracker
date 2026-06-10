/**
 * Thin fetch wrapper that always sends cookies.
 * BetterAuth manages sessions automatically; 401s mean the session is gone
 * and the caller should redirect to login (handled by route guards / nav-user).
 */
export async function fetchWithAuth(input, init = {}) {
  return fetch(input, { ...init, credentials: 'include' });
}
