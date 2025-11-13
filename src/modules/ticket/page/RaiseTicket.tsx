import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Row,
  Col,
  Card,
  message,
  Modal,
  Typography,
  Space,
  Tag
} from "antd";
import {
  PlusOutlined,
  InboxOutlined,
  UserAddOutlined,
  SendOutlined,
  PaperClipOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { useGetCategoryActiveListQuery } from "../../Category/api/categoryEndPoint";
import { useGetEmployeeAllDistributedAssetQuery } from "../../assets/api/assetsEndPoint";
import { useCreateRaiseTicketMutation } from "../api/ticketEndpoint";
import { useGetOverallEmployeesQuery } from "../../employee/api/employeeEndPoint";
import { IEmployee } from "../../employee/types/employeeTypes";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAppDispatch } from "../../../app/store/store";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useGetMeQuery } from "../../../app/api/userApi";
import SeatingLocationModal from "../../employee/components/SeatingLocationModal";
import Lottie from "lottie-react";
import DoneAnimation from "../../../assets/Done.json";
import SadAnimation from "../../../assets/sadloader.json";

const { Option } = Select;
const { Title, Text } = Typography;

interface RaiseTicketFormProps {
  setActiveKey: React.Dispatch<React.SetStateAction<string>>;
}

const RaiseTicketForm: React.FC<RaiseTicketFormProps> = ({ setActiveKey }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [isCcVisible, setIsCcVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const { data: allEmployee, isLoading: empLoading } = useGetOverallEmployeesQuery();
  const { data, isLoading } = useGetEmployeeAllDistributedAssetQuery({});
  const { data: categoryData, isLoading: categoryLoading } = useGetCategoryActiveListQuery({});
  const { data: { data: profile } = {} } = useGetMeQuery();

  const [create, { isSuccess, isLoading: isCreating }] = useCreateRaiseTicketMutation();
  const editor = useRef(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const successTimerRef = useRef<NodeJS.Timeout | null>(null);

  const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);
  const handleCcButtonClick = () => setIsCcVisible(!isCcVisible);

  // Handle countdown and auto-open seating location modal
  useEffect(() => {
    if (errorModalVisible && countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (errorModalVisible && countdown === 0) {
      // Close error modal and open seating location modal
      setErrorModalVisible(false);
      setCountdown(3); // Reset countdown for next time
      
      // Open seating location modal
      dispatch(
        setCommonModal({
          show: true,
          title: "Update Seating Location",
          content: <SeatingLocationModal employee={profile} />,
        })
      );
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [errorModalVisible, countdown, dispatch, profile]);

  // Handle success modal and redirect
  useEffect(() => {
    if (isSuccess) {
      setSuccessModalVisible(true);
      
      // Close modal and redirect after 2 seconds
      successTimerRef.current = setTimeout(() => {
        setSuccessModalVisible(false);
        form.resetFields();
        setIsCcVisible(false);
        setSelectedPriority("");
        setActiveKey("7");
      }, 2000);
    }

    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, [isSuccess, form, setActiveKey]);

  // Ticket form submission
  const handleSubmit = async (values: any, isRetry = false) => {
    setIsSubmitting(true);
    const formData = new FormData();

    for (const key in values) {
      if (values[key]) {
        if (key === "attachment") {
          if (values[key][0]?.originFileObj) formData.append(key, values[key][0].originFileObj);
        } else if (key === "cc" && Array.isArray(values[key])) {
          values[key].forEach((id: string) => formData.append("cc[]", id));
        } else {
          formData.append(key, values[key]);
        }
      }
    }

    try {
      await create(formData).unwrap();
      // Success modal will be shown by useEffect
    } catch (err: any) {
      if (
        err?.data?.message ===
        "Your seating location has not been updated. Please update your current seating location."
      ) {
        // Show error modal with countdown
        setErrorModalVisible(true);
        setCountdown(3);
      } else {
        message.error(err?.data?.message || "Something went wrong!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Priority configuration
  const priorityConfig = {
    low: {
      color: "#52c41a",
      icon: <CheckCircleOutlined />,
      label: "Low",
      bgColor: "#f6ffed",
      borderColor: "#b7eb8f",
    },
    medium: {
      color: "#faad14",
      icon: <ClockCircleOutlined />,
      label: "Medium",
      bgColor: "#fffbe6",
      borderColor: "#ffe58f",
    },
    high: {
      color: "#ff7a45",
      icon: <WarningOutlined />,
      label: "High",
      bgColor: "#fff2e8",
      borderColor: "#ffbb96",
    },
    urgent: {
      color: "#ff4d4f",
      icon: <FireOutlined />,
      label: "Urgent",
      bgColor: "#fff1f0",
      borderColor: "#ffccc7",
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "3px 2px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={[24, 24]}>
            {/* Left Column */}
            <Col xs={24} lg={10}>
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #e8e8e8",
                }}
              >
                <Title level={5} style={{ marginBottom: "20px", color: "#262626" }}>
                  Ticket Details
                </Title>

                <Form.Item
                  label="Category"
                  name="category_id"
                  rules={[{ required: true, message: "Please select a category!" }]}
                >
                  <Select
                    loading={categoryLoading}
                    placeholder="Choose ticket category"
                    showSearch
                    allowClear
                    size="large"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    options={categoryData?.data?.map((item) => ({
                      value: item.id,
                      label: item.title,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  label="Priority"
                  name="priority"
                  rules={[{ required: true, message: "Please select a priority!" }]}
                >
                  <Select
                    placeholder="Select priority level"
                    size="large"
                    onChange={(value) => setSelectedPriority(value)}
                  >
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <Option key={key} value={key}>
                        <Space>
                          <span style={{ color: config.color }}>{config.icon}</span>
                          <Text strong>{config.label}</Text>
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {selectedPriority && (
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                      background: priorityConfig[selectedPriority as keyof typeof priorityConfig].bgColor,
                      border: `1px solid ${priorityConfig[selectedPriority as keyof typeof priorityConfig].borderColor}`,
                    }}
                  >
                    <Space>
                      <span style={{
                        color: priorityConfig[selectedPriority as keyof typeof priorityConfig].color,
                        fontSize: "18px"
                      }}>
                        {priorityConfig[selectedPriority as keyof typeof priorityConfig].icon}
                      </span>
                      <Text style={{ fontSize: "13px", color: "#595959" }}>
                        <strong>{priorityConfig[selectedPriority as keyof typeof priorityConfig].label} Priority</strong> selected
                      </Text>
                    </Space>
                  </div>
                )}

                <Form.Item
                  label={
                    <Space size={6}>
                      <Text strong style={{ fontSize: "14px" }}>
                        Related Asset
                      </Text>
                      <Tag color="blue" style={{ fontSize: "11px", padding: "0 6px", margin: 0 }}>
                        Optional
                      </Tag>
                    </Space>
                  }
                  name="asset_id"
                >
                  <Select
                    loading={isLoading}
                    placeholder="Select asset if applicable"
                    showSearch
                    size="large"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    options={data?.data?.map((item: any) => ({
                      value: item.id,
                      label: `${item.asset_name} (${item.serial_number})`,
                    }))}
                    allowClear
                  />
                </Form.Item>

                {/* Enhanced Help Box */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)",
                    border: "2px solid #91d5ff",
                    borderRadius: "12px",
                    padding: "20px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-20px",
                      width: "80px",
                      height: "80px",
                      background: "rgba(24, 144, 255, 0.08)",
                      borderRadius: "50%",
                    }}
                  />
                  <Space align="start" size={12}>
                    <div
                      style={{
                        fontSize: "24px",
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                      }}
                    >
                      💡
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ color: "#0050b3", display: "block", marginBottom: "6px", fontSize: "14px" }}>
                        Pro Tip for Faster Resolution
                      </Text>
                      <Text style={{ fontSize: "13px", color: "#595959", lineHeight: "1.6" }}>
                        Be specific about your issue. Include error messages, screenshots, or steps to reproduce the problem for quicker assistance.
                      </Text>
                    </div>
                  </Space>
                </div>
              </Card>
            </Col>

            {/* Right Column */}
            <Col xs={24} lg={14}>
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #e8e8e8",
                }}
              >
                <Title level={5} style={{ marginBottom: "20px", color: "#262626" }}>
                  Message & Attachments
                </Title>

                <Form.Item
                  label="Subject"
                  name="subject"
                  rules={[{ required: true, message: "Please enter a subject!" }]}
                >
                  <Input
                    placeholder="Brief description of your issue"
                    size="large"
                    prefix={<span style={{ color: "#bfbfbf", marginRight: "4px" }}>📌</span>}
                  />
                </Form.Item>

                <div style={{ marginBottom: "20px" }}>
                  <Button
                    onClick={handleCcButtonClick}
                    icon={<UserAddOutlined />}
                    style={{
                      borderColor: isCcVisible ? "#1890ff" : "#d9d9d9",
                      color: isCcVisible ? "#1890ff" : "#595959",
                    }}
                  >
                    {isCcVisible ? "Hide CC" : "Add CC"}
                  </Button>

                  {isCcVisible && (
                    <Form.Item
                      name="cc"
                      style={{ marginTop: "12px", marginBottom: 0 }}
                    >
                      <Select
                        loading={empLoading}
                        placeholder="Select one person to CC"
                        showSearch
                        size="large"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={allEmployee?.data?.map((item: IEmployee) => ({
                          value: item.id,
                          label: `${item.name} (${item.email})`,
                        }))}
                        allowClear
                      />
                    </Form.Item>
                  )}
                </div>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: "Please enter a description!" }]}
                >
                  <ReactQuill
                    theme="snow"
                    placeholder="Describe your issue in detail..."
                    style={{
                      height: "140px",
                      marginBottom: "40px",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <Space size={6}>
                      <PaperClipOutlined style={{ fontSize: "16px" }} />
                      <Text strong style={{ fontSize: "14px" }}>
                        Attachment
                      </Text>
                      <Tag color="blue" style={{ fontSize: "11px", padding: "0 6px", margin: 0 }}>
                        Optional
                      </Tag>
                    </Space>
                  }
                >
                  <Form.Item
                    name="attachment"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                  >
                    <Upload
                      beforeUpload={() => false}
                      maxCount={1}
                      accept="image/*,.pdf"
                      showUploadList={false}
                      className="modern-upload"
                    >
                      <div
                        style={{
                          border: "2px dashed #d9d9d9",
                          borderRadius: "12px",
                          padding: "15px",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          background: "#fafafa",
                        }}
                        className="upload-box"
                      >
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            margin: "0 auto 1px",
                            background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease",
                          }}
                          className="upload-icon"
                        >
                          <InboxOutlined style={{ fontSize: "24px", color: "#fff" }} />
                        </div>
                        <Text strong style={{ display: "block", fontSize: "14px" }}>
                          Click to upload or drag & drop
                        </Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          JPG, PNG, PDF (Max 2MB)
                        </Text>
                      </div>
                    </Upload>
                  </Form.Item>

                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                      const fileList = getFieldValue("attachment");
                      if (fileList && fileList.length > 0) {
                        const file = fileList[0];
                        return (
                          <div
                            style={{
                              marginTop: "16px",
                              padding: "12px",
                              background: "#fff",
                              border: "2px solid #1890ff",
                              borderRadius: "12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              animation: "slideIn 0.3s ease-out",
                            }}
                          >
                            <Space>
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <PaperClipOutlined style={{ fontSize: "18px", color: "#fff" }} />
                              </div>
                              <div>
                                <Text strong style={{ display: "block", fontSize: "14px" }}>
                                  {file.name}
                                </Text>
                                <Text type="secondary" style={{ fontSize: "12px" }}>
                                  {file.size ? `${(file.size / 1024).toFixed(2)} KB` : "Ready to upload"}
                                </Text>
                              </div>
                            </Space>
                            <Button
                              type="text"
                              danger
                              icon={<span style={{ fontSize: "18px" }}>×</span>}
                              onClick={() => form.setFieldValue("attachment", [])}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        );
                      }
                      return null;
                    }}
                  </Form.Item>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    icon={<SendOutlined />}
                    size="large"
                    block
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      fontWeight: 500,
                      borderRadius: "8px",
                    }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Ticket"}
                  </Button>
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Loading Modal - Shows during API call */}
      <Modal
        open={isCreating}
        centered
        closable={false}
        footer={null}
        width={400}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Lottie
            animationData={DoneAnimation}
            loop={true}
            style={{ width: 200, height: 200, margin: "0 auto" }}
          />
          <Title level={4} style={{ marginTop: "16px", marginBottom: "8px", color: "#262626" }}>
            Submitting Your Ticket
          </Title>
          <Text type="secondary" style={{ fontSize: "14px" }}>
            Please wait while we process your request...
          </Text>
        </div>
      </Modal>

      {/* Success Modal - Shows after successful submission */}
      <Modal
        open={successModalVisible}
        centered
        closable={false}
        footer={null}
        width={400}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Lottie
            animationData={DoneAnimation}
            loop={false}
            style={{ width: 200, height: 200, margin: "0 auto" }}
          />
          <Title level={4} style={{ marginTop: "16px", marginBottom: "8px", color: "#52c41a" }}>
            Ticket Submitted Successfully!
          </Title>
          <Text type="secondary" style={{ fontSize: "14px" }}>
            Redirecting you to your tickets...
          </Text>
        </div>
      </Modal>

      {/* Auto-closing Error Modal with Countdown */}
      <Modal
        open={errorModalVisible}
        centered
        closable={false}
        footer={null}
        onCancel={() => {
          setErrorModalVisible(false);
          setCountdown(3);
        }}
        width={420}
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          {/* <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 16px",
              background: "linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 1.5s infinite",
            }}
          >
            <WarningOutlined style={{ fontSize: "32px", color: "#fff" }} />
          </div> */}
          <Lottie
            animationData={SadAnimation}
            loop={false}
            style={{ width: 160, height: 160, marginBottom: "12px", margin: "0 auto" }}
          />
          
          <Title level={4} style={{ marginBottom: "8px", color: "#262626" }}>
            Opps!!! Seating Location Not Updated
          </Title>
          
          <Text type="secondary" style={{ fontSize: "14px", display: "block", marginBottom: "16px" }}>
            Your Seating Location hasn't been updated. Please contact with IT Support Team.
          </Text>

          <div
            style={{
              background: "#f5f5f5",
              borderRadius: "8px",
              padding: "12px",
              marginTop: "20px",
            }}
          >
            <Text style={{ fontSize: "13px", color: "#595959" }}>
              Opening seating location form in{" "}
              <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
                {countdown}
              </Text>
              {" "}second{countdown !== 1 ? "s" : ""}...
            </Text>
          </div>
        </div>
      </Modal>

      <style>{`
        /* Smooth transitions */
        .ant-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ant-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
        }

        /* Button hover effects */
        .ant-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
        }

        /* Input focus effects */
        .ant-input:focus,
        .ant-select-focused .ant-select-selector,
        .ant-input:hover,
        .ant-select:hover .ant-select-selector {
          border-color: #40a9ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1) !important;
        }

        /* Modern Upload Styling */
        .upload-box:hover {
          border-color: #40a9ff !important;
          background: #f0f9ff !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
        }

        .upload-box:hover .upload-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .upload-icon {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Slide in animation for uploaded file */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Pulse animation for upload icon and error modal */
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(24, 144, 255, 0);
          }
        }

        .upload-icon {
          animation: pulse 2s infinite;
        }

        /* Quill editor */
        .ql-container {
          font-size: 14px;
        }

        .ql-editor.ql-blank::before {
          color: #bfbfbf;
          font-style: normal;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .ant-card {
            margin-bottom: 16px;
          }
        }

        /* Tag animations */
        .ant-tag {
          transition: all 0.2s ease;
        }

        /* Selection */
        ::selection {
          background: #bae7ff;
          color: #003a8c;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default RaiseTicketForm;