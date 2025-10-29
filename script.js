// Using local API server - no API key needed!
const BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const weatherContainer = document.getElementById('weatherContainer');
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const temp = document.getElementById('temp');
const celsiusBtn = document.getElementById('celsiusBtn');
const fahrenheitBtn = document.getElementById('fahrenheitBtn');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDescription = document.getElementById('weatherDescription');
const visibility = document.getElementById('visibility');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');
const pressure = document.getElementById('pressure');
const uvIndex = document.getElementById('uvIndex');
const forecastGrid = document.getElementById('forecastGrid');

// Global variables
let currentTempCelsius = 0;
let currentTempFahrenheit = 0;
let currentFeelsLikeCelsius = 0;
let currentFeelsLikeFahrenheit = 0;
let isCelsius = true;

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
currentLocationBtn.addEventListener('click', getCurrentLocation);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});
celsiusBtn.addEventListener('click', () => switchTempUnit(true));
fahrenheitBtn.addEventListener('click', () => switchTempUnit(false));

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCurrentDate();
    // Try to get user's current location on page load
    getCurrentLocation();
});

function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    currentDate.textContent = now.toLocaleDateString('en-US', options);
}

function showLoading() {
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    weatherContainer.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    weatherContainer.style.display = 'none';
    hideLoading();
}

function showWeather() {
    weatherContainer.style.display = 'block';
    errorMessage.style.display = 'none';
    hideLoading();
}

function handleSearch() {
    const location = locationInput.value.trim();
    if (!location) {
        showError('Please enter a city name');
        return;
    }
    getWeatherByCity(location);
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        // Fallback to demo location if geolocation not supported
        showLoading();
        setTimeout(() => {
            getWeatherByCoordinates(51.5074, -0.1278); // London coordinates
        }, 500);
        return;
    }

    showLoading();
    
    // Show a brief message about location access
    const originalLoadingText = loading.querySelector('p').textContent;
    loading.querySelector('p').textContent = 'Trying to get your location...';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            loading.querySelector('p').textContent = 'Found your location! Getting weather...';
            getWeatherByCoordinates(lat, lon);
        },
        (error) => {
            // Instead of showing an error, fallback to a demo location
            console.log('Location access denied, using demo location (London)');
            loading.querySelector('p').textContent = 'Using demo location...';
            setTimeout(() => {
                getWeatherByCoordinates(51.5074, -0.1278); // London coordinates as fallback
            }, 1000);
        },
        {
            timeout: 5000, // 5 second timeout
            enableHighAccuracy: false // Don't require high accuracy
        }
    );
}

async function getWeatherByCity(city) {
    showLoading();
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Unable to fetch weather data');
        }

        const data = await response.json();
        await displayWeather(data);
        await getForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        showError(error.message);
    }
}

async function getWeatherByCoordinates(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/weather/coordinates?lat=${lat}&lon=${lon}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Unable to fetch weather data for your location');
        }

        const data = await response.json();
        await displayWeather(data);
        await getForecast(lat, lon);
    } catch (error) {
        showError(error.message);
    }
}

async function getForecast(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}`);
        
        if (!response.ok) {
            throw new Error('Unable to fetch forecast data');
        }

        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error('Forecast error:', error);
        // Don't show error for forecast, just log it
    }
}

async function getUVIndex(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/uvi?lat=${lat}&lon=${lon}`);
        
        if (response.ok) {
            const data = await response.json();
            return data.value;
        }
        return 'N/A';
    } catch (error) {
        return 'N/A';
    }
}

async function displayWeather(data) {
    // Store temperature values
    currentTempCelsius = Math.round(data.main.temp);
    currentTempFahrenheit = Math.round((data.main.temp * 9/5) + 32);
    currentFeelsLikeCelsius = Math.round(data.main.feels_like);
    currentFeelsLikeFahrenheit = Math.round((data.main.feels_like * 9/5) + 32);

    // Update city name
    cityName.textContent = `${data.name}, ${data.sys.country}`;

    // Update temperature
    updateTemperatureDisplay();

    // Update weather icon and description
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    weatherDescription.textContent = data.weather[0].description;

    // Update weather details
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    updateFeelsLikeDisplay();
    pressure.textContent = `${data.main.pressure} hPa`;

    // Get UV Index
    const uvValue = await getUVIndex(data.coord.lat, data.coord.lon);
    uvIndex.textContent = uvValue;

    // Update location input
    locationInput.value = data.name;

    showWeather();
}

function displayForecast(data) {
    forecastGrid.innerHTML = '';
    
    // Process forecast data to get one entry per day
    const dailyForecasts = {};
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        
        if (!dailyForecasts[dateKey]) {
            dailyForecasts[dateKey] = {
                date: date,
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
                description: item.weather[0].description,
                icon: item.weather[0].icon
            };
        } else {
            // Update min/max temperatures
            dailyForecasts[dateKey].temp_min = Math.min(dailyForecasts[dateKey].temp_min, item.main.temp_min);
            dailyForecasts[dateKey].temp_max = Math.max(dailyForecasts[dateKey].temp_max, item.main.temp_max);
        }
    });

    // Convert to array and take first 5 days
    const forecastArray = Object.values(dailyForecasts).slice(0, 5);

    forecastArray.forEach(forecast => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';

        const dayName = forecast.date.toLocaleDateString('en-US', { weekday: 'short' });
        const tempMin = Math.round(forecast.temp_min);
        const tempMax = Math.round(forecast.temp_max);

        forecastItem.innerHTML = `
            <div class="day">${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${forecast.icon}.png" alt="${forecast.description}">
            <div class="temp-range">${tempMax}° / ${tempMin}°</div>
            <div class="description">${forecast.description}</div>
        `;

        forecastGrid.appendChild(forecastItem);
    });
}

function switchTempUnit(celsius) {
    isCelsius = celsius;
    
    if (celsius) {
        celsiusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
    } else {
        fahrenheitBtn.classList.add('active');
        celsiusBtn.classList.remove('active');
    }
    
    updateTemperatureDisplay();
    updateFeelsLikeDisplay();
}

function updateTemperatureDisplay() {
    if (isCelsius) {
        temp.textContent = `${currentTempCelsius}°`;
    } else {
        temp.textContent = `${currentTempFahrenheit}°`;
    }
}

function updateFeelsLikeDisplay() {
    if (isCelsius) {
        feelsLike.textContent = `${currentFeelsLikeCelsius}°C`;
    } else {
        feelsLike.textContent = `${currentFeelsLikeFahrenheit}°F`;
    }
}

// Add some sample cities for quick testing (you can remove this)
function addQuickSearchButtons() {
    const searchContainer = document.querySelector('.search-container');
    const quickSearch = document.createElement('div');
    quickSearch.style.textAlign = 'center';
    quickSearch.style.marginTop = '15px';
    quickSearch.innerHTML = `
        <p style="color: white; margin-bottom: 10px; font-size: 0.9rem;">Quick search:</p>
        <button onclick="searchCity('London')" style="margin: 0 5px; padding: 8px 15px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; cursor: pointer;">London</button>
        <button onclick="searchCity('New York')" style="margin: 0 5px; padding: 8px 15px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; cursor: pointer;">New York</button>
        <button onclick="searchCity('Tokyo')" style="margin: 0 5px; padding: 8px 15px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; cursor: pointer;">Tokyo</button>
        <button onclick="searchCity('Paris')" style="margin: 0 5px; padding: 8px 15px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; cursor: pointer;">Paris</button>
    `;
    searchContainer.appendChild(quickSearch);
}

function searchCity(city) {
    locationInput.value = city;
    getWeatherByCity(city);
}

// Add quick search buttons on load
document.addEventListener('DOMContentLoaded', () => {
    addQuickSearchButtons();
});
