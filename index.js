const { useState, useEffect } = React;


const WeatherIcon = ({ icon, size = 'md' }) => {
    const iconMap = {
        '01d': 'fas fa-sun',
        '01n': 'fas fa-moon',
        '02d': 'fas fa-cloud-sun',
        '02n': 'fas fa-cloud-moon',
        '03d': 'fas fa-cloud',
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-cloud',
        '04n': 'fas fa-cloud',
        '09d': 'fas fa-cloud-rain',
        '09n': 'fas fa-cloud-rain',
        '10d': 'fas fa-cloud-sun-rain',
        '10n': 'fas fa-cloud-moon-rain',
        '11d': 'fas fa-bolt',
        '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake',
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog',
        '50n': 'fas fa-smog',
    };

    const sizeClasses = {
        sm: 'icon-sm',
        md: 'icon-md',
        lg: 'icon-lg'
    };

    return <i className={`${iconMap[icon] || 'fas fa-cloud'} ${sizeClasses[size]}`}></i>;
};


const CurrentWeather = ({ data }) => {
    if (!data) return null;

    const { main, weather, wind, clouds, sys } = data;
    const tempCelsius = Math.round(main.temp);
    const tempFahrenheit = Math.round((main.temp * 9/5) + 32);
    const feelsLike = Math.round(main.feels_like);
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="current-weather">
            <div className="weather-main">
                <div className="weather-icon-container">
                    <WeatherIcon icon={weather[0].icon} size="lg" />
                </div>
                <div className="temperature">
                    <div className="temp-value">
                        {tempCelsius}°C / {tempFahrenheit}°F
                    </div>
                    <div className="weather-description">
                        {weather[0].main} - {weather[0].description}
                    </div>
                    <div className="feels-like">
                        Feels like {feelsLike}°C
                    </div>
                </div>
            </div>

            <div className="weather-details">
                <div className="detail-card">
                    <i className="fas fa-droplet"></i>
                    <div>
                        <p>Humidity</p>
                        <span>{main.humidity}%</span>
                    </div>
                </div>
                <div className="detail-card">
                    <i className="fas fa-wind"></i>
                    <div>
                        <p>Wind Speed</p>
                        <span>{wind.speed} m/s</span>
                    </div>
                </div>
                <div className="detail-card">
                    <i className="fas fa-gauge"></i>
                    <div>
                        <p>Pressure</p>
                        <span>{main.pressure} hPa</span>
                    </div>
                </div>
                <div className="detail-card">
                    <i className="fas fa-eye"></i>
                    <div>
                        <p>Visibility</p>
                        <span>{(data.visibility / 1000).toFixed(1)} km</span>
                    </div>
                </div>
                <div className="detail-card">
                    <i className="fas fa-cloud"></i>
                    <div>
                        <p>Cloud Cover</p>
                        <span>{clouds.all}%</span>
                    </div>
                </div>
                <div className="detail-card">
                    <i className="fas fa-sun"></i>
                    <div>
                        <p>Sunrise</p>
                        <span>{sunrise}</span>
                    </div>
                </div>
                <div className="detail-card">
                    <i className="fas fa-moon"></i>
                    <div>
                        <p>Sunset</p>
                        <span>{sunset}</span>
                    </div>
                </div>
                <div className="detail-card">
                    <i className="fas fa-maximize"></i>
                    <div>
                        <p>Max Temp</p>
                        <span>{Math.round(main.temp_max)}°C</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


const Forecast = ({ data }) => {
    if (!data || data.length === 0) return null;

    
    const dailyForecasts = [];
    const processedDates = new Set();

    data.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toDateString();
        if (!processedDates.has(date)) {
            processedDates.add(date);
            dailyForecasts.push(forecast);
        }
    });

    return (
        <div className="forecast-section">
            <h2>5-Day Forecast</h2>
            <div className="forecast-grid">
                {dailyForecasts.slice(0, 5).map((forecast, index) => (
                    <div key={index} className="forecast-card">
                        <div className="forecast-date">
                            {new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="forecast-icon">
                            <WeatherIcon icon={forecast.weather[0].icon} size="md" />
                        </div>
                        <div className="forecast-temp">
                            <span className="temp-high">{Math.round(forecast.main.temp_max)}°</span>
                            <span className="temp-low">{Math.round(forecast.main.temp_min)}°</span>
                        </div>
                        <div className="forecast-desc">
                            {forecast.weather[0].main}
                        </div>
                        <div className="forecast-humidity">
                            <i className="fas fa-droplet"></i> {forecast.main.humidity}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const SearchBar = ({ onSearch, loading }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input);
            setInput('');
        }
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <div className="search-input-container">
                <input
                    type="text"
                    placeholder="Search for a city... e.g., New York, London, Tokyo"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="search-input"
                />
                <button type="submit" disabled={loading} className="search-button">
                    <i className="fas fa-search"></i> {loading ? 'Searching...' : 'Search'}
                </button>
            </div>
        </form>
    );
};


const WeatherApp = () => {
    const [city, setCity] = useState('New York');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchWeather = async (cityName) => {
        setLoading(true);
        setError('');
        
        try {
            
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
            );
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                setError('City not found. Please try another location.');
                setLoading(false);
                return;
            }

            const { latitude, longitude, name, country, admin1 } = geoData.results[0];
            setCity(`${name}${admin1 ? ', ' + admin1 : ''}${country ? ', ' + country : ''}`);

            
            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,cloud_cover,visibility&timezone=auto&forecast_days=6`
            );
            const weatherData = await weatherResponse.json();

            
            const current = weatherData.current;
            const weatherCode = current.weather_code;
            
            
            const weatherDescription = getWeatherDescription(weatherCode);
            const weatherIcon = getWeatherIcon(weatherCode, weatherData.is_day);

            const currentWeatherObj = {
                main: {
                    temp: current.temperature_2m,
                    feels_like: current.apparent_temperature,
                    humidity: current.relative_humidity_2m,
                    pressure: Math.round(current.pressure_msl),
                    temp_max: current.temperature_2m + 1,
                    temp_min: current.temperature_2m - 1,
                },
                weather: [{
                    main: weatherDescription.main,
                    description: weatherDescription.desc,
                    icon: weatherIcon
                }],
                wind: {
                    speed: current.wind_speed_10m
                },
                clouds: {
                    all: current.cloud_cover
                },
                visibility: current.visibility,
                sys: {
                    sunrise: Math.floor(Date.now() / 1000) - 14400,
                    sunset: Math.floor(Date.now() / 1000) + 43200,
                }
            };

            setCurrentWeather(currentWeatherObj);

            
            const forecastArray = weatherData.daily.time.map((date, index) => ({
                dt: new Date(date).getTime() / 1000,
                main: {
                    temp_max: weatherData.daily.temperature_2m_max[index],
                    temp_min: weatherData.daily.temperature_2m_min[index],
                    humidity: weatherData.daily.relative_humidity_2m_max[index],
                },
                weather: [{
                    main: getWeatherDescription(weatherData.daily.weather_code[index]).main,
                    description: getWeatherDescription(weatherData.daily.weather_code[index]).desc,
                    icon: getWeatherIcon(weatherData.daily.weather_code[index], true)
                }]
            }));

            setForecast(forecastArray.slice(1)); 
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

   
    const getWeatherDescription = (code) => {
        const descriptions = {
            0: { main: 'Clear', desc: 'Clear sky' },
            1: { main: 'Partly Cloudy', desc: 'Mainly clear' },
            2: { main: 'Partly Cloudy', desc: 'Partly cloudy' },
            3: { main: 'Cloudy', desc: 'Overcast' },
            45: { main: 'Foggy', desc: 'Foggy' },
            48: { main: 'Foggy', desc: 'Foggy and rime' },
            51: { main: 'Drizzle', desc: 'Light drizzle' },
            53: { main: 'Drizzle', desc: 'Moderate drizzle' },
            55: { main: 'Drizzle', desc: 'Dense drizzle' },
            61: { main: 'Rainy', desc: 'Slight rain' },
            63: { main: 'Rainy', desc: 'Moderate rain' },
            65: { main: 'Rainy', desc: 'Heavy rain' },
            71: { main: 'Snowy', desc: 'Slight snow' },
            73: { main: 'Snowy', desc: 'Moderate snow' },
            75: { main: 'Snowy', desc: 'Heavy snow' },
            77: { main: 'Snowy', desc: 'Snow grains' },
            80: { main: 'Rainy', desc: 'Slight rain showers' },
            81: { main: 'Rainy', desc: 'Moderate rain showers' },
            82: { main: 'Rainy', desc: 'Violent rain showers' },
            85: { main: 'Snowy', desc: 'Slight snow showers' },
            86: { main: 'Snowy', desc: 'Heavy snow showers' },
            95: { main: 'Thunderstorm', desc: 'Thunderstorm' },
            96: { main: 'Thunderstorm', desc: 'Thunderstorm with slight hail' },
            99: { main: 'Thunderstorm', desc: 'Thunderstorm with heavy hail' },
        };
        return descriptions[code] || { main: 'Unknown', desc: 'Unknown condition' };
    };

    const getWeatherIcon = (code, isDay) => {
        const iconMap = {
            0: isDay ? '01d' : '01n',
            1: isDay ? '02d' : '02n',
            2: isDay ? '02d' : '02n',
            3: '04d',
            45: '50d',
            48: '50n',
            51: '09d',
            53: '09d',
            55: '09d',
            61: '10d',
            63: '10d',
            65: '10d',
            71: '13d',
            73: '13d',
            75: '13d',
            77: '13d',
            80: '10d',
            81: '10d',
            82: '10d',
            85: '13d',
            86: '13d',
            95: '11d',
            96: '11d',
            99: '11d',
        };
        return iconMap[code] || '04d';
    };

    useEffect(() => {
        fetchWeather(city);
    }, []);

    const handleSearch = (searchCity) => {
        fetchWeather(searchCity);
    };

    return (
        <div className="weather-app">
            <div className="container">
                <div className="header">
                    <div className="app-title">
                        <i className="fas fa-cloud-sun"></i>
                        <h1>Weather.io</h1>
                    </div>
                    <p className="subtitle">Get real-time weather updates anywhere</p>
                </div>

                <SearchBar onSearch={handleSearch} loading={loading} />

                {error && (
                    <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Fetching weather data...</p>
                    </div>
                )}

                {currentWeather && !loading && (
                    <>
                        <div className="city-display">
                            <h2>{city}</h2>
                            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <CurrentWeather data={currentWeather} />
                        <Forecast data={forecast} />
                    </>
                )}
            </div>
        </div>
    );
};


ReactDOM.createRoot(document.getElementById('root')).render(<WeatherApp />);
