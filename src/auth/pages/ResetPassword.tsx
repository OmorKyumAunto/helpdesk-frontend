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
  newPassword: string;
  confirmPassword: string;
};
const ResetPassword = () => {
  const [resetPassword, { isSuccess, isLoading }] = useResetPasswordMutation();
  const [query] = useSearchParams();
  const email = query.get("email");
  const token = localStorage.getItem("otpToken");
  const navigate = useNavigate();

  const onFinish = (values: IForget) => {
    const body = {
      ...values,
    };

    const headers = {
      authorization: `Bearer ${token}`,
    };

    resetPassword({ body, headers });
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
      localStorage.removeItem("otpToken");
    }
  }, [isSuccess, navigate]);

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
            <Form
              name="reset-password-form"
              layout="vertical"
              onFinish={onFinish}
            >
              <Row gutter={8}>
                <Col xs={24}>
                  <Form.Item
                    name="newPassword"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your password!",
                      },
                      {
                        min: 6,
                        message: "Password must be at least 6 characters long!",
                      },
                      // {
                      //   pattern:
                      //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      //   message:
                      //     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!",
                      // },
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
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={["newPassword"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("newPassword") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("The two passwords do not match!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Confirm your password"
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
