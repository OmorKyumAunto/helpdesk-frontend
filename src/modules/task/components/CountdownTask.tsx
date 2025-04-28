import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface TaskCountdownProps {
  item: {
    task_status: string;
    task_start_date: string;
    task_end_date: string;
    task_start_time: string;
    task_end_time: string;
    total_set_time: number;
    format: string;
    updated_at: string;
    start_time: string;
    start_date: string;
  };
}

const TaskCountdown = ({ item }: { item: any }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progressTimeLeft, setProgressTimeLeft] = useState<number>(0);
  const [timeOverdue, setTimeOverdue] = useState<boolean>(false);
  const [progressTimeOverdue, setProgressTimeOverdue] =
    useState<boolean>(false);
  const [completionDuration, setCompletionDuration] = useState<string>("");

  const convertSetTimeToSeconds = (setTime: number, format: string): number => {
    return format === "hours" ? setTime * 3600 : setTime * 60;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (item.task_status === "incomplete") {
      const calculateTimeLeft = () => {
        const currentTime = dayjs();
        const add6hours = dayjs(item.start_date).add(6, "hours");
        const startTime = dayjs(
          dayjs(add6hours).format("YYYY-MM-DD") + "T" + item.start_time
        );
        const remainingTime = startTime.diff(currentTime, "second");

        if (remainingTime >= 0) {
          setTimeLeft(remainingTime);
          setTimeOverdue(false);
        } else {
          setTimeLeft(Math.abs(remainingTime)); // Store positive remaining time
          setTimeOverdue(true);
        }
      };

      calculateTimeLeft();

      intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (!timeOverdue && prevTimeLeft > 0) {
            return prevTimeLeft - 1; // Countdown until overdue
          } else if (timeOverdue) {
            return prevTimeLeft + 1; // Increment when overdue
          }
          return prevTimeLeft;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }

    if (item.task_status === "inprogress") {
      const calculateProgressTimeLeft = () => {
        const updatedAt = dayjs(item.updated_at);
        const remainingProgressTime = convertSetTimeToSeconds(
          item.total_set_time,
          item.format
        );
        const elapsedTime = dayjs().diff(updatedAt, "second");
        const remainingProgress = remainingProgressTime - elapsedTime;

        if (remainingProgress > 0) {
          setProgressTimeLeft(remainingProgress);
          setProgressTimeOverdue(false);
        } else {
          setProgressTimeOverdue(true);
          setProgressTimeLeft(Math.abs(remainingProgress));
        }
      };

      calculateProgressTimeLeft();

      intervalId = setInterval(() => {
        setProgressTimeLeft((prevProgressTimeLeft) => {
          if (!progressTimeOverdue && prevProgressTimeLeft > 0) {
            return prevProgressTimeLeft - 1;
          } else if (progressTimeOverdue) {
            return prevProgressTimeLeft + 1;
          }
          return prevProgressTimeLeft;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }

    if (item.task_status === "complete") {
      const calculateCompletionDuration = () => {
        const add6hoursStart = dayjs(item.task_start_date).add(6, "hours");
        const startTime = dayjs(
          dayjs(add6hoursStart).format("YYYY-MM-DD") +
            "T" +
            item.task_start_time
        );
        const add6hoursEnd = dayjs(item.task_end_date).add(6, "hours");
        const endTime = dayjs(
          dayjs(add6hoursEnd).format("YYYY-MM-DD") + "T" + item.task_end_time
        );

        if (endTime.isValid() && startTime.isValid()) {
          const duration = endTime.diff(startTime, "second");
          setCompletionDuration(formatTime(duration));
        } else {
          setCompletionDuration("Invalid Dates");
        }
      };

      calculateCompletionDuration();
    }

    return () => clearInterval(intervalId);
  }, [item, timeOverdue, progressTimeOverdue]);

  return (
    <div className="flex items-center gap-2">
      {item.task_status === "incomplete" && (
        <div>
          {timeOverdue ? (
            <div className="px-3 py-1 rounded-full text-sm font-semibold bg-red-200 text-red-800">
              ⏳ Overdue {formatTime(timeLeft)}
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-800">
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
      )}

      {item.task_status === "inprogress" && (
        <div>
          {progressTimeOverdue ? (
            <div className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-200 text-orange-800">
              ⏳ Overdue {formatTime(progressTimeLeft)}
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-200 text-yellow-800">
              {formatTime(progressTimeLeft)}
            </div>
          )}
        </div>
      )}

      {item.task_status === "complete" && (
        <div>
          <div className="px-3 py-1 rounded-full text-sm font-semibold bg-green-200 text-green-800">
            Task completed in {completionDuration}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCountdown;
