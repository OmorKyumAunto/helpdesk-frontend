/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Avatar, Card } from "antd";
import dayjs from "dayjs";
import MorningSunIcon from "../../../assets/morning.png";
import AfternoonSunIcon from "../../../assets/afternoon.png";
import EveningMoonIcon from "../../../assets/evening.png";
import NightMoonIcon from "../../../assets/night.png";
import { imageURL } from "../../../app/slice/baseQuery";
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
    } else if (currentHour >= 12 && currentHour < 18) {
      greetingText = "Good Afternoon";
      timeOfDayText = "Afternoon";
      iconPath = AfternoonSunIcon;
    } else if (currentHour >= 18 && currentHour < 20) {
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
            {greeting}, {profile?.data?.name}
          </h1>
          <p className="sub-text">
            It's a lovely {timeOfDay}! Welcome to DBL Group Asset System
          </p>
        </div>
        <div className="top-dash-icon">
          <img
            src={icon}
            alt={`${timeOfDay} Icon`}
            className="time-icon"
          />
        </div>
      </div>
    </StyledCard>
  );
};

export default TopDash;

// Styled components with CSS animations

const StyledCard = styled(Card)`
  background: linear-gradient(135deg, #4e6ad0, #0d3c6e); /* Blue Shaded Gradient */
  color: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, opacity 0.4s ease-out;
  animation: cardBounce 1s ease-in-out infinite alternate;
  font-family: 'Poppins', sans-serif; /* Updated font family to Poppins */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.3);
    opacity: 0.9; /* Fade in and out effect for the entire card */
  }

  @keyframes cardBounce {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-10px);
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
    font-size: 1.0rem;
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
    width: 90px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: bounceIcon 1.5s ease-out infinite alternate;
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
`;
