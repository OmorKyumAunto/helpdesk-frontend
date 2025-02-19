import React, { useState, useEffect } from "react";
import axios from "axios";

interface WeatherData {
  name: string; // City or district name
  main: {
    temp: number; // Temperature
    humidity: number; // Humidity
  };
  weather: {
    description: string; // Weather description
    icon: string; // Icon ID for the weather
  }[];
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = "ae6afae4699dca92a0ee23ed7f047038"; // Your OpenWeatherMap API key
  const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

  const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
    setError(null);

    try {
      const response = await axios.get(API_URL, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: "metric",
        },
      });
      setWeather(response.data);
    } catch {
      setError("Unable to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchWeatherForLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // Initial fetch
            fetchWeatherByCoordinates(latitude, longitude);

            // Set interval for subsequent updates (every 10 minutes)
            intervalId = setInterval(() => {
              fetchWeatherByCoordinates(latitude, longitude);
            }, 10 * 60 * 1000); // 10 minutes
          },
          () => {
            setError("Unable to access your location. Please enable location services.");
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };

    fetchWeatherForLocation();

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        background: "transparent", // Fully transparent background
        color: "#ffffff",
        display: "flex",
        flexDirection: "column", // Stack elements vertically
        alignItems: "flex-end", // Align items to the right
        justifyContent: "center",
        textAlign: "right", // Align text to the right
        cursor: "pointer",
      }}
    >
      {loading && <p>Loading Weather data...</p>}
      {error && <p style={{ color: "#ff4d4f" }}>{error}</p>}
      {weather && (
        <>
          <h3 style={{ margin: "0 0 2px 0", fontSize: "12px", fontWeight: "bold" }}>
            {weather.name}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {Math.round(weather.main.temp)}°C
          </p>
          <p style={{ margin: "1px 0", fontSize: "12px", textTransform: "capitalize" }}>
            {weather.weather[0].description}
          </p>
          <p style={{ fontSize: "12px", marginTop: "2px" }}>
            <strong>Humidity:</strong> {weather.main.humidity}%
          </p>
        </>
      )}
    </div>
  );
};

export default WeatherWidget;
