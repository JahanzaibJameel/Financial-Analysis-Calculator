# Financial Analysis Calculator

A modern, production-ready financial analysis web application built with Next.js 16, React, TypeScript, and AI-powered insights.

## 🚀 Features

### 💰 Financial Calculator
- **Advanced compound interest calculations** with real-time updates
- **Interactive sliders** for principal ($1,000-$1,000,000), rate (0.1%-30%), and time (1-50 years)
- **Compound frequency options**: Annually, Semi-annually, Quarterly, Monthly
- **Yearly breakdown table** with detailed projections
- **Export functionality** to download calculations as JSON
- **Responsive design** with glass morphism effects

### 📊 Stock Dashboard
- **Interactive charts** using Recharts with zoom/pan capabilities
- **Multiple time ranges**: 7 days, 30 days, 90 days, 1 year
- **Technical indicators**: 7-day moving average, volume charts
- **Real-time statistics**: Current price, daily change, volatility, range analysis
- **Toggle features**: Show/hide moving averages and volume
- **Mock data generation** ready for Alpha Vantage API integration

### 🤖 AI Financial Assistant
- **OpenAI integration** with intelligent financial guidance
- **Modern chat UI** with typing indicators and animations
- **Context awareness** maintains conversation history
- **Quick suggestions** for common financial questions
- **Rate limiting** (10 requests/hour) to prevent abuse
- **Error handling** with user-friendly messages
- **Professional disclaimers** about educational nature

### 🎨 Modern UI/UX
- **Dark/Light/System theme** with smooth transitions
- **Glass morphism design** with backdrop blur effects
- **Framer Motion animations** for micro-interactions
- **Responsive layout** for mobile, tablet, and desktop
- **Professional navigation** with mobile menu
- **Component library** with consistent styling

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for interactive visualizations
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for modern iconography
- **API**: OpenAI for AI-powered assistance
- **HTTP**: Axios with interceptors and retry logic

## 📦 Installation

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
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI assistant | Yes |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key for real stock data | Optional |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |

### API Setup

#### OpenAI API
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file
4. The AI assistant will be fully functional

#### Alpha Vantage API (Optional)
1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Get your free API key
3. Add it to your `.env.local` file
4. Replace mock data with real API calls

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Setup
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm start`
- **Lint**: `npm run lint`
- **Type Check**: `npm run type-check`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/              # API routes
│   │   └── chat/        # OpenAI chat endpoint
│   ├── components/        # React components
│   │   ├── Calculator.tsx
│   │   ├── ChatBot.tsx
│   │   └── Dashboard.tsx
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/              # Shared components
│   ├── Header.tsx
│   └── ThemeProvider.tsx
├── lib/                   # Utilities
│   └── theme.tsx          # Theme system
├── styles/                # Global styles
│   └── globals.css
└── utils/                 # Helper functions
    ├── api.ts             # API utilities
    └── finance.ts         # Financial calculations
```

## 🎯 Key Features

### Financial Calculations
- **Compound Interest**: A = P(1 + r/n)^(nt)
- **Loan Payments**: Monthly payment calculations
- **Annuity Calculations**: Future value projections
- **Currency Formatting**: Professional display
- **Percentage Calculations**: Growth rates and returns

### Stock Analysis
- **Mock Data Generation**: Realistic price movements
- **Moving Averages**: 7-day technical indicator
- **Volatility Calculations**: Standard deviation analysis
- **Volume Analysis**: Trading activity tracking
- **Range Calculations**: High/low/period statistics

### AI Integration
- **Rate Limiting**: 10 requests per hour per IP
- **Error Handling**: Network, API, quota errors
- **Context Management**: Conversation history
- **Typing Indicators**: Real-time feedback
- **Quick Actions**: Common question suggestions

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs
- **CORS Headers**: Proper cross-origin configuration
- **Environment Variables**: Secure API key management
- **Type Safety**: Strict TypeScript configuration

## 🌐 Browser Support

- **Chrome/Edge**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Mobile**: iOS Safari, Android Chrome

## 📱 Responsive Design

- **Mobile**: < 768px - Optimized layout
- **Tablet**: 768px - 1024px - Adaptive design
- **Desktop**: > 1024px - Full experience
- **Large Screens**: > 1440px - Enhanced layout

## 🎨 Customization

### Theme System
The application supports three theme modes:
- **Light**: Clean, bright interface
- **Dark**: Easy on the eyes, professional
- **System**: Follows OS preference

### Color Scheme
- **Primary**: Main brand color
- **Secondary**: Accent colors
- **Muted**: Subtle backgrounds
- **Chart**: Data visualization colors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check this README and inline comments
- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions for questions

## 🚀 Future Enhancements

- [ ] Real-time stock data integration
- [ ] Portfolio tracking features
- [ ] Advanced charting tools
- [ ] Export to PDF/Excel
- [ ] Multi-language support
- [ ] Advanced AI financial planning
- [ ] Tax calculation features
- [ ] Retirement planning tools

---

**Built with ❤️ using modern web technologies**
- Professional UI with smooth animations

### 📊 **Financial Dashboard**
- Interactive stock price charts using Chart.js
- Mock data integration ready for Alpha Vantage API
- Responsive design with modern styling
- Real-time data visualization

### 🤖 **AI Financial Assistant**
- Chat interface powered by OpenAI API
- Financial concept explanations
- Investment guidance and analysis interpretation
- Rate limiting and error handling
- Professional chat UI with typing indicators

## Tech Stack

- **Framework**: Next.js 16.0.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: React Icons
- **API Integration**: OpenAI API
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd analysis-calculator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Running the Application

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/          # OpenAI API integration
│   ├── components/
│   │   ├── Calculator.tsx # Financial calculator component
│   │   ├── ChatBot.tsx    # AI chat assistant
│   │   └── Dashboard.tsx  # Stock data dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── utils/                 # Utility functions
└── ...
```

## API Integration

### OpenAI API
The chatbot integrates with OpenAI's API to provide financial assistance. To enable this feature:

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env.local` file
3. The API includes rate limiting for free tier usage

### Alpha Vantage API (Optional)
The dashboard is prepared to integrate with Alpha Vantage for real stock data:

1. Get a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Replace the mock data generation with actual API calls
3. The current implementation uses mock data for demonstration

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
# Optional: ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
```

## Development

### Code Quality

The project includes:
- ESLint for code linting
- TypeScript for type safety
- Prettier for code formatting (recommended)

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Features in Detail

### Financial Calculator
- **Principal Range**: $1,000 - $100,000
- **Interest Rate**: 1% - 20% annually
- **Time Period**: 1 - 30 years
- **Calculations**: Compound interest with real-time updates

### AI Assistant Capabilities
- Investment strategy explanations
- Financial concept definitions
- Risk assessment guidance
- Portfolio analysis interpretation
- Market trend explanations

### Dashboard Features
- 30-day stock price history
- Interactive chart with zoom and pan
- Responsive design for all screen sizes
- Mock data with realistic price movements

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security Considerations

- API keys are stored in environment variables
- Rate limiting implemented for API calls
- Input validation on all user inputs
- Secure headers configured in Next.js

## Performance

- Optimized build with Next.js
- Component-level code splitting
- Efficient state management
- Minimal bundle size

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include reproduction steps and environment details

## Roadmap

- [ ] Real-time stock data integration
- [ ] Portfolio tracking features
- [ ] Advanced financial calculators
- [ ] User authentication and profiles
- [ ] Mobile app development
- [ ] Advanced AI features with custom training

---

**Built with ❤️ using Next.js and modern web technologies**

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
