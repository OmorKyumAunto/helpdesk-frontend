import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, Select, Divider, Space, message } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useCreateAnnouncementMutation } from "../api/announcementEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";

const { TextArea } = Input;

const CreateAnnouncement = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [createAnnouncement, { isLoading, isSuccess, isError }] =
    useCreateAnnouncementMutation();

  const { data: unitData } = useGetUnitsQuery({ status: "active" });
  const { data: profile } = useGetMeQuery();

  // Admin units (role_id 4)
  const unitOptionForAdmin = unitData?.data?.filter((unit) =>
    profile?.data?.searchAccess?.some((item: any) => item.unit_id === unit.id)
  );

  // Decide options based on role
  const unitOption =
    profile?.data?.role_id === 4 ? unitOptionForAdmin : unitData?.data;

  const handleSubmit = async (values: any) => {
    try {
      await createAnnouncement({
        ...values,
        unit_id: values.unit_id || [],
        announcement_date: values.announcement_date.format("YYYY-MM-DD"),
      }).unwrap();
      message.success("Announcement created successfully!");
      form.resetFields();
    } catch (err) {
      message.error("Failed to create announcement.");
      console.error(err);
    }
  };

  // Close modal on success
  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal({ show: false }));
    }
  }, [isSuccess, dispatch]);

  return (
    <div style={{ padding: 16 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ priority: "medium", announcement_date: dayjs() }}
      >
        {/* Units */}
        <Form.Item label="Select Units" name="unit_id">
          <Select
            mode="multiple"
            allowClear
            placeholder={
              profile?.data?.role_id === 4
                ? "Select units you have access to"
                : "Select units (leave empty for all)"
            }
            showSearch
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={unitOption?.map((unit: any) => ({
              value: unit.id,
              label: unit.title,
            }))}
          />
        </Form.Item>

        <Divider />

        {/* Title & Description */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Form.Item
            label="Title"
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
            <TextArea rows={4} placeholder="Enter details" />
          </Form.Item>
        </Space>

        <Divider />

        {/* Date, Break Time & Priority */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Form.Item
            label="Announcement Date"
            name="announcement_date"
            rules={[{ required: true, message: "Select a date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>

          <Form.Item label="Break Time (optional)" name="break_time">
            <Input placeholder="e.g. 2pm-3pm" />
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: "Select a priority" }]}
          >
            <Select
              options={[
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low", value: "low" },
              ]}
            />
          </Form.Item>
        </Space>

        {/* Submit Button */}
        <Form.Item style={{ textAlign: "right", marginTop: 16 }}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create Announcement
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateAnnouncement;
