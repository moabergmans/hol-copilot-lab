import { describe, it, expect } from 'vitest';
import { formatPrice, calculateTotal, validateEmail } from './helpers';

describe('helpers.ts', () => {
  describe('formatPrice', () => {
    it('formats price as USD currency', () => {
      expect(formatPrice(29.99)).toBe('$29.99');
    });

    it('formats whole numbers with .00', () => {
      expect(formatPrice(10)).toBe('$10.00');
    });

    it('formats large numbers with thousands separator', () => {
      expect(formatPrice(1000.50)).toBe('$1,000.50');
    });

    it('handles zero', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('handles negative numbers', () => {
      expect(formatPrice(-15.99)).toBe('-$15.99');
    });

    it('rounds to two decimal places', () => {
      expect(formatPrice(19.999)).toBe('$20.00');
    });

    it('handles very small decimals', () => {
      expect(formatPrice(0.01)).toBe('$0.01');
    });

    it('handles very large numbers', () => {
      expect(formatPrice(999999.99)).toBe('$999,999.99');
    });
  });

  describe('calculateTotal', () => {
    it('calculates total for single item', () => {
      const items = [{ price: 29.99, quantity: 1 }];
      expect(calculateTotal(items)).toBe(29.99);
    });

    it('calculates total for multiple quantities', () => {
      const items = [{ price: 29.99, quantity: 2 }];
      expect(calculateTotal(items)).toBeCloseTo(59.98, 2);
    });

    it('calculates total for multiple items', () => {
      const items = [
        { price: 29.99, quantity: 2 },
        { price: 49.99, quantity: 1 }
      ];
      expect(calculateTotal(items)).toBeCloseTo(109.97, 2);
    });

    it('handles empty array', () => {
      expect(calculateTotal([])).toBe(0);
    });

    it('handles zero quantity', () => {
      const items = [{ price: 29.99, quantity: 0 }];
      expect(calculateTotal(items)).toBe(0);
    });

    it('handles multiple items with zero quantities', () => {
      const items = [
        { price: 29.99, quantity: 0 },
        { price: 49.99, quantity: 2 }
      ];
      expect(calculateTotal(items)).toBeCloseTo(99.98, 2);
    });

    it('handles negative prices', () => {
      const items = [
        { price: 29.99, quantity: 1 },
        { price: -10, quantity: 2 }
      ];
      expect(calculateTotal(items)).toBeCloseTo(9.99, 2);
    });

    it('handles large quantities', () => {
      const items = [{ price: 10, quantity: 1000 }];
      expect(calculateTotal(items)).toBe(10000);
    });
  });

  describe('validateEmail', () => {
    it('validates correct email format', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('validates email with multiple subdomains', () => {
      expect(validateEmail('user@mail.example.co.uk')).toBe(true);
    });

    it('validates email with numbers and symbols', () => {
      expect(validateEmail('user.name+tag@example.com')).toBe(true);
    });

    it('rejects email without @ symbol', () => {
      expect(validateEmail('invalidemail.com')).toBe(false);
    });

    it('rejects email without domain', () => {
      expect(validateEmail('user@')).toBe(false);
    });

    it('rejects email without local part', () => {
      expect(validateEmail('@example.com')).toBe(false);
    });

    it('rejects email with spaces', () => {
      expect(validateEmail('user name@example.com')).toBe(false);
    });

    it('rejects email without TLD', () => {
      expect(validateEmail('user@domain')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('rejects email with multiple @ symbols', () => {
      expect(validateEmail('user@@example.com')).toBe(false);
    });

    it('validates email with hyphens in domain', () => {
      expect(validateEmail('user@ex-ample.com')).toBe(true);
    });

    it('validates email with underscores', () => {
      expect(validateEmail('user_name@example.com')).toBe(true);
    });
  });
});
