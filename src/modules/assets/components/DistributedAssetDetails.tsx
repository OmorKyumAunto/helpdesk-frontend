import { Tabs, Timeline, Spin, Alert } from "antd";
import {
  ProfileOutlined,
  SettingOutlined,
  HistoryOutlined,
  FileTextOutlined,
  LaptopOutlined,
  CalendarOutlined,
  ToolOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { Remark } from "../utils/assetVisuals";
import {
  useGetSingleDistributedAssetQuery,
  useGetAssetSupportHistoryQuery,
  useGetAssetRepairHistoryQuery,
  useGetAssetActivityQuery,
} from "../api/assetsEndPoint";
import RepairNotes from "./RepairNotes";
import ActivityTimeline from "./ActivityTimeline";
import SerialCopy from "./SerialCopy";
import "./asset-details.css";

const fmt = (d?: string | Date) =>
  d && dayjs(d).isValid() ? dayjs(d).format("DD MMM YYYY") : "";

const initials = (name?: string) => {
  const p = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!p.length) return "?";
  return ((p[0][0] || "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
};

const panel = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
const listStagger = { show: { transition: { staggerChildren: 0.05 } } };
const cardIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
};

const Fact = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="adx-fact">
    <span className="adx-fact__label">{label}</span>
    <span className={`adx-fact__value${value ? "" : " adx-fact__value--empty"}`}>
      {value || "Not set"}
    </span>
  </div>
);

const Block = ({ label, text }: { label: string; text?: string }) => (
  <div className="adx-block">
    <div className="adx-block__label">{label}</div>
    <div className={`adx-block__text${text ? "" : " adx-block__text--empty"}`}>
      {text || "Not provided"}
    </div>
  </div>
);

const DistributeAssetDetails = ({ id }: { id: any }) => {
  const { data: singleAsset, isLoading, error } =
    useGetSingleDistributedAssetQuery(id);
  const { data: supportHistoryRes } = useGetAssetSupportHistoryQuery(Number(id));
  const supportHistory = supportHistoryRes?.data || [];
  const { data: repairHistoryRes } = useGetAssetRepairHistoryQuery(Number(id));
  const repairHistory = repairHistoryRes?.data || [];
  const { data: activityRes } = useGetAssetActivityQuery(Number(id));
  const activity = activityRes?.data || [];

  if (isLoading) return <Spin tip="Loading asset details..." />;
  if (error) return <Alert message="Failed to load asset data." type="error" showIcon />;

  const {
    category,
    purchase_date,
    serial_number,
    po_number,
    asset_no,
    asset_unit_name,
    model,
    specification,
    remarks,
    asset_name,
    history,
    location_name,
    device_remarks,
  } = singleAsset?.data || {};

  const items = [
    {
      key: "1",
      label: (
        <span>
          <ProfileOutlined style={{ marginRight: 6 }} />
          Details
        </span>
      ),
      children: (
        <motion.div
          className="adx-facts"
          variants={panel}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Fact label="Asset No" value={asset_no} />
          <Fact label="Asset Name" value={asset_name} />
          <Fact label="Category" value={category} />
          <Fact label="Model" value={model} />
          <Fact
            label="Serial No"
            value={serial_number ? <SerialCopy value={serial_number} /> : undefined}
          />
          <Fact label="PO Number" value={po_number} />
          <Fact label="Buying Unit" value={asset_unit_name} />
          <Fact label="Location" value={location_name} />
          <Fact label="Purchase Date" value={fmt(purchase_date)} />
          <Fact label="Status" value={<Remark remarks={remarks} />} />
        </motion.div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <SettingOutlined style={{ marginRight: 6 }} />
          Specifications
        </span>
      ),
      children: (
        <motion.div
          variants={panel}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Block label="Specification" text={specification} />
          <Block label="Device Remarks" text={device_remarks} />
        </motion.div>
      ),
    },
    ...(history?.length
      ? [
          {
            key: "3",
            label: (
              <span>
                <HistoryOutlined style={{ marginRight: 6 }} />
                Asset History
              </span>
            ),
            children: (
              <Timeline
                items={history.map((item: any) => ({
                  color: item?.status === 1 ? "green" : "red",
                  children: (
                    <div>
                      <div style={{ color: "#334155", fontSize: 13.5 }}>
                        {item?.history}
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
                        {fmt(item?.asset_assign_date)}
                      </div>
                    </div>
                  ),
                }))}
              />
            ),
          },
        ]
      : []),
    ...(supportHistory.length
      ? [
          {
            key: "support",
            label: (
              <span>
                <FileTextOutlined style={{ marginRight: 6 }} />
                Support Notes ({supportHistory.length})
              </span>
            ),
            children: (
              <motion.div
                className="adx-notes"
                variants={listStagger}
                initial="hidden"
                animate="show"
              >
                {supportHistory.map((s: any) => {
                  const active = Number(s.status) === 1 && !s.returned_at;
                  const period = `${fmt(s.assign_date) || "—"} → ${
                    s.returned_at
                      ? `${fmt(s.returned_at)} · returned`
                      : s.expected_return
                      ? `${fmt(s.expected_return)} · due`
                      : "—"
                  }`;
                  return (
                    <motion.div
                      key={s.assign_id}
                      className="adx-note"
                      variants={cardIn}
                      whileHover={{ y: -2 }}
                    >
                      <span
                        className="adx-note__av"
                        data-active={active ? "true" : "false"}
                      >
                        {initials(s.user_name)}
                      </span>
                      <div className="adx-note__body">
                        <div className="adx-note__row">
                          <span className="adx-note__name">
                            {s.user_name || "—"}
                            {s.user_id_no && (
                              <span className="adx-note__id"> · {s.user_id_no}</span>
                            )}
                          </span>
                          <span
                            className={`adx-note__pill ${
                              active ? "adx-note__pill--active" : "adx-note__pill--past"
                            }`}
                          >
                            {active
                              ? "On support"
                              : s.returned_at
                              ? "Returned"
                              : "Ended"}
                          </span>
                        </div>
                        <div className="adx-note__meta">
                          <CalendarOutlined style={{ fontSize: 11, marginRight: 5 }} />
                          {s.department ? `${s.department} · ` : ""}
                          {period}
                        </div>
                        {s.support_note && (
                          <div className="adx-note__text" title={s.support_note}>
                            {s.support_note}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ),
          },
        ]
      : []),
    ...(repairHistory.length
      ? [
          {
            key: "repair",
            label: (
              <span>
                <ToolOutlined style={{ marginRight: 6 }} />
                Repair History ({repairHistory.length})
              </span>
            ),
            children: <RepairNotes rows={repairHistory} />,
          },
        ]
      : []),
    ...(activity.length
      ? [
          {
            key: "activity",
            label: (
              <span>
                <ClockCircleOutlined style={{ marginRight: 6 }} />
                Activity ({activity.length})
              </span>
            ),
            children: <ActivityTimeline rows={activity} />,
          },
        ]
      : []),
  ];

  return (
    <div className="adx">
      <motion.div
        className="adx-head"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          className="adx-head__icon"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <LaptopOutlined />
        </motion.span>
        <div className="adx-head__main">
          <div className="adx-head__name">{model || asset_name || "Asset"}</div>
          <div className="adx-head__sub">
            {category || "—"}
            {serial_number ? ` · ${serial_number}` : ""}
          </div>
        </div>
        <span className="adx-head__status">
          <Remark remarks={remarks} />
        </span>
      </motion.div>

      <motion.div
        className="adx-body"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Tabs defaultActiveKey="1" type="line" items={items} />
      </motion.div>
    </div>
  );
};

export default DistributeAssetDetails;
