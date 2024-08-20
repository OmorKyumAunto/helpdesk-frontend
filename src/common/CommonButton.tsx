import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Tooltip } from "antd";
import { MdDelete } from "react-icons/md";

export const CreateButton = ({
  name,
  onClick,
  size,
}: {
  name: string;
  onClick: any;
  size?: "small" | "middle" | "large";
}) => {
  return (
    <Button
      // style={{ background: "#00b4e9" }}
      onClick={onClick}
      type="primary"
      size={size}
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
export const EyeIcon = () => {
  return (
    <Tooltip placement="top" title={"View details"}>
      <Button size="small" type="primary" style={{ background: "#00b4e9" }}>
        View
      </Button>
    </Tooltip>
  );
};

export const EditButton = ({ onClick }: { onClick?: any }) => {
  return (
    <Button
      size="small"
      type="primary"
      style={{ background: "#00b4e9" }}
      onClick={onClick}
      icon={<EditOutlined />}
    >
      Edit
    </Button>
  );
};

export const DeleteIcon = ({
  onConfirm,
}: {
  title?: string;
  onConfirm?: any;
}) => {
  return (
    <Popconfirm
      title="Sure to delete ?"
      okText="Yes"
      cancelText="No"
      onConfirm={onConfirm}
    >
      {" "}
      {/* <Tooltip placement="top" title={title}> */}
      <Button danger icon={<MdDelete size={20} />} size="small" />{" "}
      {/* </Tooltip> */}
    </Popconfirm>
  );
};
