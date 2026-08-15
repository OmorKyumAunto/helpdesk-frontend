import {
  EditOutlined,
  EyeOutlined,
  InboxOutlined,
  SwapOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Tooltip, Button, Popconfirm } from "antd";
import { TableProps } from "antd/lib";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import DistributeAssetDetails from "../components/DistributedAssetDetails";
import { IAsset } from "../types/assetsTypes";
import UpdateAsset from "../components/UpdateAssets";
import AssignEmployee from "../components/AssignEmployee";
import SendRepairModal from "../components/SendRepairModal";
import SerialCopy from "../components/SerialCopy";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useReturnAssetToStockMutation } from "../api/assetsEndPoint";

const emptyCell = <span className="asset-empty">—</span>;

export const DistributedAssetsTableColumns =
  (): TableProps<IAsset>["columns"] => {
    const dispatch = useDispatch();
    const { data: profile } = useGetMeQuery();
    const employeeID = profile?.data?.employee_id;
    const [returnToStock, { isLoading: returning }] =
      useReturnAssetToStockMutation();

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
        // Asset name (primary) with the category beneath; the model shows on
        // hover so the column stays compact.
        title: "Asset",
        key: "asset",
        width: 200,
        render: (record: any) => (
          <Tooltip
            title={record.model ? `Model: ${record.model}` : "No model recorded"}
            getPopupContainer={() => document.body}
          >
            <div style={{ minWidth: 0, cursor: "default" }}>
              <div className="asset-cell-title">
                {record.asset_name || record.model || emptyCell}
              </div>
              <div className="asset-cell-sub">{record.category}</div>
            </div>
          </Tooltip>
        ),
      },
      {
        title: "Serial No",
        dataIndex: "serial_number",
        key: "serial_number",
        render: (value: string) => <SerialCopy value={value} />,
      },
      {
        // The asset's owning (buying) unit — asset_unit_name in the view.
        title: "Buying Unit",
        dataIndex: "asset_unit_name",
        key: "asset_unit_name",
        render: (value: string) =>
          value ? (
            <span style={{ whiteSpace: "nowrap" }}>{value}</span>
          ) : (
            emptyCell
          ),
      },
      {
        title: "Location",
        dataIndex: "location_name",
        key: "location_name",
        render: (value: string) =>
          value ? (
            <span style={{ whiteSpace: "nowrap" }}>{value}</span>
          ) : (
            emptyCell
          ),
      },
      {
        title: "Actions",
        key: "action",
        fixed: "right",
        width: 196,
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

            {employeeID !== "Assetteam" && !(record as any).in_repair && (
              <Tooltip
                title="Assign to another employee"
                getPopupContainer={() => document.body}
              >
                <Button
                  type="text"
                  className="asset-iconbtn"
                  aria-label="Assign this asset to another employee"
                  icon={<SwapOutlined />}
                  onClick={() =>
                    dispatch(
                      setCommonModal({
                        title: "Assign to Another Employee",
                        content: (
                          <AssignEmployee
                            id={record.id}
                            currentHolder={{
                              name: (record as any).user_name,
                              employee_id: (record as any).user_id_no,
                            }}
                          />
                        ),
                        show: true,
                        width: 640,
                      })
                    )
                  }
                />
              </Tooltip>
            )}

            {!!(record as any).in_repair && (
              <Tooltip
                title="Out at a vendor for repair. Mark it back from the Under Repair page before reassigning."
                getPopupContainer={() => document.body}
              >
                <span
                  className="asset-badge asset-badge--stock"
                  style={{ cursor: "help" }}
                >
                  <span className="asset-badge__dot" />
                  In Repair
                </span>
              </Tooltip>
            )}

            {employeeID !== "Assetteam" && !(record as any).in_repair && (
              <Tooltip
                title="Send for repair"
                getPopupContainer={() => document.body}
              >
                <Button
                  type="text"
                  className="asset-iconbtn"
                  aria-label="Send this asset for repair"
                  icon={<ToolOutlined />}
                  onClick={() =>
                    dispatch(
                      setCommonModal({
                        title: "Send for Repair",
                        content: (
                          <SendRepairModal
                            id={record.id}
                            currentHolder={{
                              name: (record as any).user_name,
                              employee_id: (record as any).user_id_no,
                            }}
                          />
                        ),
                        show: true,
                        width: "min(720px, 94vw)",
                      })
                    )
                  }
                />
              </Tooltip>
            )}

            {employeeID !== "Assetteam" && (
              <Popconfirm
                title="Move this asset to stock?"
                description="The employee will be unassigned and the asset returned to stock."
                okText="Yes, move"
                cancelText="Cancel"
                getPopupContainer={() => document.body}
                onConfirm={() => returnToStock({ assetId: record.id })}
              >
                <Tooltip
                  title="Move back to stock"
                  getPopupContainer={() => document.body}
                >
                  <Button
                    type="text"
                    className="asset-iconbtn"
                    aria-label="Move asset back to stock"
                    loading={returning}
                    icon={<InboxOutlined />}
                  />
                </Tooltip>
              </Popconfirm>
            )}

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
