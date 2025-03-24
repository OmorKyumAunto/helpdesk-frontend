import React, { useState } from "react";
import { Statistic } from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
const { Countdown } = Statistic;

const TaskCountdown = ({ item }: { item: any }) => {
  console.log(item);
  //   const targetTime = dayjs("2025-03-23T22:41:00.000Z")
  //     .subtract(6, "hours")
  //     .valueOf();
  const targetTime = dayjs(
    item.start_date.split("T")[0] + "T" + item.start_time
  )
    .subtract(6, "hours")
    .valueOf();
  let taskStartTime = null;
  if (item.task_start_date && item.task_start_time) {z
    taskStartTime = dayjs(
      //   item.task_start_date.split("T")[0] + "T" + item.task_start_time
      "2025-03-23T22:41:00.000Z"
    )
      .subtract(6, "hours")
      .valueOf();
  }
  let taskEndTime = null;
  if (item.task_end_date && item.task_end_time) {
    taskEndTime = dayjs(
      //   item.task_end_date.split("T")[0] + "T" + item.task_end_time
      "2025-03-24T12:59:00.000Z"
    )
      .subtract(6, "hours")
      .valueOf();
  }
  let taskDuration = null;
  if (taskStartTime && taskEndTime) {
    const diffMs = taskEndTime - taskStartTime;
    const durationFormatted = dayjs.duration(diffMs).format("HH:mm:ss");
    taskDuration = durationFormatted;
  }
  const [isOverdue, setIsOverdue] = useState(false);
  const [overdueStartTime, setOverdueStartTime] = useState<number | undefined>(
    undefined
  );

  return (
    <div>
      {!isOverdue ? (
        <Countdown
          valueStyle={{ fontSize: "14px" }}
          value={targetTime}
          format="DD [Day], HH:mm:ss"
          onFinish={() => {
            setIsOverdue(true);
            setOverdueStartTime(dayjs().valueOf()); // Start counting overdue time
          }}
        />
      ) : (
        <Countdown
          valueStyle={{ fontSize: "14px", color: "red" }}
          value={dayjs()
            .add(dayjs().diff(overdueStartTime), "millisecond")
            .valueOf()}
          format="DD [Day], HH:mm:ss"
        />
      )}

      <p>
        Task Duration: <strong>{taskDuration || "N/A"}</strong>
      </p>
    </div>
  );
};

export default TaskCountdown;
