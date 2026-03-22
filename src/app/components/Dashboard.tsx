'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import {
  generateMockStockData,
  calculateMovingAverage,
  calculateVolatility,
} from '@/utils/finance';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface StockData {
  date: string;
  price: number;
  volume: number;
  ma?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

// Custom tooltip component moved outside of render
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="card border p-3 shadow-lg">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function StockDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>(
    '30d'
  );
  const [showMA, setShowMA] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted on mount
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Generate mock data based on time range
  const stockData = useMemo<StockData[]>(() => {
    const days = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    }[timeRange];

    // Use a fixed seed for consistent data generation between server and client
    const data = generateMockStockData(days, 12345);

    // Add moving average
    if (showMA) {
      const prices = data.map(d => d.price);
      const ma = calculateMovingAverage(prices, 7);
      return data.map((d, i) => ({
        ...d,
        ma: i >= 6 ? ma[i - 6] : undefined,
      }));
    }

    return data;
  }, [timeRange, showMA]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (stockData.length < 2) return null;

    const prices = stockData.map(d => d.price);
    const currentPrice = prices[prices.length - 1];
    const previousPrice = prices[prices.length - 2];
    const firstPrice = prices[0];

    const dayChange = currentPrice - previousPrice;
    const dayChangePercent = (dayChange / previousPrice) * 100;
    const totalChange = currentPrice - firstPrice;
    const totalChangePercent = (totalChange / firstPrice) * 100;

    const volatility = calculateVolatility(prices);
    const avgVolume =
      stockData.reduce((sum, d) => sum + d.volume, 0) / stockData.length;

    return {
      currentPrice,
      dayChange,
      dayChangePercent,
      totalChange,
      totalChangePercent,
      volatility,
      avgVolume,
      high: Math.max(...prices),
      low: Math.min(...prices),
    };
  }, [stockData]);

  if (!stats) {
    return (
      <div className="card glass">
        <div className="card-header">
          <h2 className="card-title">Stock Dashboard</h2>
        </div>
        <div className="card-content">
          <div className="flex h-80 items-center justify-center">
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Stock Market Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Real-time market analysis and technical indicators
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-blue-100">Current Price</span>
            <DollarSign className="h-5 w-5 text-blue-100" />
          </div>
          <div className="mb-2 text-2xl font-bold">
            ${stats.currentPrice.toFixed(2)}
          </div>
          <div
            className={`flex items-center space-x-1 text-sm ${
              stats.dayChange >= 0 ? 'text-green-300' : 'text-red-300'
            }`}>
            {stats.dayChange >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>
              {stats.dayChange >= 0 ? '+' : ''}
              {stats.dayChange.toFixed(2)}({stats.dayChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-green-600 to-green-700 p-6 text-white">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-green-100">Total Return</span>
            <Activity className="h-5 w-5 text-green-100" />
          </div>
          <div
            className={`mb-2 text-2xl font-bold ${
              stats.totalChange >= 0 ? 'text-green-100' : 'text-red-100'
            }`}>
            {stats.totalChange >= 0 ? '+' : ''}
            {stats.totalChange.toFixed(2)}
          </div>
          <div
            className={`text-sm ${
              stats.totalChange >= 0 ? 'text-green-200' : 'text-red-200'
            }`}>
            ({stats.totalChangePercent.toFixed(2)}%)
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-purple-100">Volatility</span>
            <TrendingUp className="h-5 w-5 text-purple-100" />
          </div>
          <div className="mb-2 text-2xl font-bold">
            {(stats.volatility * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-purple-200">Annualized</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 p-6 text-white">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-orange-100">Range</span>
            <BarChart3 className="h-5 w-5 text-orange-100" />
          </div>
          <div className="mb-2 text-lg font-bold">
            ${stats.low.toFixed(2)} - ${stats.high.toFixed(2)}
          </div>
          <div className="text-sm text-orange-200">{timeRange} range</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-gray-50 p-6 sm:flex-row dark:bg-gray-800/50">
        <div className="flex flex-wrap gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}>
              {range}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowMA(!showMA)}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              showMA
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}>
            Moving Avg
          </button>
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              showVolume
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}>
            Volume
          </button>
        </div>
      </div>

      {/* Chart */}
      {mounted && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Price Chart
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stockData.length} days
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height={384}>
              <AreaChart data={stockData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                  {showMA && (
                    <linearGradient id="colorMA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#10B981"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  )}
                </defs>

                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: string) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={(value: number) => `$${value.toFixed(0)}`}
                />

                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  strokeWidth={2}
                  name="Price"
                />

                {showMA && (
                  <Area
                    type="monotone"
                    dataKey="ma"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorMA)"
                    strokeWidth={2}
                    name="7-day MA"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Volume Chart */}
      {showVolume && mounted && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Volume Analysis
          </h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value: string) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value: number) => {
                    if (value >= 1000000)
                      return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                    return value.toString();
                  }}
                />

                <Tooltip
                  formatter={(value: number | undefined) => [
                    value?.toLocaleString() || '0',
                    'Volume',
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.3}
                  strokeWidth={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-center space-x-2 text-sm text-blue-800 dark:text-blue-200">
          <Activity className="h-4 w-4" />
          <span>
            Mock data demonstration - Ready for Alpha Vantage API integration
          </span>
        </div>
      </div>
    </div>
  );
}
