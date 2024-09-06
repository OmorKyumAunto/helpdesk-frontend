import { Button, Popconfirm, Space, Switch } from "antd";
import { TableProps } from "antd/lib";
import { IUnit } from "../types/unitTypes";
import dayjs from "dayjs";
import {
  useDeleteUnitMutation,
  useUpdateUnitStatusMutation,
} from "../api/unitEndPoint";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import UpdateUnit from "../components/UpdateUnit";
export const UnitTableColumns = (): TableProps<IUnit>["columns"] => {
  const [deleteUnit] = useDeleteUnitMutation();
  const [updateStatus] = useUpdateUnitStatusMutation();
  const dispatch = useDispatch();
  const confirm = (id: number) => {
    if (id) {
      deleteUnit(id);
    }
  };
  return [
    {
      title: "Serial No",
      render: (_, __, index) => index + 1,
    },

    {
      title: "Unit Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      key: "status",
      render: (record) => (
        <>
          <Switch
            defaultChecked={record.status === 1 ? true : false}
            unCheckedChildren="Inactive"
            checkedChildren="Active"
            onChange={() => updateStatus(record.id)}
          />
        </>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => dayjs(created_at).format("DD-MM-YYYY"),
    },
    {
      title: "Actions",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button
            size="small"
            type="primary"
            onClick={() => {
              dispatch(
                setCommonModal({
                  title: "Update Unit",
                  content: <UpdateUnit single={record} />,
                  show: true,
                  width: 400,
                })
              );
            }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete the unit"
            description="Are you sure to delete this unit?"
            onConfirm={() => confirm(record?.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" type="primary">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
};
