import { TableProps } from "antd/lib";
import { IAsset } from "../types/assetsTypes";
import dayjs from "dayjs";
import { Button, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import AssetDetails from "../components/AssetDetails";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDispatch } from "react-redux";

export const EmployeeDistributedAssetsTableColumns =
  (): TableProps<IAsset>["columns"] => {
    const dispatch = useDispatch();

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
              type="primary"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Distributed Asset Details",
                    content: <AssetDetails id={record?.id} />,
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
