import { Button, Popconfirm, Space, Tag, Tooltip, Select } from "antd";
import { TableProps } from "antd/lib";
import { IAsset } from "../types/assetsTypes";
import {
  useDeleteAssetsMutation,
  useUpdateAssetStatusMutation,
} from "../api/assetsEndPoint";
import UpdateAsset from "../components/UpdateAssets";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import AssignEmployee from "../components/AssignEmployee";
import AssetDetails from "../components/AssetDetails";
import { RootState } from "../../../app/store/store";
import { useGetMeQuery } from "../../../app/api/userApi";
import { ASSET_STATUS, ASSET_STATUS_OPTIONS } from "./assetStatus";

export const AssetsTableColumns = (): TableProps<IAsset>["columns"] => {
  const dispatch = useDispatch();
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const { data: profile } = useGetMeQuery();
  const employeeID = profile?.data?.employee_id;
  const [deleteAsset] = useDeleteAssetsMutation();
  const [updateStatus, { isSuccess }] = useUpdateAssetStatusMutation();
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
      title: "Asset No",
      dataIndex: "asset_no",
      key: "asset_no",
    },
    {
      title: "PO No",
      dataIndex: "po_number",
      key: "po_number",
    },

    {
      title: "Remarks",
      render: ({ remarks }) =>
        remarks === "assigned" ? (
          <Tag color="success">Assigned</Tag>
        ) : remarks === "disposed" ? (
          <Tag color="error">Disposed</Tag>
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
          {employeeID !== "Assetteam" && (
            <>
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

              {/* Status can only be changed while the asset is NOT assigned —
                  the backend rejects it otherwise, so hide it for assigned ones. */}
              {record.remarks !== "assigned" && (
                <Select
                  size="small"
                  style={{ width: 110 }}
                  value={record.status}
                  options={ASSET_STATUS_OPTIONS}
                  onChange={(status: number) =>
                    updateStatus({ id: record.id, status })
                  }
                />
              )}
            </>
          )}


          {(roleId === 1 || roleId === 4) && (
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
          {/* Only ACTIVE (status 1) assets can be assigned — inactive (2) and
              disposed (3) are rejected by the backend, so hide the button. */}
          {employeeID !== "Assetteam" &&
            record?.is_assign === 0 &&
            record?.status === ASSET_STATUS.ACTIVE && (
            <Button
              size="small"
              type="primary"
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
          )}

        </Space>
      ),
    },
  ];
};
