A modern, production-ready financial analysis web application built with Next.js 16, React, TypeScript, and AI-powered insights.

## 🚀 Features

### 💰 Advanced Financial Calculator
- **Compound Interest Calculations** with real-time updates
- **Interactive Sliders** for principal ($1,000-$1,000,000), rate (0.1%-30%), and time (1-50 years)
- **Compound Frequency Options**: Annually, Semi-annually, Quarterly, Monthly
- **Yearly Breakdown Table** with detailed projections
- **Export Functionality** to download calculations as JSON
- **Responsive Design** with modern glass morphism effects

### 📊 Interactive Stock Dashboard
- **Real-time Charts** using Recharts with zoom/pan capabilities
- **Multiple Time Ranges**: 7 days, 30 days, 90 days, 1 year
- **Technical Indicators**: 7-day moving average, volume analysis
- **Live Statistics**: Current price, daily change, volatility, range analysis
- **Toggle Features**: Show/hide moving averages and volume
- **Deterministic Data** with seeded random generation for consistent SSR

### 🤖 AI Financial Assistant
- **OpenAI Integration** with intelligent financial guidance
- **Mock Mode Toggle** for testing without API keys
- **Modern Chat UI** with typing indicators and smooth animations
- **Context Awareness** maintains conversation history
- **Quick Suggestions** for common financial questions
- **Rate Limiting** with intelligent error handling
- **Educational Disclaimers** about non-professional advice

### 🎨 Modern UI/UX
- **Dark/Light/System Theme** with smooth transitions
- **Glass Morphism Design** with backdrop blur effects
- **Framer Motion Animations** for micro-interactions
- **Responsive Layout** for mobile, tablet, and desktop
- **Professional Navigation** with mobile menu support
- **Component Library** with consistent styling

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router and Turbopack
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for interactive visualizations
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for modern iconography
- **API**: OpenAI for AI-powered assistance
- **HTTP**: Axios with interceptors and retry logic

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd analysis-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI assistant | Optional (Mock Mode available) |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key for real stock data | Optional |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |

### API Setup

#### OpenAI API (Optional)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file
4. **Pro Tip**: Use Mock Mode to test without API keys!

#### Alpha Vantage API (Optional)
1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Get your free API key
3. Add it to your `.env.local` file
4. Replace mock data with real API calls

## 🚀 Development & Deployment

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
- **Development**: `npm run dev` - Hot reload with Turbopack
- **Production**: `npm run build && npm start` - Optimized build
- **Type Check**: Built into Next.js compilation

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/              # API routes
│   │   └── chat/        # OpenAI chat endpoint
│   ├── components/        # React components
│   │   ├── Calculator.tsx    # Financial calculator
│   │   ├── ChatBot.tsx       # AI assistant
│   │   └── Dashboard.tsx     # Stock dashboard
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/              # Shared components
│   ├── Header.tsx         # Navigation header
│   └── ThemeProvider.tsx  # Theme system
├── styles/                # Global styles
│   └── globals.css
└── utils/                 # Helper functions
    ├── api.ts             # API utilities
    └── finance.ts         # Financial calculations
```

## 🎯 Key Features

### Financial Calculations
- **Compound Interest**: A = P(1 + r/n)^(nt)
- **Yearly Breakdown**: Detailed projection tables
- **Currency Formatting**: Professional display
- **Percentage Calculations**: Growth rates and returns
- **Export Functionality**: JSON download support

### Stock Analysis
- **Mock Data Generation**: Seeded random for SSR consistency
- **Moving Averages**: 7-day technical indicator
- **Volatility Calculations**: Standard deviation analysis
- **Volume Analysis**: Trading activity tracking
- **Range Calculations**: High/low/period statistics

### AI Integration
- **Mock Mode**: Instant responses without API
- **Live Mode**: Real OpenAI integration
- **Rate Limiting**: Intelligent error handling
- **Context Management**: Conversation history
- **Typing Indicators**: Real-time feedback
- **Quick Actions**: Common question suggestions

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs
- **CORS Headers**: Proper cross-origin configuration
- **Environment Variables**: Secure API key management
- **Type Safety**: Strict TypeScript configuration

## 🎨 UI/UX Features

### Theme System
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes, professional
- **System Mode**: Follows OS preference
- **Smooth Transitions**: Animated theme switching

### Responsive Design
- **Mobile**: < 768px - Optimized layout
- **Tablet**: 768px - 1024px - Adaptive design
- **Desktop**: > 1024px - Full experience
- **Large Screens**: > 1440px - Enhanced layout

### Animations
- **Framer Motion**: Smooth micro-interactions
- **Loading States**: Professional feedback
- **Hover Effects**: Interactive elements
- **Page Transitions**: Smooth navigation

## 🌐 Browser Support

- **Chrome/Edge**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Mobile**: iOS Safari, Android Chrome

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow existing code style
- Test responsive design
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check this README and inline comments
- **Issues**: Open a GitHub issue with detailed information
- **Discussions**: Use GitHub Discussions for questions
- **Mock Mode**: Use Mock Mode to test without API keys

## 🚀 Future Enhancements

- [ ] Real-time stock data integration
- [ ] Portfolio tracking features
- [ ] Advanced charting tools
- [ ] Export to PDF/Excel
- [ ] Multi-language support
- [ ] Advanced AI financial planning
- [ ] Tax calculation features
- [ ] Retirement planning tools
- [ ] Mobile app development

## 🎯 Quick Start Tips

### For Testing
1. **Use Mock Mode** - Toggle in AI Assistant header
2. **No API Keys Required** - Test all features immediately
3. **Full Functionality** - Everything works in Mock Mode

### For Production
1. **Add API Keys** - Set up OpenAI and Alpha Vantage
2. **Switch to Live Mode** - In AI Assistant
3. **Deploy** - Build and deploy to your platform

### For Development
1. **Hot Reload** - Changes appear instantly
2. **Type Safety** - TypeScript catches errors
3. **Modern Stack** - Latest Next.js with Turbopack

---

**Built with ❤️ using Next.js 16, TypeScript, and modern web technologies**

## 📊 Performance

- **Optimized Build**: Next.js production optimizations
- **Code Splitting**: Component-level lazy loading
- **Bundle Analysis**: Minimal JavaScript footprint
- **SEO Ready**: Meta tags and structured data

## 🔧 Troubleshooting

### Common Issues

**Hydration Errors**: Fixed with deterministic data generation
**TypeScript Errors**: All resolved with proper typing
**API Rate Limits**: Use Mock Mode for testing
**Build Issues**: Run `npm install` and check Node version

### Getting Help

1. Check the console for specific error messages
2. Verify environment variables are set correctly
3. Use Mock Mode to isolate API issues
4. Open a GitHub issue with reproduction steps

---

**Financial Analysis Calculator** - Modern web development meets financial intelligence 🚀
