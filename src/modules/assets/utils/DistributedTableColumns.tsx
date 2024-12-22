import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { TableProps } from "antd/lib";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import DistributeAssetDetails from "../components/DistributedAssetDetails";
import { IAsset } from "../types/assetsTypes";
import UpdateAsset from "../components/UpdateAssets";

export const DistributedAssetsTableColumns =
  (): TableProps<IAsset>["columns"] => {
    const dispatch = useDispatch();

    return [
      {
        title: "No",
        render: (_, __, index) => index + 1,
      },

      {
        title: "Employee ID",
        dataIndex: "user_id_no",
        key: "user_id_no",
      },
      {
        title: "Employee Name",
        dataIndex: "user_name",
        key: "user_name",
      },
      {
        title: "Department",
        dataIndex: "department",
        key: "department",
      },
      {
        title: "Emp Unit",
        dataIndex: "employee_unit_name",
        key: "employee_unit_name",
      },
      {
        title: "Asset Type",
        dataIndex: "category",
        key: "category",
      },
      {
        title: "Serial No",
        dataIndex: "serial_number",
        key: "serial_number",
      },
      // {
      //   title: "Assigning Date",
      //   render: ({ history }) =>
      //     history[0]?.status === 1
      //       ? dayjs(history[0]?.asset_assign_date).format("DD-MM-YYYY")
      //       : null,
      // },
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
                    title: "Distributed Asset Details",
                    content: <DistributeAssetDetails id={record.id} />,
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
                    title: "Update Distributed Asset",
                    content: <UpdateAsset asset={record} />,
                    show: true,
                    width: 678,
                  })
                );
              }}
            >
              <EditOutlined />
            </Button>
          </Space>
        ),
      },
    ];
  };
