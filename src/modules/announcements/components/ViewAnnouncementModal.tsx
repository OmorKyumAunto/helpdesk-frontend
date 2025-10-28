import { Modal, Tag } from "antd";
import { Announcement } from "../types/announcementTypes";
import dayjs from "dayjs";

interface Props {
  visible: boolean;
  announcement: Announcement | null;
  onClose: () => void;
}

const getPriorityTag = (priority: "low" | "medium" | "high") => {
  const colors = { high: "red", medium: "orange", low: "green" };
  return <Tag color={colors[priority]}>{priority.toUpperCase()}</Tag>;
};

const ViewAnnouncementModal: React.FC<Props> = ({ visible, announcement, onClose }) => {
  if (!announcement) return null;

  return (
    <Modal
      visible={visible}
      title={announcement.title}
      footer={null}
      onCancel={onClose}
      width={500}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <strong>Description:</strong>
          <p style={{ margin: "4px 0 0 0", padding: "8px", background: "#f5f5f5", borderRadius: 4 }}>
            {announcement.description}
          </p>
        </div>
        <div>
          <strong>Unit:</strong> <span>{announcement.unit_name}</span>
        </div>
        <div>
          <strong>Date:</strong> <span>{dayjs(announcement.announcement_date).format("YYYY-MM-DD")}</span>
        </div>
        <div>
          <strong>Break Time:</strong> <span>{announcement.break_time}</span>
        </div>
        <div>
          <strong>Priority:</strong> {getPriorityTag(announcement.priority)}
        </div>
        <div>
          <strong>Created By:</strong> <span>{announcement.created_by_name} ({announcement.created_by_employee_id})</span>
        </div>
      </div>
    </Modal>
  );
};

export default ViewAnnouncementModal;
