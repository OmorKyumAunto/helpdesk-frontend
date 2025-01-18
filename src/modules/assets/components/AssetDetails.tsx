import { Descriptions, Divider, Tag, Timeline } from "antd";
import dayjs from "dayjs";
import { useGetSingleAssetsQuery } from "../api/assetsEndPoint";

const AssetDetails = ({ id }: { id: any }) => {
  const { data: singleAsset } = useGetSingleAssetsQuery(id);
  console.log(singleAsset);
  const {
    category,
    purchase_date,
    serial_number,
    po_number,
    asset_no,
    unit_name,
    model,
    specification,
    remarks,
    employee_id_no,
    name,
    history,
    price,
    warranty,
    device_remarks,
    location_name,
  } = singleAsset?.data || {};

  const assetHistory = history?.map((item: any) => ({
    children: (
      <p>
        <span>{item?.history}</span>
        <span className="ml-2">
          ( Assign date :
          <span className="px-2 rounded font-bold">
            {dayjs(item?.asset_assign_date).format("DD-MM-YYYY")}
          </span>
          )
        </span>
      </p>
    ),
    color: item?.status === 1 ? "green" : "red",
  }));

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
            children: name,
            span: 2,
          },
          {
            key: "13",
            label: "Asset No",
            children: asset_no,
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
            children: unit_name,
            span: 2,
          },
          {
            key: "12",
            label: "Sub Unit",
            children: location_name,
            span: 2,
          },
          {
            key: "9",
            label: "Price",
            children: price,
            span: 2,
          },
          {
            key: "8",
            label: "Purchase Date",
            children: dayjs(purchase_date).format("DD-MM-YYYY"),
            span: 2,
          },
          {
            key: "10",
            label: "Remaining Warranty",
            children: warranty,
            span: 2,
          },
          {
            key: "5",
            label: "Specification",
            children: specification,
            span: 4,
          },
          {
            key: "14",
            label: "Device Remarks",
            children: device_remarks,
            span: 4,
          },
        ]}
      />
      {history?.length ? (
        <>
          <Divider
            orientation="center"
            style={{ fontWeight: "bold", fontSize: "16px" }}
          >
            Asset History
          </Divider>
          <Timeline items={assetHistory} />
        </>
      ) : null}

    </div>
  );
};

export default AssetDetails;
