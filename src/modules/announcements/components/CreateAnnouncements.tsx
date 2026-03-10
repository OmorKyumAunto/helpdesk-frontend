import React, { useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  message,
  Typography,
  Card,
  Space,
  Row,
  Col,
} from "antd";
import {
  ApartmentOutlined,
  FileTextOutlined,
  CalendarOutlined,
  StarOutlined,
  ClockCircleOutlined,
  SendOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { TfiAnnouncement } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { useCreateAnnouncementMutation } from "../api/announcementEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const { TextArea } = Input;
const { Title, Text } = Typography;

const CreateAnnouncementPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [createAnnouncement, { isLoading, isSuccess }] =
    useCreateAnnouncementMutation();

  const { data: unitData } = useGetUnitsQuery({ status: "active" });
  const { data: profile } = useGetMeQuery();

  // Filter units for Admin (role_id 4)
  const unitOptionForAdmin = unitData?.data?.filter((unit) =>
    profile?.data?.searchAccess?.some((item: any) => item.unit_id === unit.id)
  );
  const unitOption =
    profile?.data?.role_id === 4 ? unitOptionForAdmin : unitData?.data;

  const handleSubmit = async (values: any) => {
    try {
      await createAnnouncement({
        ...values,
        unit_id: values.unit_id || [],
        announcement_date: values.announcement_date.format("YYYY-MM-DD"),
      }).unwrap();
      message.success("✅ Announcement created successfully!");
      form.resetFields();
      navigate("/announcements");
    } catch {
      message.error("❌ Failed to create announcement.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
    }
  }, [isSuccess, form]);

  // ReactQuill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "align",
    "link",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: 1400,
          width: "100%",
          margin: "0 auto 24px",
        }}
      >
        <Card
          style={{
            borderRadius: 12,
            border: "1px solid #e8eaed",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
          bodyStyle={{ padding: "32px 40px" }}
        >
          <Row align="middle" justify="space-between">
            <Col>
              <Space direction="vertical" size={4}>
                <Title level={3} style={{ margin: 0, fontSize: 28 }}>
                  Create New Announcement
                </Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Share important updates and information with your organization
                </Text>
              </Space>
            </Col>
            <Col>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "#1677ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TfiAnnouncement style={{ color: "#fff", fontSize: 24 }} />
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: 1400,
          width: "100%",
          margin: "0 auto",
          flex: 1,
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            priority: "medium",
            announcement_date: dayjs(),
          }}
        >
          <Row gutter={24}>
            {/* Left Column - Main Content */}
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                {/* Title & Description Card */}
                <Card
                  title={
                    <Space>
                      <FileTextOutlined style={{ color: "#1677ff" }} />
                      <span>Announcement Content</span>
                    </Space>
                  }
                  style={{
                    borderRadius: 12,
                    border: "1px solid #e8eaed",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                  bodyStyle={{ padding: "24px 32px" }}
                >
                  <Form.Item
                    label={
                      <Text strong style={{ fontSize: 14 }}>
                        Title
                      </Text>
                    }
                    name="title"
                    rules={[{ required: true, message: "Title is required" }]}
                  >
                    <Input
                      placeholder="Enter announcement title"
                      size="large"
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <Text strong style={{ fontSize: 14 }}>
                        Description
                      </Text>
                    }
                    name="description"
                    rules={[
                      { required: true, message: "Description is required" },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <ReactQuill
                      theme="snow"
                      modules={modules}
                      formats={formats}
                      placeholder="Provide detailed information about the announcement..."
                      style={{
                        borderRadius: 8,
                        background: "#fff",
                      }}
                    />
                  </Form.Item>
                </Card>

                {/* Schedule & Break Time Card */}
                <Card
                  title={
                    <Space>
                      <CalendarOutlined style={{ color: "#1677ff" }} />
                      <span>Schedule Information</span>
                    </Space>
                  }
                  style={{
                    borderRadius: 12,
                    border: "1px solid #e8eaed",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                  bodyStyle={{ padding: "24px 32px" }}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <Text strong style={{ fontSize: 14 }}>
                            Announcement Date
                          </Text>
                        }
                        name="announcement_date"
                        rules={[{ required: true, message: "Select a date" }]}
                      >
                        <DatePicker
                          style={{ width: "100%", borderRadius: 8 }}
                          size="large"
                          format="YYYY-MM-DD"
                          disabledDate={(current) =>
                            current && current < dayjs().startOf("day")
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <Text strong style={{ fontSize: 14 }}>
                            Break Time (Optional)
                          </Text>
                        }
                        name="break_time"
                        style={{ marginBottom: 0 }}
                      >
                        <Input
                          placeholder="e.g. 2:00 PM - 3:00 PM"
                          size="large"
                          prefix={
                            <ClockCircleOutlined style={{ color: "#bfbfbf" }} />
                          }
                          style={{ borderRadius: 8 }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Space>
            </Col>

            {/* Right Column - Settings */}
            <Col xs={24} lg={8}>
              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                {/* Unit Selection Card */}
                <Card
                  title={
                    <Space>
                      <ApartmentOutlined style={{ color: "#1677ff" }} />
                      <span>Target Units</span>
                    </Space>
                  }
                  style={{
                    borderRadius: 12,
                    border: "1px solid #e8eaed",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                  bodyStyle={{ padding: "24px" }}
                >
                  <Text
                    type="secondary"
                    style={{ fontSize: 13, display: "block", marginBottom: 12 }}
                  >
                    {profile?.data?.role_id === 4
                      ? "Select units you have access to"
                      : "Leave IT empty to broadcast in All Units"}
                  </Text>
                  <Form.Item
                    name="unit_id"
                    style={{ marginBottom: 0 }}
                    rules={
                      profile?.data?.role_id === 4
                        ? [
                            {
                              required: true,
                              message: "Please select at least one unit",
                            },
                          ]
                        : []
                    }
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="Select units..."
                      showSearch
                      size="large"
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={unitOption?.map((unit: any) => ({
                        value: unit.id,
                        label: unit.title,
                      }))}
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                </Card>

                {/* Priority Card */}
                <Card
                  title={
                    <Space>
                      <StarOutlined style={{ color: "#1677ff" }} />
                      <span>Priority Level</span>
                    </Space>
                  }
                  style={{
                    borderRadius: 12,
                    border: "1px solid #e8eaed",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                  bodyStyle={{ padding: "24px" }}
                >
                  <Text
                    type="secondary"
                    style={{ fontSize: 13, display: "block", marginBottom: 12 }}
                  >
                    Set the importance level for this announcement
                  </Text>
                  <Form.Item
                    name="priority"
                    rules={[{ required: true, message: "Select a priority" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      size="large"
                      style={{ borderRadius: 8 }}
                      options={[
                        {
                          label: (
                            <Space>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: "#ff4d4f",
                                }}
                              />
                              <span>High Priority</span>
                            </Space>
                          ),
                          value: "high",
                        },
                        {
                          label: (
                            <Space>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: "#faad14",
                                }}
                              />
                              <span>Medium Priority</span>
                            </Space>
                          ),
                          value: "medium",
                        },
                        {
                          label: (
                            <Space>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: "#52c41a",
                                }}
                              />
                              <span>Low Priority</span>
                            </Space>
                          ),
                          value: "low",
                        },
                      ]}
                    />
                  </Form.Item>
                </Card>

                {/* Action Buttons */}
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid #e8eaed",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                  bodyStyle={{ padding: "24px" }}
                >
                  <Space direction="vertical" size={12} style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      icon={<SendOutlined />}
                      size="large"
                      block
                      style={{
                        height: 48,
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      Create Announcement
                    </Button>
                    <Button
                      onClick={() => navigate(-1)}
                      size="large"
                      block
                      style={{
                        height: 48,
                        borderRadius: 8,
                        fontWeight: 500,
                      }}
                    >
                      Cancel
                    </Button>
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default CreateAnnouncementPage;