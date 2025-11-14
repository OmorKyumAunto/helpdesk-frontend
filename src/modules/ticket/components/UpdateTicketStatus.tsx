/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Form, Input, Button, Select, Popconfirm, message } from "antd";
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
import { useGetAdminWiseUnitsQuery } from "../../Unit/api/unitEndPoint";
import TextArea from "antd/es/input/TextArea";
import { useWatch } from "antd/es/form/Form";

const { Option } = Select;

const UpdateTicketStatus = ({ single }: { single: IAdminTicketList }) => {
  const { ticket_table_id, ticket_status } = single || {};
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [update, { isLoading: updateLoading, isSuccess }] =
    useUpdateTicketAdminStatusMutation();
  const [forward, { isLoading: forwardLoading, isSuccess: forwardSuccess }] =
    useForwardTicketMutation();

  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryActiveListQuery({});
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });

  // 🔹 Watch selected ticket_status & unit_id
  const status = useWatch("ticket_status", form);
  const selectedUnit = useWatch("unit_id", form);

  // 🔹 Fetch admins dynamically when unit changes
  const { data: adminData, isLoading: adminLoading } = useGetAdminWiseUnitsQuery(
    selectedUnit,
    { skip: !selectedUnit }
  );

  // 🔹 Handle submit
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

  // 🔹 Set initial ticket status
  useEffect(() => {
    form.setFieldsValue({ ticket_status });
  }, [form, ticket_status]);

  // 🔹 Success handling
  useEffect(() => {
    if (isSuccess || forwardSuccess) {
      message.success(
        isSuccess
          ? "Ticket status updated successfully!"
          : "Ticket forwarded successfully!"
      );
      dispatch(setCommonModal());
      form.resetFields();
    }
  }, [isSuccess, forwardSuccess, dispatch, form]);

  const isSubmitting = updateLoading || forwardLoading;

  return (
    <Row justify="center" align="middle" style={{ maxWidth: "auto" }}>
      <Col xs={24}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Card className="border" style={{ margin: "1rem 0" }}>
            <Row align={"middle"} gutter={[12, 16]}>
              <Col xs={24}>
                {/* 🔹 Status Selector */}
                <Form.Item
                  label="Select Status"
                  name="ticket_status"
                  rules={[
                    { required: true, message: "Please select a status!" },
                  ]}
                >
                  <Select placeholder="Select Status">
                    <Option value="inprogress">IN PROGRESS</Option>
                    <Option value="solved">SOLVED</Option>
                    <Option value="unsolved">UNSOLVED</Option>
                    <Option value="forward">FORWARD</Option>
                  </Select>
                </Form.Item>

                {/* 🔹 Forward Section */}
                {status === "forward" && (
                  <Card
                    size="small"
                    title="Forward Ticket Details"
                    bordered
                    style={{ background: "#fafafa" }}
                  >
                    <Row gutter={[12, 12]}>
                      {/* Unit */}
                      <Col xs={24} sm={12}>
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
                            filterOption={(input, option) =>
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
                      </Col>

                      {/* Admin */}
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Select Admin"
                          name="admin_id"
                          rules={[
                            { required: true, message: "Please select an admin!" },
                          ]}
                        >
                          <Select
                            loading={adminLoading}
                            disabled={!selectedUnit}
                            placeholder={
                              selectedUnit
                                ? "Select Admin"
                                : "Please select a unit first"
                            }
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={adminData?.data?.user_list
                              ?.filter((admin: any) => admin.role_id !== 4) // ⛔ remove role_id = 4
                              .map((admin: any) => ({
                                value: admin.user_id,
                                label: `[${admin.employee_id}] ${admin.name}`,
                              }))
                            }

                          />
                        </Form.Item>
                      </Col>

                      {/* Category */}
                      <Col xs={24} sm={12}>
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
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={categoryData?.data?.map((item: any) => ({
                              value: item.id,
                              label: item.title,
                            }))}
                          />
                        </Form.Item>
                      </Col>

                      {/* Remarks */}
                      <Col span={24}>
                        <Form.Item
                          label="Remarks / Forward Note"
                          name="remarks"
                          rules={[
                            { required: true, message: "Please add remarks!" },
                          ]}
                        >
                          <TextArea
                            rows={3}
                            placeholder="Write your remarks here..."
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                )}
              </Col>
            </Row>
          </Card>

          {/* 🔹 Submit Section */}
          <Form.Item>
            <div style={{ textAlign: "end" }}>
              {status === "forward" ? (
                <Popconfirm
                  title="Are you sure you want to forward this ticket?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => form.submit()}
                >
                  <Button
                    htmlType="button"
                    type="primary"
                    icon={<SendOutlined />}
                    loading={isSubmitting}
                  >
                    Submit
                  </Button>
                </Popconfirm>
              ) : (
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<SendOutlined />}
                  loading={isSubmitting}
                  disabled={isSubmitting}
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
