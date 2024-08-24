// import Typography from "antd/es/typography/Typography";
import { Card, Col, Row } from "antd";
import DashCard from "../components/DashCard";
import { useGetAllDashboardQuery } from "../api/dashboardEndPoints";
import { IViewDashboard } from "../types/dashboardTypes";
import BarGraph from "../components/BarGraph";
// import FullCalender from "./FullCalender";
// import TopDash from "../components/TopDash";
export const DashboardDemo = () => {
  const { data } = useGetAllDashboardQuery();
  const dashBoard = data?.data as IViewDashboard;

  return (
    <>
      {/* <TopDash /> */}
      <DashCard dashboard={dashBoard} />
      <Row>
        <Col sm={24} xs={24} md={24} xxl={24}>
          <Card
            title="Event & Schedule List"
            // style={{
            //   background:
            //     "linear-gradient(90deg, hsla(172, 63%, 27%, 1) 0%, hsla(258, 40%, 68%, 1) 100%)",
            // }}
          >
            {/* <FullCalender /> */}
          </Card>
        </Col>
      </Row>
      {/* <ReportInformation /> */}
    </>
  );
};
