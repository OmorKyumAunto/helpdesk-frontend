import {
  CalendarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import "./asset-details.css";

const fmt = (d?: string | Date) =>
  d && dayjs(d).isValid() ? dayjs(d).format("DD MMM YYYY") : "";

const initials = (name?: string) => {
  const p = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!p.length) return "?";
  return ((p[0][0] || "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
};

const SERVICE_LABEL: Record<string, string> = {
  repair: "Repair",
  warranty: "Warranty",
  preventive: "Preventive",
  other: "Other",
};

const listStagger = { show: { transition: { staggerChildren: 0.05 } } };
const cardIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Repair history for one asset — every time it went to a vendor, active or
 * closed. Presentational only; the parent passes the fetched rows so the tab
 * can be shown conditionally on the count. Reuses the `.adx-note` card styling.
 */
const RepairNotes = ({ rows }: { rows: any[] }) => (
  <motion.div
    className="adx-notes"
    variants={listStagger}
    initial="hidden"
    animate="show"
  >
    {rows.map((r: any) => {
      const active = Number(r.status) === 1 && !r.returned_at;
      // The pill (Returned / In repair) already says the status, so the period
      // is just the two dates — no "· back" / "· due" tag cluttering it.
      const endDate = r.returned_at
        ? fmt(r.returned_at)
        : r.expected_return
        ? fmt(r.expected_return)
        : "No ETA";
      const period = `${fmt(r.sent_date) || "—"} → ${endDate}`;
      const cost =
        r.estimated_cost != null && r.estimated_cost !== ""
          ? `৳${Number(r.estimated_cost).toLocaleString()}`
          : "";
      return (
        <motion.div
          key={r.repair_id}
          className="adx-note"
          variants={cardIn}
          whileHover={{ y: -2 }}
        >
          <span className="adx-note__av" data-active={active ? "true" : "false"}>
            {initials(r.vendor_name)}
          </span>
          <div className="adx-note__body">
            <div className="adx-note__row">
              <span className="adx-note__name">
                {r.vendor_name || "—"}
                <span className="adx-note__id">
                  {" · "}
                  {SERVICE_LABEL[r.service_type] || "Repair"}
                </span>
              </span>
              <span
                className={`adx-note__pill ${
                  active ? "adx-note__pill--active" : "adx-note__pill--past"
                }`}
              >
                {active ? "In repair" : r.returned_at ? "Returned" : "Ended"}
              </span>
            </div>

            <div className="adx-note__meta">
              <CalendarOutlined style={{ fontSize: 11, marginRight: 5 }} />
              {r.held_user_name ? `From ${r.held_user_name} · ` : "From stock · "}
              {period}
            </div>

            {r.vendor_address && (
              <div className="adx-note__meta">
                <EnvironmentOutlined style={{ fontSize: 11, marginRight: 5 }} />
                {r.vendor_address}
              </div>
            )}

            {cost && (
              <div className="adx-note__cost">
                <DollarOutlined style={{ fontSize: 11, marginRight: 5 }} />
                <span className="adx-note__cost-k">
                  {r.returned_at ? "Final cost" : "Est. cost"}
                </span>
                <span className="adx-note__cost-v">{cost}</span>
              </div>
            )}

            {r.issue_note && (
              <div className="adx-note__text" title={r.issue_note}>
                {r.issue_note}
              </div>
            )}
          </div>
        </motion.div>
      );
    })}
  </motion.div>
);

export default RepairNotes;
