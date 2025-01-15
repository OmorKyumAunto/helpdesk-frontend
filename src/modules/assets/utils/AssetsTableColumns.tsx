import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { TableProps } from "antd/lib";
import { IAsset } from "../types/assetsTypes";
import { useDeleteAssetsMutation } from "../api/assetsEndPoint";
import UpdateAsset from "../components/UpdateAssets";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import AssignEmployee from "../components/AssignEmployee";
import AssetDetails from "../components/AssetDetails";
import { RootState } from "../../../app/store/store";

export const AssetsTableColumns = (): TableProps<IAsset>["columns"] => {
  const dispatch = useDispatch();
  const { roleId } = useSelector((state: RootState) => state.userSlice);
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
      render: (model: string, record: IAsset) => (
        <Tooltip title={record.specification}>
          <span>{model}</span>
        </Tooltip>
      ),
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
      title: "Asset No",
      dataIndex: "asset_no",
      key: "asset_no",
    },
    {
      title: "Remarks",
      render: ({ remarks }) =>
        remarks === "assigned" ? (
          <Tag color="success">Assigned</Tag>
        ) : (
          <Tag color="processing">In Stock</Tag>
        ),
    },
    {
      title: "Buying Unit",
      dataIndex: "unit_name",
      key: "unit_name",
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
                  title: "Assets Details",
                  content: <AssetDetails id={record?.id} />,
                  show: true,
                  width: 740,
                })
              );
            }}
          >
            <EyeOutlined />
          </Button>
          <Button
            size="small"
            style={{ color: "#1775BB" }}
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
          {roleId === 1 && (
            <Popconfirm
              title="Delete this Asset"
              description="Are You Sure to Delete This?"
              onConfirm={() => confirm(record?.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" style={{ color: "red" }}>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          )}
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
        </Space>
      ),
    },
  ];
};
