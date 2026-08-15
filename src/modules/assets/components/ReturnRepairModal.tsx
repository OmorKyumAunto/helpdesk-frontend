import { CheckCircleOutlined, LaptopOutlined } from "@ant-design/icons";
import { Button, Form, InputNumber } from "antd";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useReturnRepairMutation } from "../api/assetsEndPoint";
import "../assets-ui.css";

/**
 * Confirm a device is back from the vendor, and optionally set the final cost —
 * the actual bill often differs from the estimate entered at send time.
 */
const ReturnRepairModal = ({ repair }: { repair: any }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [returnRepair, { isLoading, isSuccess }] = useReturnRepairMutation();

  useEffect(() => {
    if (isSuccess) dispatch(setCommonModal());
  }, [isSuccess]);

  const onFinish = (values: any) => {
    const payload: any = { repairId: repair.repair_id };
    if (values.estimated_cost !== undefined && values.estimated_cost !== null)
      payload.estimated_cost = values.estimated_cost;
    returnRepair(payload);
  };

  return (
    <div className="asset-ui">
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
            {repair?.asset_name || repair?.model || "Asset"}
            {repair?.serial_number ? ` · ${repair.serial_number}` : ""}
          </div>
          <div className="asset-cell-sub">
            At {repair?.vendor_name}
            {repair?.sent_date
              ? ` · sent ${dayjs(repair.sent_date).format("DD MMM YYYY")}`
              : ""}
          </div>
        </div>
      </motion.div>

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ estimated_cost: repair?.estimated_cost ?? undefined }}
        className="asset-form ae-form"
      >
        <Form.Item name="estimated_cost" label="Final Cost (optional)">
          <InputNumber
            size="large"
            style={{ width: "100%" }}
            min={0}
            placeholder="Actual amount billed"
            formatter={(v) => `৳ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => (v ? Number(v.replace(/[^\d.]/g, "")) : 0) as any}
          />
        </Form.Item>

        <div
          style={{
            fontSize: 12.5,
            color: "#64748b",
            marginTop: -4,
            marginBottom: 4,
          }}
        >
          The repair will be closed. The asset keeps whatever assignment it had
          before it went out.
        </div>

        <div className="ae-footer">
          <Button onClick={() => dispatch(setCommonModal())}>Cancel</Button>
          <Button
            htmlType="submit"
            type="primary"
            icon={<CheckCircleOutlined />}
            loading={isLoading}
          >
            Mark Back
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ReturnRepairModal;
