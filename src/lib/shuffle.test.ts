import { describe, expect, it } from 'vitest';
import { permutation } from './shuffle';
import { QUESTIONS } from '@/data/questions';

describe('option shuffling', () => {
  it('returns a valid, stable permutation', () => {
    for (let n = 1; n <= 8; n++) {
      const p = permutation(n, `k${n}`);
      expect([...p].sort((a, b) => a - b)).toEqual(Array.from({ length: n }, (_, i) => i));
      expect(permutation(n, `k${n}`)).toEqual(p);
    }
  });

  it('removes answer-position bias across the question bank', () => {
    const counts = [0, 0, 0, 0];
    for (const q of QUESTIONS) {
      const order = q.ordered ? q.options.map((_, i) => i) : permutation(q.options.length, q.id);
      counts[order.indexOf(q.answer)]++;
    }
    // no single display position should hold more than half of all correct answers
    expect(Math.max(...counts)).toBeLessThan(QUESTIONS.length / 2);
  });
});
