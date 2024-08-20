import { Tag } from "antd";

const CustomStatusTag = ({ status }: { status: string }) => {
  return (
    <>
      <Tag
        color={
          status === "pending" ? "gold" : status === "active" ? "green" : "red"
        }
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Tag>
    </>
  );
};

export default CustomStatusTag;
