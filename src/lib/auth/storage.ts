import type { User } from '@/lib/types';

// Only the non-secret display identity (id + email) is stored, so the UI
// can show who is signed in after a reload. Tokens live in httpOnly
// cookies and never touch JS. Remove this once the backend has a
// GET /auth/me that returns the user.
const STORAGE_KEY = 'careerforge:user';

export function loadStoredUser(): User | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as User).id === 'string' &&
      typeof (parsed as User).email === 'string'
    ) {
      return { id: (parsed as User).id, email: (parsed as User).email };
    }
  } catch {
    // Corrupt value or storage unavailable — behave as if nothing is stored.
  }

  return null;
}

export function saveStoredUser(user: User): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Private mode / quota — the app works fine without persistence.
  }
}

export function clearStoredUser(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
