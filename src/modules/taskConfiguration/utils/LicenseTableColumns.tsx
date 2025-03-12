import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Switch } from "antd";
import { TableProps } from "antd/lib";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
  useDeleteLicenseMutation,
  useUpdateLicenseStatusMutation,
} from "../api/licenseEndPoint";
import UpdateLicense from "../components/UpdateLicense";
import { ILicense } from "../types/taskConfigTypes";
export const LicenseTableColumns = (): TableProps<ILicense>["columns"] => {
  const [deleteLicense] = useDeleteLicenseMutation();
  const [updateStatus] = useUpdateLicenseStatusMutation();
  const dispatch = useDispatch();
  const confirm = (id: number) => {
    if (id) {
      deleteLicense(id);
    }
  };
  return [
    {
      title: "Serial No",
      render: (_, __, index) => index + 1,
    },
    {
      title: "License Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      key: "status",
      render: (record) => (
        <>
          <Switch
            defaultChecked={record.status === "active" ? true : false}
            style={{ background: record.status === "active" ? "green" : "red" }}
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
            style={{ color: "#1775BB" }}
            onClick={() => {
              dispatch(
                setCommonModal({
                  title: "Update License",
                  content: <UpdateLicense single={record} />,
                  show: true,
                  width: 400,
                })
              );
            }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete the license"
            description="Are you sure to delete this license?"
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
