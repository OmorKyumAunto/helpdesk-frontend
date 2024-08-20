import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Divider,
  Popover,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useGetMeQuery } from "../../app/api/userApi";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useReadNotificationMutation,
} from "../../modules/dashboard/api/dashboardEndPoints";
import dayjs from "dayjs";
import { INotification } from "../../modules/dashboard/types/dashboardTypes";
import { socket } from "../../hooks/socket";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const Notification = () => {
  const { data: profile } = useGetMeQuery();
  const { data: notification, isLoading } = useGetNotificationsQuery();
  const [deleteNotification, { isSuccess }] = useDeleteNotificationMutation();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [readNotification, { isSuccess: updateSuccess }] =
    useReadNotificationMutation();

  useEffect(() => {
    if (isSuccess) {
      setNotifications([]);
    } else if (notification?.data?.length) {
      setNotifications(notification.data as INotification[]);
    }
  }, [isSuccess, notification?.data, updateSuccess]);

  useEffect(() => {
    const handleMessage = (data: any) => {
      // console.log(data);
      message.success(data?.message);
      setNotifications((prevData) => [data, ...prevData]);
    };

    if (profile?.data?.id) {
      socket.auth = { id: profile?.data?.id, type: "user_admin" };
      if (!socket.connected) {
        socket.connect();
      }
      socket.on("admin_new_notification", handleMessage);

      return () => {
        socket.off("admin_new_notification", handleMessage);
      };
    }
  }, [profile?.data?.id]);

  const unreadCount = notifications?.filter((noti) => !noti.read_status);

  const content = (
    <div
      style={{
        width: "330px",
        height: "350px",
        overflow: "auto",
        // paddingTop: "10px",
      }}
    >
      <Space direction="vertical" split={<Divider style={{ margin: 0 }} />}>
        {notifications?.length ? (
          <>
            {notifications?.map((notification: INotification) => {
              // console.log(notification);
              return (
                <Space key={notification.id}>
                  {/* <Space direction="vertical" size={0}> */}
                  <div
                    className="notification"
                    onClick={() =>
                      readNotification({
                        id: notification?.id,
                        data: { read_status: true },
                      })
                    }
                  >
                    <div style={{ marginRight: "8px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "4px",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            boxShadow:
                              "0 2.98686px 13.4409px rgba(126,172,235,.25)",
                            background:
                              "linear-gradient(149.1deg,#99b8f3 14.61%,#177fcb 130.18%)",
                            borderRadius: "100%",
                          }}
                        ></div>

                        <div>
                          <Typography.Text
                            strong
                            className={
                              notification?.read_status
                                ? "notification-read"
                                : "notification-unread"
                            }
                            style={{
                              fontFamily: " 'Exo 2', sans-serif",
                            }}
                          >
                            {notification.message}
                          </Typography.Text>
                        </div>
                      </div>{" "}
                      <Typography.Text
                        type="secondary"
                        className={
                          notification?.read_status
                            ? "notification-read"
                            : "notification-unread"
                        }
                        style={{ paddingLeft: "15px", fontSize: "12px" }}
                      >
                        {dayjs(notification.created_at).fromNow()}
                      </Typography.Text>
                    </div>
                  </div>
                </Space>
              );
            })}
          </>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "300px",
              paddingTop: "20px",
            }}
          >
            <Typography.Title level={5} style={{ textAlign: "center" }}>
              No data available
            </Typography.Title>
          </div>
        )}
      </Space>
    </div>
  );
  const loadingContent = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 20,
      }}
    >
      <Spin />
    </div>
  );
  return (
    <>
      <Popover
        content={isLoading ? loadingContent : content}
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Notifications</h3>
            <p
              onClick={() => deleteNotification()}
              style={{ cursor: "pointer" }}
            >
              Clear all
            </p>
            {/* <Typography.Title level={5}>Notifications</Typography.Title>
            <Typography.Title level={5}>Clear all</Typography.Title> */}
          </div>
        }
        placement="bottomRight"
      >
        <div>
          {" "}
          <Badge size="default" count={unreadCount?.length || 0} showZero>
            <Button icon={<BellOutlined />} />
          </Badge>
        </div>
      </Popover>
    </>
  );
};

export default Notification;
