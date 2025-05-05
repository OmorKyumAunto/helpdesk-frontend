import { Card, Col, Row, Tabs, Tag, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

const { Text } = Typography;

const FieldItem = ({ label, value }: { label: string; value?: string | React.ReactNode }) => (
  <div style={{ marginBottom: 12 }}>
    <Text strong>{label}: </Text>
    <Text>{value || <Text type="secondary">N/A</Text>}</Text>
  </div>
);

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
              <FieldItem label="Asset Name" value={asset_name} />
              <FieldItem label="Model" value={model} />
              <FieldItem label="Serial No" value={serial_number} />

            </Card>
          </Col>
          <Col xs={24} md={14}>
            <Card>
              <FieldItem label="PO Number" value={po_number} />
              <FieldItem label="Buying Unit" value={asset_unit_name} />
              <FieldItem label="Location" value={location_name} />
              <FieldItem
                label="Purchase Date"
                value={purchase_date ? dayjs(purchase_date).format("DD-MM-YYYY") : "Not Updated"}
              />
              <FieldItem
                label="Status"
                value={
                  remarks === "assigned" ? (
                    <Tag color="green">Assigned</Tag>
                  ) : (
                    <Tag color="blue">In Stock</Tag>
                  )
                }
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
        <Row>
          <Col span={24}>
            <Card>
              <FieldItem label="Specification" value={specification} />
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Tabs defaultActiveKey="1" type="line" items={items} />
    </div>
  );
};

export default EmployeeDistributedAssetDetails;
