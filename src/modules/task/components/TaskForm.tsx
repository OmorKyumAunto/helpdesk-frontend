/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Form, Input, Button, Select, DatePicker } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCommonModal } from "../../../app/slice/modalSlice";
import TextArea from "antd/es/input/TextArea";
const { Option } = Select;
const { RangePicker } = DatePicker;
const TaskForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = (value: any) => {
    // create(value);
  };

  //   useEffect(() => {
  //     if (isSuccess) {
  //       dispatch(setCommonModal());
  //       form.resetFields();
  //     }
  //   }, [isSuccess]);

  return (
    <Row justify="center" align="middle" style={{ maxWidth: "auto" }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Card
            className="border"
            style={{
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
          >
            <Row align={"middle"} gutter={[5, 16]}>
              <Col xs={24} sm={24}>
                <Form.Item
                  name="title"
                  rules={[{ required: true }]}
                  label="Title"
                >
                  <Input placeholder="Enter Task Title" type="text" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24}>
                <Form.Item
                  name="time"
                  rules={[{ required: true }]}
                  label="Start Time and End Time"
                >
                  <RangePicker
                    style={{ width: "100%" }}
                    showTime={{ format: "HH:mm" }}
                    format="YYYY-MM-DD HH:mm"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24}>
                <Form.Item
                  label="Select List"
                  name="list"
                  style={{ marginBottom: "8px" }}
                  rules={[{ required: true, message: "Please select a list!" }]}
                >
                  <Select placeholder="Select list">
                    <Option value="My Tasks">My Tasks</Option>
                    <Option value="Today Tasks">Today Tasks</Option>
                    <Option value="Yearly Plan">Yearly Plan</Option>
                    <Option value="Movie Goals">Movie Goals</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  style={{ marginBottom: "8px" }}
                >
                  <TextArea placeholder="Enter Description" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Form.Item>
            <div style={{ textAlign: "end" }}>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SendOutlined />}
                // loading={isLoading}
              >
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default TaskForm;
