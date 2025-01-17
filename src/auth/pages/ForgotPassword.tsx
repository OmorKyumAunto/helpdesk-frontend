/*
Change Password
@Author Abdulla al mammun<mamun.m360ict@gmail.com>
*/
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Form, Input, Typography, Row, Col, Image } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { motion } from "framer-motion"; // Import motion from framer-motion
import "./Login.css";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useGetOTPMutation } from "../../forget_api/forgetApi";
import logo from "../../assets/logo.png";
import SubmitButton from "../../components/submitButton/SubmitButton";

type IForget = {
  email: string;
  type: string;
  otp: string;
};
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [getOTP, { isSuccess, isLoading }] = useGetOTPMutation();

  const onFinish = (values: IForget) => {
    const body = {
      email: values.email.toLowerCase().replace(/\s/g, ""),
    };
    getOTP(body);
  };
  if (isSuccess) {
    navigate(`/forget-password/otp?email=${email}`);
  }

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className=" login-form-container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="login-form">
            <div className="flex justify-center">
              <Image preview={false} height={140} src={logo} />
            </div>
            <Typography.Title
              level={4}
              style={{
                textAlign: "center",
                paddingBottom: "10px",
                color: "black",
              }}
            >
              Forget Password
            </Typography.Title>
            <Form name="login-form" layout="vertical" onFinish={onFinish}>
              <Row gutter={[16, 8]}>
                <Col xs={24}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        type: "email",
                        message: "The input is not a valid E-mail!",
                      },
                      {
                        required: true,
                        message: "Please input your E-mail!",
                      },
                    ]}
                  >
                    <Input
                      onChange={(e: any) => setEmail(e.target.value)}
                      prefix={<MailOutlined />}
                      placeholder="Enter email address"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <SubmitButton
                        loading={isLoading}
                        label="Send OTP"
                        block
                        style={{ width: "100%" }}
                      />
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <span>
                      Go to <Link to="/login"> Login</Link>
                    </span>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
