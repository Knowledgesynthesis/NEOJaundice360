/** Per-session salt so option order differs between visits but is stable within one. */
const SALT = Math.floor(Math.random() * 2 ** 31);

function hash(s: string): number {
  let h = 2166136261 ^ SALT;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic permutation of 0..n-1 for a given key (Fisher–Yates with a seeded LCG). */
export function permutation(n: number, key: string): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  let seed = hash(key) || 1;
  const rnd = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}
