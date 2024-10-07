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
    unit_name,
    model,
    specification,
    remarks,
    employee_id_no,
    name,
    history,
    price,
    warranty,
  } = singleAsset?.data || {};
  const assetHistory = history?.map((item: any) => {
    return {
      children: (
        <p>
          <span
          // style={{
          //   color: item?.status === 1 ? "green" : "red",
          // }}
          >
            {item?.history}
          </span>
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
    };
  });
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
          {
            key: "8",
            label: "Purchase Date",
            children: dayjs(purchase_date).format("DD-MM-YYYY"),
          },
          {
            key: "9",
            label: "Price",
            children: price,
          },
          {
            key: "10",
            label: "Warranty",
            children: warranty,
          },
        ]}
      />
      {purchase_date && employee_id_no && (
        <>
          <Divider
            orientation="center"
            style={{ fontWeight: "bold", fontSize: "16px" }}
          >
            {" "}
            Asset History
          </Divider>
          {/* <Typography.Text style={{ fontWeight: 500, fontSize: "15px" }}>
            1. In Stock since {dayjs(purchase_date).format("DD-MM-YYYY")}
          </Typography.Text>{" "}
          <br />
          <Typography.Text style={{ fontWeight: 500, fontSize: "15px" }}>
            2. Reserved for Employee ID : {employee_id_no} ({employee_name})
          </Typography.Text> */}
          <Timeline items={assetHistory?.length ? assetHistory : []} />
        </>
      )}
    </div>
  );
};

export default AssetDetails;
