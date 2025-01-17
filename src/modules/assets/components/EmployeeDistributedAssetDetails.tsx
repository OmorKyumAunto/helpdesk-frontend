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
        column={{ sm: 1, md: 2 }}
        items={[
          {
            key: "12",
            label: "Name",
            children: asset_name,
            span: 2,
            
          },
          {
            key: "2",
            label: "Category",
            children: category,
            span: 2,
          },
          {
            key: "1",
            label: "Model",
            children: model,
            span: 2,
          },
          {
            key: "3",
            label: "Serial No",
            children: serial_number,
            span: 2,
          },
          {
            key: "4",
            label: "PO Number",
            children: po_number,
            span: 2,
          },
          {
            key: "13",
            label: "Asset No",
            children: asset_no,
            span: 2,
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
              span: 2,
          },
          {
            key: "7",
            label: "Buying Unit",
            children: asset_unit_name,
            span: 2,
          },
          {
            key: "9",
            label: "Location",
            children: location_name,
            span: 2,
          },
          {
            key: "8",
            label: "Purchase Date",
            children: dayjs(purchase_date).format("DD-MM-YYYY"),
            span: 2,
          },
          {
            key: "5",
            label: "Specification",
            children: specification,
            span: 4,
          },
        ]}
      />
    </div>
  );
};

export default EmployeeDistributedAssetDetails;
