import {
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  LaptopOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Form, Select } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useGetOverallEmployeesQuery } from "../../employee/api/employeeEndPoint";
import {
  useAssignEmployeeMutation,
  useGetSingleAssetsQuery,
} from "../api/assetsEndPoint";
import "../assets-ui.css";

const TENURES = [7, 15, 30, 60];

const AssignEmployee = ({ id }: any) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { data: singleAsset } = useGetSingleAssetsQuery(Number(id));
  const asset = singleAsset?.data as any;

  const {
    data,
    isLoading: empLoading,
    isFetching,
  } = useGetOverallEmployeesQuery();
  const [update, { isLoading, isSuccess }] = useAssignEmployeeMutation(id);

  const [isSupport, setIsSupport] = useState(false);
  const [tenure, setTenure] = useState<number | "custom">(7);

  const assignDate = Form.useWatch("assign_date", form);
  const customDate = Form.useWatch("expected_return", form);

  // Live preview of the return date.
  const returnBy =
    !isSupport
      ? null
      : tenure === "custom"
      ? customDate
        ? dayjs(customDate)
        : null
      : assignDate
      ? dayjs(assignDate).add(Number(tenure), "day")
      : null;

  const onFinish = (values: any) => {
    const payload: any = {
      user_id: values.user_id,
      assign_date: dayjs(values.assign_date).format("YYYY-MM-DD"),
    };

    if (isSupport) {
      payload.assign_type = "support";
      if (tenure === "custom") {
        payload.expected_return = dayjs(values.expected_return).format("YYYY-MM-DD");
      } else {
        payload.support_days = Number(tenure);
      }
    }

    update({ data: payload, id });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      form.resetFields();
    }
  }, [isSuccess]);

  return (
    <div className="asset-ui">
      {/* Which asset am I assigning? */}
      <motion.div
        className="ae-asset"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="ae-asset__icon">
          <LaptopOutlined />
        </span>
        <div style={{ minWidth: 0 }}>
          <div className="asset-cell-title">
            {asset?.model || asset?.name || "Asset"}
          </div>
          <div className="asset-cell-sub">
            {asset?.category}
            {asset?.serial_number ? ` · ${asset.serial_number}` : ""}
          </div>
        </div>
      </motion.div>

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ assign_date: dayjs() }}
        className="asset-form ae-form"
      >
        <Form.Item
          name="user_id"
          rules={[{ required: true, message: "Select an employee" }]}
          label="Assign to"
        >
          <Select
            size="large"
            loading={empLoading || isFetching}
            placeholder="Search employee by ID or name"
            showSearch
            optionFilterProp="children"
            filterOption={(input: string, option?: { label: string; value: string }) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={data?.data?.map((employee: any) => ({
              value: employee.id,
              label: `${employee.employee_id} (${employee.name})`,
            }))}
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="assign_date"
          label="Assign Date"
          rules={[{ required: true, message: "Pick an assign date" }]}
        >
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            format="DD MMM YYYY"
            suffixIcon={<CalendarOutlined />}
            placeholder="Select assign date"
          />
        </Form.Item>

        {/* Assignment type — two explicit choices instead of a dropdown */}
        <Form.Item label="Assignment Type" style={{ marginBottom: 14 }}>
          <div className="ae-choice">
            {[
              {
                on: !isSupport,
                pick: () => setIsSupport(false),
                icon: <UserAddOutlined />,
                title: "Permanent",
                desc: "Stays with the employee until reassigned.",
              },
              {
                on: isSupport,
                pick: () => setIsSupport(true),
                icon: <ClockCircleOutlined />,
                title: "On Support",
                desc: "Temporary — must be returned by a set date.",
              },
            ].map((c) => (
              <motion.button
                key={c.title}
                type="button"
                className={`ae-choice__card ${c.on ? "ae-choice__card--on" : ""}`}
                onClick={c.pick}
                aria-pressed={c.on}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.985 }}
              >
                <AnimatePresence>
                  {c.on && (
                    <motion.span
                      className="ae-choice__bg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {c.on && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    >
                      <CheckCircleFilled className="ae-choice__tick" />
                    </motion.span>
                  )}
                </AnimatePresence>
                <div className="ae-choice__icon">{c.icon}</div>
                <div className="ae-choice__title">{c.title}</div>
                <div className="ae-choice__desc">{c.desc}</div>
              </motion.button>
            ))}
          </div>
        </Form.Item>

        {isSupport && (
          <>
            <Form.Item label="Support Period" style={{ marginBottom: 8 }}>
              <div className="ae-tenure">
                {[...TENURES, "custom" as const].map((d) => (
                  <button
                    key={String(d)}
                    type="button"
                    className={`ae-pill ${tenure === d ? "ae-pill--on" : ""}`}
                    onClick={() => setTenure(d as any)}
                  >
                    {tenure === d && (
                      <motion.span
                        layoutId="aeTenure"
                        className="ae-pill__bg"
                        transition={{ type: "spring", stiffness: 430, damping: 34 }}
                      />
                    )}
                    {d === "custom" ? "Custom" : `${d} days`}
                  </button>
                ))}
              </div>
            </Form.Item>

            {tenure === "custom" && (
              <Form.Item
                name="expected_return"
                label="Return by"
                rules={[{ required: true, message: "Pick a return date" }]}
              >
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  format="DD MMM YYYY"
                  suffixIcon={<CalendarOutlined />}
                  disabledDate={(d) => d && d < dayjs().startOf("day")}
                />
              </Form.Item>
            )}

            <motion.div
              className="ae-summary"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="ae-summary__icon">
                <CalendarOutlined />
              </span>
              <div>
                <div className="ae-summary__label">Return By</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={returnBy ? returnBy.format("YYYY-MM-DD") : "none"}
                    className="ae-summary__value"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {returnBy ? returnBy.format("DD MMM YYYY") : "—"}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="ae-summary__note">
                Admins are emailed 3 days before. You can extend the period later —
                even after it expires.
              </div>
            </motion.div>
          </>
        )}

        <div className="ae-footer">
          <Button onClick={() => dispatch(setCommonModal())}>Cancel</Button>
          <Button
            htmlType="submit"
            type="primary"
            icon={<UserAddOutlined />}
            loading={isLoading}
          >
            {isSupport ? "Assign on Support" : "Assign"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AssignEmployee;
