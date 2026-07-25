import { useEffect, useState } from "react";
import axios from "axios";

export type WeatherCondition =
  | "clear"
  | "clouds"
  | "rain"
  | "thunder"
  | "snow"
  | "mist";

export type Weather = {
  city: string;
  temp: number;
  description: string;
  humidity: number;
  condition: WeatherCondition;
  isNight: boolean;
};

type State = {
  loading: boolean;
  error: string | null;
  weather: Weather | null;
};

// OpenWeather icon code → condition group. The 3rd char (d/n) gives day/night.
const conditionFromIcon = (icon: string): WeatherCondition => {
  const c = icon.slice(0, 2);
  if (c === "01") return "clear";
  if (c === "02" || c === "03" || c === "04") return "clouds";
  if (c === "09" || c === "10") return "rain";
  if (c === "11") return "thunder";
  if (c === "13") return "snow";
  return "mist"; // 50 = mist/fog/haze
};

const API_KEY = "ae6afae4699dca92a0ee23ed7f047038";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

/**
 * Current weather for the browser's location. Returns the parsed condition and
 * a day/night flag so the hero can react visually; the raw fields drive the
 * text readout. One fetch, refreshed every 10 minutes.
 */
export const useWeather = (): State => {
  const [state, setState] = useState<State>({
    loading: true,
    error: null,
    weather: null,
  });

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const fetchAt = async (lat: number, lon: number) => {
      try {
        const { data } = await axios.get(API_URL, {
          params: { lat, lon, appid: API_KEY, units: "metric" },
        });
        const w = data?.weather?.[0] || {};
        setState({
          loading: false,
          error: null,
          weather: {
            city: data?.name || "",
            temp: Math.round(data?.main?.temp ?? 0),
            description: w.description || "",
            humidity: data?.main?.humidity ?? 0,
            condition: conditionFromIcon(String(w.icon || "01d")),
            isNight: String(w.icon || "01d").endsWith("n"),
          },
        });
      } catch {
        setState({ loading: false, error: "Unable to fetch weather.", weather: null });
      }
    };

    if (!navigator.geolocation) {
      setState({ loading: false, error: "Geolocation not supported.", weather: null });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchAt(latitude, longitude);
        intervalId = setInterval(() => fetchAt(latitude, longitude), 10 * 60 * 1000);
      },
      () => setState({ loading: false, error: "Location unavailable.", weather: null })
    );

    return () => clearInterval(intervalId);
  }, []);

  return state;
};
