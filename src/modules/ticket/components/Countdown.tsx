import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

interface TicketCountdownProps {
  ticketCreatedAt: string;
  ticketUpdatedAt: string;
  responseTimeValue: number;
  responseTimeUnit: string;
  resolveTimeValue: number;
  resolveTimeUnit: string;
  ticketStatus: string;
}

const TicketCountdown: React.FC<TicketCountdownProps> = ({
  ticketCreatedAt,
  ticketUpdatedAt,
  responseTimeValue,
  responseTimeUnit,
  resolveTimeValue,
  resolveTimeUnit,
  ticketStatus,
}) => {
  const getTimeInMinutes = (value: number, unit: string): number => {
    return unit === "hours" ? value * 60 : value; // Convert hours to minutes
  };

  const [responseTimeLeft, setResponseTimeLeft] = useState<number>(0);
  const [solveTimeLeft, setSolveTimeLeft] = useState<number>(0);

  const [responseTimeWarning, setResponseTimeWarning] = useState<boolean>(false);
  const [solveTimeWarning, setSolveTimeWarning] = useState<boolean>(false);

  const [responseTimeOverdue, setResponseTimeOverdue] = useState<boolean>(false);
  const [solveTimeOverdue, setSolveTimeOverdue] = useState<boolean>(false);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = dayjs();
      const createdAt = dayjs(ticketCreatedAt);
      const updatedAt = dayjs(ticketUpdatedAt);

      const responseMinutes = getTimeInMinutes(responseTimeValue, responseTimeUnit);
      const resolveMinutes = getTimeInMinutes(resolveTimeValue, resolveTimeUnit);

      const elapsedResponse = now.diff(createdAt, "second"); // In seconds
      const elapsedSolve = now.diff(updatedAt, "second"); // In seconds

      const remainingResponse = responseMinutes * 60 - elapsedResponse;
      const remainingSolve = resolveMinutes * 60 - elapsedSolve;

      setResponseTimeLeft(Math.max(remainingResponse, 0));
      setSolveTimeLeft(Math.max(remainingSolve, 0));

      // Check for overdue
      setResponseTimeOverdue(remainingResponse <= 0);
      setSolveTimeOverdue(remainingSolve <= 0);

      // Check for warnings (e.g., if time left is less than 10 minutes)
      setResponseTimeWarning(remainingResponse <= 300); // 5 minutes
      setSolveTimeWarning(remainingSolve <= 60); // 1 minute
    };

    calculateRemainingTime();

    const interval = setInterval(calculateRemainingTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [ticketCreatedAt, ticketUpdatedAt, responseTimeValue, responseTimeUnit, resolveTimeValue, resolveTimeUnit]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const status = ticketStatus?.toLowerCase();

  return (
    <div className="flex gap-12 justify-center p-4">
      {/* Response Time */}
      {status === "unsolved" && (
        <div className="text-center">
          <div
            className={`w-24 h-14 rounded-full border-8 flex items-center justify-center ${responseTimeWarning ? "border-red-500 bg-red-100" : "border-blue-200 bg-blue-50"}`}
          >
            <span className={`text-s font-bold ${responseTimeWarning ? "text-red-500" : "text-blue-500"}`}>
              {responseTimeOverdue ? "Overdue" : formatTime(responseTimeLeft)}
            </span>
          </div>
          <p className="text-xs text-gray-900 mt-2">Response Within</p>
        </div>
      )}

      {/* Solve Time */}
      {(status === "inprogress" || status === "forward") && (
        <div className="text-center">
          <div
            className={`w-24 h-14 rounded-full border-8 flex items-center justify-center ${solveTimeWarning ? "border-orange-500 bg-orange-100" : "border-green-200 bg-green-100"}`}
          >
            <span className={`text-s font-bold ${solveTimeWarning ? "text-orange-600" : "text-green-500"}`}>
              {solveTimeOverdue ? "Overdue" : formatTime(solveTimeLeft)}
            </span>
          </div>
          <p className="text-xs text-gray-900 mt-2">Solve Within</p>
        </div>
      )}

      {/* Solved Time */}
      {status === "solved" && (
        <div className="text-center">
          <div className={`w-24 h-14 rounded-full border-8 flex items-center justify-center border-gray-200 bg-blue-100`}>
            <span className="text-s font-bold text-gray-500">
              {formatTime(dayjs(ticketUpdatedAt).diff(dayjs(ticketCreatedAt), "second"))}
            </span>
          </div>
          <p className="text-xs text-gray-900 mt-2">Solved Within</p>
        </div>
      )}
    </div>
  );
};

export default TicketCountdown;
