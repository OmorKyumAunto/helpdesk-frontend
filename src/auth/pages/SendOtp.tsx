/*
Change Password
@Author Abdulla al mammun<mamun.m360ict@gmail.com>
*/
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Typography, Row, Col } from "antd";
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

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="registration-form login-form-container"
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
            <Typography.Title
              level={4}
              style={{
                textAlign: "center",
                paddingBottom: "10px",
                color: "black",
              }}
            >
              Match OTP
            </Typography.Title>
            <Form name="login-form" onFinish={onFinish}>
              <Row gutter={[16, 8]}>
                <Col xs={24}>
                  <Form.Item
                    name="otp"
                    rules={[
                      { required: true, message: "Please enter your otp!" },
                    ]}
                  >
                    <Input type="number" placeholder="Enter OTP" />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <SubmitButton loading={isLoading} label="Send" block />
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

export default SendOtp;
