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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card glass"
    >
      <div className="card-header">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="card-title">Financial Calculator</h2>
            <p className="card-description">
              Calculate compound interest and investment growth
            </p>
          </div>
        </div>
      </div>

      <div className="card-content space-y-8">
        {/* Input Controls */}
        <div className="grid gap-6">
          {/* Principal Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <DollarSign className="w-4 h-4" />
                <span>Initial Investment</span>
              </label>
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(principal)}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="1000000"
              step="1000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$1,000</span>
              <span>$1,000,000</span>
            </div>
          </div>

          {/* Rate Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <Percent className="w-4 h-4" />
                <span>Annual Interest Rate</span>
              </label>
              <span className="text-sm font-semibold text-primary">
                {formatPercentage(rate)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="30"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Years Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                <span>Investment Period</span>
              </label>
              <span className="text-sm font-semibold text-primary">
                {years} {years === 1 ? 'year' : 'years'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 year</span>
              <span>50 years</span>
            </div>
          </div>

          {/* Compound Frequency */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Compound Frequency</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 1, label: 'Annually' },
                { value: 2, label: 'Semi' },
                { value: 4, label: 'Quarterly' },
                { value: 12, label: 'Monthly' },
              ].map((freq) => (
                <button
                  key={freq.value}
                  onClick={() => setCompoundFrequency(freq.value)}
                  className={`btn btn-sm ${
                    compoundFrequency === freq.value
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Final Amount</span>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary mt-1">
              {formatCurrency(calculation.finalAmount)}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Interest</span>
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-500 mt-1">
              {formatCurrency(calculation.totalInterest)}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Return on Investment</span>
              <Percent className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-500 mt-1">
              {formatPercentage(calculation.roi)}
            </div>
          </div>
        </motion.div>

        {/* Yearly Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Yearly Breakdown</h3>
            <button onClick={handleExport} className="btn btn-outline btn-sm">
              Export Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background border-b">
                  <tr>
                    <th className="text-left p-3 font-medium">Year</th>
                    <th className="text-right p-3 font-medium">Principal</th>
                    <th className="text-right p-3 font-medium">Interest</th>
                    <th className="text-right p-3 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {calculation.yearlyBreakdown.map((year, index) => (
                    <motion.tr
                      key={year.year}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3 font-medium">{year.year}</td>
                      <td className="p-3 text-right">{formatCurrency(year.principal)}</td>
                      <td className="p-3 text-right text-green-500">
                        +{formatCurrency(year.interest)}
                      </td>
                      <td className="p-3 text-right font-semibold">
                        {formatCurrency(year.balance)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}