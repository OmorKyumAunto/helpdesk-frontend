import { Card, Tag, Typography, Row, Col, Divider, Timeline, Space, Avatar, Tooltip } from "antd";
import { useGetSingleSuperAdminTaskQuery, useGetSingleTaskQuery } from "../api/taskEndpoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import dayjs from "dayjs";
import { UserOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SingleTask = ({ id, user_name, user_employee_id }: { id: number; user_name?: string; user_employee_id?: string }) => {
  const { data: profile } = useGetMeQuery();
  const roleID = profile?.data?.role_id;
  const { data } = useGetSingleTaskQuery(id || 0);
  const { data: superAdminData } = useGetSingleSuperAdminTaskQuery(id);
  const singleData = roleID === 1 ? superAdminData?.data : data?.data;

  const {
    category_title,
    task_code,
    task_status,
    start_time,
    sub_list_details,
    start_date,
    description,
    task_start_date,
    task_start_time,
    task_end_date,
    task_end_time,
  } = singleData || {};

  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr || !timeStr) return "N/A";
    const date = dayjs(dateStr).add(6, "hours");
    return dayjs(`${date.format("YYYY-MM-DD")}T${timeStr}`).format("DD MMM YYYY hh:mm A");
  };

  const getTagColor = () => {
    switch (task_status) {
      case "complete":
        return "green";
      case "incomplete":
        return "red";
      default:
        return "blue";
    }
  };

  return (
    <Row gutter={[24, 16]} justify="space-between">
      {/* Task Details Section */}
      <Col xs={24} md={16}>
        <Card
          style={{
            borderRadius: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            padding: 24,
            background: "#ffffff",
            transition: "transform 0.3s ease-in-out",

          }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Text strong style={{ fontSize: 16, color: "#333" }}>Task Code</Text>
              <div style={{ fontSize: 14, color: "#555" }}>{task_code || "N/A"}</div>
            </Col>
            <Col xs={24} md={12}>
              <Text strong style={{ fontSize: 16, color: "#333" }}>Category Title</Text>
              <div style={{ fontSize: 14, color: "#555" }}>{category_title || "N/A"}</div>
            </Col>
            <Col xs={24} md={12}>
              <Text strong style={{ fontSize: 16, color: "#333" }}>Status</Text>
              <div>
                <Tag color={getTagColor()} style={{ fontWeight: "bold", fontSize: 14 }}>
                  {task_status?.toUpperCase()}
                </Tag>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Text strong style={{ fontSize: 16, color: "#333" }}>Approx. Start Time</Text>
              <div style={{ fontSize: 14, color: "#555" }}>{formatDateTime(start_date, start_time)}</div>
            </Col>
            {task_start_date && task_start_time && (
              <Col xs={24} md={12}>
                <Text strong style={{ fontSize: 16, color: "#333" }}>Started at</Text>
                <div style={{ fontSize: 14, color: "#555" }}>{formatDateTime(task_start_date, task_start_time)}</div>
              </Col>
            )}
            {task_end_date && task_end_time && (
              <Col xs={24} md={12}>
                <Text strong style={{ fontSize: 16, color: "#333" }}>Ends at</Text>
                <div style={{ fontSize: 14, color: "#555" }}>{formatDateTime(task_end_date, task_end_time)}</div>
              </Col>
            )}
          </Row>

          

          {sub_list_details?.some(item => item.is_checked === 1) && (
            <div>
              <Divider />
              <Title level={5} style={{ color: "#333" }}>Subcategory</Title>
              <div style={{ marginBottom: 16 }}>
                {sub_list_details
                  .filter(item => item.is_checked === 1)
                  .map((item, index) => (
                    <Tag key={index} color="geekblue" style={{ marginBottom: 8, fontSize: 14 }}>
                      {Array.isArray(item.title) ? item.title.join(", ") : item.title}
                    </Tag>
                  ))
                }
              </div>
            </div>
          )}


          <Divider />
          <Title level={5} style={{ color: "#333" }}>Description</Title>
          <Text style={{ fontSize: 14, color: "#555" }}>{description || "No description provided."}</Text>
        </Card>
      </Col>

      {/* Timeline Section */}
      <Col xs={24} md={8}>
        <Card
          style={{
            borderRadius: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            padding: 24,
            background: "#ffffff",
            minWidth: 280,
            transition: "transform 0.3s ease-in-out",

          }}
        >
          <Title level={5} style={{ color: "#333" }}>Task Timeline</Title>
          <Timeline mode="alternate">
            <Timeline.Item dot={<ClockCircleOutlined />} color="blue">
              <Text strong style={{ fontSize: 12, color: "#333" }}>Should Start at</Text>
              <div style={{ fontSize: 12, color: "#555" }}>{formatDateTime(start_date, start_time)}</div>
            </Timeline.Item>

            {task_start_date && task_start_time && (
              <Timeline.Item dot={<ClockCircleOutlined />} color="green">
                <Text strong style={{ fontSize: 12, color: "#333" }}>Task Started</Text>
                <div style={{ fontSize: 12, color: "#555" }}>{formatDateTime(task_start_date, task_start_time)}</div>
              </Timeline.Item>
            )}

            {task_end_date && task_end_time && (
              <Timeline.Item dot={<ClockCircleOutlined />} color="red">
                <Text strong style={{ fontSize: 12, color: "#333" }}>Task Ended</Text>
                <div style={{ fontSize: 12, color: "#555" }}>{formatDateTime(task_end_date, task_end_time)}</div>
              </Timeline.Item>
            )}
          </Timeline>



          {roleID === 1 && (
            
            <Space direction="vertical" size={16} style={{ width: '100%', alignItems: 'center' }}>
              
              <Tooltip title="Admin Info">
                <Avatar size="large" icon={<UserOutlined />} />
              </Tooltip>
              <Text strong style={{ fontSize: 14 }}>
                Admin: {user_name || "N/A"}
              </Text>
              <Text style={{ fontSize: 12 }}>
                Employee ID: {user_employee_id || "N/A"}
              </Text>
            </Space>
          )}


        </Card>
      </Col>
    </Row>
  );
};

export default SingleTask;
