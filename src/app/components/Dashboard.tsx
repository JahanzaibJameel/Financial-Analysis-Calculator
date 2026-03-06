'use client';

import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { generateMockStockData, calculateMovingAverage, calculateVolatility } from '@/utils/finance';
import { useTheme } from '@/components/ThemeProvider';

interface StockData {
  date: string;
  price: number;
  volume: number;
  ma?: number;
}

export default function StockDashboard() {
  const { resolvedTheme } = useTheme();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [showMA, setShowMA] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  
  const chartRef = useRef<HTMLDivElement>(null);

  // Generate mock data based on time range
  const stockData = useMemo<StockData[]>(() => {
    const days = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    }[timeRange];

    const data = generateMockStockData(days);
    
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
    const avgVolume = stockData.reduce((sum, d) => sum + d.volume, 0) / stockData.length;

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
          <div className="h-80 flex items-center justify-center">
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="card p-3 shadow-lg border">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card glass"
    >
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="card-title">Stock Dashboard</h2>
              <p className="card-description">
                Real-time stock price analysis and trends
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMA(!showMA)}
              className={`btn btn-sm ${showMA ? 'btn-primary' : 'btn-outline'}`}
            >
              MA
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`btn btn-sm ${showVolume ? 'btn-primary' : 'btn-outline'}`}
            >
              Volume
            </button>
          </div>
        </div>
      </div>

      <div className="card-content space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Price</span>
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary mt-1">
              ${stats.currentPrice.toFixed(2)}
            </div>
            <div className={`flex items-center space-x-1 text-sm mt-1 ${
              stats.dayChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {stats.dayChange >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {stats.dayChange >= 0 ? '+' : ''}{stats.dayChange.toFixed(2)} 
                ({stats.dayChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Return</span>
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div className={`text-2xl font-bold mt-1 ${
              stats.totalChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {stats.totalChange >= 0 ? '+' : ''}{stats.totalChange.toFixed(2)}
            </div>
            <div className={`text-sm mt-1 ${
              stats.totalChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              ({stats.totalChangePercent.toFixed(2)}%)
            </div>
          </div>

          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Volatility</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-500 mt-1">
              {(stats.volatility * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Annualized
            </div>
          </div>

          <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Range</span>
              <BarChart3 className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-lg font-bold text-purple-500 mt-1">
              ${stats.low.toFixed(2)} - ${stats.high.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {timeRange} range
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`btn btn-sm ${
                  timeRange === range ? 'btn-primary' : 'btn-outline'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{stockData.length} days</span>
          </div>
        </div>

        {/* Chart */}
        <div ref={chartRef} className="chart-container h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stockData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
                {showMA && (
                  <linearGradient id="colorMA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                  </linearGradient>
                )}
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  });
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={['dataMin - 5', 'dataMax + 5']}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorPrice)"
                strokeWidth={2}
                name="Price"
              />
              
              {showMA && (
                <Area
                  type="monotone"
                  dataKey="ma"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#colorMA)"
                  strokeWidth={2}
                  name="7-day MA"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Chart */}
        {showVolume && (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    });
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                    return value.toString();
                  }}
                />
                
                <Tooltip 
                  formatter={(value: number | undefined) => [
                    value?.toLocaleString() || '0',
                    'Volume'
                  ]}
                />
                
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.3}
                  strokeWidth={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Info Section */}
        <div className="p-4 rounded-lg bg-muted/30 border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span>Mock data demonstration - Ready for Alpha Vantage API integration</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}