import { EditOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Image,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";

import { useNavigate } from "react-router-dom";
import { setLogout } from "../../app/features/userSlice";
import { useAppDispatch } from "../../app/store/store";
import user from "../../assets/user.png";
import { useGetMeQuery } from "../../app/api/userApi";
import dayjs from "dayjs";
import { setCommonModal } from "../../app/slice/modalSlice";
import UpdateEmployee from "../../modules/employee/components/UpdateEmployee";
import ChangeEmployeePassword from "./ChangePassword";
const ProfileSection = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data } = useGetMeQuery();
  const {
    role_id,
    status,
    name,
    email,
    department,
    designation,
    joining_date,
    unit_name,
    employee_id,
    contact_no,
  } = data?.data || {};
  // console.log(data?.data);
  const record = data?.data;
  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
      <Card
        title="Profile Details"
        extra={
          <Space>
            <Button
              type="primary"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Update Employee",
                    content: <UpdateEmployee employee={record as any} />,
                    show: true,
                    width: 678,
                  })
                );
              }}
              icon={<EditOutlined />}
            >
              Update Profile
            </Button>
            <Button
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Change Employee Password",
                    content: <ChangeEmployeePassword />,
                    show: true,
                    width: 550,
                  })
                );
              }}
            >
              Change Password
            </Button>
          </Space>
        }
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: "15%",
              border: "1px solid #bfbfbf",
              padding: "14px",
              borderRadius: "8px",
            }}
          >
            <Image preview={false} src={user} />
          </div>
          <div
            style={{
              width: "85%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <div style={{ display: "flex" }}>
              <p style={{ width: "20%", fontSize: "18px" }}>Name </p> <br />
              <p style={{ fontWeight: 700, fontSize: "18px" }}> : {name} </p>
            </div>
            <div style={{ display: "flex" }}>
              <p style={{ width: "20%", fontSize: "18px" }}>Employee ID </p>{" "}
              <br />
              <p style={{ fontWeight: 700, fontSize: "18px" }}>
                {" "}
                : {employee_id}{" "}
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <p style={{ width: "20%", fontSize: "18px" }}>Phone </p> <br />
              <p style={{ fontWeight: 700, fontSize: "18px" }}>
                {" "}
                : {contact_no}{" "}
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <p style={{ width: "20%", fontSize: "16px" }}>Email </p> <br />
              <p style={{ fontWeight: 700, fontSize: "16px" }}> : {email} </p>
            </div>
            <div style={{ display: "flex" }}>
              <p style={{ width: "20%", fontSize: "16px" }}>Designation </p>{" "}
              <br />
              <p style={{ fontWeight: 700, fontSize: "16px" }}>
                {" "}
                : {designation}{" "}
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <p style={{ width: "20%", fontSize: "16px" }}>Department </p>{" "}
              <br />
              <p style={{ fontWeight: 700, fontSize: "16px" }}>
                {" "}
                : {department}{" "}
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <p style={{ width: "20%", fontSize: "16px" }}>Unit Name </p>{" "}
              <br />
              <p style={{ fontWeight: 700, fontSize: "16px" }}>
                {" "}
                : {unit_name}{" "}
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <p style={{ width: "20%", fontSize: "16px" }}>Joining Date </p>{" "}
              <br />
              <p style={{ fontWeight: 700, fontSize: "16px" }}>
                {" "}
                : {dayjs(joining_date).format("DD MMM YYYY")}{" "}
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <p style={{ width: "20%", fontSize: "16px" }}>Role </p> <br />
              <p style={{ fontWeight: 700, fontSize: "16px" }}>
                {" "}
                : {role_id === 1 && <Tag color="blue-inverse">SUPER ADMIN</Tag>}
                {role_id === 2 && <Tag color="geekblue">ADMIN</Tag>}
                {role_id === 3 && <Tag color="orange-inverse">EMPLOYEE</Tag>}
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <p style={{ width: "20%", fontSize: "16px" }}>Status </p> <br />
              <p style={{ fontWeight: 700, fontSize: "16px" }}>
                {" "}
                :{" "}
                <Tag color={status === 1 ? "success" : "error"}>
                  {status === 1 ? "ACTIVE" : "INACTIVE"}
                </Tag>{" "}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSection;
