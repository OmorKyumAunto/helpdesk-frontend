/* eslint-disable @typescript-eslint/no-explicit-any */
import { SendOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
} from "antd";
import { useWatch } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useGetTaskCategoryQuery } from "../../taskConfiguration/api/taskCategoryEndPoint";
import { ITaskCategoryList } from "../../taskConfiguration/types/taskConfigTypes";
import { useCreateTaskMutation } from "../api/taskEndpoint";
import { ITaskItems, ITaskPost } from "../types/taskTypes";

const UpdateTask = ({ single }: { single: ITaskItems }) => {
  const { description, start_date, start_time } = single || {};
  console.log(single);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { data: taskCategory, isLoading: taskLoader } =
    useGetTaskCategoryQuery();
  const [create, { isSuccess, isLoading }] = useCreateTaskMutation();

  const taskCategoriesId = useWatch("task_categories_id", form);

  const selectedCategory = taskCategory?.data?.find(
    (item) => item.id === taskCategoriesId
  );

  const onFinish = (values: ITaskPost) => {
    const { start_date, start_time, is_assign, ...rest } = values || {};
    const formattedData: ITaskPost = {
      ...rest,
      start_date: dayjs(start_date?.[0])?.format("YYYY-MM-DD"),
      start_time: dayjs(start_time)?.format("HH:mm"),
    };
    if (is_assign) {
      formattedData.is_assign = 1;
    }
    create(formattedData);
  };
  const formattedDate = start_date.split("T")[0] + "T" + start_time;
  useEffect(() => {
    form.setFieldsValue({
      start_date: dayjs(start_date),
      description,
      start_time: dayjs(formattedDate),
    });
  }, [start_date, start_time, description]);

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
              <Col xs={24} sm={24} md={24} lg={24}>
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
                    options={taskCategory?.data?.map(
                      (task: ITaskCategoryList) => ({
                        value: task.id,
                        label: task.title,
                      })
                    )}
                    allowClear
                  />
                </Form.Item>
              </Col>
              {taskCategoriesId && selectedCategory?.tsc?.length ? (
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Form.Item valuePropName="checked" name="sub_list_selected">
                    <Checkbox.Group>
                      {selectedCategory?.tsc?.map((item) => (
                        <Checkbox key={item.id} value={item.id}>
                          {item.title}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
              ) : null}
              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="start_date"
                  rules={[{ required: true }]}
                  label="Start Date"
                >
                  <DatePicker style={{ width: "100%" }} />
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
                Update
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default UpdateTask;
