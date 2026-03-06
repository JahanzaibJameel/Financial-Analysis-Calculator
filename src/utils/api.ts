import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API configuration
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default configuration
export const apiClient: AxiosInstance = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error);
    
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          throw new Error('Unauthorized: Please check your API credentials');
        case 429:
          throw new Error('Rate limit exceeded. Please try again later');
        case 500:
          throw new Error('Server error. Please try again later');
        default:
          throw new Error(data?.error || `Request failed with status ${status}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error: Please check your internet connection');
    } else {
      // Something else happened
      throw new Error('Request setup error: ' + error.message);
    }
  }
);

// OpenAI API helper
export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const openaiAPI = {
  async chat(messages: OpenAIMessage[]): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      const response = await apiClient.post<OpenAIResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a professional financial advisor and analyst. Provide accurate, helpful financial guidance while being clear about limitations. 
              
              Guidelines:
              - Always clarify that you're not providing personalized financial advice
              - Explain financial concepts clearly
              - Provide general investment education
              - Mention that users should consult qualified professionals for personal advice
              - Be concise but thorough
              - Use simple language when possible`
            },
            ...messages
          ],
          max_tokens: 1000,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      return response.data.choices[0]?.message?.content || 
             'I apologize, but I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  },
};

// Alpha Vantage API helper (for future stock data integration)
export interface AlphaVantageQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  latestTradingDay: string;
}

export const alphaVantageAPI = {
  async getQuote(symbol: string): Promise<AlphaVantageQuote> {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Alpha Vantage API key is not configured');
    }

    try {
      const response = await apiClient.get(
        `https://www.alphavantage.co/query`,
        {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol,
            apikey: apiKey,
          },
        }
      );

      const data = response.data;
      const quote = data['Global Quote'];

      if (!quote) {
        throw new Error('Invalid stock symbol or API limit reached');
      }

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        latestTradingDay: quote['07. latest trading day'],
      };
    } catch (error) {
      console.error('Alpha Vantage API Error:', error);
      throw error;
    }
  },

  async getTimeSeriesDaily(symbol: string, outputSize: string = 'compact') {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Alpha Vantage API key is not configured');
    }

    try {
      const response = await apiClient.get(
        `https://www.alphavantage.co/query`,
        {
          params: {
            function: 'TIME_SERIES_DAILY',
            symbol,
            outputsize: outputSize,
            apikey: apiKey,
          },
        }
      );

      const data = response.data;
      const timeSeries = data['Time Series (Daily)'];

      if (!timeSeries) {
        throw new Error('Invalid stock symbol or API limit reached');
      }

      return Object.entries(timeSeries).map(([date, values]: [string, unknown]) => {
        const typedValues = values as Record<string, string>;
        return {
          date,
          open: parseFloat(typedValues['1. open']),
          high: parseFloat(typedValues['2. high']),
          low: parseFloat(typedValues['3. low']),
          close: parseFloat(typedValues['4. close']),
          volume: parseInt(typedValues['5. volume']),
        };
      });
    } catch (error) {
      console.error('Alpha Vantage API Error:', error);
      throw error;
    }
  },
};

// Generic API helper functions
export const apiHelpers = {
  // Retry mechanism for failed requests
  async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: unknown;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (i === maxRetries - 1) {
          break;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }

    throw lastError as Error;
  },

  // Debounce function for API calls
  debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Cache API responses
  createCache() {
    const cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

    return {
      get(key: string): unknown | null {
        const item = cache.get(key);
        if (!item) return null;
        
        if (Date.now() > item.timestamp + item.ttl) {
          cache.delete(key);
          return null;
        }
        
        return item.data;
      },
      
      set(key: string, data: unknown, ttl: number = 300000): void { // 5 minutes default TTL
        cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl,
        });
      },
      
      clear(): void {
        cache.clear();
      },
    };
  },
};

// Export default API client
export default apiClient;
