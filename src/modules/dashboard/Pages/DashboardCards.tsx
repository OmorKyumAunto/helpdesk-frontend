import { Card, Col, Row, Typography } from "antd";
import { useGetAllDashboardQuery } from "../api/dashboardEndPoints";
import { FaComputer } from "react-icons/fa6";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";

const DashboardCards = () => {
  const { data } = useGetAllDashboardQuery();
  return (
    <Row gutter={[12, 6]}>
      <Col xs={24} sm={24} md={24} lg={8}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Typography.Title level={3}>Total Asset</Typography.Title>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginTop: "4px",
                }}
              >
                {data?.data?.total_asset || 0}
              </p>
            </div>
            <div>
              <div
                style={{
                  height: "80px",
                  width: "80px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "12px",
                  border: "1px solid gray",
                }}
              >
                <FaComputer size={52} />
              </div>
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={24} lg={8}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Typography.Title level={3}>Total Employee</Typography.Title>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginTop: "4px",
                }}
              >
                {data?.data?.total_employee || 0}
              </p>
            </div>
            <div>
              <div
                style={{
                  height: "80px",
                  width: "80px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "12px",
                  border: "1px solid gray",
                }}
              >
                <LuUsers2 size={52} />
              </div>
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={24} lg={8}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Typography.Title level={3}>Total Assign Asset</Typography.Title>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginTop: "4px",
                }}
              >
                {data?.data?.total_assign_asset || 0}
              </p>
            </div>
            <div>
              <div
                style={{
                  height: "80px",
                  width: "80px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "12px",
                  border: "1px solid gray",
                }}
              >
                <MdOutlineAssignmentTurnedIn size={52} />
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardCards;
