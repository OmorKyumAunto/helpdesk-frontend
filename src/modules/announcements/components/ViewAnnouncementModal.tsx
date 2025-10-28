import { Modal, Tag, Typography, Space, Divider, Row, Col, Card } from "antd";
import { Announcement } from "../types/announcementTypes";
import {
  CalendarOutlined,
  ApartmentOutlined,
  ClockCircleOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useGetMeQuery } from "../../../app/api/userApi";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

interface Props {
  visible: boolean;
  announcement: Announcement | null;
  onClose: () => void;
}

const getPriorityTag = (priority: "low" | "medium" | "high") => {
  const colors = { high: "#ff4d4f", medium: "#faad14", low: "#52c41a" };
  return (
    <Tag
      color={colors[priority]}
      style={{
        borderRadius: 8,
        fontWeight: 600,
        padding: "4px 12px",
        textTransform: "capitalize",
        fontSize: 12,
      }}
    >
      {priority}
    </Tag>
  );
};

const ViewAnnouncementModal: React.FC<Props> = ({ visible, announcement, onClose }) => {
  const { data: profile } = useGetMeQuery();
  const hideForRole4 = profile?.data?.role_id === 4;

  if (!announcement) return null;

  const displayUnit = announcement.unit_name ? announcement.unit_name : "All Unit";

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      bodyStyle={{ padding: 24, background: "#fff" }}
      title={
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Title level={4} style={{ margin: 0 }}>
            {announcement.title}
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            <CalendarOutlined style={{ marginRight: 6 }} />
            {dayjs(announcement.announcement_date).format("dddd, DD MMM YYYY")}
          </Text>
        </div>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Description */}
        <div>
          <Text strong style={{ fontSize: 14 }}>
            Description
          </Text>
          <Paragraph
            style={{
              marginTop: 6,
              padding: 14,
              background: "#fafafa",
              borderRadius: 12,
              lineHeight: 1.6,
              color: "#333",
            }}
          >
            {announcement.description}
          </Paragraph>
        </div>

        {/* Two-Column Metadata */}
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            padding: 16,
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Row gutter={[24, 16]}>
            {/* Unit */}
            {!hideForRole4 && (
              <Col span={12} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ApartmentOutlined style={{ color: "#1890ff", fontSize: 16 }} />
                <div>
                  <Text strong>Unit:</Text>
                  <div>{displayUnit}</div>
                </div>
              </Col>
            )}

            {/* Break Time */}
            {announcement.break_time && (
              <Col span={12} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ClockCircleOutlined style={{ color: "#52c41a", fontSize: 16 }} />
                <div>
                  <Text strong>Break Time:</Text>
                  <div>{announcement.break_time}</div>
                </div>
              </Col>
            )}

            {/* Priority */}
            <Col span={12} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StarOutlined style={{ color: "#faad14", fontSize: 16 }} />
              <div>
                <Text strong>Priority:</Text>
                <div>{getPriorityTag(announcement.priority)}</div>
              </div>
            </Col>

            {/* Created By */}
            {!hideForRole4 && (
              <Col span={12} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserOutlined style={{ color: "#722ed1", fontSize: 16 }} />
                <div>
                  <Text strong>Created By:</Text>
                  <div>
                    {announcement.created_by_name} ({announcement.created_by_employee_id})
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Card>
      </Space>

      <Divider style={{ marginTop: 32, marginBottom: 8 }} />

      <Text type="secondary" style={{ fontSize: 12, display: "block", textAlign: "center" }}>
        © {new Date().getFullYear()} IT Connect — Announcement Details
      </Text>
    </Modal>
  );
};

export default ViewAnnouncementModal;
