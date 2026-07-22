import { Tooltip } from "antd";
import { TableProps } from "antd/lib";
import { IAsset } from "../types/assetsTypes";
import {
  AssetRowActions,
  AssetStatusControl,
} from "../components/AssetRowActions";
import { Remark } from "./assetVisuals";

const emptyCell = <span className="asset-empty">—</span>;

export const AssetsTableColumns = (): TableProps<IAsset>["columns"] => {
  return [
    {
      title: "Asset",
      key: "asset",
      width: 240,
      render: (record: IAsset) => (
        <div style={{ minWidth: 0 }}>
          <div className="asset-cell-title">{record.model || record.name}</div>
          <div className="asset-cell-sub">{record.category}</div>
        </div>
      ),
    },
    {
      title: "Specification",
      dataIndex: "specification",
      key: "specification",
      width: 210,
      render: (specification: string) =>
        specification ? (
          <Tooltip title={specification}>
            <div
              className="asset-cell-sub"
              style={{
                maxWidth: 190,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {specification}
            </div>
          </Tooltip>
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
      title: "Remarks",
      key: "remarks",
      render: ({ remarks }: IAsset) => <Remark remarks={remarks} />,
    },
    {
      title: "Status",
      key: "status",
      render: (record: IAsset) => <AssetStatusControl record={record} />,
    },
    {
      title: "Buying Unit",
      dataIndex: "unit_name",
      key: "unit_name",
      render: (value: string) =>
        value ? <span style={{ whiteSpace: "nowrap" }}>{value}</span> : emptyCell,
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      width: 170,
      render: (record: IAsset) => <AssetRowActions record={record} />,
    },
  ];
};
