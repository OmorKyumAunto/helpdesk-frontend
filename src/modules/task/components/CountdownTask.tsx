import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

interface TaskCountdownProps {
  item: {
    task_status: string;
    task_start_date: string;
    task_end_date: string;
    task_start_time: string;
    task_end_time: string;
    set_time: number;
    format: string;
    updated_at: string;
    start_time: string;
    start_date: string;
  };
}

const TaskCountdown: React.FC<TaskCountdownProps> = ({ item }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0); // Time remaining for "incomplete"
  const [progressTimeLeft, setProgressTimeLeft] = useState<number>(0); // Time remaining for "inprogress"
  const [timeOverdue, setTimeOverdue] = useState<boolean>(false); // Overdue status for "incomplete"
  const [progressTimeOverdue, setProgressTimeOverdue] = useState<boolean>(false); // Overdue status for "inprogress"
  const [completionDuration, setCompletionDuration] = useState<string>(""); // Duration for "completed"

  // Convert set_time to seconds depending on the format (minutes or hours)
  const convertSetTimeToSeconds = (setTime: number, format: string): number => {
    return format === "hours" ? setTime * 3600 : setTime * 60; // Convert to seconds
  };

  // Format time as hh:mm:ss
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // "incomplete" status: countdown from start_time and start_date
    if (item.task_status === "incomplete") {
      const calculateTimeLeft = () => {
        const currentTime = dayjs(); // Current time
        const startTime = dayjs(`${item.start_date}T${item.start_time}`); // Task start time

        const remainingTime = startTime.diff(currentTime, "second"); // Remaining time in seconds

        if (remainingTime > 0) {
          setTimeLeft(remainingTime);
          setTimeOverdue(false);
        } else {
          setTimeOverdue(true);
          setTimeLeft(0); // No time left, set to 0
        }
      };

      calculateTimeLeft();

      intervalId = setInterval(() => {
        if (timeOverdue) {
          setTimeLeft((prevTimeLeft) => prevTimeLeft + 1); // Increment the time for overdue
        } else {
          setTimeLeft((prevTimeLeft) => {
            if (prevTimeLeft > 0) {
              return prevTimeLeft - 1; // Decrement normally for incomplete
            }
            return 0;
          });
        }
      }, 1000); // Update every second

      return () => clearInterval(intervalId); // Cleanup on component unmount
    }

    // "inprogress" status: countdown from updated_at
    if (item.task_status === "inprogress") {
      const calculateProgressTimeLeft = () => {
        const updatedAt = dayjs(item.updated_at); // Use updated_at as the start time
        const remainingProgressTime = convertSetTimeToSeconds(item.set_time, item.format); // Convert set_time to seconds

        const elapsedTime = dayjs().diff(updatedAt, "second"); // Elapsed time since updated_at

        // Remaining progress time: set_time - elapsed time
        const remainingProgress = remainingProgressTime - elapsedTime;

        if (remainingProgress > 0) {
          setProgressTimeLeft(remainingProgress);
          setProgressTimeOverdue(false);
        } else {
          setProgressTimeOverdue(true);
          setProgressTimeLeft(0); // No time left, set to 0
        }
      };

      calculateProgressTimeLeft();

      intervalId = setInterval(() => {
        if (progressTimeOverdue) {
          setProgressTimeLeft((prevProgressTimeLeft) => prevProgressTimeLeft + 1); // Increment the time for overdue
        } else {
          setProgressTimeLeft((prevProgressTimeLeft) => {
            if (prevProgressTimeLeft > 0) {
              return prevProgressTimeLeft - 1; // Decrement normally for inprogress
            }
            return 0;
          });
        }
      }, 1000); // Update every second

      return () => clearInterval(intervalId); // Cleanup on component unmount
    }

    // "completed" status: calculate time difference between task start and end
    if (item.task_status === "complete") {
      const calculateCompletionDuration = () => {
        const taskStartDate = dayjs(item.task_start_date); // Task start date
        const taskEndDate = dayjs(item.task_end_date); // Task end date

        console.log("Start Date:", taskStartDate.format());  // Debugging the parsed start date
        console.log("End Date:", taskEndDate.format());  // Debugging the parsed end date

        if (taskEndDate.isValid() && taskStartDate.isValid()) {
          // Calculate the total duration in seconds between start and end dates
          const duration = taskEndDate.diff(taskStartDate, "second");

          setCompletionDuration(formatTime(duration)); // Format the duration into hh:mm:ss
        } else {
          setCompletionDuration("Invalid Dates"); // In case the dates are invalid
        }
      };

      calculateCompletionDuration();
    }

    // Cleanup function
    return () => clearInterval(intervalId);
  }, [item]);

  return (
    <div className="flex items-center gap-2">
      {/* Incomplete Task Countdown */}
      {item.task_status === "incomplete" && (
        <div>
          {timeOverdue ? (
            <div className="px-3 py-1 rounded-full text-sm font-semibold bg-red-200 text-red-800">
              ⏳ Overdue {formatTime(timeLeft)} {/* Show overdue time */}
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-800">
              {formatTime(timeLeft)} {/* Display countdown */}
            </div>
          )}
        </div>
      )}

      {/* Inprogress Task Countdown */}
      {item.task_status === "inprogress" && (
        <div>
          {progressTimeOverdue ? (
            <div className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-200 text-orange-800">
              ⏳ Overdue {formatTime(progressTimeLeft)} {/* Show overdue time */}
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-200 text-yellow-800">
              {formatTime(progressTimeLeft)} {/* Display countdown */}
            </div>
          )}
        </div>
      )}

      {/* Completed Task Duration */}
      {item.task_status === "complete" && (
        <div>
          <div className="px-3 py-1 rounded-full text-sm font-semibold bg-green-200 text-green-800">
            Task completed in {completionDuration} {/* Show completion duration */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCountdown;
