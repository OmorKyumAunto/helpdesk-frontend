/* eslint-disable @typescript-eslint/no-explicit-any */
import { SendOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useAssignCategoryMutation } from "../api/assignCategoryEndPoint";
import { useGetCategoryActiveListQuery } from "../../Category/api/categoryEndPoint";
import { IAssignCategory } from "../types/assignCategoryTypes";

const AssignCategoryToAdmin = ({
  id,
  assign_category,
}: {
  id: number;
  assign_category: IAssignCategory[];
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [assign, { isLoading, isSuccess }] = useAssignCategoryMutation();
  const { data } = useGetCategoryActiveListQuery({});
  const onFinish = (value: { category_id: number[] }) => {
    assign({ body: value, id });
  };
  useEffect(() => {
    if (assign_category?.length > 0) {
      form.setFieldValue(
        "category_id",
        assign_category?.map((item: IAssignCategory) => item?.category_id)
      );
    } else {
      form.setFieldValue("category_id", null);
    }
  }, [assign_category, form]);

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
              <Col xs={24} sm={24} md={24}>
                <Form.Item
                  label="Category"
                  name="category_id"
                  rules={[
                    { required: true, message: "Please Select Category" },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select Category"
                    value={selectedItems}
                    onChange={setSelectedItems}
                    style={{ width: "100%" }}
                    filterOption={(
                      input: string,
                      option?: { label: string; value: number }
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
                Assign
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default AssignCategoryToAdmin;
