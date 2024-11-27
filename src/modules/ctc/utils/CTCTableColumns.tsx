import { TableProps } from "antd/lib";
import { ICTC } from "../types/ctcTypes";
export const CTCTableColumns = (): TableProps<ICTC>["columns"] => {
  return [
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      key: "employee_id",
    },
    {
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Assets",
      render: ({ assets }) =>
        assets?.map((item: any) => item?.category).join(", "),
    },
    {
      title: "Location",
      dataIndex: "unit_name",
      key: "unit_name",
    },
    {
      title: "Total Asset Cost",
      dataIndex: "total_asset_price",
      key: "total_asset_price",
    },
    {
      title: "Monthly Asset Cost",
      dataIndex: "monthly_asset_cost",
      key: "monthly_asset_cost",
    },
    {
      title: "Licenses",
      render: ({ licenses }) =>
        licenses?.map((item: any) => item?.title).join(", "),
    },
    {
      title: "Monthly Licenses Cost",
      dataIndex: "montly_licenses_price",
      key: "montly_licenses_price",
    },
    {
      title: "Total CTC Per Month",
      dataIndex: "total_ctc_per_month",
      key: "total_ctc_per_month",
    },
    {
      title: "Total CTC Per Year",
      dataIndex: "total_ctc_per_year",
      key: "total_ctc_per_year",
    },
  ];
};
