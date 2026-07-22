import { TableProps } from "antd/lib";
import { IAsset } from "../types/assetsTypes";
import dayjs from "dayjs";
import { Button, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDispatch } from "react-redux";
import EmployeeDistributedAssetDetails from "../components/EmployeeDistributedAssetDetails";
import { useGetMeQuery } from "../../../app/api/userApi";

const emptyCell = <span className="asset-empty">—</span>;

export const EmployeeDistributedAssetsTableColumns =
  (): TableProps<IAsset>["columns"] => {
    const dispatch = useDispatch();
    const { data: profile } = useGetMeQuery();
    const roleID = profile?.data?.role_id;

    return [
      {
        title: "No",
        width: 56,
        render: (_, __, index) => (
          <span className="asset-cell-sub">{index + 1}</span>
        ),
      },
      {
        // Asset name (primary) with the category beneath — mirrors the Stock table.
        title: "Asset",
        key: "asset",
        width: 220,
        render: (record: any) => (
          <div style={{ minWidth: 0 }}>
            <div className="asset-cell-title">
              {record.asset_name || record.model || emptyCell}
            </div>
            <div className="asset-cell-sub">{record.category}</div>
          </div>
        ),
      },
      {
        title: "Model",
        dataIndex: "model",
        key: "model",
        render: (value: string) => value || emptyCell,
      },
      {
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
        title: "PO Number",
        dataIndex: "po_number",
        key: "po_number",
        render: (value: string) =>
          value ? <span className="asset-mono">{value}</span> : emptyCell,
      },
      {
        title: "Asset No",
        dataIndex: "asset_no",
        key: "asset_no",
        render: (value: string) =>
          value ? <span className="asset-mono">{value}</span> : emptyCell,
      },
      {
        title: "Assign Date",
        key: "assign_date",
        render: ({ assign_date }: any) =>
          assign_date ? (
            <span style={{ whiteSpace: "nowrap" }}>
              {dayjs(assign_date).format("DD-MM-YYYY")}
            </span>
          ) : (
            emptyCell
          ),
      },
      {
        title: "Actions",
        key: "action",
        fixed: "right",
        width: 80,
        render: (record: IAsset) => (
          <div className="asset-actions">
            <Tooltip title="View details" getPopupContainer={() => document.body}>
              <Button
                type="text"
                className="asset-iconbtn"
                aria-label="View asset details"
                icon={<EyeOutlined />}
                onClick={() =>
                  dispatch(
                    setCommonModal({
                      title:
                        roleID === 3
                          ? "Distributed Asset Details"
                          : "My Stock Details",
                      content: (
                        <EmployeeDistributedAssetDetails record={record} />
                      ),
                      show: true,
                      width: 740,
                    })
                  )
                }
              />
            </Tooltip>
          </div>
        ),
      },
    ];
  };
