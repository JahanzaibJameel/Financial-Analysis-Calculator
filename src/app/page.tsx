'use client';

import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Zap, Sparkles } from 'lucide-react';
import FinancialCalculator from '@/app/components/Calculator';
import StockDashboard from '@/app/components/Dashboard';
import AIAssistant from '@/app/components/ChatBot';

export default function HomePage() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Smart Calculations',
      description: 'Advanced compound interest calculations with real-time updates and detailed breakdowns.',
    },
    {
      icon: Shield,
      title: 'Market Insights',
      description: 'Interactive stock charts with technical indicators and comprehensive analysis.',
    },
    {
      icon: Zap,
      title: 'AI-Powered Assistant',
      description: 'Get personalized financial guidance and answers to your investment questions.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 text-sm text-primary">
                <Sparkles className="w-4 h-4" />
                <span>Powered by Advanced AI</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold gradient-text">
                Smart Financial
                <br />
                Analysis Platform
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Calculate investments, analyze market trends, and get AI-powered financial insights
                all in one powerful platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-primary btn-lg"
              >
                Start Calculating
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button
                onClick={() => document.getElementById('assistant')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-outline btn-lg"
              >
                Ask AI Assistant
              </button>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need for Financial Analysis
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to help you make informed financial decisions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card glass text-center p-8"
              >
                <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Professional Financial Tools
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Industry-standard calculations and real-time market analysis
            </p>
          </div>

          <div className="space-y-24">
            {/* Calculator */}
            <motion.div
              id="calculator"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <FinancialCalculator />
            </motion.div>

            {/* Dashboard */}
            <motion.div
              id="dashboard"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <StockDashboard />
            </motion.div>

            {/* AI Assistant */}
            <motion.div
              id="assistant"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <AIAssistant />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Take Control of Your Financial Future?
            </h2>
            <p className="text-xl text-muted-foreground">
              Start using our advanced tools today and make informed investment decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-primary btn-lg"
              >
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button className="btn btn-outline btn-lg">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 FinanceAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}