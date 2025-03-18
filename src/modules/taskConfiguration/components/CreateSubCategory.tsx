import {
  MinusOutlined,
  MinusSquareOutlined,
  PlusOutlined,
  PlusSquareOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Select } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
  useCreateSubTaskCategoryMutation,
  useGetTaskCategoryQuery,
} from "../api/taskCategoryEndPoint";
import {
  ICreateSubTaskCategory,
  ITaskCategoryList,
} from "../types/taskConfigTypes";

const CreateSubTaskCategory = ({ record }: { record: ITaskCategoryList }) => {
  const { id, tsc } = record || {};
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { data, isLoading: categoryLoader } = useGetTaskCategoryQuery();
  const [create, { isLoading, isSuccess }] = useCreateSubTaskCategoryMutation();

  const onFinish = (values: ICreateSubTaskCategory) => {
    console.log("Form values:", values);

    create(values);
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        categories_id: id,
        title: tsc?.map((item) => item.title),
      });
    }
  }, [record, form]);

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
            {/* Static Category Field */}
            <Form.Item
              label="Select Task Category"
              name="categories_id"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select
                disabled
                loading={categoryLoader}
                placeholder="Select a category"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={data?.data?.map((task: ITaskCategoryList) => ({
                  value: task.id,
                  label: task.title,
                }))}
                allowClear
              />
            </Form.Item>

            <Form.List name="title">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} align={"middle"} gutter={[5, 16]}>
                      <Col span={22}>
                        <Form.Item
                          {...restField}
                          label="Title"
                          name={name}
                          rules={[
                            {
                              required: true,
                              message: "Please enter a title!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter title" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button
                          type="primary"
                          danger
                          style={{ marginTop: "6px" }}
                          onClick={() => remove(name)}
                          icon={<MinusOutlined size={24} />}
                        ></Button>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    type="primary"
                    onClick={() => add()}
                    style={{ width: "100%" }}
                    icon={<PlusOutlined />}
                  >
                    Add Field
                  </Button>
                </>
              )}
            </Form.List>
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

export default CreateSubTaskCategory;
