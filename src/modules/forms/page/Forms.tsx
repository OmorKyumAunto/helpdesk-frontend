import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Typography } from "antd";
import { saveAs } from "file-saver";

const Forms = () => {
  const handleDemandSlip = () => {
    const pdfUrl = "../../../assets/demand-slip-bandhan.xlsx";
    const pdfName = "demand-slip.xlsx";

    saveAs(pdfUrl, pdfName);
  };
  return (
    <Card
      title="Downloadable Forms and Templates"
      extra={
        <>
          <Input
            prefix={<SearchOutlined />}
            // onChange={(e) => setFilter({ ...filter, key: e.target.value })}
            placeholder="Search..."
          />
        </>
      }
    >
      <Typography.Title level={5}>
        Select and download the necessary Templates and Forms.
      </Typography.Title>
      <Row gutter={[12, 6]}>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Card className="shadow-lg">
            <Typography.Title level={4}>
              Demand Slip For Bandhan
            </Typography.Title>
            <Typography.Text style={{ fontSize: "15px" }}>
              Demand Slip For Bandhan
            </Typography.Text>{" "}
            <br />
            <Button
              onClick={handleDemandSlip}
              style={{
                marginTop: "12px",
                background: "#7AB536",
                color: "white",
              }}
            >
              Download
            </Button>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default Forms;
