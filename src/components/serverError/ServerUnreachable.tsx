import { Button, Result } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

interface Props {
  onRetry?: () => void;
}

/**
 * Shown when the backend can't be reached (server down / network offline),
 * instead of bouncing the user to the login screen. Lets them retry without a
 * full page reload.
 */
export default function ServerUnreachable({ onRetry }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "1rem",
      }}
    >
      <Result
        status="500"
        title="Can't reach the server"
        subTitle="The DBL Helpdesk server is currently unreachable. Please check your connection or try again in a moment."
        extra={
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => (onRetry ? onRetry() : window.location.reload())}
          >
            Retry
          </Button>
        }
      />
    </div>
  );
}
