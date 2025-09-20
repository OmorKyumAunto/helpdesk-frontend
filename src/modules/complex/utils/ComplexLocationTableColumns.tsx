import { Button, Popconfirm, Space, Switch } from "antd";
import { TableProps } from "antd/lib";
import { IComplex } from "../types/complexTypes";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
  useDeleteComplexLocationMutation,
  useUpdateComplexLocationStatusMutation,
} from "../api/complexlocationEndPoint";
import { IComplexLocation } from "../types/complexlocationTypes";
import UpdateComplexLocation from "../components/UpdateComplexLocation";

export const ComplexLocationTableColumns = (): TableProps<IComplexLocation>["columns"] => {
  const [deleteComplex] = useDeleteComplexLocationMutation();
  const [updateStatus] = useUpdateComplexLocationStatusMutation();
  const dispatch = useDispatch();
  const confirm = (id: number) => {
    if (id) {
      deleteComplex(id);
    }
  };
  return [
    {
      title: "Serial No",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Complex Name",
      dataIndex: "building_name",
      key: "building_name",
    },
    {
      title: "Complex Location",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      key: "status",
      render: (record) => (
        <>
          {record.status === "active" && (
            <Switch
              defaultChecked={true}
              style={{ background: "green" }}
              onChange={() => updateStatus(record.id)}
            />
          )}
          {record.status === "inactive" && (
            <Switch
              defaultChecked={false}
              style={{ background: "red" }}
              onChange={() => updateStatus(record.id)}
            />
          )}
        </>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (record: any) => (
        <Space size="middle">
          <Button
            size="small"
            style={{ color: "#1775BB" }}
            onClick={() => {
              dispatch(
                setCommonModal({
                  title: "Update Complex Location",
                  content: <UpdateComplexLocation single={record} />,
                  show: true,
                  width: 400,
                })
              );
            }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete the Complex"
            description="Are you sure to delete this Complex?"
            onConfirm={() => confirm(record?.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" style={{ color: "red" }}>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
};
