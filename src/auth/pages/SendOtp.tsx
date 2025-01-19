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
  Button,
  message,
} from "antd";
import { motion } from "framer-motion"; // Import motion from framer-motion
import "./Login.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetOTPMutation,
  useMatchOtpMutation,
} from "../../forget_api/forgetApi";
type IForget = {
  email: string;
  type: string;
  otp: string;
};
import SubmitButton from "../../components/submitButton/SubmitButton";
import logo from "../../assets/logo.png";
import { CountdownProps } from "antd/lib";
import { OTPProps } from "antd/es/input/OTP";
import { useEffect, useState } from "react";

const SendOtp = () => {
  const [matchOtp, { isSuccess, isLoading, data }] = useMatchOtpMutation();
  const [getOTP, { isSuccess: otpSuccess }] = useGetOTPMutation();
  const [query] = useSearchParams();
  const email = query.get("email");
  const navigate = useNavigate();
  const onFinish = (values: IForget) => {
    const body = {
      email: email,
      otp: Number(values.otp),
    };
    matchOtp(body);
  };
  console.log(data?.data?.token);
  if (isSuccess) {
    const resToken = data?.data?.token;
    localStorage.setItem("otpToken", resToken);
    navigate(`/reset-password?email=${email}`);
  }
  const { Countdown } = Statistic;

  const [deadline, setDeadline] = useState(Date.now() + 5 * 60 * 1000);

  const onFinishTime: CountdownProps["onFinish"] = () => {
    message.error("OTP has been invalid. Resent for new OTP!");
  };
  const handleResendOtp = async () => {
    try {
      await getOTP({ email });
    } catch (error) {
      message.error("An error occurred while resending OTP.");
    }
  };
  useEffect(() => {
    if (otpSuccess) {
      setDeadline(Date.now() + 5 * 60 * 1000);
    }
  }, [otpSuccess]);
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
                        {
                          pattern: /^\d+$/,
                          message: "OTP must be a numeric value!",
                        },
                      ]}
                    >
                      <Input.OTP style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  {/* <Col xs={24}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[{ required: true }]}
                    >
                      <Input readOnly placeholder="Your Email" />
                    </Form.Item>
                  </Col> */}

                  <Col xs={24}>
                    <Form.Item>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <SubmitButton
                          style={{ width: "100%" }}
                          loading={isLoading}
                          label="Verify"
                          block
                        />
                      </div>
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <div style={{ textAlign: "center" }}>
                      <p>
                        <Button
                          type="text"
                          style={{ color: "#1775BB" }}
                          onClick={handleResendOtp}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.textDecoration = "underline")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.textDecoration = "none")
                          }
                        >
                          {" "}
                          Resend
                        </Button>
                      </p>

                      <p>
                        Go to <Link to="/login"> Login</Link>
                      </p>
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
