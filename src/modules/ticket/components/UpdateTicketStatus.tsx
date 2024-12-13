/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Form, Input, Button, Select } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useUpdateTicketAdminStatusMutation } from "../api/ticketEndpoint";
import { IAdminTicketList } from "../types/ticketTypes";
const { Option } = Select;
const UpdateTicketStatus = ({ single }: { single: IAdminTicketList }) => {
  const { ticket_table_id, ticket_status } = single || {};
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [update, { isLoading, isSuccess }] =
    useUpdateTicketAdminStatusMutation();

  const onFinish = (value: string) => {
    update({ body: value, id: ticket_table_id });
  };

  useEffect(() => {
    form.setFieldsValue({ ticket_status });
  }, [form, ticket_status]);

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
                  label="Select Status"
                  name="ticket_status"
                  rules={[
                    { required: true, message: "Please select a status!" },
                  ]}
                >
                  <Select placeholder="Select Status">
                    <Option value="solved">SOLVED</Option>
                    <Option value="unsolved">UNSOLVED</Option>
                    <Option value="forward">FORWARD</Option>
                  </Select>
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
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default UpdateTicketStatus;
