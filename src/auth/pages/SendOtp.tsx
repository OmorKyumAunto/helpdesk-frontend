/*
Change Password
@Author Abdulla al mammun<mamun.m360ict@gmail.com>
*/
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Form,
  Input,
  Typography,
  Row,
  Col,
  Image,
  InputNumber,
  Statistic,
  Flex,
} from "antd";
import { motion } from "framer-motion"; // Import motion from framer-motion
import "./Login.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMatchOtpMutation } from "../../forget_api/forgetApi";
type IForget = {
  email: string;
  type: string;
  otp: string;
};
import SubmitButton from "../../components/submitButton/SubmitButton";
import logo from "../../assets/logo.png";
import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { CountdownProps } from "antd/lib";
import { OTPProps } from "antd/es/input/OTP";

const SendOtp = () => {
  const [matchOtp, { isSuccess, isLoading, data }] = useMatchOtpMutation();
  const [query] = useSearchParams();
  const email = query.get("email");
  const navigate = useNavigate();
  const onFinish = (values: IForget) => {
    const body = {
      email: email,
      otp: values.otp,
      type: "reset_admin",
    };
    matchOtp(body);
  };
  if (isSuccess) {
    const resToken = data?.token;
    localStorage.setItem("otpToken", resToken);
    navigate(`/reset-password?email=${email}`);
  }
  const { Countdown } = Statistic;

  const deadline = Date.now() + 10 * 10 * 60 * 25 * 2 + 1000 * 30;

  const onFinishTime: CountdownProps["onFinish"] = () => {
    console.log("finished!");
  };
  const onChange: OTPProps["onChange"] = (text) => {
    console.log("onChange:", text);
  };

  const onInput: OTPProps["onInput"] = (value) => {
    console.log("onInput:", value);
  };
  const sharedProps: OTPProps = {
    onChange,
    onInput,
  };
  return (
    <>
      <motion.div
        className="login-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="login-form-container"
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
                  color: "black",
                }}
              >
                Match OTP
              </Typography.Title>
              <Flex justify="center" align="center">
                <Countdown value={deadline} onFinish={onFinishTime} />
              </Flex>
              <Form
                name="login-form"
                layout="vertical"
                initialValues={{ email: "abc@gmail.com" }}
                onFinish={onFinish}
              >
                <Row gutter={6}>
                  <Col xs={24}>
                    <Form.Item
                      name="otp"
                      label="OTP"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your otp!",
                        },
                      ]}
                    >
                      <Input.OTP
                        style={{ width: "100%" }}
                        formatter={(str) => str.toUpperCase()}
                        {...sharedProps}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[{ required: true }]}
                    >
                      <Input readOnly placeholder="Your Email" />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <SubmitButton
                          style={{ width: "100%" }}
                          loading={isLoading}
                          label="Send"
                          block
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
    </>
  );
};

export default SendOtp;
