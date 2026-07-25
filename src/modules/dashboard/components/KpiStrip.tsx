import { RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCountUp } from "./useCountUp";

export type TStatTone = "violet" | "amber" | "green" | "blue";

export type TKpi = {
  to: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: TStatTone;
};

const Cell = ({ kpi, index }: { kpi: TKpi; index: number }) => {
  const navigate = useNavigate();
  // Start each count once its cell has finished its CSS fade-in.
  const shown = useCountUp(Number(kpi.value) || 0, 850, 300 + index * 70);
  return (
    <button
      type="button"
      className={`kpi__cell kpi__cell--${kpi.tone} dfade`}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => navigate(kpi.to)}
    >
      <span className="kpi__icon">{kpi.icon}</span>
      <span className="kpi__text">
        <span className="kpi__label">{kpi.label}</span>
        <span className="kpi__value">{shown.toLocaleString()}</span>
      </span>
      <RightOutlined className="kpi__chev" />
    </button>
  );
};

/** Compact metric strip — one connected row of divided segments. */
const KpiStrip = ({ items }: { items: TKpi[] }) => (
  <div className="kpi">
    {items.map((k, i) => (
      <Cell key={k.label} kpi={k} index={i} />
    ))}
  </div>
);

export default KpiStrip;
