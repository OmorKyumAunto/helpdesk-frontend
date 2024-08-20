/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

type Props = {
  loading?: boolean;
  label?: string;
  icon?: React.ReactNode;
  block?: boolean;
  onClick?: () => void;
  style?: any;
};

const SubmitButton = ({ loading, label, icon, onClick, style }: Props) => {
  return (
    <Button
      style={style}
      onClick={onClick}
      type="primary"
      htmlType="submit"
      loading={loading}
      icon={icon}
    >
      {label || "Submit"}
    </Button>
  );
};

export default SubmitButton;

export const ViewButton = () => {
  return (
    <div
      style={{
        display: "flex",
        color: "white",
        backgroundColor: "#155E75",
        cursor: "pointer",
        paddingTop: "1px",
        paddingBottom: "1px",
        paddingRight: "10px",
        paddingLeft: "10px",
        borderRadius: "5px",
      }}
    >
      <EyeOutlined style={{ cursor: "pointer" }} />
      <p style={{ paddingLeft: "5px" }}>View</p>
    </div>
  );
};
