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

type State = { loading: boolean; error: string | null; weather: Weather | null };

const conditionFromIcon = (icon: string): WeatherCondition => {
  const c = icon.slice(0, 2);
  if (c === "01") return "clear";
  if (c === "02" || c === "03" || c === "04") return "clouds";
  if (c === "09" || c === "10") return "rain";
  if (c === "11") return "thunder";
  if (c === "13") return "snow";
  return "mist";
};

const API_KEY = "ae6afae4699dca92a0ee23ed7f047038";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
// Last-resort location so the hero always shows weather.
const DEFAULT_CITY = "Dhaka";

const parse = (data: any): Weather => {
  const w = data?.weather?.[0] || {};
  const icon = String(w.icon || "01d");
  return {
    city: data?.name || "",
    temp: Math.round(data?.main?.temp ?? 0),
    description: w.description || "",
    humidity: data?.main?.humidity ?? 0,
    condition: conditionFromIcon(icon),
    isNight: icon.endsWith("n"),
  };
};

/**
 * Current weather, resilient to blocked location.
 *
 * Chain: precise browser geolocation (per-user, if the user allows it) →
 * approximate IP-based location (per-user, no permission prompt) → a default
 * city. Because the live site's users mostly don't grant the location prompt,
 * relying on geolocation alone left the hero blank — the IP fallback fixes that
 * while still using precise coordinates when they're offered. Refreshed every
 * 10 minutes.
 */
export const useWeather = (): State => {
  const [state, setState] = useState<State>({
    loading: true,
    error: null,
    weather: null,
  });

  useEffect(() => {
    let cancelled = false;
    const ok = (data: any) =>
      !cancelled && setState({ loading: false, error: null, weather: parse(data) });

    const byCoords = async (lat: number, lon: number) => {
      const { data } = await axios.get(API_URL, {
        params: { lat, lon, appid: API_KEY, units: "metric" },
      });
      ok(data);
    };
    const byCity = async (q: string) => {
      const { data } = await axios.get(API_URL, {
        params: { q, appid: API_KEY, units: "metric" },
      });
      ok(data);
    };

    // Precise location — resolves null on deny/timeout/no-support (never throws).
    const geolocate = () =>
      new Promise<{ lat: number; lon: number } | null>((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
          () => resolve(null),
          { timeout: 7000, maximumAge: 10 * 60 * 1000 }
        );
      });

    // Approximate location from IP — no permission needed. Two providers.
    const ipLocate = async (): Promise<{ lat: number; lon: number } | null> => {
      try {
        const { data } = await axios.get("https://ipwho.is/", { timeout: 7000 });
        if (data?.success && data.latitude && data.longitude)
          return { lat: Number(data.latitude), lon: Number(data.longitude) };
      } catch {
        /* try next */
      }
      try {
        const { data } = await axios.get("https://get.geojs.io/v1/ip/geo.json", {
          timeout: 7000,
        });
        if (data?.latitude && data?.longitude)
          return { lat: Number(data.latitude), lon: Number(data.longitude) };
      } catch {
        /* fall through */
      }
      return null;
    };

    const run = async () => {
      try {
        const geo = await geolocate();
        if (geo) return await byCoords(geo.lat, geo.lon);
        const ip = await ipLocate();
        if (ip) return await byCoords(ip.lat, ip.lon);
        return await byCity(DEFAULT_CITY);
      } catch {
        try {
          await byCity(DEFAULT_CITY);
        } catch {
          if (!cancelled)
            setState({ loading: false, error: "Unable to fetch weather.", weather: null });
        }
      }
    };

    run();
    const id = setInterval(run, 10 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return state;
};
