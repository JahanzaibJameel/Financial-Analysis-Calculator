// Financial calculation utilities
export interface YearlyBreakdown {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface CalculationResult {
  finalAmount: number;
  totalInterest: number;
  yearlyBreakdown: YearlyBreakdown[];
  roi: number;
}

/**
 * Calculate compound interest with yearly breakdown
 */
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  compoundFrequency: number = 1
): CalculationResult {
  const rate = annualRate / 100;
  const yearlyBreakdown: YearlyBreakdown[] = [];
  let currentBalance = principal;
  let totalInterest = 0;

  for (let year = 1; year <= years; year++) {
    const yearStartBalance = currentBalance;
    const yearInterest = currentBalance * rate;
    currentBalance += yearInterest;
    totalInterest += yearInterest;

    yearlyBreakdown.push({
      year,
      principal: yearStartBalance,
      interest: yearInterest,
      balance: currentBalance,
    });
  }

  const roi = ((currentBalance - principal) / principal) * 100;

  return {
    finalAmount: currentBalance,
    totalInterest,
    yearlyBreakdown,
    roi,
  };
}

/**
 * Calculate monthly payment for a loan
 */
export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  years: number
): {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
} {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  if (monthlyRate === 0) {
    const monthlyPayment = principal / numberOfPayments;
    return {
      monthlyPayment,
      totalPayment: principal,
      totalInterest: 0,
    };
  }

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
  };
}

/**
 * Calculate future value of an annuity (regular contributions)
 */
export function calculateAnnuityFutureValue(
  monthlyContribution: number,
  annualRate: number,
  years: number
): {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
} {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  const totalContributions = monthlyContribution * numberOfPayments;

  let futureValue: number;
  if (monthlyRate === 0) {
    futureValue = totalContributions;
  } else {
    futureValue =
      monthlyContribution *
      ((Math.pow(1 + monthlyRate, numberOfPayments) - 1) / monthlyRate);
  }

  const totalInterest = futureValue - totalContributions;

  return {
    futureValue,
    totalContributions,
    totalInterest,
  };
}

/**
 * Format currency with proper locale formatting
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage with proper decimal places
 */
export function formatPercentage(
  value: number | undefined,
  decimals: number = 2
): string {
  if (value === undefined || isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate risk-adjusted return (Sharpe Ratio approximation)
 */
export function calculateSharpeRatio(
  portfolioReturn: number,
  riskFreeRate: number,
  standardDeviation: number
): number {
  if (standardDeviation === 0) return 0;
  return (portfolioReturn - riskFreeRate) / standardDeviation;
}

/**
 * Generate mock stock data for demonstration
 */
export function generateMockStockData(days: number = 30, seed?: number) {
  const data = [];
  const basePrice = 150;
  let currentPrice = basePrice;
  const today = new Date();

  // Use seed for deterministic generation if provided
  const random = seed !== undefined ? seededRandom(seed) : Math.random;

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate realistic price movement with deterministic approach
    const change = (random() - 0.5) * 8;
    currentPrice = Math.max(currentPrice + change, basePrice * 0.7);

    data.push({
      date: date.toISOString().split('T')[0],
      price: Number(currentPrice.toFixed(2)),
      volume: Math.floor(random() * 1000000) + 500000,
    });
  }

  return data;
}

/**
 * Seeded random number generator for deterministic results
 */
function seededRandom(seed: number): () => number {
  let value = seed;
  return function () {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(
  data: number[],
  period: number
): number[] {
  const result: number[] = [];

  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }

  return result;
}

/**
 * Calculate volatility (standard deviation of returns)
 */
export function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;

  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) /
    returns.length;

  return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
}
