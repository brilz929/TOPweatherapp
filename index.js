const API_KEY = window.WEATHER_CONFIG?.API_KEY;

// Form & Input Elements
const weatherForm = document.querySelector(".weather-form");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const unitSwitch = document.getElementById("unit-switch");

// Display Elements
const tempText = document.querySelector(".temp-text");
const humidityText = document.getElementById("humidity");
const windText = document.getElementById("wind");
const precipitationText = document.getElementById("precipitation");
const weatherIcon = document.querySelector(".weather-icon");
const currentDateText = document.querySelector(".current-date");
const locationTitle = document.querySelector(".location-title");
const forecastCarousel = document.querySelector(".google-style-carousel");

const performSearch = async (cityOverride) => {
    let query = cityOverride || searchInput.value.trim();
    if (!query) return;

    const unitSystem = unitSwitch.checked ? "metric" : "imperial";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query},US&units=${unitSystem}&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${query},US&units=${unitSystem}&appid=${API_KEY}`;

    try {
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        if (!weatherRes.ok || !forecastRes.ok) throw new Error("Location not found");

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        locationTitle.textContent = weatherData.name;
        displayWeatherData(weatherData);
        displayForecastData(forecastData);
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Could not find that location. Please try again.");
    } finally {
        searchInput.value = "";
    }
};


function displayWeatherData(data) {
    const isCelsius = unitSwitch.checked;
    const unitSymbol = isCelsius ? "°C" : "°F";

    tempText.textContent = `${Math.round(data.main.temp)} ${unitSymbol}`;
    humidityText.textContent = `Humidity: ${data.main.humidity}%`;
    
    const windSpeed = isCelsius ? `${data.wind.speed} m/s` : `${data.wind.speed} mph`;
    windText.textContent = `Wind: ${windSpeed}`;

    // API uses '1h', not '1hr'[cite: 3]
    const rain = data.rain ? data.rain['1h'] || 0 : 0;
    const snow = data.snow ? data.snow['1h'] || 0 : 0;
    precipitationText.textContent = `Precipitation: ${rain + snow} mm`;

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.style.display = "inline-block";

    currentDateText.textContent = getLocalTime(data.timezone);
    document.querySelector(".weather-info").style.display = "flex";
}

function displayForecastData(data) {
    forecastCarousel.innerHTML = "";

    const dailyData = data.list.filter(reading => reading.dt_txt.includes("12:00:00"));

    dailyData.forEach((day, index) => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const icon = day.weather[0].icon;
      
        const highTemp = Math.round(day.main.temp_max); 
        const lowTemp = Math.round(day.main.temp_min);

        const slide = document.createElement('sl-carousel-item');
        
      
        const activeClass = index === 0 ? "is-active" : "";

        slide.innerHTML = `
            <div class="forecast-card ${activeClass}">
                <h5>${dayName}</h5>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather">
                <div class="forecast-temp-range">
                    <span class="high-temp">${highTemp}°</span>
                    <span class="low-temp">${lowTemp}°</span>
                </div>
            </div>
        `;
        forecastCarousel.appendChild(slide);
    });
}


function getLocalTime(offsetSeconds) {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cityDate = new Date(utc + (1000 * offsetSeconds));

    return cityDate.toLocaleString('en-US', {
        weekday: "long",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}


async function init() {
    await Promise.all([
        customElements.whenDefined('sl-switch'),
        customElements.whenDefined('sl-input'),
        customElements.whenDefined('sl-icon'),
        customElements.whenDefined('sl-carousel')
    ]);

    if (searchBtn) {
        searchBtn.style.cursor = "pointer";
        searchBtn.addEventListener("click", (e) => {
            e.stopPropagation(); 
            performSearch();
        });
    }

    weatherForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        performSearch();
    });

    unitSwitch?.addEventListener("sl-change", () => {
        const currentCity = locationTitle.textContent.trim();
        if (currentCity) {
            console.log("Switching units for:", currentCity);
            performSearch(currentCity);
        }
    });
}

init();
//theme
(function () {
    const STORAGE_KEY = "weather-app-theme";
    const html = document.documentElement;
    const toggle = document.getElementById("theme-toggle");

    function getStoredTheme() {
        try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
    }

    function setStoredTheme(theme) {
        try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";
        html.setAttribute("data-theme", isDark ? "dark" : "light");
        html.classList.toggle("sl-theme-dark", isDark);
        if (toggle) {
            toggle.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
        }
    }

    function resolveInitialTheme() {
        const stored = getStoredTheme();
        if (stored === "light" || stored === "dark") return stored;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    applyTheme(resolveInitialTheme());

    toggle?.addEventListener("click", function () {
        const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        setStoredTheme(next);
    });

    window.matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
            if (getStoredTheme()) return;
            applyTheme(e.matches ? "dark" : "light");
        });
})();