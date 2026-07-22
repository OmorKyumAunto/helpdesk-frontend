import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { IAsset } from "../types/assetsTypes";
import { Remark } from "../utils/assetVisuals";
import { AssetRowActions, AssetStatusControl } from "./AssetRowActions";
import AssetDetails from "./AssetDetails";

const Field = ({
  label,
  value,
  mono = true,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
}) => (
  <div style={{ minWidth: 0 }}>
    <div className="asset-card__label">{label}</div>
    <div
      className={mono ? "asset-mono" : "asset-cell-sub"}
      style={{ overflow: "hidden", textOverflow: "ellipsis" }}
    >
      {value ? value : <span className="asset-empty">—</span>}
    </div>
  </div>
);

/** Card representation of an asset, used instead of the table on small screens. */
const AssetMobileCard = ({ record }: { record: IAsset }) => {
  const dispatch = useDispatch();

  const openDetails = () =>
    dispatch(
      setCommonModal({
        title: "Assets Details",
        content: <AssetDetails id={record.id} />,
        show: true,
        width: 740,
      })
    );

  return (
  <div className="asset-card">
    {/* Tapping the card body opens details; the footer holds its own controls. */}
    <div
      role="button"
      tabIndex={0}
      style={{ cursor: "pointer" }}
      onClick={openDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetails();
        }
      }}
    >
    <div className="asset-card__head">
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="asset-cell-title">{record.model || record.name}</div>
        <div className="asset-cell-sub">{record.category}</div>
      </div>
      <Remark remarks={record.remarks} />
    </div>

    <div className="asset-card__grid">
      <Field label="Serial No" value={record.serial_number} />
      <Field label="Asset No" value={record.asset_no} />
      <Field label="PO No" value={record.po_number} />
      <Field label="Buying Unit" value={record.unit_name} mono={false} />
    </div>
    </div>

    <div className="asset-card__foot">
      <AssetStatusControl record={record} />
      <AssetRowActions record={record} />
    </div>
  </div>
  );
};

export default AssetMobileCard;
