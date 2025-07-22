import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Divider, Form, Image, Input, Row } from "antd";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../app/api/api";
import logo from "../../assets/logo.png";
import itlogo from "../../assets/itlogo.png";
import SubmitButton from "../../components/submitButton/SubmitButton";
import "./Login.css";
type IInputs = {
  id: string;
  password: string;
};

export const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const onFinish = (values: IInputs) => {
    const body = {
      id: values.id,
      password: values.password,
    };
    login(body);
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
              <Form name="login-form" layout="vertical" onFinish={onFinish}>
                <Row gutter={6}>
                  <Col xs={24}>
                    <Form.Item
                      name="id"
                      label="Employee ID"
                      rules={[
                        {
                          required: true,
                          message: "Please input your ID!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter Employee ID"
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
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <SubmitButton
                          loading={isLoading}
                          label="LogIn"
                          icon={<LoginOutlined />}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </Form.Item>
                  </Col>

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
                  <Col xs={24}>
                    <div className="flex justify-center mt-[-10px] mb-[-5px]">
                      <Image src={itlogo} preview={false} height={80} alt="IT Logo" />
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
