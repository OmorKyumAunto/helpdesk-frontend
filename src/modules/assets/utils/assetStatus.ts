// Fixed asset status values.
// NOTE: 0 is reserved for "deleted" — list queries filter `status != 0`.
export const ASSET_STATUS = {
  ACTIVE: 1,
  INACTIVE: 2,
  DISPOSED: 3,
  WRITE_OFF: 4,
} as const;

export const ASSET_STATUS_OPTIONS = [
  { value: ASSET_STATUS.ACTIVE, label: "Active" },
  { value: ASSET_STATUS.INACTIVE, label: "Inactive" },
  { value: ASSET_STATUS.DISPOSED, label: "Disposed" },
  { value: ASSET_STATUS.WRITE_OFF, label: "Write Off" },
];

export const assetStatusLabel = (status: number): string =>
  ASSET_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? "Unknown";
