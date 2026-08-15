import { Typography } from "antd";

/**
 * Serial number in monospace with a one-click copy icon (shows a "Copied" tick).
 * Wrapped so a click on the copy control never bubbles up to a row's onClick
 * (which would open the details modal).
 */
const SerialCopy = ({ value }: { value?: string | null }) =>
  value ? (
    <span
      style={{ display: "inline-flex", alignItems: "center" }}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography.Text
        className="asset-mono"
        style={{ margin: 0 }}
        copyable={{ text: String(value), tooltips: ["Copy serial", "Copied"] }}
      >
        {value}
      </Typography.Text>
    </span>
  ) : (
    <span className="asset-empty">—</span>
  );

export default SerialCopy;
