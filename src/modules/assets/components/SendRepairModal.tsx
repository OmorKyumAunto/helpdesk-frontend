import {
  CalendarOutlined,
  FileTextOutlined,
  LaptopOutlined,
  ShopOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
  useGetSingleAssetsQuery,
  useGetVendorsQuery,
  useSendAssetForRepairMutation,
} from "../api/assetsEndPoint";
import "../assets-ui.css";
import "./repair-modal.css";

const DURATIONS = [3, 7, 15, 30];

const SERVICE_TYPES = [
  { value: "repair", label: "Repair" },
  { value: "warranty", label: "Warranty Claim" },
  { value: "preventive", label: "Preventive Maintenance" },
  { value: "other", label: "Other" },
];

/**
 * Send an asset out to a vendor for servicing ("Under Repair").
 *
 * Calm single-column form grouped into Vendor · Timeline · Details. The vendor
 * field is a type-to-search box: pick a saved vendor (its contact auto-fills)
 * or just type a new name — the backend remembers it for next time. Works from
 * Stock or from Disbursements; an assigned device stays linked to its holder.
 */
const SendRepairModal = ({
  id,
  currentHolder,
}: {
  id: any;
  currentHolder?: { name?: string; employee_id?: string };
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { data: singleAsset } = useGetSingleAssetsQuery(Number(id));
  const asset = singleAsset?.data as any;

  const [send, { isLoading, isSuccess }] = useSendAssetForRepairMutation();

  const { data: vendorRes } = useGetVendorsQuery();
  const vendors = vendorRes?.data || [];

  // When the typed name matches a saved vendor, prefill its contact + address
  // (both editable).
  const onVendorChange = (name: string) => {
    const match = vendors.find(
      (v: any) => String(v.name).toLowerCase() === String(name || "").toLowerCase()
    );
    if (match)
      form.setFieldsValue({
        vendor_contact: match.contact || undefined,
        vendor_address: match.address || undefined,
      });
  };

  // "open" = no ETA yet; a number = preset days; "custom" = pick a date.
  const [duration, setDuration] = useState<number | "custom" | "open">(7);

  const sentDate = Form.useWatch("sent_date", form);
  const customDate = Form.useWatch("expected_return", form);

  const returnBy =
    duration === "open"
      ? null
      : duration === "custom"
      ? customDate
        ? dayjs(customDate)
        : null
      : sentDate
      ? dayjs(sentDate).add(Number(duration), "day")
      : null;

  const onFinish = (values: any) => {
    const payload: any = {
      asset_id: Number(id),
      vendor_name: values.vendor_name?.trim(),
      service_type: values.service_type || "repair",
      sent_date: dayjs(values.sent_date).format("YYYY-MM-DD"),
    };
    if (values.vendor_contact?.trim())
      payload.vendor_contact = values.vendor_contact.trim();
    if (values.vendor_address?.trim())
      payload.vendor_address = values.vendor_address.trim();
    if (values.issue_note?.trim()) payload.issue_note = values.issue_note.trim();
    if (values.estimated_cost !== undefined && values.estimated_cost !== null)
      payload.estimated_cost = values.estimated_cost;

    if (duration === "custom") {
      payload.expected_return = dayjs(values.expected_return).format("YYYY-MM-DD");
    } else if (duration !== "open") {
      payload.repair_days = Number(duration);
    }

    send({ data: payload });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      form.resetFields();
    }
  }, [isSuccess]);

  return (
    <div className="asset-ui">
      {/* Which asset is going out for service? */}
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

      {currentHolder?.name && (
        <motion.div
          className="ae-handover"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <UserOutlined className="ae-handover__icon" />
          <span>
            In use by <strong>{currentHolder.name}</strong>
            {currentHolder.employee_id ? ` (${currentHolder.employee_id})` : ""}
            . It stays assigned to them while at the vendor, but can't be
            reassigned until it's back.
          </span>
        </motion.div>
      )}

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ sent_date: dayjs(), service_type: "repair" }}
        className="asset-form ae-form"
      >
        {/* ---- Vendor ---- */}
        <div className="rpx-sec">
          <ShopOutlined className="rpx-sec__icon" />
          Vendor
        </div>

        <div className="rp-2col">
          <Form.Item
            name="vendor_name"
            label="Service Provider"
            rules={[{ required: true, message: "Enter or pick a vendor" }]}
          >
            <AutoComplete
              size="large"
              allowClear
              placeholder="Type a vendor — pick a saved one or add new"
              options={vendors.map((v: any) => ({ value: v.name }))}
              filterOption={(input, option) =>
                String(option?.value ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={onVendorChange}
            />
          </Form.Item>
          <Form.Item name="vendor_contact" label="Contact (optional)">
            <Input size="large" placeholder="Phone / person" maxLength={100} />
          </Form.Item>
        </div>

        <Form.Item name="vendor_address" label="Address (optional)">
          <Input
            size="large"
            placeholder="Vendor address"
            maxLength={255}
          />
        </Form.Item>

        <Form.Item name="service_type" label="Service Type" style={{ marginBottom: 0 }}>
          <Select size="large" options={SERVICE_TYPES} />
        </Form.Item>

        {/* ---- Timeline ---- */}
        <div className="rpx-sec">
          <CalendarOutlined className="rpx-sec__icon" />
          Timeline
        </div>

        <Form.Item
          name="sent_date"
          label="Sent Date"
          rules={[{ required: true, message: "Pick the date it was sent" }]}
        >
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            format="DD MMM YYYY"
            suffixIcon={<CalendarOutlined />}
            disabledDate={(d) => d && d > dayjs().endOf("day")}
          />
        </Form.Item>

        <Form.Item label="Expected Duration" style={{ marginBottom: 8 }}>
          <div className="ae-tenure">
            {[...DURATIONS, "custom" as const, "open" as const].map((d) => (
              <button
                key={String(d)}
                type="button"
                className={`ae-pill ${duration === d ? "ae-pill--on" : ""}`}
                onClick={() => setDuration(d as any)}
              >
                {duration === d && (
                  <motion.span
                    layoutId="rpDuration"
                    className="ae-pill__bg"
                    transition={{ type: "spring", stiffness: 430, damping: 34 }}
                  />
                )}
                {d === "custom" ? "Custom" : d === "open" ? "No ETA" : `${d} days`}
              </button>
            ))}
          </div>
        </Form.Item>

        {duration === "custom" && (
          <Form.Item
            name="expected_return"
            label="Expected back by"
            rules={[{ required: true, message: "Pick an expected return date" }]}
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

        {/* Inline expected-back readout — small, not a big card. */}
        <div className="rpx-eta">
          <CalendarOutlined className="rpx-eta__icon" />
          <span className="rpx-eta__label">Expected back</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={returnBy ? returnBy.format("YYYY-MM-DD") : "none"}
              className="rpx-eta__value"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
            >
              {returnBy ? returnBy.format("DD MMM YYYY") : "No fixed date"}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ---- Details ---- */}
        <div className="rpx-sec">
          <FileTextOutlined className="rpx-sec__icon" />
          Details
        </div>

        <Form.Item name="estimated_cost" label="Estimated Cost (optional)">
          <InputNumber
            size="large"
            style={{ width: "100%" }}
            min={0}
            placeholder="e.g. 3500"
            formatter={(v) => `৳ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => (v ? Number(v.replace(/[^\d.]/g, "")) : 0) as any}
          />
        </Form.Item>

        <Form.Item
          name="issue_note"
          label="Issue / Reason (optional)"
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea
            rows={2}
            maxLength={500}
            showCount
            placeholder="e.g. screen flickering, keyboard replacement, annual service…"
          />
        </Form.Item>

        <div className="ae-footer">
          <Button onClick={() => dispatch(setCommonModal())}>Cancel</Button>
          <Button
            htmlType="submit"
            type="primary"
            icon={<ToolOutlined />}
            loading={isLoading}
          >
            Send for Repair
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SendRepairModal;
