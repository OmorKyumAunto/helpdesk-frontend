import { Card, Col, Row, Form, Input, Button, Select } from "antd";
import { SendOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DateInput } from "../../../common/formItem/FormItems";
import { useGetEmployeesQuery } from "../../employee/api/employeeEndPoint";
import { useAssignEmployeeMutation } from "../api/assetsEndPoint";
import { useEffect } from "react";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDispatch } from "react-redux";

const AssignEmployee = ({ id }: any) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { data } = useGetEmployeesQuery({});
  const [update, { isLoading, isSuccess }] = useAssignEmployeeMutation(id);

  const onFinish = (values: any) => {
    const formattedData: any = {};
    for (const key in values) {
      if (values[key]) {
        if (key === "assign_date") {
          formattedData[key] = dayjs(values[key]).format("YYYY-MM-DD");
        } else {
          formattedData[key] = values[key];
        }
      }
    }

    // console.log(formattedData);
    update({ data: formattedData, id });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      form.resetFields();
    }
  }, [isSuccess]);
  return (
    <Row justify="center" align="middle" style={{ maxWidth: "auto" }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{
            assign_date: dayjs(),
          }}
        >
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
                  name="employee_id"
                  rules={[{ required: true }]}
                  label="Employee ID"
                  required
                >
                  <Select
                    className="w-full "
                    placeholder="Select Employee"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(
                      input: string,
                      option?: { label: string; value: string }
                    ) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={data?.data?.map((employee: any) => ({
                      value: employee.id,
                      label: `${employee.employee_id} (${employee.name})`,
                    }))}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24}>
                <DateInput
                  label="Assign Date"
                  name="assign_date"
                  placeholder="Select Assign Date"
                  rules={[{ required: true }]}
                />
              </Col>
            </Row>
          </Card>

          <Form.Item style={{ marginTop: "1rem" }}>
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

export default AssignEmployee;
