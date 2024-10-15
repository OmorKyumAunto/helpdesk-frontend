/* eslint-disable @typescript-eslint/no-explicit-any */
import { SendOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useAssignUnitToAdminMutation } from "../api/adminEndPoint";

const AssignUnitToAdmin = ({ id, searchAccess }: any) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [assign, { isLoading, isSuccess }] = useAssignUnitToAdminMutation();
  const { data } = useGetUnitsQuery({});
  const onFinish = (value: any) => {
    // console.log(value);
    assign({ body: value, id });
  };
  useEffect(() => {
    if (searchAccess?.length > 0) {
      form.setFieldValue(
        "unit_id",
        searchAccess?.map((item) => item?.unit_id)
      );
    }
  }, [searchAccess, form]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      //   form.resetFields();
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
              <Col xs={24} sm={24} md={24}>
                <Form.Item
                  label="Unit"
                  name="unit_id"
                  rules={[
                    { required: true, message: "Please Select Unit Type" },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select Unit"
                    value={selectedItems}
                    onChange={setSelectedItems}
                    style={{ width: "100%" }}
                    filterOption={(
                      input: string,
                      option?: { label: string; value: string }
                    ) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={data?.data?.map((item) => ({
                      value: item.id,
                      label: item.title,
                    }))}
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
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default AssignUnitToAdmin;
