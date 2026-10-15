/**
 * Tiny localStorage wrapper for preferences. Every call is wrapped so private mode or a full
 * disk never breaks a tool. Phase 2 ("My Forms" tracker) should use IndexedDB via lib/storage.
 */
const KEY_LAST_EXAM = "fs:lastExam";

function get(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function set(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export const getLastExam = () => get(KEY_LAST_EXAM);
export const setLastExam = (slug: string) => set(KEY_LAST_EXAM, slug);
