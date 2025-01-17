import { Form, Input, Typography, Row, Col, Image } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import "./Login.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../forget_api/forgetApi";
import SubmitButton from "../../components/submitButton/SubmitButton";
import { useEffect } from "react";
import notification from "../../common/utils/Notification";
import logo from "../../assets/logo.png";
type IForget = {
  password: string;
};
const ResetPassword = () => {
  const [resetPassword, { isSuccess, isLoading }] = useResetPasswordMutation();
  const [query] = useSearchParams();
  const email = query.get("email");
  const token = localStorage.getItem("otpToken");
  const navigate = useNavigate();

  const onFinish = (values: IForget) => {
    if (values.password.length < 8) {
      notification("error", "Password must be at least 8 characters");
      return;
    }
    const body = {
      token: token,
      email,
      password: values.password,
    };
    resetPassword(body);
  };
  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
      localStorage.removeItem("otpToken");
    }
  }, [isSuccess]);

  return (
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
                paddingBottom: "10px",
                color: "black",
              }}
            >
              Reset Password
            </Typography.Title>
            <Form name="login-form" layout="vertical" onFinish={onFinish}>
              <Row gutter={8}>
                <Col xs={24}>
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
                      placeholder="Enter new password"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="confirm_password"
                    label="Confirm Password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter confirm password!",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Enter confirm password"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <SubmitButton
                        style={{ width: "100%" }}
                        loading={isLoading}
                        label="Submit"
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
  );
};

export default ResetPassword;
