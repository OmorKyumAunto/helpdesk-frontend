import { Button, Popconfirm, Space } from "antd";
import { TableProps } from "antd/lib";
import { IAsset } from "../types/assetsTypes";
import { useDeleteAssetsMutation } from "../api/assetsEndPoint";
import { CustomLink } from "../../../common/CustomLink";
import { DeleteIcon, EyeIcon } from "../../../common/CommonButton";
import UpdateAsset from "../components/UpdateAssets";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDispatch } from "react-redux";
import AssignEmployee from "../components/AssignEmployee";

export const AssetsTableColumns = (): TableProps<IAsset>["columns"] => {
  const dispatch = useDispatch();
  const [deleteAsset] = useDeleteAssetsMutation();
  const confirm = (id: number) => {
    if (id) {
      deleteAsset(id);
    }
  };
  return [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },

    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Serial No",
      dataIndex: "serial_number",
      key: "serial_number",
    },
    {
      title: "PO No",
      dataIndex: "po_number",
      key: "po_number",
    },
    {
      title: "Specification",
      dataIndex: "specification",
      key: "specification",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Unit",
      dataIndex: "unit_name",
      key: "unit_name",
    },

    {
      title: "Actions",
      key: "action",
      render: (record) => (
        <Space size="middle">
          {/* {record?.is_assign === 0 && ( */}
          <Button
            size="small"
            type="primary"
            className={record?.is_assign === 0 ? "block" : "hidden"}
            onClick={() => {
              dispatch(
                setCommonModal({
                  title: "Assign Employee",
                  content: <AssignEmployee id={record.id} />,
                  show: true,
                  width: 500,
                })
              );
            }}
          >
            Assign
          </Button>
          {/* )} */}
          {/* <Button
            size="small"
            type="primary"
            onClick={() => {
              dispatch(
                setCommonModal({
                  title: "Employee Details",
                  content: <EmployeeDetails employee={record} />,
                  show: true,
                  width: 740,
                })
              );
            }}
          >
            <EyeOutlined />
          </Button> */}
          <Button
            size="small"
            type="primary"
            onClick={() => {
              dispatch(
                setCommonModal({
                  title: "Update Asset",
                  content: <UpdateAsset asset={record} />,
                  show: true,
                  width: 678,
                })
              );
            }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete the asset"
            description="Are you sure to delete this asset?"
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
