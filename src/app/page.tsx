'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calculator, BarChart3, Bot } from 'lucide-react';
import FinancialCalculator from '@/app/components/Calculator';
import StockDashboard from '@/app/components/Dashboard';
import AIAssistant from '@/app/components/ChatBot';

export default function HomePage() {
  const features = [
    {
      icon: Calculator,
      title: 'Smart Calculations',
      description:
        'Advanced compound interest calculations with real-time updates and detailed breakdowns.',
    },
    {
      icon: BarChart3,
      title: 'Market Insights',
      description:
        'Interactive stock charts with technical indicators and comprehensive analysis.',
    },
    {
      icon: Bot,
      title: 'AI-Powered Assistant',
      description:
        'Get personalized financial guidance and answers to your investment questions.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
              <Sparkles className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Powered by AI & Modern Finance
              </span>
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl dark:text-white">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart Financial
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Analysis Platform
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
              Experience the future of financial planning with our intelligent
              calculator, real-time market insights, and AI-powered guidance.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() =>
                  document
                    .getElementById('calculator')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg">
                Start Calculating
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById('dashboard')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="inline-flex transform items-center rounded-xl border border-gray-200 bg-white px-8 py-4 font-semibold text-gray-900 transition-all duration-200 hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                View Dashboard
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Everything You Need for Financial Success
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Our comprehensive platform combines powerful calculations, market
              analysis, and AI insights.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="transform rounded-2xl border border-gray-100 bg-white p-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Powerful Financial Tools
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Try our interactive tools and see the power of modern financial
              analysis.
            </p>
          </motion.div>

          <div className="space-y-24">
            {/* Calculator */}
            <motion.div
              id="calculator"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
              <FinancialCalculator />
            </motion.div>

            {/* Dashboard */}
            <motion.div
              id="dashboard"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
              <StockDashboard />
            </motion.div>

            {/* AI Assistant */}
            <motion.div
              id="assistant"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
              <AIAssistant />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-white">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="mb-8 text-xl opacity-90">
              Start using our powerful tools today and take control of your
              financial journey.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() =>
                  document
                    .getElementById('calculator')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="inline-flex transform items-center rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 transition-all duration-200 hover:scale-105 hover:shadow-lg">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 py-12 sm:px-6 lg:px-8 dark:border-gray-700">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 FinanceAI. Built with modern web technologies for your
            financial success.
          </p>
        </div>
      </footer>
    </div>
  );
}
