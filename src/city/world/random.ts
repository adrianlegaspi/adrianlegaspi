/**
 * Deterministic noise. The city has to look scattered but never change between
 * loads, so nothing in the scene uses `Math.random`.
 */
export function hash(x: number, z: number, salt = 0) {
  const n = Math.sin(x * 127.1 + z * 311.7 + salt * 74.7) * 43758.5453
  return n - Math.floor(n)
}

/** Picks from a list with the same deterministic value. */
export const pick = <T>(list: readonly T[], r: number) =>
  list[Math.floor(r * list.length) % list.length]
