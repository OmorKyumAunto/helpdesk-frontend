import { Button, Popconfirm, Space, Tag, message, Modal } from "antd";
import { TableProps } from "antd/lib";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
  useDemoteToEmployeeMutation,
  useDemoteToUnitAdminMutation,
  usePromoteToSuperAdminMutation,
} from "../api/adminEndPoint";
import AssignCategoryToAdmin from "../../assignCategory/components/AssignCategoryToAdmin";
import AssignLocationToAdmin from "../components/AssignLocationToAdmin";
import { IAdmin } from "../types/adminTypes";

export const UnitAdminTableColumns = (): TableProps<IAdmin>["columns"] => {
  const dispatch = useDispatch();
  const [demote, { isLoading: isDemoting }] = useDemoteToEmployeeMutation();
  const [promoteSuperAdmin] = usePromoteToSuperAdminMutation();
  const [demoteToUnitAdmin] = useDemoteToUnitAdminMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState<string[]>([]);

  const openModal = (title: string, content: React.ReactNode) => {
    dispatch(setCommonModal({ title, content, show: true }));
  };

  const showFullListModal = (title: string, data: string[]) => {
    setModalTitle(title);
    setModalData(data);
    setModalVisible(true);
  };

  const roleColors: Record<number, { label: string; color: string }> = {
    1: { label: "Super Admin", color: "green" },
    2: { label: "Admin", color: "orange" },
    3: { label: "Employee", color: "purple" },
    4: { label: "Unit Super Admin", color: "blue" },
  };

  // Safe renderTagsWithMore for arrays or comma-separated strings
  const renderTagsWithMore = (items: string[] | string | undefined) => {
    if (!items) return null;

    const arr = Array.isArray(items)
      ? items
      : items.split(",").map((i) => i.trim());

    const max = 3;

    return (
      <>
        {arr.slice(0, max).map((item, i) => (
          <Tag key={i} color="blue">
            {item}
          </Tag>
        ))}
        {arr.length > max && (
          <Tag
            color="default"
            onClick={() => showFullListModal("Full List", arr)}
            style={{ cursor: "pointer" }}
          >
            +{arr.length - max} more
          </Tag>
        )}
      </>
    );
  };

  return [
    { title: "Admin ID", dataIndex: "employee_id", key: "employee_id" },
    { title: "Admin Name", dataIndex: "name", key: "name" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Designation", dataIndex: "designation", key: "designation" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Contact No", dataIndex: "contact_no", key: "contact_no" },
    { title: "Location", dataIndex: "unit_name", key: "unit_name" },
    {
      title: "Asset Units",
      dataIndex: "asset_unit_titles",
      key: "asset_unit_titles",
      render: (items) => renderTagsWithMore(items),
    },
    {
      title: "Ticket Categories",
      dataIndex: "ticket_category_titles",
      key: "ticket_category_titles",
      render: (items) => renderTagsWithMore(items),
    },
    {
      title: "Seating Locations",
      dataIndex: "seating_location_titles",
      key: "seating_location_titles",
      render: (items) => renderTagsWithMore(items),
    },

    {
      title: "Role",
      key: "role",
      render: (record) => {
        const role = roleColors[record.role_id];
        return role ? <Tag color={role.color}>{role.label}</Tag> : null;
      },
    },

    {
      title: "Actions",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button
            size="small"
            type="primary"
            onClick={() =>
              openModal(
                "Assign Location",
                <AssignLocationToAdmin id={record.id} />
              )
            }
          >
            Assign Location
          </Button>


          <Button
            size="small"
            type="primary"
            onClick={() =>
              openModal(
                "Assign Category",
                <AssignCategoryToAdmin
                  id={record.id} // <-- use the correct field
                  assign_category={record?.assign_category}
                />
              )
            }
          >
            Assign Category
          </Button>


          <Popconfirm
            title="Remove the admin"
            description="Are you sure to remove this admin?"
            onConfirm={async () => {
              try {
                await demote(record.id).unwrap();
                message.success("Admin removed successfully");
              } catch {
                message.error("Failed to remove admin");
              }
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" type="primary" danger loading={isDemoting}>
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    },

    // Scrollable modal for full list view
    {
      title: "",
      key: "modal",
      render: () => (
        <Modal
          title={modalTitle}
          open={modalVisible}
          footer={null}
          onCancel={() => setModalVisible(false)}
        >
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {modalData.map((item, i) => (
              <Tag key={i} color="blue" style={{ marginBottom: 4 }}>
                {item}
              </Tag>
            ))}
          </div>
        </Modal>
      ),
    },
  ];
};
