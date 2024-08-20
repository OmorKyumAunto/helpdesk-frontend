import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLoginMutation } from "../../app/api/api";

const Login = () => {
  // const [login, { isLoading, isSuccess, isError }] = useLoginMutation();
  const onFinish = (values: any) => {
    const body = {
      email: values.email,
      password: values.password,
    };
    // login(body);
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const formStyle = {
    width: "400px",
    padding: "50px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const headingStyle = {
    marginBottom: "20px",
    marginTop: "10px",
  };

  const buttonStyle = {
    width: "100%",
    marginRight: "8px",
  };

  const forgotStyle = {
    float: "right",
  };

  const buttonContainerStyle = {
    marginTop: "8px",
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h1 style={headingStyle}>Login</h1>
        <Form name="login-form" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item style={buttonContainerStyle}>
            <Button type="primary" htmlType="submit" style={buttonStyle}>
              Log in
            </Button>
            Or <a href="/">register now!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
