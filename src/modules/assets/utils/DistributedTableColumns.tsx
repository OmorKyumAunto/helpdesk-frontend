import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Tooltip, Button, Space } from "antd";
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
      // {
      //   title: "Employee Name",
      //   dataIndex: "user_name",
      //   key: "user_name",
      // },




      {
        title: "Employee Name",
        dataIndex: "user_name",
        key: "user_name",
        render: (user_name, record) => (
          <Tooltip
            title={
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d9d9d9",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  color: "#333",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                <p style={{ margin: "0 0 8px" }}>
                  <strong>Designation:</strong> {record.designation || "N/A"}
                </p>
                <p style={{ margin: "0 0 8px" }}>
                  <strong>Department:</strong> {record.department}
                </p>
                <p style={{ margin: "0 0 8px" }}>
                  <strong>Email:</strong> {record.email || "N/A"}
                </p>
                <p style={{ margin: "0" }}>
                  <strong>Phone No:</strong> {record.contact_no || "N/A"}
                </p>
                <p style={{ margin: "0" }}>
                  <strong>Unit:</strong> {record.employee_unit_name}
                </p>
              </div>
            }
            color="white"
            overlayInnerStyle={{
              borderRadius: "10px",
              padding: "0",
            }}
          >
            <span
              style={{
                cursor: "pointer",
                padding: "5px 10px",
                borderRadius: "6px",
                transition: "background-color 0.3s ease",
                color: "inherit",  // This keeps the default color for the name (black)
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f5ff")  // Highlight background on hover
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {user_name}
            </span>
          </Tooltip>
        ),
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
