import { useState, useEffect } from 'react'
import './App.css'

// Type definitions for weather data structures
interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
}

function App() {
  // State management
  const [city, setCity] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [isCelsius, setIsCelsius] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Mock weather data generator for demonstration
  // In production, this would be replaced with actual API calls to OpenWeatherMap, WeatherAPI, etc.
  const fetchWeatherData = async (cityName: string): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock current weather data
      const mockWeather: WeatherData = {
        city: cityName,
        country: 'US',
        temperature: Math.floor(Math.random() * 20) + 15, // 15-35°C
        feelsLike: Math.floor(Math.random() * 20) + 13,
        condition: getRandomCondition(),
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        icon: getRandomCondition()
      };

      // Mock 5-day forecast
      const mockForecast: ForecastDay[] = Array.from({ length: 5 }, (_, i) => ({
        date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        tempMax: Math.floor(Math.random() * 15) + 20,
        tempMin: Math.floor(Math.random() * 10) + 10,
        condition: getRandomCondition(),
        icon: getRandomCondition()
      }));

      setCurrentWeather(mockWeather);
      setForecast(mockForecast);
      setCity(cityName);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get random weather conditions
  const getRandomCondition = (): string => {
    const conditions = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Drizzle', 'Mist'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  // Get weather icon emoji based on condition
  const getWeatherIcon = (condition: string): string => {
    const iconMap: { [key: string]: string } = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Drizzle': '🌦️',
      'Mist': '🌫️'
    };
    return iconMap[condition] || '🌤️';
  };

  // Temperature conversion functions
  const celsiusToFahrenheit = (celsius: number): number => {
    return Math.round((celsius * 9/5) + 32);
  };

  const displayTemp = (celsius: number): number => {
    return isCelsius ? Math.round(celsius) : celsiusToFahrenheit(celsius);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeatherData(searchInput.trim());
      setSearchInput('');
    }
  };

  // Toggle temperature unit
  const toggleUnit = (): void => {
    setIsCelsius(!isCelsius);
  };

  // Load default city on mount
  useEffect(() => {
    fetchWeatherData('New York');
  }, []);

  return (
    <div className="app">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="icon">🌤️</span>
            Weather Dashboard
          </h1>
          <p className="app-subtitle">Real-time weather updates for any city</p>
        </div>
      </header>

      {/* Search Section */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for a city..."
              className="search-input"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !searchInput.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Temperature Unit Toggle */}
        <div className="unit-toggle">
          <button
            onClick={toggleUnit}
            className={`toggle-button ${isCelsius ? 'active-celsius' : 'active-fahrenheit'}`}
          >
            <span className={isCelsius ? 'active' : ''}>°C</span>
            <span className="separator">|</span>
            <span className={!isCelsius ? 'active' : ''}>°F</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        ) : currentWeather ? (
          <>
            {/* Current Weather Card */}
            <div className="current-weather">
              <div className="weather-header">
                <div className="location">
                  <h2>{currentWeather.city}</h2>
                  <p>{currentWeather.country}</p>
                </div>
                <div className="weather-icon-large">
                  {getWeatherIcon(currentWeather.condition)}
                </div>
              </div>

              <div className="temperature-display">
                <div className="temp-main">
                  {displayTemp(currentWeather.temperature)}°
                </div>
                <div className="temp-details">
                  <p className="condition">{currentWeather.condition}</p>
                  <p className="feels-like">
                    Feels like {displayTemp(currentWeather.feelsLike)}°
                  </p>
                </div>
              </div>

              <div className="weather-stats">
                <div className="stat-item">
                  <span className="stat-icon">💧</span>
                  <div className="stat-info">
                    <p className="stat-label">Humidity</p>
                    <p className="stat-value">{currentWeather.humidity}%</p>
                  </div>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">💨</span>
                  <div className="stat-info">
                    <p className="stat-label">Wind Speed</p>
                    <p className="stat-value">{currentWeather.windSpeed} km/h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="forecast-section">
              <h3 className="forecast-title">5-Day Forecast</h3>
              <div className="forecast-grid">
                {forecast.map((day, index) => (
                  <div key={index} className="forecast-card">
                    <p className="forecast-date">{day.date}</p>
                    <div className="forecast-icon">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <p className="forecast-condition">{day.condition}</p>
                    <div className="forecast-temps">
                      <span className="temp-max">
                        {displayTemp(day.tempMax)}°
                      </span>
                      <span className="temp-divider">/</span>
                      <span className="temp-min">
                        {displayTemp(day.tempMin)}°
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="no-data">
            <span className="no-data-icon">🌍</span>
            <p>Search for a city to see weather information</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Weather Dashboard © 2024 | Built with React & TypeScript</p>
      </footer>
    </div>
  )
}

export default App