import {
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  LaptopOutlined,
  SearchOutlined,
  ToolOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Empty,
  Grid,
  Input,
  Select,
  Skeleton,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
  useGetRepairsQuery,
} from "../api/assetsEndPoint";
import ExtendRepairModal from "../components/ExtendRepairModal";
import ReturnRepairModal from "../components/ReturnRepairModal";
import AssetDetails from "../components/AssetDetails";
import CategoryFilterBar from "../components/CategoryFilterBar";
import SerialCopy from "../components/SerialCopy";
import { TOP_STOCK_CATEGORIES } from "../utils/assetCategories";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import "../assets-ui.css";

const emptyCell = <span className="asset-empty">—</span>;

const SERVICE_LABEL: Record<string, string> = {
  repair: "Repair",
  warranty: "Warranty",
  preventive: "Preventive",
  other: "Other",
};
const serviceLabel = (t?: string) => SERVICE_LABEL[t || "repair"] || "Repair";

const stateLabel = (s: string) =>
  s === "overdue" ? "Overdue" : s === "expiring" ? "Expiring" : "In Repair";

const StateBadge = ({ state }: { state: string }) => {
  const tone =
    state === "overdue" ? "disposed" : state === "expiring" ? "expiring" : "stock";
  return (
    <span className={`asset-badge asset-badge--${tone}`}>
      <span className="asset-badge__dot" />
      {stateLabel(state)}
    </span>
  );
};

const money = (v: any) =>
  v === null || v === undefined || v === ""
    ? ""
    : `৳${Number(v).toLocaleString()}`;

/** Share of the expected repair window already elapsed (0–100). */
const elapsedPct = (start?: string, end?: string) => {
  if (!start || !end) return 0;
  const total = dayjs(end).diff(dayjs(start), "day");
  if (total <= 0) return 100;
  const used = dayjs().diff(dayjs(start), "day");
  return Math.max(0, Math.min(100, Math.round((used / total) * 100)));
};

const UnderRepair = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState("");
  const [unit, setUnit] = useState<number | undefined>();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();

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

  const { data, isLoading, isFetching } = useGetRepairsQuery({
    ...(state ? { state } : {}),
    ...(unit ? { unit } : {}),
  });
  const screens = Grid.useBreakpoint();

  const allRows = data?.data?.length ? data.data : [];

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
      r.vendor_name,
      r.held_user_name,
      r.held_user_id_no,
    ]
      .filter(Boolean)
      .some((v: any) => String(v).toLowerCase().includes(q));

  const rows = allRows.filter((r: any) => {
    if (cat && !String(r.category ?? "").toLowerCase().includes(cat)) return false;
    return matchesSearch(r);
  });

  const emptyText = q
    ? `No results for "${search}"`
    : category
    ? `No ${category} assets are under repair`
    : state
    ? "Nothing in this category"
    : "No assets are currently under repair";

  const summary = data?.summary || { total: 0, expiring: 0, overdue: 0 };
  const active = Math.max(summary.total - summary.expiring - summary.overdue, 0);

  const tiles = [
    { key: "", tone: "all", icon: <LaptopOutlined />, label: "Total at Vendor", value: summary.total, hint: "under repair now" },
    { key: "in_repair", tone: "active", icon: <ToolOutlined />, label: "In Repair", value: active, hint: "within window" },
    { key: "expiring", tone: "expiring", icon: <AlertOutlined />, label: "Due Soon", value: summary.expiring, hint: "within 3 days" },
    { key: "overdue", tone: "overdue", icon: <WarningOutlined />, label: "Overdue", value: summary.overdue, hint: "past expected date" },
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

  const isInteractive = (target: HTMLElement | null) =>
    !!target?.closest(
      "button, a, input, .sl-actions, .ant-popover, .ant-popconfirm, .ant-tooltip"
    );

  const openExtend = (repair: any) =>
    dispatch(
      setCommonModal({
        title: "Extend Repair Period",
        content: <ExtendRepairModal repair={repair} />,
        show: true,
        width: screens.sm ? 620 : "94vw",
      })
    );

  const openReturn = (repair: any) =>
    dispatch(
      setCommonModal({
        title: "Mark Back from Repair",
        content: <ReturnRepairModal repair={repair} />,
        show: true,
        width: screens.sm ? 460 : "94vw",
      })
    );

  const vendorCell = (r: any) => (
    <Tooltip
      title={
        r.vendor_contact || r.vendor_address ? (
          <div style={{ fontSize: 12.5, lineHeight: 1.6 }}>
            {r.vendor_contact && (
              <div>
                <strong>Contact:</strong> {r.vendor_contact}
              </div>
            )}
            {r.vendor_address && (
              <div>
                <strong>Address:</strong> {r.vendor_address}
              </div>
            )}
          </div>
        ) : undefined
      }
      getPopupContainer={() => document.body}
    >
      <div style={{ minWidth: 0 }}>
        <div className="asset-cell-title">{r.vendor_name || emptyCell}</div>
        <div className="asset-cell-sub">
          <Tag color="blue" style={{ marginInlineEnd: 6 }}>
            {serviceLabel(r.service_type)}
          </Tag>
          {money(r.estimated_cost)}
        </div>
      </div>
    </Tooltip>
  );

  const columns = [
    {
      title: "Asset",
      key: "asset",
      width: 220,
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
      render: (v: string) => <SerialCopy value={v} />,
    },
    {
      title: "Vendor",
      key: "vendor",
      width: 200,
      render: vendorCell,
    },
    {
      title: "From",
      key: "from",
      width: 150,
      render: (r: any) =>
        r.held_user_name ? (
          <div style={{ minWidth: 0 }}>
            <div className="asset-cell-title">{r.held_user_name}</div>
            <div className="asset-mono">{r.held_user_id_no}</div>
          </div>
        ) : (
          <Tag>Stock</Tag>
        ),
    },
    {
      title: "Period",
      key: "period",
      width: 200,
      render: (r: any) => {
        const pct = elapsedPct(r.sent_date, r.expected_return);
        const danger = r.repair_state === "overdue";
        const colour = danger ? "#d92d20" : r.repair_state === "expiring" ? "#f79009" : "#1775bb";
        return (
          <div>
            <div style={{ fontSize: 12.5, whiteSpace: "nowrap" }}>
              {r.sent_date ? dayjs(r.sent_date).format("DD MMM") : "—"}
              <span style={{ color: "#d0d5dd", margin: "0 6px" }}>→</span>
              <span style={{ fontWeight: 600, color: "#101828" }}>
                {r.expected_return ? dayjs(r.expected_return).format("DD MMM YYYY") : "No ETA"}
              </span>
            </div>
            {r.expected_return && (
              <div className="sl-progress">
                <motion.div
                  className={`sl-progress__fill ${danger ? "sl-progress__fill--danger" : ""}`}
                  style={{ background: danger ? undefined : colour }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            )}
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
      dataIndex: "repair_state",
      render: (s: string) => <StateBadge state={s} />,
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right" as const,
      width: 210,
      render: (r: any) => (
        <div className="sl-actions">
          <Tooltip title="Extend the repair period" getPopupContainer={() => document.body}>
            <Button
              size="small"
              className="sl-btn"
              type={r.repair_state === "overdue" ? "primary" : "default"}
              danger={r.repair_state === "overdue"}
              icon={<FieldTimeOutlined />}
              onClick={() => openExtend(r)}
            >
              Extend
            </Button>
          </Tooltip>

          <Tooltip title="Mark the device back from the vendor" getPopupContainer={() => document.body}>
            <Button
              size="small"
              className="sl-btn"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => openReturn(r)}
            >
              Mark Back
            </Button>
          </Tooltip>
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
        <motion.div
          className="sl-hero"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="sl-hero__title">
            <ToolOutlined style={{ marginRight: 9 }} />
            Assets Under Repair
          </div>
          <div className="sl-hero__sub">
            Devices out at a vendor for servicing, and when they're expected back.
            Admins are emailed 3 days before the due date — extend the period or
            mark the device back when it returns.
          </div>
        </motion.div>

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
                  layoutId="rpStatActive"
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
            placeholder="Search serial, vendor, holder..."
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
            excelName={"assets_under_repair"}
            excelTableHead={[
              "SL",
              "Asset",
              "Category",
              "Model",
              "Serial No",
              "Asset No",
              "Vendor",
              "Service Type",
              "Vendor Contact",
              "Vendor Address",
              "From (Employee)",
              "Sent On",
              "Expected Back",
              "Days Left",
              "Est. Cost",
              "Status",
              "Issue Note",
            ]}
            excelData={rows.map((r: any, i: number) => ({
              SL: i + 1,
              Asset: r.asset_name || r.model || "",
              Category: r.category || "",
              Model: r.model || "",
              "Serial No": r.serial_number || "",
              "Asset No": r.asset_no || "",
              Vendor: r.vendor_name || "",
              "Service Type": serviceLabel(r.service_type),
              "Vendor Contact": r.vendor_contact || "",
              "Vendor Address": r.vendor_address || "",
              "From (Employee)": r.held_user_name
                ? `${r.held_user_name} (${r.held_user_id_no || ""})`
                : "Stock",
              "Sent On": r.sent_date ? dayjs(r.sent_date).format("DD-MM-YYYY") : "",
              "Expected Back": r.expected_return
                ? dayjs(r.expected_return).format("DD-MM-YYYY")
                : "",
              "Days Left":
                r.days_left === null || r.days_left === undefined
                  ? ""
                  : r.days_left < 0
                  ? `${Math.abs(r.days_left)} overdue`
                  : r.days_left,
              "Est. Cost": r.estimated_cost ?? "",
              Status: stateLabel(r.repair_state),
              "Issue Note": r.issue_note || "",
            }))}
          />
          {hasFilters && (
            <Button
              icon={<CloseCircleOutlined />}
              onClick={() => {
                setSearch("");
                setUnit(undefined);
                setState("");
                setCategory(undefined);
              }}
            >
              Clear
            </Button>
          )}
        </div>

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
                <div
                  className="asset-card"
                  key={r.repair_id}
                  onClick={() => openAssetDetails(r.asset_id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <div className="asset-cell-title">{r.asset_name || r.model}</div>
                      <div className="asset-cell-sub">
                        {r.category}
                        {r.serial_number ? ` · ${r.serial_number}` : ""}
                      </div>
                    </div>
                    <StateBadge state={r.repair_state} />
                  </div>
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: 12.5 }}>
                    <span><strong>Vendor:</strong> {r.vendor_name}</span>
                    <span><Tag color="blue">{serviceLabel(r.service_type)}</Tag></span>
                    {r.estimated_cost != null && <span>{money(r.estimated_cost)}</span>}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12.5 }}>
                    <strong>From:</strong>{" "}
                    {r.held_user_name ? `${r.held_user_name} (${r.held_user_id_no})` : "Stock"}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12.5 }}>
                    {r.sent_date ? dayjs(r.sent_date).format("DD MMM") : "—"}
                    <span style={{ color: "#d0d5dd", margin: "0 6px" }}>→</span>
                    {r.expected_return ? dayjs(r.expected_return).format("DD MMM YYYY") : "No ETA"}
                  </div>
                  <div
                    className="sl-actions"
                    style={{ marginTop: 12 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button size="small" icon={<FieldTimeOutlined />} onClick={() => openExtend(r)}>
                      Extend
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={() => openReturn(r)}
                    >
                      Mark Back
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <Empty description={emptyText} style={{ padding: "34px 0" }} />
            )}
          </div>
        ) : (
          <Table
            rowKey="repair_id"
            size="small"
            bordered
            className="asset-table"
            sticky
            rowClassName={(r: any) =>
              `asset-row ${r.repair_state === "overdue" ? "sl-row--overdue" : ""}`
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
              emptyText: <Empty description={emptyText} style={{ padding: "34px 0" }} />,
            }}
            pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (t) => `Total ${t}` }}
          />
        )}
      </Card>
    </div>
  );
};

export default UnderRepair;
