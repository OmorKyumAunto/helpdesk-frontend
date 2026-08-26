import { motion } from "framer-motion";
import dayjs from "dayjs";
import "./asset-details.css";

const fmt = (d?: string) =>
  d && dayjs(d).isValid() ? dayjs(d).format("DD MMM YYYY, h:mm A") : "";

// action + context → a human label and a tone (dot colour).
const meta = (action: string, context: string) => {
  const isRepair = context === "repair";
  switch (action) {
    case "sent":
      return {
        label: isRepair ? "Sent for repair" : "Put on support",
        tone: "blue",
      };
    case "extended":
      return {
        label: isRepair ? "Repair extended" : "Support extended",
        tone: "amber",
      };
    case "returned":
      return {
        label: isRepair ? "Back from repair" : "Moved to stock",
        tone: "green",
      };
    default:
      return { label: action, tone: "grey" };
  }
};

const listStagger = { show: { transition: { staggerChildren: 0.05 } } };
const rowIn = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Who-did-what trail for one asset — every On-Support / Under-Repair action,
 * newest first. Flat rows (no connecting spine): action + tag on top, an
 * optional detail line, then "by <actor> · <time>".
 */
const ActivityTimeline = ({ rows }: { rows: any[] }) => (
  <motion.div
    className="acx"
    variants={listStagger}
    initial="hidden"
    animate="show"
  >
    {rows.map((r: any) => {
      const m = meta(r.action, r.context);
      // Hide a detail that only echoes the label (e.g. "Back from repair").
      const detail = (r.detail || "").trim();
      const showDetail =
        detail && detail.toLowerCase() !== m.label.toLowerCase();
      const when = fmt(r.created_at);
      return (
        <motion.div key={r.id} className="acx-row" variants={rowIn}>
          <span className={`acx-dot acx-dot--${m.tone}`} />
          <div className="acx-body">
            <div className="acx-top">
              <span className="acx-label">{m.label}</span>
              <span className={`acx-tag acx-tag--${r.context}`}>
                {r.context === "repair" ? "Repair" : "Support"}
              </span>
            </div>
            {showDetail && <div className="acx-detail">{detail}</div>}
            <div className="acx-meta">
              <span className="acx-by">by {r.actor_name || "—"}</span>
              {when && <span className="acx-when">{when}</span>}
            </div>
          </div>
        </motion.div>
      );
    })}
  </motion.div>
);

export default ActivityTimeline;
