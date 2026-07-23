import { Button, Dropdown, Grid, Modal, Popconfirm, Tooltip } from "antd";
import type { MenuProps } from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { RootState } from "../../../app/store/store";
import { useGetMeQuery } from "../../../app/api/userApi";
import {
  useDeleteAssetsMutation,
  useUpdateAssetStatusMutation,
} from "../api/assetsEndPoint";
import { IAsset } from "../types/assetsTypes";
import {
  ASSET_STATUS,
  ASSET_STATUS_OPTIONS,
  assetStatusLabel,
} from "../utils/assetStatus";
import { StaticStatus, StatusDot } from "../utils/assetVisuals";
import AssetDetails from "./AssetDetails";
import UpdateAsset from "./UpdateAssets";
import AssignEmployee from "./AssignEmployee";

/**
 * Status shown as a badge (not a form control). Clicking opens a compact menu.
 * Assigned assets render a static badge — the backend rejects changes there.
 */
export const AssetStatusControl = ({ record }: { record: IAsset }) => {
  const { data: profile } = useGetMeQuery();
  const employeeID = profile?.data?.employee_id;
  const [updateStatus] = useUpdateAssetStatusMutation();

  // Write Off is fully terminal. A disposed asset may only progress to Write
  // Off. An assigned asset must be unassigned first.
  const isWriteOff = record.status === ASSET_STATUS.WRITE_OFF;
  const isDisposed = record.status === ASSET_STATUS.DISPOSED;
  const isAssigned = record.remarks === "assigned";
  const canChange =
    employeeID !== "Assetteam" && !isAssigned && !isWriteOff;

  if (!canChange) {
    const reason = isWriteOff
      ? "This asset is written off — its status can no longer be changed."
      : isAssigned
      ? "Unassign this asset before changing its status."
      : undefined;
    return <StaticStatus status={record.status} reason={reason} />;
  }

  // Write Off is only ever reachable FROM Disposed — an asset must be disposed
  // before it can be written off, so the option is hidden everywhere else
  // (notably on the Stock page). From Disposed it is the only move left.
  const options = isDisposed
    ? ASSET_STATUS_OPTIONS.filter((o) => o.value === ASSET_STATUS.WRITE_OFF)
    : ASSET_STATUS_OPTIONS.filter((o) => o.value !== ASSET_STATUS.WRITE_OFF);

  const items: MenuProps["items"] = options.map((option) => ({
    key: String(option.value),
    label: (
      <span className="asset-menu-item">
        <StatusDot status={option.value} />
        {option.label}
        {record.status === option.value && (
          <CheckOutlined className="asset-menu-item__check" />
        )}
      </span>
    ),
  }));

  return (
    <Dropdown
      trigger={["click"]}
      overlayClassName="asset-status-menu"
      getPopupContainer={() => document.body}
      menu={{
        items,
        onClick: ({ key }) => {
          const next = Number(key);
          if (next === record.status) return;

          // Disposing / writing off is irreversible — confirm before committing.
          if (
            next === ASSET_STATUS.DISPOSED ||
            next === ASSET_STATUS.WRITE_OFF
          ) {
            const writingOff = next === ASSET_STATUS.WRITE_OFF;
            Modal.confirm({
              title: writingOff
                ? "Write off this asset?"
                : "Dispose this asset?",
              centered: true,
              icon: <ExclamationCircleFilled style={{ color: "#b42318" }} />,
              content: (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>
                    {record.model || record.name}
                    {record.serial_number ? ` · ${record.serial_number}` : ""}
                  </div>
                  <div>
                    {writingOff
                      ? "This cannot be undone. A written-off asset leaves your stock permanently and can no longer be changed or assigned."
                      : "This cannot be undone. A disposed asset can only be moved to Write Off afterwards, and cannot be assigned to anyone."}
                  </div>
                </div>
              ),
              okText: writingOff ? "Yes, write off" : "Yes, dispose",
              okButtonProps: { danger: true },
              cancelText: "Cancel",
              onOk: () => updateStatus({ id: record.id, status: next }),
            });
            return;
          }

          updateStatus({ id: record.id, status: next });
        },
      }}
    >
      <button
        type="button"
        className="asset-status"
        title="Click to change status"
        aria-label={`Status: ${assetStatusLabel(
          record.status
        )}. Click to change`}
      >
        <StatusDot status={record.status} />
        {assetStatusLabel(record.status)}
        <DownOutlined className="asset-status__chev" />
      </button>
    </Dropdown>
  );
};

/** View / Edit / Assign / Delete controls shared by the table and card views. */
export const AssetRowActions = ({ record }: { record: IAsset }) => {
  const dispatch = useDispatch();
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const { data: profile } = useGetMeQuery();
  const employeeID = profile?.data?.employee_id;
  const [deleteAsset] = useDeleteAssetsMutation();
  const screens = Grid.useBreakpoint();

  const canAssign =
    employeeID !== "Assetteam" &&
    record?.is_assign === 0 &&
    record?.status === ASSET_STATUS.ACTIVE;

  return (
    <div className="asset-actions">
      <Tooltip title="View details" getPopupContainer={() => document.body}>
        <Button
          type="text"
          className="asset-iconbtn"
          aria-label="View asset details"
          icon={<EyeOutlined />}
          onClick={() =>
            dispatch(
              setCommonModal({
                title: "Assets Details",
                content: <AssetDetails id={record?.id} />,
                show: true,
                width: 740,
              })
            )
          }
        />
      </Tooltip>

      {employeeID !== "Assetteam" && (
        <Tooltip title="Edit asset" getPopupContainer={() => document.body}>
          <Button
            type="text"
            className="asset-iconbtn"
            aria-label="Edit asset"
            icon={<EditOutlined />}
            onClick={() =>
              dispatch(
                setCommonModal({
                  title: "Update Asset",
                  content: <UpdateAsset asset={record} />,
                  show: true,
                  width: 760,
                })
              )
            }
          />
        </Tooltip>
      )}

      {canAssign && (
        <Button
          size="small"
          type="primary"
          className="asset-assign-btn"
          icon={<UserAddOutlined />}
          onClick={() =>
            dispatch(
              setCommonModal({
                title: "Assign Employee",
                content: <AssignEmployee id={record.id} />,
                show: true,
                // Fixed 640 on desktop, near-full-bleed on phones.
                width: screens.sm ? 640 : "94vw",
              })
            )
          }
        >
          Assign
        </Button>
      )}

      {(roleId === 1 || roleId === 4) && (
        <Popconfirm
          title="Delete this Asset"
          description="Are You Sure to Delete This?"
          onConfirm={() => record?.id && deleteAsset(record.id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
          getPopupContainer={() => document.body}
        >
          <Button
            type="text"
            className="asset-iconbtn asset-iconbtn--danger"
            aria-label="Delete asset"
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      )}

    </div>
  );
};
