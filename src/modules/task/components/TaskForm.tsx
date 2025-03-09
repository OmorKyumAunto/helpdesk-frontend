/* eslint-disable @typescript-eslint/no-explicit-any */
import { SendOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
} from "antd";

import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";

import {
  useCreateTaskMutation,
  useGetTaskListQuery,
} from "../api/taskEndpoint";
import { ITaskList, ITaskPost } from "../types/taskTypes";

const TaskForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { data: taskList, isLoading: taskLoader } = useGetTaskListQuery();
  const [create, { isSuccess, isLoading }] = useCreateTaskMutation();

  const onFinish = (values: ITaskPost) => {
    const { start_date, start_time, end_time, ...rest } = values || {};
    const formattedData: ITaskPost = {
      ...rest,
      start_date: dayjs(start_date?.[0])?.format("YYYY-MM-DD"),
      end_date: dayjs(start_date?.[1])?.format("YYYY-MM-DD"),
      start_time: dayjs(start_time)?.format("HH:mm"),
      end_time: dayjs(end_time)?.format("HH:mm"),
    };

    create(formattedData);
  };

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
            <Row align={"middle"} gutter={[5, 5]}>
              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="title"
                  rules={[{ required: true }]}
                  label="Title"
                >
                  <Input placeholder="Enter Task Title" type="text" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="start_date"
                  rules={[{ required: true }]}
                  label="Start and End Date"
                >
                  <DatePicker.RangePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="start_time"
                  rules={[{ required: true }]}
                  label="Start Time"
                >
                  <DatePicker.TimePicker
                    style={{ width: "100%" }}
                    format="hh:mm A"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="end_time"
                  rules={[{ required: true }]}
                  label="End Time"
                >
                  <DatePicker.TimePicker
                    style={{ width: "100%" }}
                    format="hh:mm A"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  label="Select List"
                  name="task_categories_id"
                  rules={[{ required: true, message: "Please select a list!" }]}
                >
                  <Select
                    loading={taskLoader}
                    placeholder="Select a list"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={taskList?.data?.map((task: ITaskList) => ({
                      value: task.id,
                      label: task.category_title,
                    }))}
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item label="Description" name="description">
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
                loading={isLoading}
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
