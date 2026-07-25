import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useWeather } from "./useWeather";
import "./hero-weather.css";

const greetingFor = (hour: number) => {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 20) return "Good evening";
  return "Good night";
};

/**
 * Weather-reactive dashboard hero.
 *
 * The background gradient and an ambient particle layer both respond to the
 * live OpenWeather condition + day/night. When location is blocked, it falls
 * back to a clear day/night look based on the local clock, so it still looks
 * intentional rather than broken. Entrance and effects are pure CSS.
 */
const DashboardHero = () => {
  const { data: profile } = useGetMeQuery();
  const { weather } = useWeather();
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 60_000);
    return () => clearInterval(id);
  }, []);

  const name = profile?.data?.name || "there";
  const firstName = String(name).trim().split(/\s+/)[0];

  // Day/night only shifts the base tone; the aurora itself is time-neutral.
  const hour = now.hour();
  const clockNight = hour < 5 || hour >= 19;
  const isNight = weather ? weather.isNight : clockNight;

  return (
    <div className={`dhero dhero--${isNight ? "night" : "day"}`}>
      <span className="dhero__shine" aria-hidden="true" />

      <div className="dhero__main">
        <div className="dhero__eyebrow">{now.format("dddd, DD MMMM YYYY")}</div>
        <h1 className="dhero__title">
          {greetingFor(hour)}, <span className="dhero__name">{firstName}</span>
        </h1>
        <p className="dhero__sub">
          Welcome Back! Your IT Support Journey Starts Here.
        </p>
      </div>

      {weather && (
        <div className="dhero__weather">
          <div className="dhero__temp">{weather.temp}°C</div>
          <div className="dhero__cond">{weather.description}</div>
          <div className="dhero__meta">
            {weather.city ? `${weather.city} · ` : ""}Humidity {weather.humidity}%
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHero;
