import { useState } from "react";
import { DeleteOutlined, ExportOutlined } from "@ant-design/icons";
import AssetsList from "./AssetsList";
import "../assets-ui.css";

type TBucket = "disposed" | "write_off";

const BUCKETS = [
  {
    key: "disposed" as const,
    icon: <DeleteOutlined />,
    label: "Disposed Stock",
    hint: "Still held in your disposed stock",
  },
  {
    key: "write_off" as const,
    icon: <ExportOutlined />,
    label: "Write Off",
    hint: "Permanently handed to another department",
  },
];

/**
 * Disposed assets, split into two buckets:
 *  - "disposed"  → still sitting in your disposed stock
 *  - "write_off" → permanently handed over to another department
 *
 * Both reuse the Stock list; only the remark bucket differs.
 *
 * The tabs mirror the ticket module's TicketMain tabs (filled #2563eb tab on a
 * gradient header strip) so navigation looks the same everywhere in the app.
 */
const DisposedAssets = () => {
  const [bucket, setBucket] = useState<TBucket>("disposed");

  return (
    <AssetsList
      // Remount on switch so paging/filters reset cleanly per bucket.
      key={bucket}
      assetType={bucket}
      title={bucket === "disposed" ? "Disposed Stock" : "Write Off"}
      excelName={bucket === "disposed" ? "disposed-stock" : "write-off-assets"}
      allowCreate={false}
      headerNode={
        <div className="dp-tabs">
          <div className="dp-tabs__row" role="tablist">
            {BUCKETS.map((b) => {
              const on = bucket === b.key;
              return (
                <button
                  key={b.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  title={b.hint}
                  onClick={() => setBucket(b.key)}
                  className={`dp-tab${on ? " dp-tab--on" : ""}`}
                >
                  <span className="dp-tab__icon">{b.icon}</span>
                  <span className="dp-tab__label">{b.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      }
    />
  );
};

export default DisposedAssets;
