import { FieldTimeOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import dayjs from "dayjs";

type TProps = {
  loan: any;
  /** Share of the loan period already elapsed (0–100). */
  pct: number;
  onOpenAsset: () => void;
  onOpenHolder: () => void;
  onExtend: () => void;
  onReturn: () => void;
  returning: boolean;
  badge: React.ReactNode;
};

const remaining = (d?: number | null) => {
  if (d === null || d === undefined) return null;
  if (d < 0)
    return (
      <span style={{ color: "#b42318", fontWeight: 600 }}>
        {Math.abs(d)}d overdue
      </span>
    );
  if (d === 0)
    return <span style={{ color: "#b54708", fontWeight: 600 }}>Due today</span>;
  return (
    <span
      style={{
        color: d <= 3 ? "#b54708" : "var(--a-text-2)",
        fontWeight: d <= 3 ? 600 : 400,
      }}
    >
      {d} days left
    </span>
  );
};

/** Card form of a support loan, used instead of the table below `md`. */
const SupportLoanMobileCard = ({
  loan,
  pct,
  onOpenAsset,
  onOpenHolder,
  onExtend,
  onReturn,
  returning,
  badge,
}: TProps) => {
  const overdue = loan.support_state === "overdue";

  return (
    <div className={`asset-card${overdue ? " sl-card--overdue" : ""}`}>
      <div
        role="button"
        tabIndex={0}
        style={{ cursor: "pointer" }}
        onClick={onOpenAsset}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenAsset();
          }
        }}
      >
        <div className="asset-card__head">
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="asset-cell-title">
              {loan.asset_name || loan.model}
            </div>
            <div className="asset-cell-sub">{loan.category}</div>
          </div>
          {badge}
        </div>

        <div className="asset-card__grid">
          <div style={{ minWidth: 0 }}>
            <div className="asset-card__label">Serial No</div>
            <div className="asset-mono">
              {loan.serial_number || <span className="asset-empty">—</span>}
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="asset-card__label">Remaining</div>
            <div style={{ fontSize: 12.5 }}>
              {remaining(loan.days_left) ?? (
                <span className="asset-empty">—</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Holder is its own tap target — it opens the employee, not the asset. */}
      <button type="button" className="sl-holder sl-holder--card" onClick={onOpenHolder}>
        <div className="asset-card__label">Holder</div>
        <div className="asset-cell-title">
          {loan.user_name || <span className="asset-empty">—</span>}
        </div>
        <div className="asset-mono">{loan.user_id_no}</div>
      </button>

      <div style={{ padding: "10px 0 12px" }}>
        <div
          style={{
            fontSize: 12.5,
            marginBottom: 6,
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span className="asset-cell-sub">
            {loan.assign_date ? dayjs(loan.assign_date).format("DD MMM") : "—"}
          </span>
          <span style={{ fontWeight: 600, color: "#101828" }}>
            {loan.expected_return
              ? dayjs(loan.expected_return).format("DD MMM YYYY")
              : "—"}
          </span>
        </div>
        <div className="sl-progress">
          <div
            className={`sl-progress__fill ${
              overdue ? "sl-progress__fill--danger" : ""
            }`}
            style={{
              width: `${pct}%`,
              background: overdue
                ? undefined
                : loan.support_state === "expiring"
                ? "#f79009"
                : "#1775bb",
            }}
          />
        </div>
      </div>

      <div className="asset-card__foot">
        <Button
          size="small"
          type={overdue ? "primary" : "default"}
          danger={overdue}
          icon={<FieldTimeOutlined />}
          onClick={onExtend}
        >
          Extend
        </Button>

        <Popconfirm
          title="Move this asset to stock?"
          description="The support period will be closed and the asset returned to stock."
          okText="Yes, move"
          cancelText="Cancel"
          getPopupContainer={() => document.body}
          onConfirm={onReturn}
        >
          <Button
            size="small"
            type="primary"
            loading={returning}
            icon={<InboxOutlined />}
          >
            Move to Stock
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default SupportLoanMobileCard;
