# Weather App (The Odin Project)

A simple weather forecast app built for The Odin Project. It supports:

- Location search
- Current weather conditions
- 5-day forecast
- Light/dark theme toggle
- Fahrenheit/Celsius toggle

## Live API Setup

This project uses the OpenWeather API. To run it locally, you need your own API key.

1. Sign up at [OpenWeather](https://openweathermap.org/) and create an API key.
2. In the project root, create a file named `config.local.js`.
3. Add the following content:

```js
window.WEATHER_CONFIG = {
    API_KEY: "YOUR_OPENWEATHER_API_KEY"
};
```

4. Save the file and open `index.html` in your browser (or run it with your local dev server).

## Important Notes

- `config.local.js` is ignored by git so your API key is not committed.
- `config.example.js` is included as a template for collaborators.

## Project Structure

- `index.html` - app markup and component layout
- `index.css` - styling and theme-related styles
- `index.js` - weather fetch logic, forecast rendering, and interactions
- `config.example.js` - API config template
