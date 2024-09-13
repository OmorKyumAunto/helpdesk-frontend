import { Card, Col, Row, Typography } from "antd";
import { useGetAllDashboardQuery } from "../api/dashboardEndPoints";
import { FaComputer } from "react-icons/fa6";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import GraphChartApex from "../components/ApexChart";
import ApexPieChart from "../components/ApexPieChart";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AiOutlineOrderedList } from "react-icons/ai";
import ApexInventoryPieChart from "../components/RePieChart";
import TopDash from "../components/TopDash";

const DashboardCards = () => {
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const { data } = useGetAllDashboardQuery();

  function getMonthName(monthNumber: any) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1];
  }

  const agents = [
    { MONTH: 1, total_agent: 20 },
    { MONTH: 2, total_agent: 30 },
    { MONTH: 3, total_agent: 25 },
    { MONTH: 4, total_agent: 35 },
    { MONTH: 5, total_agent: 40 },
    { MONTH: 6, total_agent: 45 },
  ];
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9966",
  ];

  return (
    <>
      <TopDash />
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
            <Card>
              <ApexPieChart />
            </Card>
            <br />
            {/* <Card>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    dataKey="total_agent"
                    data={agents}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8228d0"
                    label
                  >
                    {agents.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                        name={getMonthName(entry.MONTH)}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card> */}
          </Col>
          <Col xs={24} sm={24} md={24} lg={18}>
            <GraphChartApex />
          </Col>
        </Row>
      ) : (
        <Row gutter={[12, 6]}>
          <Col xs={24} sm={24} md={24} lg={6}>
            <Card className="bg-[#ff9933] text-white py-8 ">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "34px",
                      fontWeight: "bold",
                      marginTop: "4px",
                    }}
                  >
                    {data?.data?.total_assign_asset || 0}
                  </p>
                  <p
                    style={{ color: "white" }}
                    className="uppercase font-bold text-[24px]"
                  >
                    Asset Assign Count
                  </p>
                </div>
                <div>
                  <div
                    className="bg-[#ffbf80]"
                    style={{
                      height: "80px",
                      width: "80px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <AiOutlineOrderedList size={52} />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={6}>
            <Card className="bg-[#ff9933] text-white py-8 ">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "34px",
                      fontWeight: "bold",
                      marginTop: "4px",
                    }}
                  >
                    {data?.data?.total_assign_asset || 0}
                  </p>
                  <p
                    style={{ color: "white" }}
                    className="uppercase font-bold text-[24px]"
                  >
                    Asset Assign Count
                  </p>
                </div>
                <div>
                  <div
                    className="bg-[#ffbf80]"
                    style={{
                      height: "80px",
                      width: "80px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <AiOutlineOrderedList size={52} />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Card className="bg-[#ff9933] text-white py-8 ">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "34px",
                      fontWeight: "bold",
                      marginTop: "4px",
                    }}
                  >
                    {data?.data?.total_assign_asset || 0}
                  </p>
                  <p
                    style={{ color: "white" }}
                    className="uppercase font-bold text-[24px]"
                  >
                    Asset Assign Count
                  </p>
                </div>
                <div>
                  <div
                    className="bg-[#ffbf80]"
                    style={{
                      height: "80px",
                      width: "80px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <AiOutlineOrderedList size={52} />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default DashboardCards;
