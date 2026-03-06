// Example function to fetch stock data
export async function fetchStockData(symbol: string) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Check if the API returned an error
    if (data['Error Message']) {
      throw new Error('Invalid stock symbol');
    }

    // Extract the most recent data points
    const timeSeries = data['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).slice(0, 30).reverse(); // Last 30 days
    const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

    return { dates, prices };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}