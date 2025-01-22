/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Avatar, Card } from "antd";
import dayjs from "dayjs";
import MorningSunIcon from "../../../assets/morning.png";
import AfternoonSunIcon from "../../../assets/afternoon.png";
import EveningMoonIcon from "../../../assets/evening.png";
import NightMoonIcon from "../../../assets/night.png";
import { imageURL } from "../../../app/slice/baseQuery";
import WeatherWidgetTop from "../components/WeatherWidgetTop";
import { useGetMeQuery } from "../../../app/api/userApi";

// Styled Components CSS-in-JS solution
import styled from "styled-components";

const TopDash = () => {
  const [greeting, setGreeting] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [icon, setIcon] = useState<string>(MorningSunIcon);
  const { data: profile } = useGetMeQuery();

  useEffect(() => {
    const currentTime = dayjs();
    const currentHour = currentTime.hour();
    let greetingText = "";
    let timeOfDayText = "";
    let iconPath = MorningSunIcon;

    if (currentHour >= 5 && currentHour < 12) {
      greetingText = "Good Morning";
      timeOfDayText = "Morning";
      iconPath = MorningSunIcon;
    } else if (currentHour >= 12 && currentHour < 17) {
      greetingText = "Good Afternoon";
      timeOfDayText = "Afternoon";
      iconPath = AfternoonSunIcon;
    } else if (currentHour >= 17 && currentHour < 20) {
      greetingText = "Good Evening";
      timeOfDayText = "Evening";
      iconPath = EveningMoonIcon;
    } else {
      greetingText = "Good Night";
      timeOfDayText = "Night";
      iconPath = NightMoonIcon;
    }

    setGreeting(greetingText);
    setTimeOfDay(timeOfDayText);
    setIcon(iconPath);
  }, []);

  return (
    <StyledCard>
      <div className="top-dash-content">
        <div className="top-dash-text">
          <h1 className="greeting">
            {greeting}, {profile?.data?.name || "User"}
          </h1>
          <p className="sub-text">
            Welcome Back! Your IT Support Journey Starts Here.
          </p>
        </div>

        <div className="top-dash-icon">
          <div className="icon-wrapper">
            <img src={icon} alt={`${timeOfDay} Icon`} className="time-icon" />
          </div>
          {(profile?.data?.role_id === 1 || profile?.data?.role_id === 2) && (
            <div className="weather-wrapper">
              <WeatherWidgetTop />
            </div>
          )}
        </div>
      </div>
    </StyledCard>
  );
};

export default TopDash;

// Styled components with animated multi-color background
const StyledCard = styled(Card)`
  background: linear-gradient(135deg, #4e6ad0, #0d3c6e,rgb(30, 161, 212), #ff6b6b); /* Initial Gradient */
  background-size: 400% 400%; /* Ensures smooth animation transition */
  color: white;
  border-radius: 20px;
  padding: 12px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, opacity 0.4s ease-out;
  animation: cardBounce 3s ease-in-out infinite alternate, colorShift 10s ease-in-out infinite;
  font-family: 'Poppins', sans-serif;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.3);
    opacity: 0.9;
  }

  @keyframes cardBounce {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-10px);
    }
  }

  @keyframes colorShift {
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

  .top-dash-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    animation: fadeIn 1.5s ease-out;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .top-dash-text {
    max-width: 70%;
  }

  .greeting {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
    animation: slideIn 1s ease-out;
  }

  .sub-text {
    font-size: 1rem;
    margin-top: 10px;
    animation: fadeInText 1.2s ease-out;
  }

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateX(-30px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInText {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .top-dash-icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
  }

  .weather-wrapper {
    font-size: 0.8rem;
    text-align: left;
  }

  .icon-wrapper {
    width: 90px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: bounceIcon 1.5s ease-out infinite alternate;
  }

  .time-icon {
    width: 100%;
    height: auto;
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3));
    transition: transform 0.3s ease-in-out;
  }

  .time-icon:hover {
    transform: scale(1.2);
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.4));
  }

  @keyframes bounceIcon {
    0% {
      transform: scale(0.9);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;
