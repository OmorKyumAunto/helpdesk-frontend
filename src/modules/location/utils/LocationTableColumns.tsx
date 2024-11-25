import { Button, Popconfirm, Space, Switch } from "antd";
import { TableProps } from "antd/lib";
import { ILocation } from "../types/locationTypes";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import UpdateLocation from "../components/UpdateLocation";
import {
  useDeleteLocationMutation,
  useUpdateLocationStatusMutation,
} from "../api/locationEndPoint";

export const LocationTableColumns = (): TableProps<ILocation>["columns"] => {
  const [deleteLocation] = useDeleteLocationMutation();
  const [updateStatus] = useUpdateLocationStatusMutation();
  const dispatch = useDispatch();
  const confirm = (id: number) => {
    if (id) {
      deleteLocation(id);
    }
  };
  return [
    {
      title: "Serial No",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Unit Name",
      dataIndex: "unit_name",
      key: "unit_name",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Status",
      key: "status",
      render: (record) => (
        <>
          {record.status === 1 && (
            <Switch
              defaultChecked={true}
              style={{ background: "green" }}
              onChange={() => updateStatus(record.id)}
            />
          )}
          {record.status === 2 && (
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
                  title: "Update Location",
                  content: <UpdateLocation single={record} />,
                  show: true,
                  width: 400,
                })
              );
            }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete the location"
            description="Are you sure to delete this location?"
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
