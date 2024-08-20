import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export const CreateButton = ({
  name,
  onClick,
}: {
  name: string;
  onClick: any;
}) => {
  return (
    <Button
      style={{ background: "#00b4e9" }}
      onClick={onClick}
      type="primary"
      icon={<PlusOutlined />}
    >
      {name}
    </Button>
  );
};

export const PrimaryButton = ({
  name,
  onClick,
  size,
  icon,
  htmlType,
  loading,
}: {
  name: string;
  onClick?: any;
  size?: "small" | "middle" | "large";
  icon?: any;
  htmlType?: any;
  loading?: boolean;
}) => {
  return (
    <Button
      size={size || "middle"}
      style={{ background: "#00b4e9", width: "100%" }}
      type="primary"
      onClick={onClick}
      icon={icon}
      htmlType={htmlType}
      loading={loading}
    >
      {name}
    </Button>
  );
};
