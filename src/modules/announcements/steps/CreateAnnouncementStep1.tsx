import React from "react";
import { Form, Input, DatePicker, Button, Space, message } from "antd";
import dayjs from "dayjs";

interface Step1Props {
  data: Record<string, any>;
  onNext: (values: Record<string, any>) => void;
}

const { TextArea } = Input;

const CreateAnnouncementStep1: React.FC<Step1Props> = ({ data, onNext }) => {
  const [form] = Form.useForm();

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      onNext(values);
    } catch {
      message.error("Please fill in all required fields.");
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{
        title: data.title || "",
        description: data.description || "",
        announcement_date: data.announcement_date || dayjs(),
      }}
    >
      <Form.Item
        label="Announcement Title"
        name="title"
        rules={[{ required: true, message: "Title is required" }]}
      >
        <Input placeholder="Enter announcement title" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Description is required" }]}
      >
        <TextArea rows={4} placeholder="Write your announcement details..." />
      </Form.Item>

      <Form.Item
        label="Announcement Date"
        name="announcement_date"
        rules={[{ required: true, message: "Select a date" }]}
      >
        <DatePicker
          style={{ width: "100%" }}
          disabledDate={(current) => current && current < dayjs().startOf("day")}
        />
      </Form.Item>

      <Space style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <Button type="primary" onClick={handleNext}>
          Next →
        </Button>
      </Space>
    </Form>
  );
};

export default CreateAnnouncementStep1;
