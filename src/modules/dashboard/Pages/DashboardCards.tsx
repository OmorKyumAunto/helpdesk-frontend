import { Card, Col, Row, Typography } from "antd";
import dayjs from "dayjs";
import { FaComputer } from "react-icons/fa6";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetMeQuery } from "../../../app/api/userApi";
import { RootState } from "../../../app/store/store";
import {
  useGetAllDashboardQuery,
  useGetDashboardAssetDataForAdminQuery,
  useGetDashboardDistributedAssetDataForAdminQuery,
  useGetDashboardEmployeeDataForEmployeeQuery,
} from "../api/dashboardEndPoints";
import GraphChartApex from "../components/ApexChart";
import ApexPieChart from "../components/ApexPieChart";
import BloodTypeChart from "../components/BloodChart";
import TopDash from "../components/TopDash";
import WeatherWidget from "../components/WeatherWidget";
import GraphChartV2 from "../components/GraphChartV2";
import CategoryPieChart from "../components/CategoryPieChat";
import TicketPieChart from "../components/TicketPieChart";

const DashboardCards = () => {
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const { data: asset } = useGetDashboardAssetDataForAdminQuery({});
  const { data: distributedAsset } =
    useGetDashboardDistributedAssetDataForAdminQuery({});
  const { data: empData } = useGetDashboardEmployeeDataForEmployeeQuery({});
  const { data } = useGetAllDashboardQuery();
  console.log(empData);
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
    role_id,
  } = profile?.data || {};
  return (
    <>
      <TopDash />
      {roleId !== 3 ? (
        <Row style={{ marginTop: "7px" }} gutter={[12, 12]}>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Link to={"/assets/list"}>
              <Card className="bg-[#ba45ba] text-white card-hover">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "3px", // Ensures padding is applied to the card content
                    position: "relative",
                  }}
                >
                  <div>
                    <Typography.Title style={{ color: "white" }} level={5}>
                      Total Asset
                    </Typography.Title>
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginTop: "4px",
                      }}
                    >
                      {role_id === 2
                        ? asset?.data?.user_count || 0
                        : data?.data?.total_asset || 0}
                    </p>
                  </div>
                  <div>
                    <div
                      className="bg-[#cf7dcf]"
                      style={{
                        height: "50px",
                        width: "50px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                      }}
                    >
                      <FaComputer size={30} />
                    </div>
                  </div>
                </div>
              </Card>

              <style>
                {`
    .card-hover {
      position: relative;
      overflow: hidden;
      border-radius: 15px; /* More rounded corners */
      transition: transform 0.3s ease, background-color 0.3s ease; /* Smooth zoom-in/out and background transition */
    }

    .card-hover:hover {
      transform: scale(1.05);  /* Slight zoom-in effect */
      background-color: #9f33a0;  /* Subtle background color change */
    }

    .card-hover::before {
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      border: 2px solid rgba(255, 255, 255, 0.1); /* Subtle inner border */
      border-radius: 15px; /* Matching rounded corners */
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;  /* Prevent interaction with inner border */
    }

    .card-hover:hover::before {
      opacity: 0;  /* Fade in the inner border */
    }
  `}
              </style>
            </Link>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Link to={"/employee/list"}>
              <Card className="bg-[#ffa500] text-white card-hover-employee">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "3px", // Ensures padding is applied to the card content
                    position: "relative",
                  }}
                >
                  <div>
                    <Typography.Title style={{ color: "white" }} level={5}>
                      Total Employee
                    </Typography.Title>
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "16px",
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
                        height: "50px",
                        width: "50px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                      }}
                    >
                      <LuUsers2 size={30} />
                    </div>
                  </div>
                </div>
              </Card>

              <style>
                {`
    .card-hover-employee {
      position: relative;
      overflow: hidden;
      border-radius: 15px; /* More rounded corners */
      transition: transform 0.3s ease, background-color 0.3s ease; /* Smooth zoom-in/out and background transition */
    }

    .card-hover-employee:hover {
      transform: scale(1.05);  /* Slight zoom-in effect */
      background-color: #e68900;  /* Slight background color change */
    }

    .card-hover-employee::before {
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      border: 2px solid rgba(255, 255, 255, 0.1); /* Subtle inner border */
      border-radius: 15px; /* Matching rounded corners */
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;  /* Prevent interaction with inner border */
    }

    .card-hover-employee:hover::before {
      opacity: 0;  /* Fade in the inner border */
    }
  `}
              </style>
            </Link>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Link to={"/assets/distributed"}>
              <Card className="bg-[#8dc73f] text-white card-hover-disbursements">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "3px", // Ensures padding is applied to the card content
                    position: "relative",
                  }}
                >
                  <div>
                    <Typography.Title style={{ color: "white" }} level={5}>
                      Disbursements
                    </Typography.Title>
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginTop: "4px",
                      }}
                    >
                      {role_id === 2
                        ? distributedAsset?.data?.employee_assign_asset_count ||
                        0
                        : data?.data?.total_assign_asset || 0}
                    </p>
                  </div>
                  <div>
                    <div
                      className="bg-[#acd775]"
                      style={{
                        height: "50px",
                        width: "50px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                      }}
                    >
                      <MdOutlineAssignmentTurnedIn size={30} />
                    </div>
                  </div>
                </div>
              </Card>

              <style>
                {`
    .card-hover-disbursements {
      position: relative;
      overflow: hidden;
      border-radius: 15px; /* More rounded corners */
      transition: transform 0.3s ease, background-color 0.3s ease; /* Smooth zoom-in/out and background transition */
    }

    .card-hover-disbursements:hover {
      transform: scale(1.05);  /* Slight zoom-in effect */
      background-color: #72b92b;  /* Slight background color change */
    }

    .card-hover-disbursements::before {
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      border: 2px solid rgba(255, 255, 255, 0.1); /* Subtle inner border */
      border-radius: 15px; /* Matching rounded corners */
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;  /* Prevent interaction with inner border */
    }

    .card-hover-disbursements:hover::before {
      opacity: 0;  /* Fade in the inner border */
    }
  `}
              </style>
            </Link>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Card title="Ticketing Statistics">
              <TicketPieChart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={16}>
            {/* category statistics /> */}
            <Card title="Asset Category Statistics" style={{ height: "100%" }}>
              <CategoryPieChart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24}>
            {/* <GraphChartApex /> */}
            <GraphChartV2 />
          </Col>
        </Row>
      ) : (
        <Row style={{ marginTop: "5px" }} gutter={[12,6]}>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Row gutter={[6, 12]}>
            <Col xs={24} sm={24} md={24}>
            <div>
                <WeatherWidget />
              </div>
            </Col>
              
            <Col xs={24} sm={24} md={24}>
                <Link to={"/employee/distributed"}>
                  <Card className="bg-[#8dc73f] text-white h-full card-hover-disbursements">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "3px", // Ensures consistent padding
                        position: "relative",
                      }}
                    >

                      <div>
                        <Typography.Title style={{ color: "white" }} level={5}>
                          Disbursements
                        </Typography.Title>
                        <p
                          style={{
                            textAlign: "center",
                            fontSize: "20px",
                            fontWeight: "bold",
                            marginTop: "4px",
                          }}
                        >
                          {empData?.data?.total_assign_count || 0}
                        </p>
                      </div>
                      <div>
                        <div
                          className="bg-[#acd775]"
                          style={{
                            height: "70px",
                            width: "70px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "50%",
                          }}
                        >
                          <MdOutlineAssignmentTurnedIn size={50} />
                        </div>
                      </div>
                    </div>

                    <style>
                      {`
      .card-hover-disbursements {
        position: relative;
        overflow: hidden;
        border-radius: 15px; /* Rounded corners */
        transition: transform 0.3s ease, background-color 0.3s ease; /* Smooth hover transitions */
      }

      .card-hover-disbursements:hover {
        transform: scale(1.05); /* Zoom-in effect */
        background-color: #72b92b; /* Subtle background color change */
      }

      .card-hover-disbursements::before {
        content: "";
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        border: 2px solid rgba(255, 255, 255, 0.1); /* Subtle inner border */
        border-radius: 15px; /* Matching rounded corners */
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none; /* Prevent interaction */
      }

      .card-hover-disbursements:hover::before {
        opacity: 0; /* Fade-in inner border on hover */
      }
    `}
                    </style>
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={24} md={24}>
                <Link to={"/employee/employee-list"}>
                  <Card className="bg-[#ffa500] text-white card-hover-employee">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "3px", // Ensures padding is applied to the card content
                        position: "relative",
                      }}
                    >

                      <div>
                        <Typography.Title style={{ color: "white" }} level={5}>
                          Total Employee
                        </Typography.Title>
                        <p
                          style={{
                            textAlign: "center",
                            fontSize: "20px",
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
                            height: "70px",
                            width: "70px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "50%",
                          }}
                        >
                          <LuUsers2 size={50} />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <style>
                    {`
    .card-hover-employee {
      position: relative;
      overflow: hidden;
      border-radius: 15px; /* More rounded corners */
      transition: transform 0.3s ease, background-color 0.3s ease; /* Smooth zoom-in/out and background transition */
    }

    .card-hover-employee:hover {
      transform: scale(1.05);  /* Slight zoom-in effect */
      background-color: #e68900;  /* Slight background color change */
    }

    .card-hover-employee::before {
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      border: 2px solid rgba(255, 255, 255, 0.1); /* Subtle inner border */
      border-radius: 15px; /* Matching rounded corners */
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;  /* Prevent interaction with inner border */
    }

    .card-hover-employee:hover::before {
      opacity: 0;  /* Fade in the inner border */
    }
  `}
                  </style>
                </Link>
              </Col>

            </Row>
          </Col>
          <Col xs={24} sm={24} md={16}>
            {/* <BloodTypeChart /> */}
            <Card title="Available Blood Group">
              <ApexPieChart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Row style={{ marginTop: "4px" }} justify="center">
              <Col xs={24} sm={22} md={20} lg={24}>
                <Card
                  style={{
                    background: "linear-gradient(145deg, #ffffff, #f0f4f7)", // Light gray background
                    border: "1px solid #e0e0e0", // Subtle border
                    borderRadius: "16px",
                    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
                    padding: "24px",
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                  }}
                  className="employee-detail-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <Row gutter={[24, 24]}>
                    {/* Left Section */}
                    <Col xs={24} sm={12}>
                      <div>
                        <h3
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            marginBottom: "16px",
                            color: "#333",
                            borderBottom: "2px solid #d6d6d6",
                            paddingBottom: "4px",
                          }}
                        >
                          Your Information
                        </h3>
                        <div style={{ marginBottom: "12px" }}>
                          <p style={{ margin: "0", color: "#000000", fontWeight: "500" }}>
                            <strong>Employee ID:</strong> {employee_id}
                          </p>
                        </div>
                        <div style={{ marginBottom: "12px" }}>
                          <p style={{ margin: "0", color: "#000000", fontWeight: "500" }}>
                            <strong>Designation:</strong> {designation}
                          </p>
                        </div>
                        <div style={{ marginBottom: "12px" }}>
                          <p style={{ margin: "0", color: "#000000", fontWeight: "500" }}>
                            <strong>Department:</strong> {department}
                          </p>
                        </div>
                        {/* <div style={{ marginBottom: "12px" }}>
                          <p style={{ margin: "0", color: "#000000", fontWeight: "500" }}>
                            <strong>Joining Date:</strong>{" "}
                            {dayjs(joining_date).format("DD-MM-YYYY")}
                          </p>
                        </div> */}
                      </div>
                    </Col>


                    {/* Right Section */}
                    <Col xs={24} sm={12}>
                      <div>
                        <h3
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            marginBottom: "16px",
                            color: "#333",
                            borderBottom: "2px solid #d6d6d6",
                            paddingBottom: "4px",
                          }}
                        >
                          Contact Details
                        </h3>
                        <div style={{ marginBottom: "12px" }}>
                          <p style={{ margin: "0", color: "#000000", fontWeight: "500" }}>
                            <strong>Phone:</strong> {contact_no}
                          </p>
                        </div>
                        <div style={{ marginBottom: "12px" }}>
                          <p style={{ margin: "0", color: "#000000", fontWeight: "500" }}>
                            <strong>Email:</strong> {email}
                          </p>
                        </div>
                        <div style={{ marginBottom: "12px" }}>
                          <p style={{ margin: "0", color: "#000000", fontWeight: "500" }}>
                            <strong>Unit Name:</strong> {unit_name}
                          </p>
                        </div>
                        <div style={{ marginBottom: "12px" }}>
                          <p style={{ margin: "0", color: "#000000", fontWeight: "500" }}>
                            <strong>Status:</strong>{" "}
                            <span
                              style={{
                                fontWeight: "600",
                                color: status === 1 ? "#28a745" : "#dc3545",
                              }}
                            >
                              {status === 1 ? "Active" : "Inactive"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>

        </Row>
      )}
    </>
  );
};

export default DashboardCards;
