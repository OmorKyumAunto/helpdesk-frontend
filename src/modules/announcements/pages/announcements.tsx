import { useState } from "react";
import { Table, Button, Pagination, Spin, Space, Popconfirm, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useGetAnnouncementsQuery, useDeleteAnnouncementMutation } from "../api/announcementEndPoint";
import { Announcement } from "../types/announcementTypes";
import CreateAnnouncement from "../components/CreateAnnouncements";
import ViewAnnouncementModal from "../components/ViewAnnouncementModal";
import dayjs from "dayjs";
import { useGetMeQuery } from "../../../app/api/userApi";

const AnnouncementsTable = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const limit = 10;
    const offset = (page - 1) * limit;
    const { data: profile } = useGetMeQuery();

    const { data, isLoading, isFetching } = useGetAnnouncementsQuery({ limit, offset });
    const [deleteAnnouncement] = useDeleteAnnouncementMutation();
    const [viewModal, setViewModal] = useState<Announcement | null>(null);

    const announcements = data?.data || [];
    const total = data?.count || 0;

    const handleCreate = () => {
        dispatch(
            setCommonModal({
                title: "Create New Announcement",
                content: <CreateAnnouncement />,
                show: true,
                width: 600,
            })
        );
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteAnnouncement(id).unwrap();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const getPriorityTag = (priority: "low" | "medium" | "high") => {
        const colors = { high: "red", medium: "orange", low: "green" };
        return <Tag color={colors[priority]}>{priority.toUpperCase()}</Tag>;
    };

    const columns: ColumnsType<Announcement> = [
        { title: "Title", dataIndex: "title", key: "title", render: (text: string) => <strong>{text}</strong>, width: 200, ellipsis: true },
        ...(profile?.data?.role_id !== 4
            ? [
                {
                    title: "Unit",
                    dataIndex: "unit_name",
                    key: "unit_name",
                    width: 150,
                    ellipsis: true,
                    render: (_: any, record: Announcement) =>
                        record.unit_id === null ? "All Units" : record.unit_name,
                },
            ]
            : []),
        { title: "Date", dataIndex: "announcement_date", key: "announcement_date", render: (date: string) => dayjs(date).format("YYYY-MM-DD"), width: 120 },
        { title: "Break Time", dataIndex: "break_time", key: "break_time", width: 120 },
        { title: "Priority", dataIndex: "priority", key: "priority", render: (priority: "low" | "medium" | "high") => getPriorityTag(priority), width: 120 },
        {
            title: "Actions",
            key: "actions",
            width: 180,
            fixed: "right",
            render: (_: any, record: Announcement) => (
                <Space>
                    <Button
                        type="default"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => setViewModal(record)}
                    >
                        View
                    </Button>

                    {!(profile?.data?.role_id === 4 && record.unit_id === null) && (
                        <Popconfirm
                            title="Are you sure delete this announcement?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger icon={<DeleteOutlined />} size="small">
                                Delete
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>📢 Announcements</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>New</Button>
            </div>

            {/* Table */}
            {isLoading || isFetching ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <Table<Announcement>
                        columns={columns}
                        dataSource={announcements}
                        rowKey="id"
                        bordered
                        pagination={false}
                        scroll={{ x: 900 }}
                    />

                    {/* Pagination bottom-left */}
                    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                        <Pagination current={page} pageSize={limit} total={total} onChange={setPage} showSizeChanger={false} />
                    </div>
                </>
            )}

            {/* Separate View Modal */}
            <ViewAnnouncementModal visible={!!viewModal} announcement={viewModal} onClose={() => setViewModal(null)} />
        </div>
    );
};

export default AnnouncementsTable;
