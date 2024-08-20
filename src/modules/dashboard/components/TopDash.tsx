/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Avatar, Card } from "antd";
import dayjs from "dayjs";
import "./TopDash.css";
import MorningSunIcon from "../../../assets/morning.png";
import AfternoonSunIcon from "../../../assets/afternoon.png";
import EveningMoonIcon from "../../../assets/evening.png";
import { imageURL } from "../../../app/slice/baseQuery";
import { useGetMeQuery } from "../../../app/api/userApi";

const TopDash = () => {
  const [greeting, setGreeting] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [_icon, setIcon] = useState<JSX.Element | undefined>(undefined);
  const { data: profile } = useGetMeQuery();

  useEffect(() => {
    const currentTime = dayjs();
    const currentHour = currentTime.hour();

    let greetingText = "";
    let timeOfDayText = "";
    let iconComponent = null;

    if (currentHour >= 5 && currentHour < 12) {
      greetingText = "Good Morning";
      timeOfDayText = "Morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      greetingText = "Good Afternoon";
      timeOfDayText = "Afternoon";
    } else {
      greetingText = "Good Evening";
      timeOfDayText = "Evening";
    }

    setGreeting(greetingText);
    setTimeOfDay(timeOfDayText);
  }, []);

  return (
    <Card className="top-dash-card" style={{ marginBottom: "10px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "start",
        }}
      >
        <div>
          <h1 style={{ fontSize: "40px" }}>
            {greeting}, {profile?.data?.username}{" "}
            {/* <Avatar
              size={{ xs: 30, sm: 40, md: 40, lg: 40, xl: 60, xxl: 70 }}
              src={imageURL + "user_files/" + profile?.data?.image}
              alt={`${profile?.data?.image}'s Avatar`}
            /> */}
          </h1>
          <p>
            It's a lovely {timeOfDay}!, Welcome to Inventory Management
            Dashboard
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TopDash;
