import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Row,
  theme,
  Typography,
} from "antd";

import {
  ArrowRightOutlined,
  MoneyCollectFilled,
  RiseOutlined,
} from "@ant-design/icons";
// import BreadCrumb from '../../../components/breadcrumb/BreadCrumb';
import PageTitle from "../../../components/pageTitle/PageTitle";

function Dashboard() {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  return (
    <>
      {/* <PageTitle title='Dashboard' showButton /> */}
      <Row align={"middle"} justify={"end"} style={{ marginBottom: "1rem" }}>
        {/* <BreadCrumb /> */}
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
        <Col span={6} xs={24} sm={24} md={24} lg={16}>
          <Card
            style={{
              boxShadow: "rgba(100, 100, 111, 0.1) 0px 7px 29px 0px",
              // background: '#6e5db1',
              marginBottom: "1rem",
              padding: "1rem",
            }}
          >
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}
              align={"middle"}
              justify={"space-between"}
            >
              <Col span={6} xs={24} sm={24} md={24} lg={19}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
                  <Typography.Title level={2}>Welcome, Mamun</Typography.Title>
                </Row>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
                  <Typography.Text>
                    You have gained 34040 BDT profit!
                  </Typography.Text>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
                  <Typography.Text>
                    Start a new goal & improve your result
                  </Typography.Text>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
                  <Button type="primary" style={{ marginTop: "1rem" }}>
                    Go to Profile
                  </Button>
                </Row>
              </Col>
              <Col span={6} xs={24} sm={24} md={24} lg={5}>
                {/* <Lottie animationData={finance} size={100} /> */}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6} xs={24} sm={24} md={24} lg={4}>
          <Card
            style={{
              boxShadow: "rgba(100, 100, 111, 0.1) 0px 7px 29px 0px",
              marginBottom: "1rem",
              padding: "1rem",
            }}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
              <Col span={6} xs={24} sm={24} md={24} lg={20}></Col>
              <Col span={6} xs={24} sm={24} md={24} lg={4}>
                <ArrowRightOutlined />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6} xs={24} sm={24} md={24} lg={4}>
          <Card
            style={{
              boxShadow: "rgba(100, 100, 111, 0.1) 0px 7px 29px 0px",
              marginBottom: "1rem",
              padding: "1rem",
            }}
          ></Card>
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;
