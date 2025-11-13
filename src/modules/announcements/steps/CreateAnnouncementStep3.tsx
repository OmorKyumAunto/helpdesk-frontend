import React from "react";
import { Card, Button, Descriptions, Tag, Space, message } from "antd";
import { useCreateAnnouncementMutation } from "../api/announcementEndPoint";
import dayjs from "dayjs";

interface ReviewProps {
  data: Record<string, any>;
  onPrev: () => void;
  onSubmit: () => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "red";
    case "medium":
      return "gold";
    case "low":
      return "green";
    default:
      return "blue";
  }
};

const CreateAnnouncementReview: React.FC<ReviewProps> = ({ data, onPrev, onSubmit }) => {
  const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();

  const handleSubmit = async () => {
    try {
      await createAnnouncement({
        ...data,
        announcement_date: dayjs(data.announcement_date).format("YYYY-MM-DD"),
        unit_id: data.unit_id || [],
      }).unwrap();
      message.success("Announcement created successfully!");
      onSubmit();
    } catch (err) {
      message.error("Failed to create announcement.");
      console.error(err);
    }
  };

  return (
    <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
      <Descriptions
        title="Review Your Announcement"
        bordered
        column={1}
        size="middle"
        labelStyle={{ fontWeight: 600 }}
      >
        <Descriptions.Item label="Title">{data.title}</Descriptions.Item>
        <Descriptions.Item label="Description">{data.description}</Descriptions.Item>
        <Descriptions.Item label="Announcement Date">
          {dayjs(data.announcement_date).format("DD MMM YYYY")}
        </Descriptions.Item>
        {data.break_time && (
          <Descriptions.Item label="Break Time">{data.break_time}</Descriptions.Item>
        )}
        <Descriptions.Item label="Priority">
          <Tag color={getPriorityColor(data.priority)}>{data.priority}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Units">
          {data.unit_id?.length > 0 ? data.unit_id.join(", ") : "All Units"}
        </Descriptions.Item>
      </Descriptions>

      <Space style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <Button onClick={onPrev}>← Back</Button>
        <Button type="primary" onClick={handleSubmit} loading={isLoading}>
          Submit ✅
        </Button>
      </Space>
    </Card>
  );
};

export default CreateAnnouncementReview;
