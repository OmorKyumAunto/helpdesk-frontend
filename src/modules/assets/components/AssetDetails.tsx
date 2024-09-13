import { Descriptions, Divider, Tag, Timeline, Typography } from "antd";
import dayjs from "dayjs";
import { useGetSingleAssetsQuery } from "../api/assetsEndPoint";

const AssetDetails = ({ id }: { id: any }) => {
  console.log(id);

  const { data: singleAsset } = useGetSingleAssetsQuery(id.id);
  const assetHistory = id?.asset_history?.map((item: any) => {
    return {
      children: `${dayjs(item.created_at).format("DD-MM-YYYY")} ${
        item.history
      }`,
    };
  });
  console.log(assetHistory);
  const {
    category,
    purchase_date,
    serial_number,
    po_number,
    unit_name,
    model,
    specification,
    remarks,
    employee_id_no,
    employee_name,
    name,
    asset_history,
  } = singleAsset?.data || {};
  console.log(singleAsset);
  console.log(asset_history);
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
            children: name,
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
            children: unit_name,
          },
        ]}
      />
      {purchase_date && employee_id_no && (
        <>
          <Divider
            orientation="left"
            style={{ fontWeight: "bold", fontSize: "16px" }}
          >
            Asset History
          </Divider>
        </>
      )}
      <Timeline items={assetHistory?.length ? assetHistory : []} />
    </div>
  );
};

export default AssetDetails;
