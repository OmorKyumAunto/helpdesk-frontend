import {
  AlertOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  SearchOutlined,
  InboxOutlined,
  LaptopOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Empty,
  Grid,
  Input,
  Popconfirm,
  Select,
  Skeleton,
  Table,
  Tooltip,
} from "antd";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
  useGetSupportLoansQuery,
  useReturnSupportLoanMutation,
} from "../api/assetsEndPoint";
import ExtendSupportModal from "../components/ExtendSupportModal";
import AssetDetails from "../components/AssetDetails";
import HolderDetails from "../components/HolderDetails";
import SupportLoanMobileCard from "../components/SupportLoanMobileCard";
import CategoryFilterBar from "../components/CategoryFilterBar";
import { TOP_STOCK_CATEGORIES } from "../utils/assetCategories";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import "../assets-ui.css";

const emptyCell = <span className="asset-empty">—</span>;

const stateLabel = (s: string) =>
  s === "overdue" ? "Overdue" : s === "expiring" ? "Expiring" : "On Support";

const StateBadge = ({ state }: { state: string }) => {
  const tone =
    state === "overdue" ? "disposed" : state === "expiring" ? "expiring" : "stock";
  const label = stateLabel(state);
  return (
    <span className={`asset-badge asset-badge--${tone}`}>
      <span className="asset-badge__dot" />
      {label}
    </span>
  );
};

/** Share of the loan period already elapsed (0–100). */
const elapsedPct = (start?: string, end?: string) => {
  if (!start || !end) return 0;
  const total = dayjs(end).diff(dayjs(start), "day");
  if (total <= 0) return 100;
  const used = dayjs().diff(dayjs(start), "day");
  return Math.max(0, Math.min(100, Math.round((used / total) * 100)));
};

const SupportLoans = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState("");
  const [unit, setUnit] = useState<number | undefined>();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();

  // Unit list restricted to what this user actually has access to. Super Admin
  // (role 1) sees every unit; admins see only their searchAccess units.
  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitLoading } = useGetUnitsQuery({
    status: "active",
  });
  const isSuperAdmin = profile?.data?.role_id === 1;
  const accessUnitIds: number[] =
    profile?.data?.searchAccess?.map((i: any) => i?.unit_id) ?? [];
  const unitOptions = (
    isSuperAdmin
      ? unitData?.data
      : unitData?.data?.filter((u: any) => accessUnitIds.includes(u?.id))
  )?.map((u: any) => ({ value: u.id, label: u.title }));

  const { data, isLoading, isFetching } = useGetSupportLoansQuery({
    ...(state ? { state } : {}),
    ...(unit ? { unit } : {}),
  });
  const [returnLoan, { isLoading: returning }] = useReturnSupportLoanMutation();
  const screens = Grid.useBreakpoint();

  const allRows = data?.data?.length ? data.data : [];

  // Searches asset + holder fields, and filters by category. Both are done
  // client-side because the endpoint returns the full (scoped) list rather
  // than a server-paginated page.
  const hasFilters = Boolean(search.trim() || unit || state || category);
  const q = search.trim().toLowerCase();
  const cat = category?.toLowerCase();

  const matchesSearch = (r: any) =>
    !q ||
    [
      r.serial_number,
      r.asset_no,
      r.po_number,
      r.asset_name,
      r.model,
      r.category,
      r.user_name,
      r.user_id_no,
      r.department,
    ]
      .filter(Boolean)
      .some((v: any) => String(v).toLowerCase().includes(q));

  const rows = allRows.filter((r: any) => {
    // Substring match mirrors the backend's LIKE semantics elsewhere, so a
    // "Camera" chip also catches CAMERA / IP Camera.
    if (cat && !String(r.category ?? "").toLowerCase().includes(cat))
      return false;
    return matchesSearch(r);
  });
  // Names whichever filter emptied the list, so an empty page never reads as
  // "nothing is on support" when it is really "nothing matches Printer".
  const emptyText = q
    ? `No results for "${search}"`
    : category
    ? `No ${category} assets are on support`
    : state
    ? "Nothing in this category"
    : "No assets are currently on support";

  const summary = data?.summary || { total: 0, expiring: 0, overdue: 0 };
  const active = Math.max(summary.total - summary.expiring - summary.overdue, 0);

  const tiles = [
    { key: "", tone: "all", icon: <LaptopOutlined />, label: "Total Issued", value: summary.total, hint: "on support now" },
    { key: "on_support", tone: "active", icon: <ClockCircleOutlined />, label: "On Support", value: active, hint: "within period" },
    { key: "expiring", tone: "expiring", icon: <AlertOutlined />, label: "Expiring", value: summary.expiring, hint: "due within 3 days" },
    { key: "overdue", tone: "overdue", icon: <WarningOutlined />, label: "Overdue", value: summary.overdue, hint: "past return date" },
  ];

  const openAssetDetails = (assetId: number) =>
    dispatch(
      setCommonModal({
        title: "Assets Details",
        content: <AssetDetails id={assetId} />,
        show: true,
        width: 740,
      })
    );

  // A row click opens the asset, but must not fire when the user is actually
  // clicking Extend / Move to Stock or anything inside their popups.
  const isInteractive = (target: HTMLElement | null) =>
    !!target?.closest(
      "button, a, input, .sl-actions, .sl-holder, .ant-popover, .ant-popconfirm, .ant-tooltip"
    );

  const openHolder = (loan: any) =>
    dispatch(
      setCommonModal({
        title: "Employee Details",
        content: <HolderDetails loan={loan} />,
        show: true,
        width: 620,
      })
    );

  const openExtend = (loan: any) =>
    dispatch(
      setCommonModal({
        title: "Extend Support Period",
        content: <ExtendSupportModal loan={loan} />,
        show: true,
        width: screens.sm ? 620 : "94vw",
      })
    );

  const columns = [
    {
      title: "Asset",
      key: "asset",
      width: 230,
      render: (r: any) => (
        <div style={{ minWidth: 0 }}>
          <div className="asset-cell-title">{r.asset_name || r.model}</div>
          <div className="asset-cell-sub">{r.category}</div>
        </div>
      ),
    },
    {
      title: "Serial No",
      dataIndex: "serial_number",
      render: (v: string) => (v ? <span className="asset-mono">{v}</span> : emptyCell),
    },
    {
      title: "Holder",
      key: "holder",
      width: 190,
      render: (r: any) => (
        <Tooltip title="View employee details" getPopupContainer={() => document.body}>
          <button
            type="button"
            className="sl-holder"
            onClick={() => openHolder(r)}
          >
            <div className="asset-cell-title">{r.user_name || emptyCell}</div>
            <div className="asset-mono">{r.user_id_no}</div>
          </button>
        </Tooltip>
      ),
    },
    {
      title: "Period",
      key: "period",
      width: 200,
      render: (r: any) => {
        const pct = elapsedPct(r.assign_date, r.expected_return);
        const danger = r.support_state === "overdue";
        const colour = danger ? "#d92d20" : r.support_state === "expiring" ? "#f79009" : "#1775bb";
        return (
          <div>
            <div style={{ fontSize: 12.5, whiteSpace: "nowrap" }}>
              {r.assign_date ? dayjs(r.assign_date).format("DD MMM") : "—"}
              <span style={{ color: "#d0d5dd", margin: "0 6px" }}>→</span>
              <span style={{ fontWeight: 600, color: "#101828" }}>
                {r.expected_return ? dayjs(r.expected_return).format("DD MMM YYYY") : "—"}
              </span>
            </div>
            <div className="sl-progress">
              <motion.div
                className={`sl-progress__fill ${danger ? "sl-progress__fill--danger" : ""}`}
                style={{ background: danger ? undefined : colour }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: "Remaining",
      dataIndex: "days_left",
      width: 120,
      render: (d: number) => {
        if (d === null || d === undefined) return emptyCell;
        if (d < 0)
          return <span style={{ color: "#b42318", fontWeight: 600 }}>{Math.abs(d)}d overdue</span>;
        if (d === 0) return <span style={{ color: "#b54708", fontWeight: 600 }}>Due today</span>;
        return (
          <span style={{ color: d <= 3 ? "#b54708" : "#475467", fontWeight: d <= 3 ? 600 : 400 }}>
            {d} days left
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "support_state",
      render: (s: string) => <StateBadge state={s} />,
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right" as const,
      width: 210,
      render: (r: any) => (
        <div className="sl-actions">
          <Tooltip title="Extend the support period" getPopupContainer={() => document.body}>
            <Button
              size="small"
              className="sl-btn"
              type={r.support_state === "overdue" ? "primary" : "default"}
              danger={r.support_state === "overdue"}
              icon={<FieldTimeOutlined />}
              onClick={() => openExtend(r)}
            >
              Extend
            </Button>
          </Tooltip>

          <Popconfirm
            title="Move this asset to stock?"
            description="The support period will be closed and the asset returned to stock."
            okText="Yes, move"
            cancelText="Cancel"
            getPopupContainer={() => document.body}
            onConfirm={() => returnLoan({ assignId: r.assign_id })}
          >
            <Tooltip title="Return the asset to stock" getPopupContainer={() => document.body}>
              <Button
                size="small"
                className="sl-btn"
                type="primary"
                loading={returning}
                icon={<InboxOutlined />}
              >
                Move to Stock
              </Button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="asset-ui">
      <Card
        style={{ boxShadow: "0 0 0 1px rgba(0,0,0,.05)", borderRadius: 14 }}
        styles={{ body: { padding: 20 } }}
      >
        {/* Hero */}
        <motion.div
          className="sl-hero"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="sl-hero__title">
            <ClockCircleOutlined style={{ marginRight: 9 }} />
            Assets On Support
          </div>
          <div className="sl-hero__sub">
            Devices issued temporarily for support, and their return dates. Admins are emailed
            3 days before expiry — extend the period or move the asset back to stock.
          </div>
        </motion.div>

        {/* Stat tiles double as the filter */}
        <div className="sl-stats">
          {tiles.map((t, i) => (
            <motion.button
              key={t.key || "all"}
              type="button"
              aria-pressed={state === t.key}
              onClick={() => setState(state === t.key ? "" : t.key)}
              className={`sl-stat sl-stat--${t.tone}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.985 }}
            >
              {state === t.key && (
                <motion.span
                  layoutId="slStatActive"
                  className="sl-stat__bg"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <div className="sl-stat__head">
                <span className="sl-stat__icon">{t.icon}</span>
                <span className="sl-stat__label">{t.label}</span>
              </div>
              <div className="sl-stat__value">{t.value}</div>
              <div className="sl-stat__hint">{t.hint}</div>
            </motion.button>
          ))}
        </div>

        <div className="asset-toolbar">
          <Input
            allowClear
            style={{ width: 240 }}
            prefix={<SearchOutlined />}
            placeholder="Search serial, PO, holder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            allowClear
            showSearch
            style={{ width: 200 }}
            optionFilterProp="label"
            loading={unitLoading}
            placeholder="Select Unit Name"
            value={unit}
            onChange={(v) => setUnit(v)}
            options={unitOptions}
          />
          <ExcelDownload
            excelName={"assets_on_support"}
            excelTableHead={[
              "SL",
              "Asset",
              "Category",
              "Model",
              "Serial No",
              "Asset No",
              "PO No",
              "Holder",
              "Employee ID",
              "Department",
              "Issued On",
              "Return By",
              "Days Left",
              "Status",
            ]}
            excelData={rows.map((r: any, i: number) => ({
              SL: i + 1,
              Asset: r.asset_name || r.model || "",
              Category: r.category || "",
              Model: r.model || "",
              "Serial No": r.serial_number || "",
              "Asset No": r.asset_no || "",
              "PO No": r.po_number || "",
              Holder: r.user_name || "",
              "Employee ID": r.user_id_no || "",
              Department: r.department || "",
              "Issued On": r.assign_date
                ? dayjs(r.assign_date).format("DD-MM-YYYY")
                : "",
              "Return By": r.expected_return
                ? dayjs(r.expected_return).format("DD-MM-YYYY")
                : "",
              "Days Left":
                r.days_left === null || r.days_left === undefined
                  ? ""
                  : r.days_left < 0
                  ? `${Math.abs(r.days_left)} overdue`
                  : r.days_left,
              Status: stateLabel(r.support_state),
            }))}
          />
          {hasFilters && (
            <Button icon={<CloseCircleOutlined />} onClick={() => {
              setSearch("");
              setUnit(undefined);
              setState("");
              setCategory(undefined);
            }}>
              Clear
            </Button>
          )}
        </div>

        {/* Support assets are issued out of stock, so the stock shortlist is
            the right set here. The long tail stays reachable via the search
            box, which already matches on category. */}
        <CategoryFilterBar
          value={category}
          categories={TOP_STOCK_CATEGORIES}
          onChange={setCategory}
        />

        {!screens.md ? (
          /* --- Card layout for phones/small tablets --- */
          <div style={{ display: "grid", gap: 12 }}>
            {isLoading || isFetching ? (
              [1, 2, 3].map((i) => (
                <div className="asset-card" key={i}>
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>
              ))
            ) : rows.length ? (
              rows.map((r: any) => (
                <SupportLoanMobileCard
                  key={r.assign_id}
                  loan={r}
                  pct={elapsedPct(r.assign_date, r.expected_return)}
                  badge={<StateBadge state={r.support_state} />}
                  returning={returning}
                  onOpenAsset={() => openAssetDetails(r.asset_id)}
                  onOpenHolder={() => openHolder(r)}
                  onExtend={() => openExtend(r)}
                  onReturn={() => returnLoan({ assignId: r.assign_id })}
                />
              ))
            ) : (
              <Empty
                description={emptyText}
                style={{ padding: "34px 0" }}
              />
            )}
          </div>
        ) : (
        <Table
          rowKey="assign_id"
          size="small"
          bordered
          className="asset-table"
          sticky
          rowClassName={(r: any) =>
            `asset-row ${r.support_state === "overdue" ? "sl-row--overdue" : ""}`
          }
          onRow={(record: any) => ({
            onClick: (event: any) => {
              if (isInteractive(event.target as HTMLElement)) return;
              openAssetDetails(record.asset_id);
            },
          })}
          loading={isLoading || isFetching}
          dataSource={rows}
          columns={columns}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: (
              <Empty
                description={emptyText}
                style={{ padding: "34px 0" }}
              />
            ),
          }}
          pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (t) => `Total ${t}` }}
        />
        )}
      </Card>
    </div>
  );
};

export default SupportLoans;
