/* eslint-disable @typescript-eslint/no-explicit-any */
import { SendOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
  ICreateTaskCategory,
  ITaskCategoryList,
} from "../types/taskConfigTypes";
import { useUpdateTaskCategoryMutation } from "../api/taskCategoryEndPoint";

const UpdateTaskCategory = ({ single }: { single: ITaskCategoryList }) => {
  const { id, title, format, set_time } = single || {};
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [update, { isLoading, isSuccess }] = useUpdateTaskCategoryMutation();

  const onFinish = (value: ICreateTaskCategory) => {
    update({ data: value, id });
  };

  useEffect(() => {
    form.setFieldsValue({ title, format, set_time });
  }, [form, title, format, set_time]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      form.resetFields();
    }
  }, [isSuccess]);

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
                  label="Task Name"
                  required
                >
                  <Input placeholder="Enter Task Name" type="text" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="set_time"
                  rules={[{ required: true }]}
                  label="Time"
                  required
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter Time"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="format"
                  rules={[{ required: true }]}
                  label="Format"
                  required
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select Format"
                    allowClear
                    options={[
                      { label: "Minutes", value: "minutes" },
                      { label: "Hours", value: "hours" },
                      { label: "Day", value: "day" },
                    ]}
                  />
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
                loading={isLoading}
              >
                Update
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default UpdateTaskCategory;
