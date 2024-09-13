import { TableProps } from "antd/lib";
import { IAsset } from "../types/assetsTypes";
import dayjs from "dayjs";
import { Button, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import AssetDetails from "../components/AssetDetails";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDispatch } from "react-redux";

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
        dataIndex: "employee_id_no",
        key: "employee_id_no",
      },
      {
        title: "Employee Name",
        dataIndex: "employee_name",
        key: "employee_name",
      },
      {
        title: "Department",
        dataIndex: "department",
        key: "department",
      },
      {
        title: "Unit",
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
