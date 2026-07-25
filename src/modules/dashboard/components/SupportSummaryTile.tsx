import { Link } from "react-router-dom";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  WarningOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useGetSupportLoansQuery } from "../../assets/api/assetsEndPoint";
import "./support-panel.css";

/**
 * Assets On Support — dashboard panel.
 *
 * Repositioned to sit directly under the KPI row as a full-width panel (was a
 * thin strip below the charts), and redesigned: a proportion bar shows the
 * on-track / expiring / overdue split at a glance, three stat blocks give the
 * numbers, and the whole panel escalates its accent when anything is overdue.
 *
 * Data comes from the SAME endpoint the On Support page uses; its `summary` is
 * already unit-scoped to the caller, so no backend change. Self-hides when
 * nothing is on loan.
 */
const SupportSummaryTile = ({ compact = false }: { compact?: boolean }) => {
  const { data, isLoading } = useGetSupportLoansQuery();

  const summary = data?.summary || { total: 0, expiring: 0, overdue: 0 };
  const total = Number(summary.total) || 0;
  const expiring = Number(summary.expiring) || 0;
  const overdue = Number(summary.overdue) || 0;
  const onTrack = Math.max(total - expiring - overdue, 0);

  // Always render on the dashboard — including a clean "0 on support" state —
  // so every admin (roles 1/2/4) has the panel as a consistent entry point.
  // (Counts are already unit-scoped server-side: role 2/4 see only their own
  // units, role 1 sees everything. A hidden-when-empty rule made it vanish for
  // admins whose units simply had nothing on loan, which read as a bug.)
  void isLoading;

  const pct = (n: number) => (total ? (n / total) * 100 : 0);
  const level = overdue > 0 ? "danger" : expiring > 0 ? "warn" : "ok";

  const stats = [
    {
      key: "ok",
      icon: <CheckCircleOutlined />,
      value: onTrack,
      label: "On track",
      hint: "within period",
    },
    {
      key: "warn",
      icon: <AlertOutlined />,
      value: expiring,
      label: "Expiring",
      hint: "due ≤ 3 days",
    },
    {
      key: "danger",
      icon: <WarningOutlined />,
      value: overdue,
      label: "Overdue",
      hint: "past return date",
    },
  ];

  return (
    <div style={{ height: "100%" }}>
      <Link
        to="/assets/support"
        className={`spanel spanel--${level}${compact ? " spanel--compact" : ""}`}
      >
        <div className="spanel__head">
          <span className="spanel__icon">
            <ClockCircleOutlined />
          </span>
          <div className="spanel__titles">
            <span className="spanel__title">Assets On Support</span>
            <span className="spanel__sub">
              Temporary loans and their return dates
            </span>
          </div>
          <span className="spanel__total">{total}</span>
          <span className="spanel__link">
            View all <RightOutlined />
          </span>
        </div>

        {/* Proportion bar — the split, in one glance. */}
        <div className="spanel__bar" role="img" aria-label="Support status split">
          {onTrack > 0 && (
            <span
              className="spanel__seg spanel__seg--ok"
              style={{ width: `${pct(onTrack)}%` }}
            />
          )}
          {expiring > 0 && (
            <span
              className="spanel__seg spanel__seg--warn"
              style={{ width: `${pct(expiring)}%` }}
            />
          )}
          {overdue > 0 && (
            <span
              className="spanel__seg spanel__seg--danger"
              style={{ width: `${pct(overdue)}%` }}
            />
          )}
        </div>

        <div className="spanel__stats">
          {stats.map((s) => (
            <div
              key={s.key}
              className={`spanel__stat spanel__stat--${s.key}${
                s.value > 0 && s.key !== "ok" ? " is-active" : ""
              }`}
            >
              <span className="spanel__stat-icon">{s.icon}</span>
              <span className="spanel__stat-num">{s.value}</span>
              <span className="spanel__stat-label">{s.label}</span>
              <span className="spanel__stat-hint">{s.hint}</span>
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
};

export default SupportSummaryTile;
