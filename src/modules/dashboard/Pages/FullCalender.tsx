import { useEffect, useRef, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Typography, Radio, Grid, Tooltip } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useGetAllScheduleQuery } from "../api/dashboardEndPoints";
dayjs.extend(utc);
dayjs.extend(timezone);

type View =
  | "dayGridMonth"
  | "timeGridWeek"
  | "timeGridDay"
  | "listMonth"
  | "listDay"
  | "listWeek";

const FullCalender = () => {
  const [filterValue, setFilterValue] = useState({
    current_date: dayjs(new Date()).format("YYYY-MM-DD"),
    single_date: false,
    week_date: false,
  });
  const { data: schedules } = useGetAllScheduleQuery(filterValue);
  const [calendarView, setCalendarView] = useState<View>("dayGridMonth");
  const calendarRef: any = useRef<FullCalendar>(null);
  const [titleDate, setTitle] = useState(
    calendarRef.current?.getApi().view.title
  );
  const { md } = Grid.useBreakpoint();
  const navigate = useNavigate();

  useEffect(() => {
    calendarRef.current?.getApi().changeView(calendarView);
  }, [calendarView]);

  useEffect(() => {
    if (md) {
      setCalendarView("dayGridMonth");
    } else {
      setCalendarView("listMonth");
    }
  }, [md]);

  const handleDayCellContent = (arg: any) => {
    const day = arg.date.getDay();

    const dayClasses = ["day-0", "day-1", "day-2", "day-3", "day-4"];

    let className = "";

    if (arg.isToday) {
      className = "current-day";
    } else if (day === 5 || day === 6) {
      className = "offDay";
    } else if (dayClasses[day] !== undefined) {
      className = dayClasses[day];
    }

    return className;
  };
  const events = schedules?.data?.map((schedule) => {
    return {
      title: schedule?.title,
      start: schedule?.start_date || schedule?.date,
      end: schedule?.end_date,
      type: schedule?.type,
      time: schedule?.time,
      memberName: schedule?.application_name,
      memberId: schedule?.application_id,
    };
  });
  console.log(schedules?.data);
  // Function to limit events to 5 per day
  // const limitEventsPerDay = (events: any) => {
  //   const limitedEvents = events.reduce((acc: any, event: any) => {
  //     const date = event.date;
  //     if (!acc[date]) {
  //       acc[date] = [];
  //     }
  //     if (acc[date].length < 5) {
  //       acc[date].push(event);
  //     }
  //     return acc;
  //   }, {});

  //   // Flatten the limitedEvents object back into an array
  //   return Object.values(limitedEvents).flat();
  // };

  // const limitedEvents = limitEventsPerDay(events);
  return (
    <div>
      <div className="calendar_header">
        <div className="actions">
          <Button
            onClick={() => {
              calendarRef.current?.getApi().prev();
              setFilterValue({
                ...filterValue,
                current_date: dayjs(
                  calendarRef.current?.getApi().view.calendar?.currentData
                    ?.dateProfile.currentDate
                ).format("YYYY-MM-DD"),
              });
            }}
            shape="circle"
            icon={<LeftOutlined />}
          />
          <Button
            onClick={() => {
              // console.log(calendarRef.current?.getApi().next());
              calendarRef.current?.getApi().next();
              setFilterValue({
                ...filterValue,
                current_date: dayjs(
                  calendarRef.current?.getApi().view.calendar?.currentData
                    ?.dateProfile.currentDate
                ).format("YYYY-MM-DD"),
              });
            }}
            shape="circle"
            icon={<RightOutlined />}
          />

          <Typography.Text
            style={{
              fontWeight: "bold",
              fontSize: md ? "20px" : "16px",
            }}
          >
            {titleDate}
          </Typography.Text>
        </div>
        <Radio.Group value={calendarView}>
          {[
            {
              label: "Day",
              desktopView: "timeGridDay",
              mobileView: "listDay",
            },
            {
              label: "Week",
              desktopView: "timeGridWeek",
              mobileView: "listWeek",
            },

            {
              label: "Month",
              desktopView: "dayGridMonth",
              mobileView: "listMonth",
            },
          ].map(({ label, desktopView, mobileView }) => {
            const view = md ? desktopView : mobileView;
            return (
              <Radio.Button
                key={label}
                value={view}
                onClick={() => {
                  setCalendarView(view as View);
                  if (label === "Week") {
                    setFilterValue({
                      ...filterValue,
                      week_date: true,
                    });
                  }
                  if (label === "Day") {
                    setFilterValue({
                      ...filterValue,
                      single_date: true,
                    });
                  }
                }}
              >
                {label}
              </Radio.Button>
            );
          })}
          {md && (
            <Radio.Button
              value="listMonth"
              onClick={() => {
                setCalendarView("listMonth");
              }}
            >
              Monthly Schedule List
            </Radio.Button>
          )}
        </Radio.Group>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView={`dayGridMonth`}
        events={events as any}
        eventContent={({ event }) => {
          console.log(event?.extendedProps?.memberName);
          return (
            <div style={{ overflow: "hidden" }}>
              <Tooltip
                style={{ background: "white" }}
                title={
                  <>
                    <p style={{ paddingBottom: "15px" }}> {event?.title}</p>
                    <p>
                      {" "}
                      <b>Type</b>: {event?.extendedProps?.type}
                    </p>{" "}
                    {event?.extendedProps?.type === "Schedular" ? (
                      <>
                        {event?.extendedProps?.memberName &&
                        event?.extendedProps?.memberName !== " " ? (
                          <>
                            <span>
                              <b> Member Name</b> :{" "}
                              <Link
                                to={`member/list/${event.extendedProps.memberId}`}
                              >
                                {event.extendedProps.memberName}
                              </Link>
                            </span>
                            <br />
                          </>
                        ) : (
                          ""
                        )}

                        <span>
                          <b> Date</b> :
                          {dayjs(event?.start)
                            .tz("Asia/Dhaka", true)
                            .format("YYYY-MM-DD hh:mm a")}{" "}
                          -{" "}
                          {dayjs(event?.end)
                            .tz("Asia/Dhaka", true)
                            .format("YYYY-MM-DD hh:mm a")}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          <b> Date</b> :{" "}
                          {dayjs(event?.start)
                            .tz("Asia/Dhaka", true)
                            .format("YYYY-MM-DD")}
                        </span>
                        <span style={{ paddingLeft: "10px" }}>
                          <b>Time</b> : {event?._def?.extendedProps?.time}
                        </span>
                      </>
                    )}
                  </>
                }
                placement="top"
              >
                <div
                  // tabindex="0"
                  className="fc-event "
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div className="fc-daygrid-event-dot"></div>
                  <div className="fc-event-time">
                    {dayjs(event?.start)
                      .tz("Asia/Dhaka", true)
                      .format("hh:mm a")}
                  </div>
                  <div className="fc-event-title">
                    {event?.title?.length > 15
                      ? `${event?.title.slice(0, 15)}...`
                      : event?.title}
                  </div>
                </div>
              </Tooltip>
            </div>
          );
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
        }}
        // eventClick={({ event }) => {
        //   navigate(`/meetings/details/${event.id}`);
        // }}
        // eventMouseEnter={({ event }) => setText(event?._def?.title)}
        // dayCellContent={(arg: any) => console.log(arg.isToday)}
        dayCellClassNames={handleDayCellContent}
        datesSet={({ view }: { view: any }) => {
          setTitle(view.title);
        }}
        headerToolbar={false}
        timeZone="UTC"
        height={600}
      />{" "}
    </div>
  );
};

export default FullCalender;
