/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Form, Select, Button, Popconfirm } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useUpdateTicketPriorityMutation } from "../api/ticketEndpoint";
import { IAdminTicketList } from "../types/ticketTypes";
import { useWatch } from "antd/es/form/Form";

const { Option } = Select;

const UpdateTicketPriority = ({ single }: { single: IAdminTicketList }) => {
  const { ticket_table_id, priority } = single || {};
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [update, { isLoading, isSuccess }] = useUpdateTicketPriorityMutation();

  const selectedPriority = useWatch("priority", form);

  const onFinish = (value: any) => {
    update({ body: value, id: ticket_table_id });
  };

  useEffect(() => {
    form.setFieldsValue({ priority });
  }, [form, priority]);

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
          <Card className="border" style={{ marginBottom: "1rem", marginTop: "1rem" }}>
            <Row align={"middle"} gutter={[5, 16]}>
              <Col xs={24} sm={24}>
                <Form.Item
                  label="Select Priority"
                  name="priority"
                  rules={[{ required: true, message: "Please select a priority!" }]}
                >
                  <Select placeholder="Select Priority">
                    <Option value="low">LOW</Option>
                    <Option value="medium">MEDIUM</Option>
                    <Option value="high">HIGH</Option>
                    <Option value="urgent">URGENT</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Form.Item>
            <div style={{ textAlign: "end" }}>
              <Popconfirm
                title="Are you sure you want to update the Priority?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => {
                  form.submit();
                }}
              >
                <Button
                  htmlType="button"
                  type="primary"
                  icon={<SendOutlined />}
                  loading={isLoading}
                >
                  Submit
                </Button>
              </Popconfirm>
            </div>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default UpdateTicketPriority;
