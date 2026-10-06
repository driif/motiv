import { describe, expect, it } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins truthy parts with a space', () => {
    expect(cx('a', false, null, undefined, '', 'b')).toBe('a b');
  });
});
