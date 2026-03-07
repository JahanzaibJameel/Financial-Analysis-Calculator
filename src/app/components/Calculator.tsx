'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';
import { calculateCompoundInterest, formatCurrency, formatPercentage, CalculationResult } from '@/utils/finance';
import { useTheme } from '@/components/ThemeProvider';

export default function FinancialCalculator() {
  const { resolvedTheme } = useTheme();
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [compoundFrequency, setCompoundFrequency] = useState(1);

  const calculation = useMemo<CalculationResult>(() => {
    return calculateCompoundInterest(principal, rate, years, compoundFrequency);
  }, [principal, rate, years, compoundFrequency]);

  const handleExport = () => {
    const data = {
      parameters: {
        principal,
        rate,
        years,
        compoundFrequency,
      },
      results: calculation,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-calculation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Compound Interest Calculator
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Calculate your investment growth with compound interest
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 space-y-4">
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span>Principal Amount</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  ${principal.toLocaleString()}
                </span>
              </label>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>$1,000</span>
                <span>$1,000,000</span>
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span>Annual Interest Rate</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {rate}%
                </span>
              </label>
              <input
                type="range"
                min="0.1"
                max="30"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>0.1%</span>
                <span>30%</span>
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span>Investment Period</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {years} years
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>1 year</span>
                <span>50 years</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Compound Frequency
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 1, label: 'Annually' },
                  { value: 2, label: 'Semi-annually' },
                  { value: 4, label: 'Quarterly' },
                  { value: 12, label: 'Monthly' },
                ].map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() => setCompoundFrequency(freq.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      compoundFrequency === freq.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Export Results as JSON
          </button>
        </div>

        {/* Results Display */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="opacity-90">Initial Investment:</span>
                <span className="font-semibold">{formatCurrency(principal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Final Amount:</span>
                <span className="font-semibold text-xl">{formatCurrency(calculation.finalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Total Interest:</span>
                <span className="font-semibold">{formatCurrency(calculation.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Total Return:</span>
                <span className="font-semibold">{formatPercentage(calculation.roi)}</span>
              </div>
            </div>
          </div>

          {/* Yearly Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Yearly Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Year</th>
                      <th className="text-right py-2 text-gray-600 dark:text-gray-400">Balance</th>
                      <th className="text-right py-2 text-gray-600 dark:text-gray-400">Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculation.yearlyBreakdown.slice(0, 10).map((year, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 text-gray-900 dark:text-white">{year.year}</td>
                        <td className="text-right py-2 text-gray-900 dark:text-white">
                          {formatCurrency(year.balance)}
                        </td>
                        <td className="text-right py-2 text-green-600 dark:text-green-400">
                          +{formatCurrency(year.interest)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {calculation.yearlyBreakdown.length > 10 && (
                  <div className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
                    ... and {calculation.yearlyBreakdown.length - 10} more years
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}