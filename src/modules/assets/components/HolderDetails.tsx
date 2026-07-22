import {
  ApartmentOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "../assets-ui.css";

const Row = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) => (
  <div className="hd-row">
    <span className="hd-row__icon">{icon}</span>
    <div style={{ minWidth: 0 }}>
      <div className="hd-row__label">{label}</div>
      <div className="hd-row__value">
        {value ? value : <span className="asset-empty">—</span>}
      </div>
    </div>
  </div>
);

/** Compact profile of the person currently holding a support asset. */
const HolderDetails = ({ loan }: { loan: any }) => {
  const initials = (loan?.user_name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="asset-ui">
      <div className="hd-head">
        <span className="hd-avatar">{initials}</span>
        <div style={{ minWidth: 0 }}>
          <div className="hd-name">{loan?.user_name || "Employee"}</div>
          <div className="hd-sub">
            {loan?.designation || "—"}
            {loan?.user_id_no ? ` · ${loan.user_id_no}` : ""}
          </div>
        </div>
      </div>

      <div className="hd-grid">
        <Row icon={<ApartmentOutlined />} label="Department" value={loan?.department} />
        <Row icon={<TeamOutlined />} label="Unit" value={loan?.user_unit_name} />
        <Row icon={<MailOutlined />} label="Email" value={loan?.user_email} />
        <Row icon={<PhoneOutlined />} label="Contact" value={loan?.contact_no} />
        <Row icon={<EnvironmentOutlined />} label="Location" value={loan?.user_location} />
        <Row icon={<IdcardOutlined />} label="Grade" value={loan?.grade} />
        <Row icon={<UserOutlined />} label="Line Manager" value={loan?.line_manager_name} />
      </div>
    </div>
  );
};

export default HolderDetails;
