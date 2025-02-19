import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface CountdownProps {
  deadline: string; // Deadline as an ISO string (e.g., "2025-02-14T15:30:00")
}

const CountdownTimer: React.FC<CountdownProps> = ({ deadline }) => {
  const calculateTimeLeft = () => {
    const now = dayjs();
    const end = dayjs(deadline);
    const diff = end.diff(now, "second");

    return {
      days: Math.max(0, Math.floor(diff / 86400)),
      hours: Math.max(0, Math.floor((diff % 86400) / 3600)),
      minutes: Math.max(0, Math.floor((diff % 3600) / 60)),
      seconds: Math.max(0, diff % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-semibold mb-4 text-gray-800 uppercase tracking-wide">Response Time Remaining</p>
      <div className="flex gap-6">
        {timeLeft.days > 0 && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white border-2 border-gray-400 rounded-full shadow-sm flex items-center justify-center">
              <CircularProgressbar
                value={timeLeft.days}
                maxValue={30}
                text={`${timeLeft.days}`}
                styles={buildStyles({
                  textColor: "#333", // Dark gray for text
                  pathColor: "#4CAF50", // Green for Days
                  trailColor: "#E5E5E5", // Light gray for the background trail
                  textSize: "36px", // Larger text size for better visibility
                  pathTransitionDuration: 0.5, // Smooth transition
                })}
              />
            </div>
            <p className="text-sm text-center mt-2 text-gray-600 font-medium">Days</p>
          </div>
        )}

        {timeLeft.hours > 0 && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white border-2 border-gray-400 rounded-full shadow-sm flex items-center justify-center">
              <CircularProgressbar
                value={timeLeft.hours}
                maxValue={60}
                text={`${timeLeft.hours}`}
                styles={buildStyles({
                  textColor: "#333", // Dark gray for text
                  pathColor: "#2196F3", // Blue for Hours
                  trailColor: "#E5E5E5", // Light gray for the background trail
                  textSize: "36px", // Larger text size for better visibility
                  pathTransitionDuration: 0.5, // Smooth transition
                })}
              />
            </div>
            <p className="text-sm text-center mt-2 text-gray-600 font-medium">Hours</p>
          </div>
        )}

        {timeLeft.minutes > 0 && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white border-2 border-gray-400 rounded-full shadow-sm flex items-center justify-center">
              <CircularProgressbar
                value={timeLeft.minutes}
                maxValue={60}
                text={`${timeLeft.minutes}`}
                styles={buildStyles({
                  textColor: "#333", // Dark gray for text
                  pathColor: "#FFEB3B", // Yellow for Minutes
                  trailColor: "#E5E5E5", // Light gray for the background trail
                  textSize: "36px", // Larger text size for better visibility
                  pathTransitionDuration: 0.5, // Smooth transition
                })}
              />
            </div>
            <p className="text-sm text-center mt-2 text-gray-600 font-medium">Minutes</p>
          </div>
        )}

        {timeLeft.seconds > 0 && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white border-2 border-gray-400 rounded-full shadow-sm flex items-center justify-center">
              <CircularProgressbar
                value={timeLeft.seconds}
                maxValue={60}
                text={`${timeLeft.seconds}`}
                styles={buildStyles({
                  textColor: "#333", // Dark gray for text
                  pathColor: "#F44336", // Red for Seconds
                  trailColor: "#E5E5E5", // Light gray for the background trail
                  textSize: "36px", // Larger text size for better visibility
                  pathTransitionDuration: 0.5, // Smooth transition
                })}
              />
            </div>
            <p className="text-sm text-center mt-2 text-gray-600 font-medium">Seconds</p>
          </div>
        )}
      </div>

      {/* CSS for bold and more visible inner circle text */}
      <style>
        {`
          .react-circular-progressbar-text {
            font-weight: 600; /* Make text bold */
            font-size: 28px !important; /* Increase the font size to make the text more visible */
          }
        `}
      </style>
    </div>
  );
};

export default CountdownTimer;
