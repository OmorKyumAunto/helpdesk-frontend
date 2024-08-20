import { notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";

type NotificationType = "success" | "info" | "warning" | "error";

export const toasterNotification = (
  type: NotificationType,
  detail: string,
  placement?: NotificationPlacement
) => {
  notification[type]({
    message: type.toLocaleUpperCase() + " !!",
    description: detail,
    placement: placement || "topRight",
    duration: 1.5,
  });
};
