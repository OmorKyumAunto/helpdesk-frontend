import { Card, Col, Row, Typography } from "antd";
import dayjs from "dayjs";
import { FaComputer } from "react-icons/fa6";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetMeQuery } from "../../../app/api/userApi";
import { RootState } from "../../../app/store/store";
import { useGetAllDashboardQuery } from "../api/dashboardEndPoints";
import GraphChartApex from "../components/ApexChart";
import ApexPieChart from "../components/ApexPieChart";
import BloodTypeChart from "../components/BloodChart";
import TopDash from "../components/TopDash";

const DashboardCards = () => {
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const { data } = useGetAllDashboardQuery();
  const { data: profile } = useGetMeQuery();
  const {
    total_assign_asset,
    employee_id,
    department,
    designation,
    email,
    contact_no,
    joining_date,
    unit_name,
    status,
  } = profile?.data || {};
  return (
    <>
      <TopDash />
      {roleId !== 3 ? (
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Link to={"/assets/list"}>
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
            </Link>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Link to={"/employee/list"}>
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
            </Link>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Link to={"/assets/distributed"}>
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
                      Total Disbursements
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
            </Link>
          </Col>
          <Col xs={24} sm={24} md={24} lg={6}>
            <Card title="Asset Category Statistics">
              <ApexPieChart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={18}>
            <GraphChartApex />
          </Col>
          <Col xs={24} sm={24} md={24}>
            <BloodTypeChart />
          </Col>
        </Row>
      ) : (
        <Row gutter={[12, 6]}>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Row gutter={[6, 12]}>
              <Col xs={24} sm={24} md={24}>
                <Link to={"/employee/employee-list"}>
                  <Card className="bg-[#ffa500] text-white h-full">
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
                </Link>
              </Col>
              <Col xs={24} sm={24} md={24}>
                <Link to={"/employee/distributed"}>
                  <Card className="bg-[#8dc73f] text-white h-full">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <Typography.Title style={{ color: "white" }} level={3}>
                          Total Disbursements
                        </Typography.Title>
                        <p
                          style={{
                            textAlign: "center",
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginTop: "4px",
                          }}
                        >
                          {total_assign_asset || 0}
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
                </Link>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={16}>
            <Row>
              <Col xs={24} sm={24} md={24}>
                <Card className="bg-[#1775bb] text-white py-8 h-full">
                  <Row gutter={[12, 6]}>
                    <Col xs={24} sm={24} md={12} lg={11}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div className="flex ">
                          <div className="text-lg md:text-xl font-bold">
                            <p className="mb-2">Employee ID</p>
                            <p className="mb-2">Designation</p>
                            <p className="mb-2">Department</p>
                            <p className="mb-3">Joining Date</p>
                          </div>
                          <div className="text-lg md:text-xl ml-4">
                            <p className="mb-2">: {employee_id}</p>
                            <p className="mb-2">: {designation}</p>
                            <p className="mb-2">: {department}</p>
                            <p className="mb-3">
                              : {dayjs(joining_date).format("DD-MM-YYYY")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={13}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div className="flex ">
                          <div className="text-lg md:text-xl font-bold">
                            <p className="mb-2">Phone</p>
                            <p className="mb-2">Email</p>
                            <p className="mb-2">Unit Name</p>
                            <p className="mb-3">Status</p>
                          </div>
                          <div className="text-lg md:text-xl ml-4">
                            <p className="mb-2">: {contact_no}</p>
                            <p className="mb-2">: {email}</p>
                            <p className="mb-2">: {unit_name}</p>
                            <p className="mb-3">
                              : {status === 1 ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <BloodTypeChart />
          </Col>
        </Row>
      )}
    </>
  );
};

export default DashboardCards;
