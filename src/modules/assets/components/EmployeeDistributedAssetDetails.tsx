import { Descriptions, Tag } from "antd";
import dayjs from "dayjs";

const EmployeeDistributedAssetDetails = ({ record }: { record: any }) => {
  const {
    category,
    purchase_date,
    serial_number,
    po_number,
    asset_no,
    asset_unit_name,
    model,
    specification,
    remarks,
    asset_name,
    location_name,
  } = record || {};
  return (
    <div>
      <Descriptions
        size="middle"
        bordered
        column={2}
        items={[
          {
            key: "12",
            label: "Name",
            children: asset_name,
            span: 4,
          },
          {
            key: "2",
            label: "Category",
            children: category,
          },
          {
            key: "1",
            label: "Model",
            children: model,
          },
          {
            key: "3",
            label: "Serial No",
            children: serial_number,
          },
          {
            key: "4",
            label: "PO Number",
            children: po_number,
          },
          {
            key: "13",
            label: "Asset No",
            children: asset_no,
          },
          {
            key: "5",
            label: "Specification",
            children: specification,
          },
          {
            key: "6",
            label: "Remarks",
            children:
              remarks === "assigned" ? (
                <Tag color="success">Assigned</Tag>
              ) : (
                <Tag color="processing">In Stock</Tag>
              ),
          },
          {
            key: "7",
            label: "Buying Unit",
            children: asset_unit_name,
          },
          {
            key: "9",
            label: "Location",
            children: location_name,
          },
          {
            key: "8",
            label: "Purchase Date",
            children: dayjs(purchase_date).format("DD-MM-YYYY"),
          },
        ]}
      />
    </div>
  );
};

export default EmployeeDistributedAssetDetails;
