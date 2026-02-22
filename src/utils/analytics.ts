import { doc, setDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db, firebaseReady } from '@/lib/firebase';

/**
 * Atomically increments the lookup count for a given target (hash, URL, or file name).
 * Stored in Firestore at: analytics/lookup_counts → { counts: { [target]: number } }
 * No-ops silently when Firebase is not configured.
 */
export async function incrementLookupCount(
  target: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _scanType: 'file' | 'url' | 'hash',
): Promise<void> {
  if (!firebaseReady || !db) return;
  try {
    // Sanitise the key — Firestore field names can't contain '/'
    const key = target.replace(/\//g, '_').slice(0, 1500);
    const ref = doc(db, 'analytics', 'lookup_counts');
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, { counts: { [key]: 1 } });
    } else {
      await updateDoc(ref, { [`counts.${key}`]: increment(1) });
    }
  } catch (error) {
    console.warn('Analytics increment failed:', error);
  }
}

/**
 * Returns the full lookup counts map { target: count }.
 * Returns an empty object when Firebase is not configured.
 */
export async function getLookupCounts(): Promise<Record<string, number>> {
  if (!firebaseReady || !db) return {};
  try {
    const ref = doc(db, 'analytics', 'lookup_counts');
    const snap = await getDoc(ref);
    if (!snap.exists()) return {};
    return (snap.data().counts as Record<string, number>) ?? {};
  } catch {
    return {};
  }
}
