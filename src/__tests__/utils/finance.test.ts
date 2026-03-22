import {
  calculateCompoundInterest,
  formatCurrency,
  formatPercentage,
  generateMockStockData,
} from '../../utils/finance';

describe('Finance Utils', () => {
  describe('calculateCompoundInterest', () => {
    it('should calculate compound interest correctly', () => {
      const result = calculateCompoundInterest(10000, 0.05, 10, 1);

      expect(result.finalAmount).toBeCloseTo(16288.95, 2);
      expect(result.totalInterest).toBeCloseTo(6288.95, 2);
      expect(result.roi).toBeCloseTo(62.89, 2);
    });

    it('should handle edge cases', () => {
      const result = calculateCompoundInterest(0, 0, 0, 1);

      expect(result.finalAmount).toBe(0);
      expect(result.totalInterest).toBe(0);
      expect(result.roi).toBe(0);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-100)).toBe('-$100.00');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage correctly', () => {
      expect(formatPercentage(0.1234)).toBe('12.34%');
      expect(formatPercentage(0)).toBe('0.00%');
      expect(formatPercentage(-0.05)).toBe('-5.00%');
    });

    it('should handle undefined values', () => {
      expect(formatPercentage(undefined as unknown as number)).toBe('0.00%');
    });
  });

  describe('generateMockStockData', () => {
    it('should generate consistent data with seed', () => {
      const data1 = generateMockStockData(30, 12345);
      const data2 = generateMockStockData(30, 12345);

      expect(data1).toEqual(data2);
      expect(data1).toHaveLength(30);
    });

    it('should generate different data with different seeds', () => {
      const data1 = generateMockStockData(30, 12345);
      const data2 = generateMockStockData(30, 54321);

      expect(data1).not.toEqual(data2);
    });
  });
});
