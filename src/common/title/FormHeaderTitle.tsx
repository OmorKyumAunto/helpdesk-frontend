import { Typography } from "antd";

type Props = { title: string; margintop?: number };

function FormHeaderTitle({ title, margintop }: Props) {
  return (
    <div
      style={{
        padding: "5px",
        margin: `${margintop || 30}px 0 10px 0`,
        borderRadius: "4px",
        boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
      }}
    >
      <Typography.Title level={5}>{title}</Typography.Title>
    </div>
  );
}

export default FormHeaderTitle;
