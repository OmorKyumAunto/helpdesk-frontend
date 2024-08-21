import { TableProps } from "antd/lib";
import { IAsset } from "../types/assetsTypes";
import dayjs from "dayjs";

export const DistributedAssetsTableColumns =
  (): TableProps<IAsset>["columns"] => {
    //    {
    //             "id": 2,
    //             "name": "T-shirt",
    //             "category": "Dress",
    //             "purchase_date": "2024-04-21T18:00:00.000Z",
    //             "serial_number": "0098765",
    //             "po_number": "234543534",
    //             "asset_history": "This is tshirt",
    //             "is_assign": 1,
    //             "created_at": "2024-08-21T08:04:53.000Z",
    //             "status": 1,
    //             "remarks": "assigned",
    //             "unit_name": "DIPL",
    //             "employee_id": 2,
    //             "assign_date": "2024-05-16T18:00:00.000Z",
    //             "employee_name": "Karim Rahman",
    //             "employee_id_no": "1153432",
    //             "employee_department": "IT",
    //             "employee_designation": "Network Engineer",
    //             "employee_unit": "Corporate Office"
    //         },
    return [
      {
        title: "Serial No",
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
        dataIndex: "employee_department",
        key: "employee_department",
      },
      {
        title: "Unit",
        dataIndex: "employee_unit",
        key: "employee_unit",
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
    ];
  };
