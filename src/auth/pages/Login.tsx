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
        style={{
          background: "#F0F7FF", // Light blue background for light theme
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        {/* SVG Bubble 1 - Bottom Left */}
        <svg
          style={{
            position: "absolute",
            bottom: "15%",
            left: "10%",
            width: "10%",
            height: "10%",
            zIndex: 0,
            opacity: 0.5,
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle cx="50" cy="50" r="30" fill="#3B82F6">
            <animate attributeName="r" dur="7s" repeatCount="indefinite" values="30;35;30" />
            <animate attributeName="opacity" dur="7s" repeatCount="indefinite" values="0.5;0.6;0.5" />
          </circle>
        </svg>
        {/* SVG Bubble 2 - Bottom Right */}
        <svg
          style={{
            position: "absolute",
            bottom: "20%",
            right: "15%",
            width: "8%",
            height: "8%",
            zIndex: 0,
            opacity: 0.45,
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle cx="50" cy="50" r="25" fill="#60A5FA">
            <animate attributeName="r" dur="8s" repeatCount="indefinite" values="25;30;25" />
            <animate attributeName="cx" dur="8s" repeatCount="indefinite" values="50;55;50" />
            <animate attributeName="opacity" dur="8s" repeatCount="indefinite" values="0.45;0.55;0.45" />
          </circle>
        </svg>
        {/* SVG Bubble 3 - Top Left */}
        <svg
          style={{
            position: "absolute",
            top: "15%",
            left: "20%",
            width: "12%",
            height: "12%",
            zIndex: 0,
            opacity: 0.4,
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle cx="50" cy="50" r="35" fill="#93C5FD">
            <animate attributeName="r" dur="9s" repeatCount="indefinite" values="35;40;35" />
            <animate attributeName="cy" dur="9s" repeatCount="indefinite" values="50;45;50" />
            <animate attributeName="opacity" dur="9s" repeatCount="indefinite" values="0.4;0.5;0.4" />
          </circle>
        </svg>
        {/* SVG Bubble 4 - Top Right */}
        <svg
          style={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: "9%",
            height: "9%",
            zIndex: 0,
            opacity: 0.45,
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle cx="50" cy="50" r="28" fill="#BFDBFE">
            <animate attributeName="r" dur="7.5s" repeatCount="indefinite" values="28;33;28" />
            <animate attributeName="opacity" dur="7.5s" repeatCount="indefinite" values="0.45;0.55;0.45" />
          </circle>
        </svg>
        {/* SVG Bubble 5 - Center Left */}
        <svg
          style={{
            position: "absolute",
            top: "40%",
            left: "15%",
            width: "7%",
            height: "7%",
            zIndex: 0,
            opacity: 0.5,
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle cx="50" cy="50" r="22" fill="#3B82F6">
            <animate attributeName="r" dur="8.5s" repeatCount="indefinite" values="22;27;22" />
            <animate attributeName="cx" dur="8.5s" repeatCount="indefinite" values="50;45;50" />
            <animate attributeName="opacity" dur="8.5s" repeatCount="indefinite" values="0.5;0.6;0.5" />
          </circle>
        </svg>
        {/* SVG Bubble 6 - Center Right */}
        <svg
          style={{
            position: "absolute",
            top: "35%",
            right: "20%",
            width: "10%",
            height: "10%",
            zIndex: 0,
            opacity: 0.4,
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle cx="50" cy="50" r="30" fill="#60A5FA">
            <animate attributeName="r" dur="9.5s" repeatCount="indefinite" values="30;35;30" />
            <animate attributeName="cy" dur="9.5s" repeatCount="indefinite" values="50;55;50" />
            <animate attributeName="opacity" dur="9.5s" repeatCount="indefinite" values="0.4;0.5;0.4" />
          </circle>
        </svg>
        {/* SVG Bubble 7 - Bottom Center */}
        <svg
          style={{
            position: "absolute",
            bottom: "25%",
            left: "45%",
            width: "8%",
            height: "8%",
            zIndex: 0,
            opacity: 0.45,
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle cx="50" cy="50" r="25" fill="#93C5FD">
            <animate attributeName="r" dur="8s" repeatCount="indefinite" values="25;30;25" />
            <animate attributeName="opacity" dur="8s" repeatCount="indefinite" values="0.45;0.55;0.45" />
          </circle>
        </svg>
        {/* SVG Bubble 8 - Top Center */}
        <svg
          style={{
            position: "absolute",
            top: "25%",
            left: "40%",
            width: "7%",
            height: "7%",
            zIndex: 0,
            opacity: 0.5,
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle cx="50" cy="50" r="20" fill="#BFDBFE">
            <animate attributeName="r" dur="7s" repeatCount="indefinite" values="20;25;20" />
            <animate attributeName="cx" dur="7s" repeatCount="indefinite" values="50;55;50" />
            <animate attributeName="opacity" dur="7s" repeatCount="indefinite" values="0.5;0.6;0.5" />
          </circle>
        </svg>
        {/* SVG Wave 1 - Bottom */}
        <svg
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "25%",
            zIndex: 0,
            opacity: 0.25,
          }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3B82F6" // Corrected invalid color #5684f8ff to valid #3B82F6
            d="M0,128L48,138.7C96,149,192,171,288,181.3C384,192,480,192,576,181.3C672,171,768,149,864,138.7C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="12s"
              repeatCount="indefinite"
              values="
                M0,128L48,138.7C96,149,192,171,288,181.3C384,192,480,192,576,181.3C672,171,768,149,864,138.7C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,160L48,149.3C96,139,192,117,288,138.7C384,160,480,224,576,224C672,224,768,160,864,149.3C960,139,1056,181,1152,192C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,128L48,138.7C96,149,192,171,288,181.3C384,192,480,192,576,181.3C672,171,768,149,864,138.7C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </path>
        </svg>
        <motion.div
          className="login-form-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "10px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            padding: "25px",
            width: "100%",
            maxWidth: "360px",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            margin: "10px",
            zIndex: 1,
          }}
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
                <Image
                  preview={false}
                  height={140}
                  src={logo}
                  style={{
                    transform: "scale(1)",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <Form name="login-form" layout="vertical" onFinish={onFinish}>
                <Row gutter={6}>
                  <Col xs={24}>
                    <Form.Item
                      name="id"
                      label={<span style={{ fontWeight: 500, color: "#1E40AF" }}>Employee ID</span>}
                      rules={[
                        {
                          required: true,
                          message: "Please input your ID!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: "#60A5FA" }} />}
                        placeholder="Enter Employee ID"
                        style={{
                          borderRadius: "6px",
                          padding: "8px",
                          fontSize: "14px",
                          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#3B82F6";
                          e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "";
                          e.target.style.boxShadow = "";
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      name="password"
                      label={<span style={{ fontWeight: 500, color: "#1E40AF" }}>Password</span>}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password!",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined style={{ color: "#60A5FA" }} />}
                        placeholder="Enter Password"
                        style={{
                          borderRadius: "6px",
                          padding: "8px",
                          fontSize: "14px",
                          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#3B82F6";
                          e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "";
                          e.target.style.boxShadow = "";
                        }}
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
                          style={{
                            width: "100%",
                            background: "#3B82F6",
                            color: "#fff",
                            borderRadius: "6px",
                            height: "40px",
                            fontSize: "14px",
                            fontWeight: 500,
                            transition: "background 0.3s ease, transform 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#2563EB";
                            e.currentTarget.style.transform = "translateY(-1px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#3B82F6";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        />
                      </div>
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <div
                      style={{
                        display: "flex", // Fixed from "fixed" to "flex"
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "#3B82F6",
                          fontWeight: 500,
                          transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#3B82F6")}
                      >
                        <Link to="/forget-password"> Forget Password? </Link>
                      </span>
                    </div>
                  </Col>
                  <Col xs={24}>
                    <div className="flex justify-center mt-[-10px] mb-[-5px]">
                      <Image
                        src={itlogo}
                        preview={false}
                        height={80}
                        alt="IT Logo"
                        style={{
                          transform: "scale(1)",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
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