/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Form, Input, Button, Select, Popconfirm } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
  useForwardTicketMutation,
  useUpdateTicketAdminStatusMutation,
} from "../api/ticketEndpoint";
import { IAdminTicketList } from "../types/ticketTypes";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetCategoryActiveListQuery } from "../../Category/api/categoryEndPoint";
import TextArea from "antd/es/input/TextArea";
import { useWatch } from "antd/es/form/Form";
const { Option } = Select;
const UpdateTicketStatus = ({ single }: { single: IAdminTicketList }) => {
  const { ticket_table_id, ticket_status } = single || {};
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [update, { isLoading, isSuccess }] =
    useUpdateTicketAdminStatusMutation();
  const [forward, { isSuccess: forwardSuccess }] = useForwardTicketMutation();
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryActiveListQuery({});
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });

  const status = useWatch("ticket_status", form);
  const onFinish = (value: any) => {
    const { ticket_status, ...rest } = value;
    const body =
      ticket_status === "forward" ? { ...rest } : { ticket_status, ...rest };
    if (ticket_status === "forward") {
      forward({ body, id: ticket_table_id });
    } else {
      update({ body, id: ticket_table_id });
    }
  };

  useEffect(() => {
    form.setFieldsValue({ ticket_status });
  }, [form, ticket_status]);

  useEffect(() => {
    if (isSuccess || forwardSuccess) {
      dispatch(setCommonModal());
      form.resetFields();
    }
  }, [isSuccess, forwardSuccess]);

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
                {status === "forward" && (
                  <>
                    <Form.Item
                      label="Select Unit"
                      name="unit_id"
                      rules={[
                        { required: true, message: "Please select a unit!" },
                      ]}
                    >
                      <Select
                        loading={unitIsLoading}
                        placeholder="Select Unit Name"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(
                          input: string,
                          option?: { label: string; value: number }
                        ) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={unitData?.data?.map((unit: any) => ({
                          value: unit.id,
                          label: unit.title,
                        }))}
                        allowClear
                      />
                    </Form.Item>

                    <Form.Item
                      label="Select Category"
                      name="category_id"
                      rules={[
                        {
                          required: true,
                          message: "Please select a category!",
                        },
                      ]}
                    >
                      <Select
                        loading={categoryLoading}
                        placeholder="Select Category"
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        filterOption={(
                          input: string,
                          option?: { label: string; value: number }
                        ) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={categoryData?.data?.map((item) => ({
                          value: item.id,
                          label: item.title,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Remarks"
                      name="remarks"
                      // rules={[
                      //   { required: true, message: "Please select a category!" },
                      // ]}
                    >
                      <TextArea rows={3} placeholder="Write here" />
                    </Form.Item>
                  </>
                )}
              </Col>
            </Row>
          </Card>
          <Form.Item>
            <div style={{ textAlign: "end" }}>
              {status === "forward" ? (
                <Popconfirm
                  title="Are you sure you want to forward?"
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
              ) : (
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<SendOutlined />}
                  loading={isLoading}
                >
                  Submit
                </Button>
              )}
            </div>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default UpdateTicketStatus;
