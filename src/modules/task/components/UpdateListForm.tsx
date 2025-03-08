/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Form, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useUpdateTaskListMutation } from "../api/taskEndpoint";
import { ITaskList, PostTask } from "../types/taskTypes";

const ListFormUpdate = ({ singleData }: { singleData: ITaskList }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [update, { isLoading, isSuccess }] = useUpdateTaskListMutation();

  const onFinish = (value: PostTask) => {
    update({ body: value, id: singleData.id });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      form.resetFields();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (singleData) {
      form.setFieldValue("title", singleData.category_title);
    }
  }, [form, singleData]);

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
                  label="Name"
                  required
                >
                  <Input placeholder="Enter Name" type="text" />
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

export default ListFormUpdate;
