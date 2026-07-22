import {
  CalendarOutlined,
  FieldTimeOutlined,
  LaptopOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { Button, DatePicker, Form } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useExtendSupportLoanMutation } from "../api/assetsEndPoint";
import "../assets-ui.css";

const TENURES = [7, 15, 30, 60];

/**
 * Extend an On-Support period. Works on an already-expired one too — the
 * backend extends from today in that case, so the new date is never in the past.
 */
const ExtendSupportModal = ({ loan }: { loan: any }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [mode, setMode] = useState<"days" | "date">("days");
  const [tenure, setTenure] = useState<number>(15);
  const [extend, { isLoading, isSuccess }] = useExtendSupportLoanMutation();

  const isOverdue = loan?.support_state === "overdue";
  const customDate = Form.useWatch("expected_return", form);

  useEffect(() => {
    if (isSuccess) dispatch(setCommonModal());
  }, [isSuccess]);

  // Mirrors the backend: an overdue period is extended from today, not from the
  // stale expiry date, so the new date can never land in the past.
  const newReturn =
    mode === "date"
      ? customDate
        ? dayjs(customDate)
        : null
      : (() => {
          const current = loan?.expected_return ? dayjs(loan.expected_return) : dayjs();
          const base = current.isBefore(dayjs(), "day") ? dayjs() : current;
          return base.add(tenure, "day");
        })();

  const onFinish = (values: any) => {
    if (mode === "days") {
      extend({ assignId: loan.assign_id, support_days: tenure });
    } else {
      extend({
        assignId: loan.assign_id,
        expected_return: dayjs(values.expected_return).format("YYYY-MM-DD"),
      });
    }
  };

  return (
    <div className="asset-ui">
      {/* Asset + holder context */}
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
            {loan?.asset_name || loan?.model || "Asset"}
            {loan?.serial_number ? ` · ${loan.serial_number}` : ""}
          </div>
          <div className="asset-cell-sub">
            Held by {loan?.user_name} ({loan?.user_id_no})
          </div>
          <div className="ex-due">
            <CalendarOutlined />
            Current return date:
            <span className="ex-due__value">
              {loan?.expected_return
                ? dayjs(loan.expected_return).format("DD MMM YYYY")
                : "—"}
            </span>
          </div>
        </div>
      </motion.div>

      {isOverdue && (
        <motion.div
          className="ex-banner"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <span className="ex-banner__icon">
            <WarningFilled />
          </span>
          <div>
            <div className="ex-banner__title">
              {Math.abs(loan?.days_left ?? 0)} day(s) overdue
            </div>
            <div className="ex-banner__text">
              The new period will be counted from today, so the return date never
              falls in the past.
            </div>
          </div>
        </motion.div>
      )}

      <Form layout="vertical" form={form} onFinish={onFinish} className="asset-form ae-form">
        {/* Mode switch */}
        <div className="ex-mode">
          {[
            { key: "days", label: "Preset period" },
            { key: "date", label: "Specific date" },
          ].map((m) => (
            <button
              key={m.key}
              type="button"
              className={`ex-mode__btn ${mode === m.key ? "ex-mode__btn--on" : ""}`}
              onClick={() => setMode(m.key as "days" | "date")}
            >
              {mode === m.key && (
                <motion.span
                  layoutId="exMode"
                  className="ex-mode__bg"
                  transition={{ type: "spring", stiffness: 430, damping: 34 }}
                />
              )}
              {m.label}
            </button>
          ))}
        </div>

        {mode === "days" ? (
          <Form.Item label="Extend By" style={{ marginBottom: 8 }}>
            <div className="ae-tenure">
              {TENURES.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`ae-pill ${tenure === d ? "ae-pill--on" : ""}`}
                  onClick={() => setTenure(d)}
                >
                  {tenure === d && (
                    <motion.span
                      layoutId="exTenure"
                      className="ae-pill__bg"
                      transition={{ type: "spring", stiffness: 430, damping: 34 }}
                    />
                  )}
                  {d} days
                </button>
              ))}
            </div>
          </Form.Item>
        ) : (
          <Form.Item
            name="expected_return"
            label="New Return Date"
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

        {/* New return date preview */}
        <motion.div
          className="ae-summary"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="ae-summary__icon">
            <FieldTimeOutlined />
          </span>
          <div>
            <div className="ae-summary__label">New Return Date</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={newReturn ? newReturn.format("YYYY-MM-DD") : "none"}
                className="ae-summary__value"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {newReturn ? newReturn.format("DD MMM YYYY") : "—"}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="ae-summary__note">
            The reminder re-arms for the new window — admins are emailed again 3
            days before this date.
          </div>
        </motion.div>

        <div className="ae-footer">
          <Button onClick={() => dispatch(setCommonModal())}>Cancel</Button>
          <Button
            htmlType="submit"
            type="primary"
            icon={<FieldTimeOutlined />}
            loading={isLoading}
          >
            Extend Period
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ExtendSupportModal;
