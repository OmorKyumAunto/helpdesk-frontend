import { Form, Input, Row, Col, Typography, Divider } from "antd";
import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import "./Login.css";
import { useLoginMutation } from "../../app/api/api";

type IInputs = {
  username: string;
  password: string;
};
import SubmitButton from "../../components/submitButton/SubmitButton";
import { Link } from "react-router-dom";

export const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const onFinish = (values: IInputs) => {
    const body = {
      username: values.username,
      password: values.password,
    };
    login(body);
  };

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
            <Form name="login-form" layout="vertical" onFinish={onFinish}>
              <Row gutter={6}>
                <Col xs={24}>
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                      {
                        required: true,
                        message: "Please input your username!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Enter username"
                    />
                  </Form.Item>
                </Col>
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
                      placeholder="Enter Password"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <SubmitButton
                        loading={isLoading}
                        label="Login"
                        icon={<LoginOutlined />}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </Form.Item>
                </Col>
                <Divider style={{ marginTop: "0px", marginBottom: "10px" }} />
                <Col xs={24}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "black" }}>
                      <Link to="/forget-password"> Forget Password? </Link>
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
