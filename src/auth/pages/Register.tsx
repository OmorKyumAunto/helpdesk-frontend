import { Button, Checkbox, Form, Input, Space, Row, Col } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { IFormInput } from "../../../Types/Login";
import styled from "styled-components";
import { Typography } from "antd";

import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../api/authEndPoint";
import { useEffect } from "react";
const { Title } = Typography;
const Register = () => {
  const navigate = useNavigate();
  const [register, { isLoading, isSuccess }] = useRegisterMutation();
  const onFinish = (values: IFormInput) => {
    register(values);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <WrapperStyle>
      <div className="login_form_card">
        <div style={{ paddingBottom: "15px" }}>
          <Title style={{ textAlign: "center" }} level={3}>
            BECOME A MEMBER
          </Title>
        </div>
        <>
          <Form onFinish={onFinish} layout="vertical">
            <Row gutter={[5, 5]}>
              <Col xs={24} md={12} xl={12}>
                <Form.Item
                  name="user_name"
                  label="User name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter user name",
                    },
                  ]}
                >
                  <Input placeholder="Enter user name" />
                </Form.Item>
              </Col>{" "}
              <Col xs={24} md={12} xl={12}>
                <Form.Item
                  name="company_name"
                  label="Hotel name"
                  rules={[
                    {
                      required: true,
                      message: "Please type your hotel name!",
                    },
                  ]}
                >
                  <Input placeholder="Enter hotel name" />
                </Form.Item>
              </Col>{" "}
              <Col xs={24} md={12} xl={12}>
                {" "}
                <Form.Item
                  name="email"
                  label="Email address"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email address!",
                    },
                  ]}
                >
                  <Input type="email" placeholder="Enter email address" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={12}>
                <Form.Item
                  name="phone"
                  label="Phone number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number",
                    },
                  ]}
                >
                  <Input type="number" placeholder="Enter phone number" />
                </Form.Item>
              </Col>{" "}
              <Col xs={24} md={12} xl={12}>
                {" "}
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Password"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={isLoading}
              >
                Register
              </Button>
              Already have an account? <Link to={"/login"}>Login</Link>
            </Form.Item>
          </Form>
        </>
      </div>
    </WrapperStyle>
  );
};

export default Register;

const WrapperStyle = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #deecf8;
`;
