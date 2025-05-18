import { TableProps } from "antd/lib";
import { IAssetReportList } from "../types/reportTypes";

export const AssetReportTableColumn =
  (): TableProps<IAssetReportList>["columns"] => {
    return [
      //   {
      //     title: "No",
      //     render: (_, __, index) => index + 1,
      //   },
      {
        title: "Asset No",
        dataIndex: "asset_no",
        key: "asset_no",
        render: (text) => text || "0",
      },
      {
        title: "Asset Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
      },
      {
        title: "Model",
        dataIndex: "model",
        key: "model",
      },
      {
        title: "Serial Number",
        dataIndex: "serial_number",
        key: "serial_number",
      },
      {
        title: "PO Number",
        dataIndex: "po_number",
        key: "po_number",
      },
      {
        title: "Unit Name",
        dataIndex: "unit_name",
        key: "unit_name",
      },
    ];
  };
