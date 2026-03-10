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
    <>
      <style>{`
        /* Responsive modal styling */
        @media (max-width: 768px) {
          .view-announcement-modal .ant-modal {
            max-width: calc(100vw - 32px) !important;
            margin: 16px auto !important;
          }
          .view-announcement-modal .ant-modal-body {
            padding: 16px !important;
          }
          .view-announcement-modal .ant-modal-header {
            padding: 16px !important;
          }
        }
        
        /* HTML content styling */
        .announcement-description-content {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .announcement-description-content h1,
        .announcement-description-content h2,
        .announcement-description-content h3 {
          margin-top: 16px;
          margin-bottom: 8px;
          font-weight: 600;
          line-height: 1.4;
        }
        
        .announcement-description-content h1 {
          font-size: 24px;
        }
        
        .announcement-description-content h2 {
          font-size: 20px;
        }
        
        .announcement-description-content h3 {
          font-size: 16px;
        }
        
        .announcement-description-content ul,
        .announcement-description-content ol {
          margin-left: 20px;
          margin-bottom: 12px;
          padding-left: 8px;
        }
        
        .announcement-description-content li {
          margin-bottom: 6px;
        }
        
        .announcement-description-content p {
          margin-bottom: 12px;
          line-height: 1.7;
        }
        
        .announcement-description-content a {
          color: #1890ff;
          text-decoration: underline;
          word-break: break-all;
        }
        
        .announcement-description-content strong {
          font-weight: 600;
        }
        
        .announcement-description-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 12px 0;
        }
        
        .announcement-description-content blockquote {
          border-left: 4px solid #1890ff;
          padding-left: 16px;
          margin: 16px 0;
          color: #595959;
          font-style: italic;
        }
        
        /* Scrollbar for modal content */
        .view-announcement-modal .ant-modal-body::-webkit-scrollbar {
          width: 8px;
        }
        
        .view-announcement-modal .ant-modal-body::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 4px;
        }
        
        .view-announcement-modal .ant-modal-body::-webkit-scrollbar-thumb {
          background: #bfbfbf;
          border-radius: 4px;
        }
        
        .view-announcement-modal .ant-modal-body::-webkit-scrollbar-thumb:hover {
          background: #8c8c8c;
        }
      `}</style>

      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width="90%"
        style={{ maxWidth: 700, top: 20 }}
        centered={false}
        className="view-announcement-modal"
        bodyStyle={{ 
          padding: 24, 
          background: "#fff",
          maxHeight: "calc(100vh - 120px)",
          overflowY: "auto"
        }}
        title={
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 4,
            paddingRight: 24
          }}>
            <Title level={4} style={{ 
              margin: 0,
              wordWrap: "break-word",
              lineHeight: 1.4
            }}>
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
            <Text strong style={{ fontSize: 14, display: "block", marginBottom: 8 }}>
              Description
            </Text>
            <div
              className="announcement-description-content"
              style={{
                padding: 14,
                background: "#fafafa",
                borderRadius: 12,
                lineHeight: 1.6,
                color: "#333",
                minHeight: 60
              }}
              dangerouslySetInnerHTML={{ __html: announcement.description }}
            />
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
                <Col xs={24} sm={12} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <ApartmentOutlined style={{ color: "#1890ff", fontSize: 16, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ display: "block" }}>Unit:</Text>
                    <div style={{ wordWrap: "break-word" }}>{displayUnit}</div>
                  </div>
                </Col>
              )}

              {/* Break Time */}
              {announcement.break_time && (
                <Col xs={24} sm={12} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <ClockCircleOutlined style={{ color: "#52c41a", fontSize: 16, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ display: "block" }}>Break Time:</Text>
                    <div style={{ wordWrap: "break-word" }}>{announcement.break_time}</div>
                  </div>
                </Col>
              )}

              {/* Priority */}
              <Col xs={24} sm={12} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <StarOutlined style={{ color: "#faad14", fontSize: 16, marginTop: 2 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text strong style={{ display: "block" }}>Priority:</Text>
                  <div>{getPriorityTag(announcement.priority)}</div>
                </div>
              </Col>

              {/* Created By */}
              {!hideForRole4 && (
                <Col xs={24} sm={12} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <UserOutlined style={{ color: "#722ed1", fontSize: 16, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ display: "block" }}>Created By:</Text>
                    <div style={{ wordWrap: "break-word" }}>
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
    </>
  );
};

export default ViewAnnouncementModal;