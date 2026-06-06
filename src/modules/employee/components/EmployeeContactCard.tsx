import {
  CopyOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import { message, Tooltip, Typography } from "antd";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { IEmployee } from "../types/employeeTypes";
import { avatarGradient, getAvatarColor, getInitials, LINE, LINE_SOFT } from "../utils/avatar";

const { Text } = Typography;

const copyToClipboard = (text: string, label = "Copied") => {
  navigator.clipboard?.writeText(text);
  message.success(`${label}`);
};

const roleLabel = (roleId: number): string | null => {
  if (roleId === 1) return "Super Admin";
  if (roleId === 2) return "Admin";
  if (roleId === 3) return "Employee";
  return null;
};

const InfoRow = ({
  icon,
  children,
  href,
  copyable,
  copyText,
}: {
  icon: ReactNode;
  children: ReactNode;
  href?: string;
  copyable?: boolean;
  copyText?: string;
}) => {
  if (!children) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0, color: "#475467", fontSize: 13 }}>
      <span style={{ color: "#98A2B3", flexShrink: 0, lineHeight: 0, fontSize: 13 }}>{icon}</span>
      {href ? (
        <a
          href={href}
          onClick={(e) => e.stopPropagation()}
          style={{ color: "#475467", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {children}
        </a>
      ) : copyable ? (
        <Text copyable={{ text: String(children) }} style={{ color: "#475467", fontSize: 13 }}>
          {children}
        </Text>
      ) : (
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{children}</span>
      )}
      {copyText && (
        <Tooltip title="Copy email">
          <CopyOutlined
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(copyText, "Email copied");
            }}
            style={{ marginLeft: "auto", color: "#98A2B3", cursor: "pointer", flexShrink: 0 }}
          />
        </Tooltip>
      )}
    </div>
  );
};

const chipBase: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 600,
  padding: "3px 10px",
  borderRadius: 999,
  lineHeight: "16px",
};

const avatarVariants = { hover: { scale: 1.08 } };

type TProps = {
  employee: IEmployee;
  actions?: ReactNode;
  onView?: () => void;
};

const EmployeeContactCard = ({ employee, actions, onView }: TProps) => {
  const color = getAvatarColor(employee.name || employee.employee_id);
  const isActive = employee.status === 1;
  const role = roleLabel(employee.role_id);

  const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] as const } },
    hover: {
      y: -5,
      boxShadow: `0 18px 36px ${color.fg}26`,
      transition: { type: "spring", stiffness: 380, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      onClick={onView}
      style={{
        position: "relative",
        borderRadius: 16,
        background: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: onView ? "pointer" : "default",
        border: `1px solid ${LINE}`,
        boxShadow: "0 1px 2px rgba(16,24,40,.05)",
      }}
    >
      {/* Colored band */}
      <div
        style={{
          height: 58,
          flexShrink: 0,
          background: `linear-gradient(135deg, ${color.bg} 0%, ${color.from}26 100%)`,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontWeight: 650,
            padding: "3px 10px",
            borderRadius: 999,
            background: "rgba(255,255,255,.85)",
            color: isActive ? "#067647" : "#667085",
          }}
        >
          {isActive ? (
            <motion.span
              initial={{ boxShadow: "0 0 0 0 rgba(22,163,74,.5)" }}
              animate={{ boxShadow: "0 0 0 5px rgba(22,163,74,0)" }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A" }}
            />
          ) : (
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#CBD5E1" }} />
          )}
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Avatar — absolutely positioned so flex can never clip it */}
      <motion.div
        variants={avatarVariants}
        style={{
          position: "absolute",
          top: 30,
          left: 16,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: avatarGradient(color),
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 680,
          fontSize: 19,
          border: "3px solid #fff",
          boxShadow: `0 6px 14px ${color.fg}45`,
          zIndex: 2,
        }}
      >
        {getInitials(employee.name)}
      </motion.div>

      <div style={{ padding: "36px 16px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Identity */}
        <div
          style={{
            fontWeight: 660,
            fontSize: 15.5,
            color: "#101828",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={employee.name}
        >
          {employee.name || "—"}
        </div>
        <div
          style={{
            color: "#667085",
            fontSize: 13,
            marginTop: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={employee.designation}
        >
          {employee.designation || "—"}
        </div>

        {/* Chips */}
        <div style={{ display: "flex", gap: 6, marginTop: 11, flexWrap: "wrap" }}>
          {employee.department && (
            <span style={{ ...chipBase, background: color.bg, color: color.fg }}>
              {employee.department}
            </span>
          )}
          {role && <span style={{ ...chipBase, background: LINE_SOFT, color: "#475467" }}>{role}</span>}
        </div>

        <div style={{ height: 1, background: LINE_SOFT, margin: "14px 0 12px" }} />

        {/* Contact info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
          <InfoRow icon={<IdcardOutlined />} copyable>
            {employee.employee_id}
          </InfoRow>
          <InfoRow icon={<PhoneOutlined />} href={employee.contact_no ? `tel:${employee.contact_no}` : undefined}>
            {employee.contact_no}
          </InfoRow>
          {employee.pabx ? (
            <InfoRow icon={<PushpinOutlined />}>PABX&nbsp;·&nbsp;{employee.pabx}</InfoRow>
          ) : null}
          <InfoRow
            icon={<MailOutlined />}
            href={employee.email ? `mailto:${employee.email}` : undefined}
            copyText={employee.email || undefined}
          >
            {employee.email}
          </InfoRow>
          <InfoRow icon={<EnvironmentOutlined />}>{employee.unit_name}</InfoRow>
        </div>

        {/* Actions */}
        {actions && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              alignItems: "center",
              borderTop: `1px solid ${LINE_SOFT}`,
              marginTop: 14,
              paddingTop: 12,
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EmployeeContactCard;
