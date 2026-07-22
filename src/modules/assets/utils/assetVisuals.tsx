import { ASSET_STATUS, assetStatusLabel } from "./assetStatus";

/** Maps a status value to its dot modifier class. */
export const statusDotClass = (status: number) =>
  status === ASSET_STATUS.ACTIVE
    ? "asset-dot--active"
    : status === ASSET_STATUS.DISPOSED
    ? "asset-dot--disposed"
    : "asset-dot--inactive";

/** Small coloured dot used in the status badge and its menu. */
export const StatusDot = ({ status }: { status: number }) => (
  <span className={`asset-status__dot ${statusDotClass(status)}`} />
);

/** Read-only status badge (used when the status cannot be changed). */
export const StaticStatus = ({
  status,
  reason,
}: {
  status: number;
  reason?: string;
}) => (
  <span className="asset-status asset-status--static" title={reason}>
    <StatusDot status={status} />
    {assetStatusLabel(status)}
  </span>
);

/** Remarks as a prominent badge so the state is obvious at a glance. */
export const Remark = ({ remarks }: { remarks?: string }) => {
  if (remarks === "assigned")
    return (
      <span className="asset-badge asset-badge--assigned">
        <span className="asset-badge__dot" />
        Assigned
      </span>
    );
  if (remarks === "disposed")
    return (
      <span className="asset-badge asset-badge--disposed">
        <span className="asset-badge__dot" />
        Disposed
      </span>
    );
  return (
    <span className="asset-badge asset-badge--stock">
      <span className="asset-badge__dot" />
      In Stock
    </span>
  );
};
