import { EditOutlined, InboxOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useReturnAssetToStockMutation } from "../api/assetsEndPoint";
import DistributeAssetDetails from "./DistributedAssetDetails";
import UpdateAsset from "./UpdateAssets";
import AssignEmployee from "./AssignEmployee";

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

/**
 * Card form of a distributed asset, used instead of the table below `md`.
 * The 6-column table does not fit a phone, and horizontal scrolling hides the
 * employee name — the thing this page is actually read for.
 */
const DistributedMobileCard = ({ record }: { record: any }) => {
  const dispatch = useDispatch();
  const { data: profile } = useGetMeQuery();
  const employeeID = profile?.data?.employee_id;
  const [returnToStock, { isLoading: returning }] =
    useReturnAssetToStockMutation();

  const openDetails = () =>
    dispatch(
      setCommonModal({
        title: "Distributed Asset Details",
        content: <DistributeAssetDetails id={record.id} />,
        show: true,
        width: 740,
      })
    );

  return (
    <div className="asset-card">
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
            <div className="asset-cell-title">
              {record.user_name || "Unassigned"}
            </div>
            <div className="asset-mono">{record.user_id_no}</div>
          </div>
        </div>

        <div className="asset-card__grid">
          <Field
            label="Asset"
            value={record.asset_name || record.model}
            mono={false}
          />
          <Field label="Category" value={record.category} mono={false} />
          <Field label="Serial No" value={record.serial_number} />
          <Field label="Location" value={record.location_name} mono={false} />
          <Field
            label="Buying Unit"
            value={record.asset_unit_name}
            mono={false}
          />
        </div>
      </div>

      {employeeID !== "Assetteam" && (
        <div className="asset-card__foot">
          <Button
            size="small"
            icon={<SwapOutlined />}
            onClick={() =>
              dispatch(
                setCommonModal({
                  title: "Assign to Another Employee",
                  content: (
                    <AssignEmployee
                      id={record.id}
                      currentHolder={{
                        name: record.user_name,
                        employee_id: record.user_id_no,
                      }}
                    />
                  ),
                  show: true,
                  width: "94vw",
                })
              )
            }
          >
            Reassign
          </Button>

          <Popconfirm
            title="Move this asset to stock?"
            description="The employee will be unassigned and the asset returned to stock."
            okText="Yes, move"
            cancelText="Cancel"
            getPopupContainer={() => document.body}
            onConfirm={() => returnToStock({ assetId: record.id })}
          >
            <Button
              size="small"
              icon={<InboxOutlined />}
              loading={returning}
              block
            >
              Move to Stock
            </Button>
          </Popconfirm>

          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() =>
              dispatch(
                setCommonModal({
                  title: "Update Distributed Asset",
                  content: <UpdateAsset asset={record} />,
                  show: true,
                  width: 760,
                })
              )
            }
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default DistributedMobileCard;
