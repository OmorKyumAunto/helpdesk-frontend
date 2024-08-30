import {
  Button,
  Checkbox,
  Form,
  Input,
  Space,
  Row,
  Col,
  Image,
  Divider,
  Select,
} from "antd";
import {
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { IFormInput } from "../../../Types/Login";
import styled from "styled-components";
import { Typography } from "antd";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../api/authEndPoint";
import { useEffect } from "react";
import SubmitButton from "../../components/submitButton/SubmitButton";
const { Title } = Typography;
import logo from "../../assets/logo.png";
import videoBg from "../../assets/background.mp4";

const { Option } = Select;
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
    <>
      <video className="video-background" autoPlay loop muted>
        <source src={videoBg} type="video/mp4" />
      </video>
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
              <Form name="login-form" layout="vertical" onFinish={onFinish}>
                <Row gutter={6}>
                  <Col xs={24}>
                    <Form.Item
                      name="name"
                      label="Name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your name!",
                        },
                      ]}
                    >
                      <Input
                        // prefix={<MailOutlined />}
                        placeholder="Enter name"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      name="employee_id"
                      label="employee ID"
                      rules={[
                        {
                          required: true,
                          message: "Please input your employee id!",
                        },
                      ]}
                    >
                      <Input
                        // prefix={<MailOutlined />}
                        placeholder="Enter employee id"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      name="unit"
                      label="Unit"
                      rules={[
                        {
                          required: true,
                          message: "Please input your employee id!",
                        },
                      ]}
                    >
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Select Unit Name"
                      >
                        <Option value="JTML">JTML</Option>
                        <Option value="DIPL">DIPL</Option>
                        <Option value="Corporate Office">
                          Corporate Office
                        </Option>
                      </Select>
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
                          label="Register"
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
                        <Link to="/login">
                          {" "}
                          Already have an account? Please Login{" "}
                        </Link>
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

export default Register;

const WrapperStyle = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #deecf8;
`;
