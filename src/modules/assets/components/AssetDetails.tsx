import { Card, Col, Row, Tabs, Tag, Typography, Timeline, Divider } from "antd";
import dayjs from "dayjs";
import { useGetSingleAssetsQuery } from "../api/assetsEndPoint";

const { Text } = Typography;

const FieldItem = ({ label, value }: { label: string; value?: string | React.ReactNode }) => (
  <div style={{ marginBottom: 12 }}>
    <Text strong>{label}: </Text>
    <Text>{value || "N/A"}</Text>
  </div>
);

const AssetDetails = ({ id }: { id: any }) => {
  const { data: singleAsset } = useGetSingleAssetsQuery(id);

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
          (Assigned on:
          <span className="px-2 rounded font-bold">
            {dayjs(item?.asset_assign_date).format("DD-MM-YYYY")}
          </span>
          )
        </span>
      </p>
    ),
    color: item?.status === 1 ? "green" : "red",
  }));

  const items = [
    {
      key: "1",
      label: "Asset Info",
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Card>
              <FieldItem label="Asset No" value={asset_no} />
              <FieldItem label="Category" value={category} />
              <FieldItem label="Asset Name" value={name} />
              <FieldItem label="Model" value={model} />
              <FieldItem label="Serial No" value={serial_number} />
              <FieldItem label="PO Number" value={po_number} />


            </Card>
          </Col>
          <Col xs={24} md={14}>
            <Card>

              <FieldItem label="Buying Unit" value={unit_name} />
              <FieldItem label="Location" value={location_name} />
              <FieldItem label="Price" value={price} />
              <FieldItem label="Purchase Date" value={purchase_date ? dayjs(purchase_date).format("DD-MM-YYYY") : "Not Updated"} />
              <FieldItem label="Warranty" value={warranty} />
              <FieldItem
                label="Status"
                value={remarks === "assigned" ? <Tag color="green">Assigned</Tag> : <Tag color="blue">In Stock</Tag>}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Specifications",
      children: (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <FieldItem label="Specification" value={specification} />
            </Card>
          </Col>
          <Col span={24}>
            <Card>
              <FieldItem label="Device Remarks" value={device_remarks} />
            </Card>
          </Col>
        </Row>
      ),
    }
    ,


    ...(history?.length
      ? [
        {
          key: "3",
          label: "Asset History",
          children: (
            <Card>
              <div style={{ marginBottom: 16 }}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  Purchase Date:{" "}
                  <span style={{ fontWeight: "normal" }}>
                    {purchase_date ? dayjs(purchase_date).format("DD-MM-YYYY") : "N/A"}
                  </span>
                </Typography.Title>
              </div>
              <Timeline items={assetHistory} />
            </Card>
          ),
        },
      ]
      : []),


  ];

  return (
    <div style={{ padding: 16 }}>
      <Tabs defaultActiveKey="1" type="line" items={items} />
    </div>
  );
};

export default AssetDetails;
