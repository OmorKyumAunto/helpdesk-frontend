import { Card, Col, Row, Typography } from "antd";
import { useGetAllDashboardQuery } from "../api/dashboardEndPoints";
import { FaComputer } from "react-icons/fa6";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import GraphChartApex from "../components/ApexChart";
import ApexPieChart from "../components/ApexPieChart";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";

const DashboardCards = () => {
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const { data } = useGetAllDashboardQuery();
  return (
    <>
      {roleId !== 3 ? (
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Card className="bg-[#ba45ba] text-white">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Typography.Title style={{ color: "white" }} level={3}>
                    Total Asset
                  </Typography.Title>
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
                    className="bg-[#cf7dcf]"
                    style={{
                      height: "80px",
                      width: "80px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <FaComputer size={52} />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Card className="bg-[#ffa500] text-white">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Typography.Title style={{ color: "white" }} level={3}>
                    Total Employee
                  </Typography.Title>
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
                    className="bg-[#ffc14d]"
                    style={{
                      height: "80px",
                      width: "80px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <LuUsers2 size={52} />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Card className="bg-[#8dc73f] text-white">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Typography.Title style={{ color: "white" }} level={3}>
                    Total Assign Asset
                  </Typography.Title>
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
                    className="bg-[#acd775]"
                    style={{
                      height: "80px",
                      width: "80px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <MdOutlineAssignmentTurnedIn size={52} />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={6}>
            <ApexPieChart />
            <br />
            <ApexPieChart />
          </Col>
          <Col xs={24} sm={24} md={24} lg={18}>
            <GraphChartApex />
          </Col>
        </Row>
      ) : (
        <div
          // xs={24}
          // sm={24}
          // md={24}
          // lg={14}
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
          }}
        >
          {" "}
          <Typography.Title level={2}> Employee Dashboard</Typography.Title>
        </div>
      )}
    </>
  );
};

export default DashboardCards;
