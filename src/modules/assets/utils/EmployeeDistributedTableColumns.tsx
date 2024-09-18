import { TableProps } from "antd/lib";
import { IAsset } from "../types/assetsTypes";
import dayjs from "dayjs";
import { Button, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDispatch } from "react-redux";
import EmployeeDistributedAssetDetails from "../components/EmployeeDistributedAssetDetails";
import { useGetMeQuery } from "../../../app/api/userApi";

export const EmployeeDistributedAssetsTableColumns =
  (): TableProps<IAsset>["columns"] => {
    const dispatch = useDispatch();
    const { data: profile } = useGetMeQuery();
    const roleID = profile?.data?.role_id;
    return [
      {
        title: "No",
        render: (_, __, index) => index + 1,
      },

      {
        title: "Asset Name",
        dataIndex: "asset_name",
        key: "asset_name",
      },
      {
        title: "Unit Name",
        dataIndex: "asset_unit_name",
        key: "asset_unit_name",
      },

      {
        title: "Unit Category",
        dataIndex: "category",
        key: "category",
      },
      {
        title: "Model",
        dataIndex: "model",
        key: "model",
      },
      {
        title: "PO Number",
        dataIndex: "po_number",
        key: "po_number",
      },
      {
        title: "Assigning Date",
        render: ({ assign_date }) => dayjs(assign_date).format("DD-MM-YYYY"),
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
                    title: `${
                      roleID === 3
                        ? `Distributed Asset Details`
                        : "My Stock Details"
                    }`,
                    content: (
                      <EmployeeDistributedAssetDetails record={record} />
                    ),
                    show: true,
                    width: 740,
                  })
                );
              }}
            >
              <EyeOutlined />
            </Button>
          </Space>
        ),
      },
    ];
  };
