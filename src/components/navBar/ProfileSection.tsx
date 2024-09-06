import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Image, Row, Tag, Typography } from "antd";

import { useNavigate } from "react-router-dom";
import { setLogout } from "../../app/features/userSlice";
import { useAppDispatch } from "../../app/store/store";
import user from "../../assets/user.png";
import { useGetMeQuery } from "../../app/api/userApi";
const ProfileSection = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data } = useGetMeQuery();
  const { role_id, status, name, email } = data?.data || {};
  console.log(data?.data);
  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
      <Card title="Profile Details">
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
              <p style={{ width: "10%", fontSize: "18px" }}>Name </p> <br />
              <p style={{ fontWeight: 700, fontSize: "18px" }}> : {name} </p>
            </div>
            <div style={{ display: "flex" }}>
              <p style={{ width: "10%", fontSize: "16px" }}>Email </p> <br />
              <p style={{ fontWeight: 700, fontSize: "16px" }}> : {email} </p>
            </div>
            <div style={{ display: "flex" }}>
              <p style={{ width: "10%", fontSize: "16px" }}>Role </p> <br />
              <p style={{ fontWeight: 700, fontSize: "16px" }}>
                {" "}
                : {role_id === 1 && <Tag color="blue-inverse">SUPER ADMIN</Tag>}
                {role_id === 2 && <Tag color="geekblue">ADMIN</Tag>}
                {role_id === 3 && <Tag color="orange-inverse">EMPLOYEE</Tag>}
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <p style={{ width: "10%", fontSize: "16px" }}>Status </p> <br />
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
