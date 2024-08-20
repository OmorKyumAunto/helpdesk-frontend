import { Row, Typography } from "antd";
export const invoiceViewTitleStyle: React.CSSProperties = {
  display: "inline-block",
  border: "1px solid #526D82",
  padding: "0 15px",
  marginTop: 16,
  color: "#526D82",
  borderRadius: 5,
  textTransform: "uppercase",
  marginBottom: 20,
};
const TitleCenter = ({ title }: { title: string }) => {
  return (
    <Row justify={"center"}>
      <Typography.Title level={5} style={invoiceViewTitleStyle}>
        {title}
      </Typography.Title>
    </Row>
  );
};

export default TitleCenter;
