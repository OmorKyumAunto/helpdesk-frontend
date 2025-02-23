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

            // Fetch data initially and set up polling
            fetchWeatherByCoordinates(latitude, longitude);
            intervalId = setInterval(() => {
              fetchWeatherByCoordinates(latitude, longitude);
            }, 10 * 60 * 1000); // Refresh every 10 minutes
          },
          () => {
            setError(
              "Unable to access your location. Please enable location services."
            );
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
        width: "100%",
        // maxWidth: "360px",
        // minWidth: "260px",
        margin: "3px auto",
        padding: "30px",
        borderRadius: "16px",
        background:
          "linear-gradient(60deg,rgb(18, 238, 201),rgb(44, 171, 230), #1A2980, #203A43)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 10s ease infinite",
        color: "#ffffff",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "110px",
        textAlign: "left",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.03)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 16px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 8px rgba(0,0,0,0.2)";
      }}
    >
      {loading && <p>Loading weather data...</p>}
      {error && <p style={{ color: "#ff4d4f" }}>{error}</p>}
      {weather && (
        <>
          <div>
            <h3
              style={{
                margin: "0 0 4px 0",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {weather.name}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {Math.round(weather.main.temp)}°C
            </p>
            <p
              style={{
                margin: "4px 0",
                fontSize: "12px",
                textTransform: "capitalize",
              }}
            >
              {weather.weather[0].description}
            </p>
          </div>
          <div
            style={{
              height: "70px",
              width: "70px",
              borderRadius: "50%",
              background: "#ffffff33",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#ffffff",
              fontSize: "12px",
              textAlign: "center",
              lineHeight: "1.2",
            }}
          >
            <div>
              Humidity
              <br />
              <strong>{weather.main.humidity}%</strong>
            </div>
          </div>
        </>
      )}

      {/* Gradient animation */}
      <style>
        {`
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default WeatherWidget;
