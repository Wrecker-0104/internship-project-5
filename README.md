# Weather App with Local API

A modern, responsive weather application with its own Node.js API backend. No external API keys required!

## Features

- 🌍 **Location-based Weather**: Get weather for your current location or search for any city
- 🌡️ **Temperature Units**: Toggle between Celsius and Fahrenheit
- 📊 **Detailed Information**: View humidity, wind speed, pressure, visibility, UV index, and "feels like" temperature
- 📅 **5-Day Forecast**: See upcoming weather conditions
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- 🚀 **Local API**: Uses a custom Node.js API server (no external dependencies!)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
**Option A: Using npm**
```bash
npm start
```

**Option B: Using the batch file (Windows)**
```bash
start-server.bat
```

### 3. Open the App
- The server will start on `http://localhost:3000`
- Open your browser and go to `http://localhost:3000`
- The weather app will load automatically!

## Available Cities

The local API includes weather data for these cities:
- London, UK
- New York, US
- Tokyo, Japan
- Paris, France
- Mumbai, India
- Sydney, Australia

## API Endpoints

The local API provides these endpoints:

- `GET /api/weather?q={city}` - Get current weather by city name
- `GET /api/weather/coordinates?lat={lat}&lon={lon}` - Get weather by coordinates
- `GET /api/forecast?q={city}` - Get 5-day forecast
- `GET /api/uvi?lat={lat}&lon={lon}` - Get UV index
- `GET /api` - API documentation

## How to Use

### Search for Weather
- **By City Name**: Type a city name from the available list
- **Current Location**: Click the location button (returns London data for demo)
- **Quick Search**: Use the quick search buttons for popular cities

### Temperature Units
- Click the °C or °F buttons to switch between Celsius and Fahrenheit

## Files Structure

```
weather-app/
├── server.js          # Node.js API server
├── index.html         # Main HTML file
├── style.css          # Stylesheet with responsive design
├── script.js          # Frontend JavaScript
├── package.json       # Node.js dependencies
├── start-server.bat   # Windows batch file to start server
└── README.md          # This file
```

## API Details

### Local Weather API
- Built with Node.js and Express
- Serves weather data for 6 major cities
- Generates realistic forecast data
- No external API dependencies
- Runs on localhost:3000

### Sample Weather Data
The API includes realistic weather data with:
- Current temperature and conditions
- Weather icons and descriptions
- Humidity, pressure, wind speed
- Visibility and "feels like" temperature
- 5-day forecasts with 3-hour intervals
- UV index data

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### "Failed to fetch" or Network Errors
- Make sure the server is running (`npm start`)
- Check that you're accessing `http://localhost:3000`
- Ensure no other application is using port 3000

### "City not found" Error
- Only these cities are available: London, New York, Tokyo, Paris, Mumbai, Sydney
- Check the spelling matches exactly
- City names are case-insensitive

### Server Won't Start
- Make sure Node.js is installed
- Run `npm install` to install dependencies
- Check if port 3000 is already in use

## Extending the App

### Adding More Cities
1. Open `server.js`
2. Add new city data to the `weatherData` object
3. Follow the same structure as existing cities
4. Restart the server

### Customizing Weather Data
- Modify the weather conditions in `server.js`
- Update temperatures, humidity, wind speed, etc.
- Add new weather types or icons

## Development

### Starting in Development Mode
```bash
npm run dev
```
This uses nodemon for automatic server restarts when you make changes.

## Credits

- Built with Node.js and Express
- Icons from [Font Awesome](https://fontawesome.com/)
- Weather icons from OpenWeatherMap icon set
- Pure HTML, CSS, and JavaScript frontend

## License

This project is open source and available under the [MIT License](https://mit-license.org/).

---

Enjoy your local weather app! 🌤️
