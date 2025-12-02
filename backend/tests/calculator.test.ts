import { evaluateExpression } from '../src/utils/calculator';

describe('Calculator Utils', () => {
  describe('evaluateExpression', () => {
    it('should calculate addition correctly', () => {
      expect(evaluateExpression('2 + 3')).toBe(5);
      expect(evaluateExpression('10 + 20')).toBe(30);
    });

    it('should calculate subtraction correctly', () => {
      expect(evaluateExpression('5 - 3')).toBe(2);
      expect(evaluateExpression('10 - 20')).toBe(-10);
    });

    it('should calculate multiplication correctly', () => {
      expect(evaluateExpression('2 * 3')).toBe(6);
      expect(evaluateExpression('5 * 4')).toBe(20);
    });

    it('should calculate division correctly', () => {
      expect(evaluateExpression('6 / 2')).toBe(3);
      expect(evaluateExpression('10 / 4')).toBe(2.5);
    });

    it('should handle complex expressions', () => {
      expect(evaluateExpression('2 + 3 * 4')).toBe(14);
      expect(evaluateExpression('(2 + 3) * 4')).toBe(20);
    });

    it('should handle decimal numbers', () => {
      expect(evaluateExpression('1.5 + 2.5')).toBe(4);
      expect(evaluateExpression('3.14 * 2')).toBe(6.28);
    });

    it('should throw error for invalid expression', () => {
      expect(() => evaluateExpression('2 + abc')).toThrow('Invalid expression');
      expect(() => evaluateExpression('2 ++')).toThrow('Invalid expression');
    });

    it('should throw error for division by zero', () => {
      expect(() => evaluateExpression('5 / 0')).toThrow('Division by zero');
    });

    it('should handle whitespace', () => {
      expect(evaluateExpression('  2  +  3  ')).toBe(5);
    });
  });
});
