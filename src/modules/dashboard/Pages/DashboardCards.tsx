import { Card, Col, Row, Typography } from "antd";
import {
  useGetAllDashboardQuery,
  useGetDashboardEmployeeDataQuery,
} from "../api/dashboardEndPoints";
import { FaComputer } from "react-icons/fa6";
import { LuUser2, LuUsers2 } from "react-icons/lu";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import GraphChartApex from "../components/ApexChart";
import ApexPieChart from "../components/ApexPieChart";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { AiOutlineOrderedList } from "react-icons/ai";
import TopDash from "../components/TopDash";
import { useGetMeQuery } from "../../../app/api/userApi";
import dayjs from "dayjs";

const DashboardCards = () => {
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const { data } = useGetAllDashboardQuery();
  const { data: profile } = useGetMeQuery();
  console.log(profile?.data);
  const {
    id,
    role_id,
    profile_id,
    employee_id,
    name,
    department,
    designation,
    email,
    contact_no,
    joining_date,
    unit_name,
    status,
  } = profile?.data || {};
  const { data: empData } = useGetDashboardEmployeeDataQuery({});
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
            <Card title="Asset Category Statistics">
              <ApexPieChart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={18}>
            <GraphChartApex />
          </Col>
        </Row>
      ) : (
        <Row gutter={[12, 6]}>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Card className="bg-[#ad33ff] text-white py-8 ">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="flex ">
                  <div className="text-2xl font-bold">
                    <p>Employee ID</p>
                    <p>Designation</p>
                    <p>Department</p>
                  </div>
                  <div className="text-2xl ml-5">
                    <p>: {employee_id}</p>
                    <p>: {designation}</p>
                    <p>: {department}</p>
                  </div>
                </div>
                <div>
                  <div
                    className="bg-[#c266ff]"
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
              {/* <div
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
                    className="bg-[#c266ff]"
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
              </div> */}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Card className="bg-[#ff7733] text-white py-8 ">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="flex ">
                  <div className="text-2xl font-bold">
                    <p>Phone</p>
                    <p>Email</p>
                    <p>Unit Name</p>
                  </div>
                  <div className="text-2xl ml-5">
                    <p>: {contact_no}</p>
                    <p>: {email}</p>
                    <p>: {unit_name}</p>
                  </div>
                </div>
                <div>
                  <div
                    className="bg-[#ff9966]"
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
              {/* <div
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
                    {data?.data?.total_asset || 0}
                  </p>
                  <p
                    style={{ color: "white" }}
                    className="uppercase font-bold text-[24px]"
                  >
                    Total Asset Count
                  </p>
                </div>
                <div>
                  <div
                    className="bg-[#ff9966]"
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
              </div> */}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Card className="bg-[#bf4080] text-white py-8 h-full">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="flex ">
                  <div className="text-2xl font-bold">
                    <p>Joining Date</p>
                    <p>Status</p>
                    <p>Asset Count</p>
                  </div>
                  <div className="text-2xl ml-5">
                    <p>: {dayjs(joining_date).format("DD-MM-YYYY")}</p>
                    <p>: {status === 1 ? "Active" : "Inactive"}</p>
                    <p>: {0}</p>
                  </div>
                </div>
                <div>
                  <div
                    className="bg-[#cc6699]"
                    style={{
                      height: "80px",
                      width: "80px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <LuUser2 size={52} />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Card className="bg-[#bf4080] text-white py-8 h-full">
              <Row gutter={[12, 6]}>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div className="flex ">
                      <div className="text-2xl font-bold">
                        <p>Employee ID</p>
                        <p>Designation</p>
                        <p>Department</p>
                      </div>
                      <div className="text-2xl ml-5">
                        <p>: {employee_id}</p>
                        <p>: {designation}</p>
                        <p>: {department}</p>
                      </div>
                    </div>
                    {/* <div>
                      <div
                        className="bg-[#cc6699]"
                        style={{
                          height: "80px",
                          width: "80px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "50%",
                        }}
                      >
                        <LuUser2 size={52} />
                      </div>
                    </div> */}
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div className="flex ">
                      <div className="text-2xl font-bold">
                        <p>Phone</p>
                        <p>Email</p>
                        <p>Unit Name</p>
                      </div>
                      <div className="text-2xl ml-5">
                        <p>: {contact_no}</p>
                        <p>: {email}</p>
                        <p>: {unit_name}</p>
                      </div>
                    </div>
                    {/* <div>
                      <div
                        className="bg-[#cc6699]"
                        style={{
                          height: "80px",
                          width: "80px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "50%",
                        }}
                      >
                        <LuUser2 size={52} />
                      </div>
                    </div> */}
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div className="flex ">
                      <div className="text-2xl font-bold">
                        <p>Joining Date</p>
                        <p>Status</p>
                        <p>Asset Count</p>
                      </div>
                      <div className="text-2xl ml-5">
                        <p>: {dayjs(joining_date).format("DD-MM-YYYY")}</p>
                        <p>: {status === 1 ? "Active" : "Inactive"}</p>
                        <p>: {0}</p>
                      </div>
                    </div>
                    <div>
                      <div
                        className="bg-[#cc6699]"
                        style={{
                          height: "80px",
                          width: "80px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "50%",
                        }}
                      >
                        <LuUser2 size={52} />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default DashboardCards;
