const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Sample weather data for different cities
const weatherData = {
    'london': {
        name: 'London',
        country: 'GB',
        coord: { lat: 51.5074, lon: -0.1278 },
        weather: [
            {
                main: 'Clouds',
                description: 'overcast clouds',
                icon: '04d'
            }
        ],
        main: {
            temp: 18.5,
            feels_like: 17.8,
            temp_min: 16.2,
            temp_max: 20.1,
            pressure: 1013,
            humidity: 72
        },
        visibility: 10000,
        wind: {
            speed: 3.2,
            deg: 240
        },
        sys: {
            country: 'GB',
            sunrise: 1721800320,
            sunset: 1721859840
        }
    },
    'new york': {
        name: 'New York',
        country: 'US',
        coord: { lat: 40.7128, lon: -74.0060 },
        weather: [
            {
                main: 'Clear',
                description: 'clear sky',
                icon: '01d'
            }
        ],
        main: {
            temp: 24.3,
            feels_like: 26.1,
            temp_min: 21.5,
            temp_max: 27.2,
            pressure: 1018,
            humidity: 58
        },
        visibility: 16000,
        wind: {
            speed: 2.8,
            deg: 180
        },
        sys: {
            country: 'US',
            sunrise: 1721810420,
            sunset: 1721862240
        }
    },
    'tokyo': {
        name: 'Tokyo',
        country: 'JP',
        coord: { lat: 35.6762, lon: 139.6503 },
        weather: [
            {
                main: 'Rain',
                description: 'light rain',
                icon: '10d'
            }
        ],
        main: {
            temp: 28.7,
            feels_like: 32.1,
            temp_min: 26.3,
            temp_max: 31.5,
            pressure: 1008,
            humidity: 78
        },
        visibility: 8000,
        wind: {
            speed: 4.1,
            deg: 90
        },
        sys: {
            country: 'JP',
            sunrise: 1721771520,
            sunset: 1721822340
        }
    },
    'paris': {
        name: 'Paris',
        country: 'FR',
        coord: { lat: 48.8566, lon: 2.3522 },
        weather: [
            {
                main: 'Sunny',
                description: 'sunny',
                icon: '01d'
            }
        ],
        main: {
            temp: 22.4,
            feels_like: 21.9,
            temp_min: 19.8,
            temp_max: 25.1,
            pressure: 1020,
            humidity: 65
        },
        visibility: 12000,
        wind: {
            speed: 2.5,
            deg: 200
        },
        sys: {
            country: 'FR',
            sunrise: 1721797920,
            sunset: 1721853840
        }
    },
    'mumbai': {
        name: 'Mumbai',
        country: 'IN',
        coord: { lat: 19.0760, lon: 72.8777 },
        weather: [
            {
                main: 'Rain',
                description: 'moderate rain',
                icon: '10d'
            }
        ],
        main: {
            temp: 26.8,
            feels_like: 29.5,
            temp_min: 25.2,
            temp_max: 28.4,
            pressure: 1006,
            humidity: 85
        },
        visibility: 6000,
        wind: {
            speed: 5.2,
            deg: 270
        },
        sys: {
            country: 'IN',
            sunrise: 1721777820,
            sunset: 1721825220
        }
    },
    'sydney': {
        name: 'Sydney',
        country: 'AU',
        coord: { lat: -33.8688, lon: 151.2093 },
        weather: [
            {
                main: 'Clear',
                description: 'clear sky',
                icon: '01d'
            }
        ],
        main: {
            temp: 16.2,
            feels_like: 14.8,
            temp_min: 13.5,
            temp_max: 19.1,
            pressure: 1025,
            humidity: 68
        },
        visibility: 15000,
        wind: {
            speed: 3.8,
            deg: 150
        },
        sys: {
            country: 'AU',
            sunrise: 1721772420,
            sunset: 1721810220
        }
    }
};

// Generate forecast data
const generateForecast = (baseTemp) => {
    const forecast = [];
    const weatherTypes = [
        { main: 'Clear', description: 'clear sky', icon: '01d' },
        { main: 'Clouds', description: 'few clouds', icon: '02d' },
        { main: 'Clouds', description: 'scattered clouds', icon: '03d' },
        { main: 'Rain', description: 'light rain', icon: '10d' },
        { main: 'Sunny', description: 'sunny', icon: '01d' }
    ];

    for (let i = 0; i < 40; i++) { // 5 days * 8 entries per day (3-hour intervals)
        const dayOffset = Math.floor(i / 8);
        const tempVariation = (Math.random() - 0.5) * 6; // ±3°C variation
        const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        
        forecast.push({
            dt: Date.now() / 1000 + (i * 10800), // 3-hour intervals
            main: {
                temp: baseTemp + tempVariation,
                temp_min: baseTemp + tempVariation - 2,
                temp_max: baseTemp + tempVariation + 2,
                humidity: 60 + Math.floor(Math.random() * 30)
            },
            weather: [weather],
            wind: {
                speed: 1 + Math.random() * 5
            }
        });
    }

    return forecast;
};

// Routes

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get weather by city name
app.get('/api/weather', (req, res) => {
    const city = req.query.q;
    
    if (!city) {
        return res.status(400).json({
            error: 'City name is required',
            message: 'Please provide a city name using the ?q= parameter'
        });
    }

    const cityKey = city.toLowerCase();
    const data = weatherData[cityKey];

    if (!data) {
        return res.status(404).json({
            error: 'City not found',
            message: `Weather data for "${city}" is not available. Try: London, New York, Tokyo, Paris, Mumbai, or Sydney`
        });
    }

    // Add current timestamp
    const responseData = {
        ...data,
        dt: Math.floor(Date.now() / 1000)
    };

    res.json(responseData);
});

// Get weather by coordinates (return closest city based on region)
app.get('/api/weather/coordinates', (req, res) => {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
        return res.status(400).json({
            error: 'Coordinates required',
            message: 'Please provide lat and lon parameters'
        });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // Determine which city to return based on approximate geographic regions
    let selectedCity = 'london'; // default

    if (latitude >= 40 && latitude <= 45 && longitude >= -75 && longitude <= -70) {
        selectedCity = 'new york'; // North America - East Coast
    } else if (latitude >= 35 && latitude <= 36 && longitude >= 139 && longitude <= 140) {
        selectedCity = 'tokyo'; // Japan
    } else if (latitude >= 48 && latitude <= 49 && longitude >= 2 && longitude <= 3) {
        selectedCity = 'paris'; // France
    } else if (latitude >= 19 && latitude <= 20 && longitude >= 72 && longitude <= 73) {
        selectedCity = 'mumbai'; // India
    } else if (latitude >= -34 && latitude <= -33 && longitude >= 151 && longitude <= 152) {
        selectedCity = 'sydney'; // Australia
    }

    const data = weatherData[selectedCity];
    const responseData = {
        ...data,
        dt: Math.floor(Date.now() / 1000),
        coord: { lat: latitude, lon: longitude }
    };

    res.json(responseData);
});

// Get 5-day forecast
app.get('/api/forecast', (req, res) => {
    const city = req.query.q;
    const { lat, lon } = req.query;
    
    let baseData;
    
    if (city) {
        const cityKey = city.toLowerCase();
        baseData = weatherData[cityKey];
    } else if (lat && lon) {
        baseData = weatherData['london']; // Default for coordinates
    }
    
    if (!baseData) {
        return res.status(404).json({
            error: 'Location not found',
            message: 'Unable to generate forecast for this location'
        });
    }

    const forecast = generateForecast(baseData.main.temp);
    
    res.json({
        city: {
            name: baseData.name,
            country: baseData.country,
            coord: baseData.coord
        },
        list: forecast
    });
});

// Get UV Index (simplified)
app.get('/api/uvi', (req, res) => {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
        return res.status(400).json({
            error: 'Coordinates required'
        });
    }

    // Return a random UV index for demo
    const uvValue = Math.floor(Math.random() * 10) + 1;
    
    res.json({
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        value: uvValue
    });
});

// API info endpoint
app.get('/api', (req, res) => {
    res.json({
        name: 'Simple Weather API',
        version: '1.0.0',
        description: 'A basic weather API for demonstration purposes',
        endpoints: {
            'GET /api/weather?q={city}': 'Get current weather by city name',
            'GET /api/weather/coordinates?lat={lat}&lon={lon}': 'Get current weather by coordinates',
            'GET /api/forecast?q={city}': 'Get 5-day forecast by city name',
            'GET /api/uvi?lat={lat}&lon={lon}': 'Get UV index by coordinates'
        },
        availableCities: Object.keys(weatherData)
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: 'Something went wrong on the server'
    });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        message: 'Please check the API documentation at /api'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🌤️  Weather API Server running on http://localhost:${PORT}`);
    console.log(`📡 API Documentation: http://localhost:${PORT}/api`);
    console.log(`🌐 Weather App: http://localhost:${PORT}`);
});
