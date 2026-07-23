import {
  BellOutlined,
  EditOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Button, Switch } from "antd";
import dayjs from "dayjs";
import {
  useGetMeQuery,
  useUpdateNotificationPreferenceMutation,
} from "../../app/api/userApi";
import { setCommonModal } from "../../app/slice/modalSlice";
import { useAppDispatch } from "../../app/store/store";
import notification from "../../common/utils/Notification";
import UpdateEmployee from "../../modules/employee/components/UpdateEmployee";
import SeatingLocationModal from "../../modules/employee/components/SeatingLocationModal";
import ChangeEmployeePassword from "./ChangePassword";
import "./profile-ui.css";

const ROLE_LABEL: Record<number, string> = {
  1: "Super Admin",
  2: "Admin",
  3: "Employee",
  4: "Unit Super Admin",
};

/** First letters of the first and last word — "M. A. Quader" → "MQ". */
const initials = (name?: string) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase();
};

const Fact = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="pf-fact">
    <span className="pf-fact__label">{label}</span>
    <span
      className={`pf-fact__value${
        value ? "" : " pf-fact__value--empty"
      }`}
    >
      {value || "Not set"}
    </span>
  </div>
);

const ProfileSection = () => {
  const dispatch = useAppDispatch();
  const { data } = useGetMeQuery();
  const {
    role_id,
    status,
    name,
    email,
    department,
    designation,
    joining_date,
    unit_name,
    employee_id,
    contact_no,
  } = data?.data || {};

  const record = data?.data;

  // Defaults to ON — matches the column default, and keeps the switch correct
  // for any account whose row predates the preference.
  const emailNotification = (data?.data as any)?.email_notification !== 0;
  const [updatePreference, { isLoading: savingPref }] =
    useUpdateNotificationPreferenceMutation();

  const handleNotificationToggle = async (checked: boolean) => {
    try {
      await updatePreference(checked).unwrap();
      notification(
        "success",
        checked
          ? "Email notifications turned on"
          : "Email notifications turned off"
      );
    } catch {
      notification("error", "Could not update notification setting");
    }
  };

  const openModal = (title: string, content: JSX.Element, width: number) =>
    dispatch(setCommonModal({ title, content, show: true, width }));

  return (
    <div className="pf">
      {/* Identity */}
      <div className="pf-card">
        <div className="pf-hero">
          <div className="pf-avatar" aria-hidden="true">
            {initials(name)}
          </div>

          <div className="pf-hero__main">
            <div className="pf-hero__name">{name || "—"}</div>
            <div className="pf-hero__sub">
              {designation || "No designation"}
              {department ? ` · ${department}` : ""}
            </div>
            <div className="pf-hero__tags">
              <span className="pf-chip pf-chip--accent">
                {ROLE_LABEL[Number(role_id)] || "User"}
              </span>
              <span
                className={`pf-chip ${
                  status === 1 ? "pf-chip--ok" : "pf-chip--off"
                }`}
              >
                <span className="pf-chip__dot" />
                {status === 1 ? "Active" : "Inactive"}
              </span>
              {employee_id && (
                <span className="pf-chip">
                  <IdcardOutlined />
                  {employee_id}
                </span>
              )}
            </div>
          </div>

          <div className="pf-hero__actions">
            {role_id !== 1 && (
              <Button
                icon={<EnvironmentOutlined />}
                onClick={() =>
                  openModal(
                    "Seating Location",
                    <SeatingLocationModal employee={record as any} />,
                    600
                  )
                }
              >
                Seating Location
              </Button>
            )}
            <Button
              icon={<LockOutlined />}
              onClick={() =>
                openModal("Change Password", <ChangeEmployeePassword />, 460)
              }
            >
              Change Password
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() =>
                openModal(
                  "Update Profile",
                  <UpdateEmployee employee={record as any} />,
                  678
                )
              }
            >
              Update Profile
            </Button>
          </div>
        </div>

        {/* Details read as a grid of label/value cells rather than fixed-width
            rows, so long emails and unit names no longer collide. */}
        <div className="pf-facts">
          <Fact label="Employee ID" value={employee_id} />
          <Fact label="Email" value={email} />
          <Fact label="Phone" value={contact_no} />
          <Fact label="Designation" value={designation} />
          <Fact label="Department" value={department} />
          <Fact label="Unit" value={unit_name} />
          <Fact
            label="Joining Date"
            value={
              joining_date && dayjs(joining_date).isValid()
                ? dayjs(joining_date).format("DD MMM YYYY")
                : ""
            }
          />
          <Fact label="Role" value={ROLE_LABEL[Number(role_id)]} />
        </div>
      </div>

      {/* Notification preference */}
      <div className="pf-card">
        <div className="pf-card__head">
          <BellOutlined />
          Notification Settings
        </div>
        <div className="pf-card__body">
          <div className="pf-toggle">
            <div style={{ minWidth: 0 }}>
              <div className="pf-toggle__title">Email Notifications</div>
              <div className="pf-toggle__hint">
                Ticket, task and asset emails sent to{" "}
                <strong>{email || "your address"}</strong>. Turning this off
                does not affect password reset or OTP emails.
              </div>
            </div>

            <Switch
              checked={emailNotification}
              loading={savingPref}
              onChange={handleNotificationToggle}
              checkedChildren="On"
              unCheckedChildren="Off"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
