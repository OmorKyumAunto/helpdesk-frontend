/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Form, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { ILocation } from "../types/locationTypes";
import { useUpdateLocationMutation } from "../api/locationEndPoint";

const UpdateLocation = ({ single }: { single: ILocation }) => {
  const { id, location } = single || {};
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [update, { isLoading, isSuccess }] = useUpdateLocationMutation();

  const onFinish = (value: any) => {
    update({ location: value, id });
  };

  useEffect(() => {
    form.setFieldsValue({ location });
  }, [form, location]);

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
                  name="location"
                  rules={[{ required: true }]}
                  label="Location"
                  required
                >
                  <Input placeholder="Enter Location Name" type="text" />
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

export default UpdateLocation;
