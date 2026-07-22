import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Tooltip, Button } from "antd";
import { TableProps } from "antd/lib";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import DistributeAssetDetails from "../components/DistributedAssetDetails";
import { IAsset } from "../types/assetsTypes";
import UpdateAsset from "../components/UpdateAssets";
import { useGetMeQuery } from "../../../app/api/userApi";

const emptyCell = <span className="asset-empty">—</span>;

export const DistributedAssetsTableColumns =
  (): TableProps<IAsset>["columns"] => {
    const dispatch = useDispatch();
    const { data: profile } = useGetMeQuery();
    const employeeID = profile?.data?.employee_id;

    return [
      {
        title: "No",
        width: 56,
        render: (_, __, index) => (
          <span className="asset-cell-sub">{index + 1}</span>
        ),
      },
      {
        // Employee name (primary) with the ID beneath — mirrors the Stock table.
        title: "Employee",
        key: "employee",
        width: 220,
        render: (record: any) => (
          <Tooltip
            placement="topLeft"
            getPopupContainer={() => document.body}
            title={
              <div style={{ fontSize: 12.5, lineHeight: 1.7 }}>
                <div>
                  <strong>Designation:</strong> {record.designation || "N/A"}
                </div>
                <div>
                  <strong>Department:</strong> {record.department || "N/A"}
                </div>
                <div>
                  <strong>Email:</strong> {record.email || "N/A"}
                </div>
                <div>
                  <strong>Phone:</strong> {record.contact_no || "N/A"}
                </div>
                <div>
                  <strong>Unit:</strong> {record.employee_unit_name || "N/A"}
                </div>
              </div>
            }
          >
            <div style={{ minWidth: 0 }}>
              <div className="asset-cell-title">
                {record.user_name || emptyCell}
              </div>
              <div className="asset-mono">{record.user_id_no}</div>
            </div>
          </Tooltip>
        ),
      },
      {
        title: "Department",
        dataIndex: "department",
        key: "department",
        render: (value: string) => value || emptyCell,
      },
      {
        title: "Emp Unit",
        dataIndex: "employee_unit_name",
        key: "employee_unit_name",
        render: (value: string) =>
          value ? (
            <span style={{ whiteSpace: "nowrap" }}>{value}</span>
          ) : (
            emptyCell
          ),
      },
      {
        title: "Asset Type",
        dataIndex: "category",
        key: "category",
        render: (value: string) =>
          value ? (
            <span style={{ fontWeight: 500, color: "#101828" }}>{value}</span>
          ) : (
            emptyCell
          ),
      },
      {
        title: "Serial No",
        dataIndex: "serial_number",
        key: "serial_number",
        render: (value: string) =>
          value ? <span className="asset-mono">{value}</span> : emptyCell,
      },
      {
        title: "Actions",
        key: "action",
        fixed: "right",
        width: 100,
        render: (record: IAsset) => (
          <div className="asset-actions">
            <Tooltip title="View details" getPopupContainer={() => document.body}>
              <Button
                type="text"
                className="asset-iconbtn"
                aria-label="View distributed asset details"
                icon={<EyeOutlined />}
                onClick={() =>
                  dispatch(
                    setCommonModal({
                      title: "Distributed Asset Details",
                      content: <DistributeAssetDetails id={record.id} />,
                      show: true,
                      width: 740,
                    })
                  )
                }
              />
            </Tooltip>

            {employeeID !== "Assetteam" && (
              <Tooltip title="Edit asset" getPopupContainer={() => document.body}>
                <Button
                  type="text"
                  className="asset-iconbtn"
                  aria-label="Edit asset"
                  icon={<EditOutlined />}
                  onClick={() =>
                    dispatch(
                      setCommonModal({
                        title: "Update Distributed Asset",
                        content: <UpdateAsset asset={record} />,
                        show: true,
                        width: 760,
                      })
                    )
                  }
                />
              </Tooltip>
            )}
          </div>
        ),
      },
    ];
  };
