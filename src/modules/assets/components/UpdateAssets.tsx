/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { DateInput } from "../../../common/formItem/FormItems";
import { useGetOverallEmployeesQuery } from "../../employee/api/employeeEndPoint";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import {
  useGetSingleAssetsQuery,
  useUpdateAssetsMutation,
} from "../api/assetsEndPoint";
import { IAsset } from "../types/assetsTypes";
import { useGetActiveLocationsQuery } from "../../location/api/locationEndPoint";
import { ASSET_CATEGORIES } from "../utils/assetCategories";
import { ASSET_STATUS } from "../utils/assetStatus";
import "../assets-ui.css";
const { Option } = Select;

/** Uppercase group heading with a trailing hairline. */
const Group = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="asset-form__group">
    <div className="asset-form__legend">{title}</div>
    <Row gutter={[14, 0]}>{children}</Row>
  </div>
);

const UpdateAsset = ({
  asset,
  onDone,
}: {
  asset: IAsset;
  /** Called after a successful save / cancel. Provided when hosted in a drawer. */
  onDone?: () => void;
}) => {
  const { data: singleAsset } = useGetSingleAssetsQuery(Number(asset?.id));
  // A disposed asset can never be assigned, so the Assignment section is hidden.
  const isDisposed = asset?.status === ASSET_STATUS.DISPOSED;
  const { data: unitData } = useGetUnitsQuery({ status: "active" });

  const {
    name,
    category,
    purchase_date,
    serial_number,
    po_number,
    asset_no,
    asset_history,
    is_assign,
    user_id,
    employee_name,
    assign_date,
    unit_name,
    model,
    specification,
    employee_id_no,
    unit_id,
    price,
    location,
    location_name,
    device_remarks,
  } = singleAsset?.data || {};
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const assignType = Form.useWatch("assign_update", form);
  const unitId = Form.useWatch("unit_id", form);
  const { data } = useGetOverallEmployeesQuery();
  const { data: locations } = useGetActiveLocationsQuery({});
  const [Update, { isLoading, isSuccess }] = useUpdateAssetsMutation();
  const locationOption = locations?.data?.filter(
    (item) => item.unit_id === (unitId?.value ? unitId?.value : unitId)
  );

  useEffect(() => {
    form.setFieldsValue({
      name,
      category,
      price,
      serial_number,
      po_number,
      asset_no,
      asset_history,
      assign_update: is_assign,
      model,
      specification,
      device_remarks,
      purchase_date: dayjs(purchase_date),
      assign_date: assign_date ? dayjs(assign_date) : null,
    });
    if (user_id) {
      form.setFieldValue("user_id", {
        label: `${employee_id_no} (${employee_name})`,
        value: user_id,
      });
    }
    if (unit_id) {
      form.setFieldValue("unit_id", {
        label: unit_name,
        value: Number(unit_id),
      });
    }
    if (location) {
      form.setFieldValue("location", {
        label: location_name,
        value: Number(location),
      });
    }
  }, [
    name,
    category,
    purchase_date,
    serial_number,
    po_number,
    asset_no,
    asset_history,
    is_assign,
    user_id,
    employee_name,
    assign_date,
    unit_name,
    model,
    specification,
    employee_id_no,
    unit_id,
    price,
    location,
    device_remarks,
    location_name,
  ]);

  const onFinish = (data: any) => {
    const { assign_update, price, ...values } = data;

    const formattedData: any = {};
    formattedData["assign_update"] = assign_update;
    formattedData["price"] = price;
    for (const key in values) {
      if (values[key]) {
        if (key === "purchase_date" || key === "assign_date") {
          formattedData[key] = dayjs(values[key]).format("YYYY-MM-DD");
        } else if (
          key === "user_id" ||
          key === "unit_id" ||
          key === "location"
        ) {
          formattedData[key] = values[key]?.value || values[key];
        } else {
          formattedData[key] = values[key];
        }
      }
    }
    Update({ data: formattedData, id: asset.id });
  };

  const close = () => (onDone ? onDone() : dispatch(setCommonModal()));

  useEffect(() => {
    if (isSuccess) close();
  }, [isSuccess]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      initialValues={{}}
      className="asset-ui asset-form"
    >
      <Group title="Asset Information">
        <Col xs={24} md={12}>
          <Form.Item
            name="name"
            rules={[{ required: true }]}
            label="Asset Name"
            required
          >
            <Input placeholder="Enter Asset Name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please Select Category" }]}
          >
            <Select
              placeholder="Select Category"
              showSearch
              optionFilterProp="children"
            >
              {ASSET_CATEGORIES.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="model"
            rules={[{ required: true }]}
            label="Model"
            required
          >
            <Input placeholder="Enter Model" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Serial Number"
            name="serial_number"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter serial no" />
          </Form.Item>
        </Col>
      </Group>

      <Group title="Purchase & Placement">
        <Col xs={24} md={12}>
          <DateInput
            label="Purchase Date"
            name="purchase_date"
            placeholder="Select Purchase Date"
            rules={[{ required: true }]}
          />
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Asset Price" name="price" rules={[{ required: true }]}>
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Enter asset price"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="PO Number" name="po_number">
            <Input placeholder="Enter PO no" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Asset No" name="asset_no">
            <Input placeholder="Enter Asset No" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Buying Unit"
            name="unit_id"
            rules={[{ required: true, message: "Please Select Unit" }]}
          >
            <Select
              placeholder="Select Buying Unit"
              showSearch
              optionFilterProp="children"
              filterOption={(
                input: string,
                option?: { label: string; value: string }
              ) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={unitData?.data?.map((unit: any) => ({
                value: unit.id,
                label: unit.title,
              }))}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Location" name="location">
            <Select
              placeholder="Select Location"
              showSearch
              optionFilterProp="children"
              filterOption={(
                input: string,
                option?: { label: string; value: string }
              ) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={locationOption?.map((location: any) => ({
                value: location.id,
                label: location.location,
              }))}
              allowClear
            />
          </Form.Item>
        </Col>
      </Group>

      {!isDisposed && (
      <Group title="Assignment">
        <Col xs={24} md={12}>
          <Form.Item
            label="Assign"
            name="assign_update"
            rules={[{ required: true, message: "Please Select Assign Type" }]}
          >
            <Select placeholder="Select Assign">
              <Option value={1}>Yes</Option>
              <Option value={0}>No</Option>
            </Select>
          </Form.Item>
        </Col>
        {assignType === 1 && (
          <>
            <Col xs={24} md={12}>
          <Form.Item
                name="user_id"
                rules={[{ required: true }]}
                label="Employee ID"
                required
              >
                <Select
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
            <Col xs={24} md={12}>
          <DateInput
                label="Assign Date"
                name="assign_date"
                placeholder="Select Assign Date"
                rules={[{ required: true }]}
              />
        </Col>
          </>
        )}
      </Group>
      )}

      <Group title="Additional Details">
        <Col xs={24} md={24}>
          <Form.Item name="specification" label="Specification">
            <TextArea rows={3} placeholder="Enter Specification" />
          </Form.Item>
        </Col>
        <Col xs={24} md={24}>
          <Form.Item name="device_remarks" label="Device Remarks">
            <TextArea rows={3} placeholder="Enter Device Remarks (If Any)" />
          </Form.Item>
        </Col>
      </Group>

      <div className="asset-form__footer">
        <Button onClick={close}>Cancel</Button>
        <Button htmlType="submit" type="primary" loading={isLoading}>
          Save changes
        </Button>
      </div>
    </Form>
  );
};

export default UpdateAsset;
