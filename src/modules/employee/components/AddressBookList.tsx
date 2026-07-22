import { CopyOutlined } from "@ant-design/icons";
import { Empty, message, Pagination, Skeleton, Tooltip } from "antd";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { IEmployee } from "../types/employeeTypes";
import { avatarGradient, getAvatarColor, getInitials, LINE, LINE_SOFT } from "../utils/avatar";

type TProps = {
  data: IEmployee[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: string[];
  onPageChange: (page: number, pageSize: number) => void;
  renderActions?: (employee: IEmployee) => ReactNode;
  onView?: (employee: IEmployee) => void;
};

const COLS = "2.4fr 1.3fr 2fr 1.4fr 0.9fr minmax(120px, auto)";

const cellEllipsis: React.CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const chipBase: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 600,
  padding: "3px 10px",
  borderRadius: 999,
  display: "inline-block",
};

const StatusPill = ({ active }: { active: boolean }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      fontWeight: 600,
      padding: "3px 10px",
      borderRadius: 999,
      background: active ? "#ECFDF3" : LINE_SOFT,
      color: active ? "#067647" : "#667085",
    }}
  >
    {active ? (
      <motion.span
        initial={{ boxShadow: "0 0 0 0 rgba(22,163,74,.45)" }}
        animate={{ boxShadow: "0 0 0 5px rgba(22,163,74,0)" }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A" }}
      />
    ) : (
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#98A2B3" }} />
    )}
    {active ? "Active" : "Inactive"}
  </span>
);

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const } },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.02 } },
};

const AddressBookList = ({
  data,
  loading,
  page,
  pageSize,
  total,
  pageSizeOptions = ["50", "100", "200", "300", "500"],
  onPageChange,
  renderActions,
  onView,
}: TProps) => {
  if (loading) {
    return (
      <div style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: 16 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!data.length) {
    return <Empty style={{ padding: "56px 0" }} description="No employees found" />;
  }

  return (
    <>
      <style>{`.ab-list-row{transition:background-color .12s ease}.ab-list-row:hover{background-color:#FBFCFE}`}</style>
      <div
        style={{
          border: `1px solid ${LINE}`,
          borderRadius: 12,
          overflowX: "auto",
        }}
      >
        <div style={{ minWidth: 860 }}>
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: COLS,
              gap: 14,
              padding: "12px 18px",
              fontSize: 11,
              fontWeight: 680,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              color: "#98A2B3",
              borderBottom: `1px solid ${LINE}`,
              background: "#FCFCFD",
            }}
          >
            <div>Employee</div>
            <div>Department</div>
            <div>Contact</div>
            <div>Location</div>
            <div>Status</div>
            <div style={{ textAlign: "right" }}>Actions</div>
          </div>

          {/* Rows */}
          <motion.div variants={containerVariants} initial="hidden" animate="show" key={`${page}-${pageSize}`}>
            {data.map((emp) => {
              const isActive = emp.status === 1;
              const color = getAvatarColor(emp.name || emp.employee_id);
              return (
                <motion.div
                  key={emp.id}
                  className="ab-list-row"
                  variants={rowVariants}
                  role={onView ? "button" : undefined}
                  tabIndex={onView ? 0 : undefined}
                  // Clicking a row opens the details view, unless the click
                  // landed on an action control inside the row.
                  onClick={
                    onView
                      ? (e) => {
                          const target = e.target as HTMLElement;
                          if (
                            target.closest(
                              "button, a, input, .ant-switch, .ant-popover, .ant-tooltip"
                            )
                          )
                            return;
                          onView(emp);
                        }
                      : undefined
                  }
                  onKeyDown={
                    onView
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onView(emp);
                          }
                        }
                      : undefined
                  }
                  style={{
                    display: "grid",
                    gridTemplateColumns: COLS,
                    gap: 14,
                    padding: "13px 18px",
                    alignItems: "center",
                    borderBottom: `1px solid ${LINE_SOFT}`,
                    fontSize: 13.5,
                    cursor: onView ? "pointer" : undefined,
                  }}
                >
                  {/* Employee */}
                  <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: avatarGradient(color),
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 680,
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(emp.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: "#101828", ...cellEllipsis }} title={emp.name}>
                        {emp.name || "—"}
                      </div>
                      <div style={{ fontSize: 12, color: "#667085", ...cellEllipsis }}>
                        {emp.designation || "—"}
                        {emp.employee_id ? ` · ${emp.employee_id}` : ""}
                      </div>
                    </div>
                  </div>

                  {/* Department */}
                  <div style={cellEllipsis}>
                    {emp.department ? (
                      <span style={{ ...chipBase, background: color.bg, color: color.fg }}>
                        {emp.department}
                      </span>
                    ) : (
                      "—"
                    )}
                  </div>

                  {/* Contact */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: "#344054", ...cellEllipsis }}>{emp.contact_no || "—"}</div>
                    {emp.email && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                        <span style={{ fontSize: 12.5, color: "#667085", ...cellEllipsis }}>{emp.email}</span>
                        <Tooltip title="Copy email">
                          <CopyOutlined
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard?.writeText(emp.email);
                              message.success("Email copied");
                            }}
                            style={{ color: "#98A2B3", cursor: "pointer", flexShrink: 0, fontSize: 12 }}
                          />
                        </Tooltip>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div style={{ color: "#475467", ...cellEllipsis }} title={emp.unit_name}>
                    {emp.unit_name || "—"}
                  </div>

                  {/* Status */}
                  <div>
                    <StatusPill active={isActive} />
                  </div>

                  {/* Actions */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}
                  >
                    {renderActions?.(emp)}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          pageSizeOptions={pageSizeOptions}
          onChange={onPageChange}
          showTotal={(t) => `Total ${t}`}
        />
      </div>
    </>
  );
};

export default AddressBookList;
