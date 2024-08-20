import { Space } from "antd";
import { TableProps } from "antd/lib";
import { IEmployee } from "../types/assetsTypes";
import { useDeleteAssetsMutation } from "../api/assetsEndPoint";
import { CustomLink } from "../../../common/CustomLink";
import { DeleteIcon, EyeIcon } from "../../../common/CommonButton";

export const AssetsTableColumns = (): TableProps<IEmployee>["columns"] => {
  const [deleteEmployee] = useDeleteAssetsMutation();
  const confirm = (id: number) => {
    if (id) {
      deleteEmployee(id);
    }
  };
  return [
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
      title: "Serial No",
      dataIndex: "serial_no",
      key: "serial_no",
    },
    {
      title: "PO No",
      dataIndex: "po_no",
      key: "po_no",
    },
    {
      title: "Specification",
      dataIndex: "specification",
      key: "specification",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },

    {
      title: "Actions",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <CustomLink to={`${record?.id}`}>
            <EyeIcon />
          </CustomLink>

          {/* <CommonTooltip title={"History"}>
            <Button size="small" type="primary">
              History
            </Button>
          </CommonTooltip> */}
          <DeleteIcon
            title={"Delete employee"}
            onConfirm={() => confirm(record?.id)}
          />
        </Space>
      ),
    },
  ];
};
