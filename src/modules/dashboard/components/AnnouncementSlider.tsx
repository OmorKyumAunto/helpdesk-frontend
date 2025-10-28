import React, { useState } from "react";
import { Card, Typography, Spin, Modal, Tag } from "antd";
import { NotificationOutlined, ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { useGetDashboardAnnouncementsQuery } from "../../announcements/api/announcementEndPoint";

const { Title, Paragraph, Text } = Typography;

// Utility to capitalize first letter
const capitalizeFirstLetter = (text: string) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";

const AnnouncementCardWeb = ({
  announcement,
  onClick,
}: {
  announcement: any;
  onClick: () => void;
}) => {
  const getPriorityConfig = () => {
    switch (announcement.priority?.toLowerCase()) {
      case "high":
        return {
          bg: "#fff1f0",
          border: "#ffa39e",
          tag: "error",
          gradient: "linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)",
        };
      case "medium":
        return {
          bg: "#fff7e6",
          border: "#ffd591",
          tag: "warning",
          gradient: "linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)",
        };
      default:
        return {
          bg: "#f0f5ff",
          border: "#adc6ff",
          tag: "default",
          gradient: "linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)",
        };
    }
  };

  const config = getPriorityConfig();
  const dateText = announcement.announcement_date
    ? new Date(announcement.announcement_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        width: "100%",
        borderRadius: 12,
        border: `1.5px solid ${config.border}`,
        background: config.gradient,
        marginBottom: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
      bodyStyle={{ padding: 16 }}
      className="announcement-card"
    >
      <div style={{ display: "flex", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "rgba(24, 144, 255, 0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <NotificationOutlined style={{ fontSize: 22, color: "#1890ff" }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
              {capitalizeFirstLetter(announcement.title)}
            </Title>
            {announcement.priority && (
              <Tag
                color={config.tag}
                style={{ margin: 0, fontSize: 11, padding: "0 6px", lineHeight: "20px" }}
              >
                {capitalizeFirstLetter(announcement.priority)}
              </Tag>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            {announcement.break_time && (
              <Text
                style={{
                  fontSize: 12,
                  color: "#8c8c8c",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <ClockCircleOutlined style={{ fontSize: 12 }} />
                {announcement.break_time}
              </Text>
            )}
            {dateText && (
              <Text
                style={{
                  fontSize: 12,
                  color: "#8c8c8c",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <CalendarOutlined style={{ fontSize: 12 }} />
                {dateText}
              </Text>
            )}
          </div>

          <Paragraph
            style={{
              fontSize: 13,
              marginBottom: 0,
              color: "#595959",
              lineHeight: "1.6",
            }}
            ellipsis={{ rows: 2 }}
          >
            {capitalizeFirstLetter(announcement.description)}
          </Paragraph>
        </div>
      </div>
    </Card>
  );
};

const AnnouncementsVerticalList = () => {
  const { data, isLoading, isError } = useGetDashboardAnnouncementsQuery({ limit: 20 });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 270,
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Spin size="large" />
        <Text type="secondary">Loading announcements...</Text>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 270,
          flexDirection: "column",
          gap: 12,
        }}
      >
        <NotificationOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
        <Text type="danger">Failed to load announcements</Text>
      </div>
    );
  }

  const announcements = data?.data || [];

  if (announcements.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 270,
          flexDirection: "column",
          gap: 12,
        }}
      >
        <NotificationOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
        <Text type="secondary">No announcements available</Text>
      </div>
    );
  }

  const openModal = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedAnnouncement(null);
    setModalVisible(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div
      style={{
        padding: "4px 8px",
        minHeight: 270,
        maxHeight: 270,
        overflowY: "auto",
      }}
      className="announcements-scroll"
    >
      <style>{`
        .announcements-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .announcements-scroll::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 3px;
        }
        .announcements-scroll::-webkit-scrollbar-thumb {
          background: #bfbfbf;
          border-radius: 3px;
        }
        .announcements-scroll::-webkit-scrollbar-thumb:hover {
          background: #8c8c8c;
        }
      `}</style>

      {announcements.map((announcement: any) => (
        <AnnouncementCardWeb
          key={announcement.id}
          announcement={announcement}
          onClick={() => openModal(announcement)}
        />
      ))}

      <Modal
        visible={modalVisible}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(24, 144, 255, 0.1)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NotificationOutlined style={{ fontSize: 20, color: "#1890ff" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {capitalizeFirstLetter(selectedAnnouncement?.title)}
              </div>
              {selectedAnnouncement?.priority && (
                <Tag
                  color={getPriorityColor(selectedAnnouncement.priority)}
                  style={{ marginTop: 4, marginLeft: 0 }}
                >
                  {capitalizeFirstLetter(selectedAnnouncement.priority)} Priority
                </Tag>
              )}
            </div>
          </div>
        }
        onCancel={closeModal}
        footer={null}
        width={600}
        centered
      >
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 20,
              padding: 12,
              background: "#fafafa",
              borderRadius: 8,
            }}
          >
            {selectedAnnouncement?.break_time && (
              <Text style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ClockCircleOutlined style={{ color: "#1890ff" }} />
                <strong>Break Time:</strong> {selectedAnnouncement.break_time}
              </Text>
            )}
            {selectedAnnouncement?.announcement_date && (
              <Text style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CalendarOutlined style={{ color: "#1890ff" }} />
                <strong>Date:</strong>{" "}
                {new Date(selectedAnnouncement.announcement_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            )}
          </div>
          <Paragraph style={{ fontSize: 15, lineHeight: 1.7, color: "#262626" }}>
            {capitalizeFirstLetter(selectedAnnouncement?.description)}
          </Paragraph>
        </div>
      </Modal>
    </div>
  );
};

export default AnnouncementsVerticalList;
