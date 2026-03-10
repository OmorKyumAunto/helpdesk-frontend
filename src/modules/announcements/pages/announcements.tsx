import { useState } from "react";
import { Table, Button, Pagination, Spin, Space, Popconfirm, Tag, Card, Input, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { PlusOutlined, EyeOutlined, DeleteOutlined, SearchOutlined, BellOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useGetAnnouncementsQuery, useDeleteAnnouncementMutation } from "../api/announcementEndPoint";
import { Announcement } from "../types/announcementTypes";
import CreateAnnouncement from "../components/CreateAnnouncements";
import ViewAnnouncementModal from "../components/ViewAnnouncementModal";
import dayjs from "dayjs";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useNavigate } from "react-router-dom";

const AnnouncementsTable = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const limit = 10;
    const offset = (page - 1) * limit;
    const { data: profile } = useGetMeQuery();
    const navigate = useNavigate();

    const { data, isLoading, isFetching } = useGetAnnouncementsQuery({ limit, offset });
    const [deleteAnnouncement] = useDeleteAnnouncementMutation();
    const [viewModal, setViewModal] = useState<Announcement | null>(null);

    const announcements = data?.data || [];
    const total = data?.count || 0;

    const handleCreate = () => {
        navigate("/announcements/create");
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteAnnouncement(id).unwrap();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const getPriorityTag = (priority: "low" | "medium" | "high") => {
        const config = {
            high: { color: "red", label: "High" },
            medium: { color: "orange", label: "Medium" },
            low: { color: "green", label: "Low" }
        };
        return <Tag color={config[priority].color}>{config[priority].label}</Tag>;
    };

    const columns: ColumnsType<Announcement> = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: 250,
            ellipsis: true,
            render: (text: string) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BellOutlined style={{ color: "#1890ff", fontSize: 16 }} />
                    <span style={{ fontWeight: 500, color: "#262626" }}>{text}</span>
                </div>
            )
        },
        ...(profile?.data?.role_id !== 4
            ? [
                {
                    title: "Unit",
                    dataIndex: "unit_name",
                    key: "unit_name",
                    width: 150,
                    ellipsis: true,
                    render: (_: any, record: Announcement) => (
                        <Tag color={record.unit_id === null ? "blue" : "default"}>
                            {record.unit_id === null ? "All Units" : record.unit_name}
                        </Tag>
                    ),
                },
            ]
            : []),
        {
            title: "Date",
            dataIndex: "announcement_date",
            key: "announcement_date",
            width: 120,
            render: (date: string) => (
                <span style={{ color: "#595959" }}>{dayjs(date).format("MMM DD, YYYY")}</span>
            )
        },
        {
            title: "Break Time",
            dataIndex: "break_time",
            key: "break_time",
            width: 120,
            render: (time: string) => <span style={{ color: "#595959" }}>{time}</span>
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            width: 110,
            render: (priority: "low" | "medium" | "high") => getPriorityTag(priority)
        },
        {
            title: "Actions",
            key: "actions",
            width: 180,
            fixed: "right",
            render: (_: any, record: Announcement) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => setViewModal(record)}
                        style={{ color: "#1890ff" }}
                    >
                        View
                    </Button>

                    {!(profile?.data?.role_id === 4 && record.unit_id === null) && (
                        <Popconfirm
                            title="Delete Announcement"
                            description="Are you sure you want to delete this announcement?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                        >
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                            >
                                Delete
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
            <Card 
                bordered={false}
                style={{ 
                    borderRadius: 12,
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)"
                }}
            >
                {/* Header Section */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 16
                    }}>
                        <div>
                            <h2 style={{ 
                                margin: 0, 
                                fontSize: 24, 
                                fontWeight: 600,
                                color: "#262626",
                                display: "flex",
                                alignItems: "center",
                                gap: 8
                            }}>
                                <BellOutlined style={{ color: "#1890ff" }} />
                                Announcements
                            </h2>
                            <p style={{ margin: "4px 0 0 0", color: "#8c8c8c", fontSize: 14 }}>
                                Manage and View All Announcements
                            </p>
                        </div>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={handleCreate}
                            size="large"
                            style={{ borderRadius: 6 }}
                        >
                            New Announcement
                        </Button>
                    </div>
                </div>

                {/* Table Section */}
                {isLoading || isFetching ? (
                    <div style={{ 
                        textAlign: "center", 
                        padding: "80px 0",
                        background: "#fafafa",
                        borderRadius: 8
                    }}>
                        <Spin size="large" />
                        <p style={{ marginTop: 16, color: "#8c8c8c" }}>Loading announcements...</p>
                    </div>
                ) : (
                    <>
                        <Table<Announcement>
                            columns={columns}
                            dataSource={announcements}
                            rowKey="id"
                            pagination={false}
                            scroll={{ x: 900 }}
                            style={{ borderRadius: 8 }}
                            rowClassName={() => "hover-row"}
                        />

                        {/* Pagination */}
                        <div style={{ 
                            marginTop: 24, 
                            display: "flex", 
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 16
                        }}>
                            <span style={{ color: "#8c8c8c", fontSize: 14 }}>
                                Showing {announcements.length > 0 ? offset + 1 : 0} to {Math.min(offset + limit, total)} of {total} announcements
                            </span>
                            <Pagination 
                                current={page} 
                                pageSize={limit} 
                                total={total} 
                                onChange={setPage} 
                                showSizeChanger={false}
                                showQuickJumper
                            />
                        </div>
                    </>
                )}
            </Card>

            {/* View Modal */}
            <ViewAnnouncementModal 
                visible={!!viewModal} 
                announcement={viewModal} 
                onClose={() => setViewModal(null)} 
            />

            {/* Custom Styles */}
            <style>{`
                .hover-row:hover {
                    background-color: #fafafa !important;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                
                .ant-table-thead > tr > th {
                    background-color: #fafafa !important;
                    font-weight: 600 !important;
                    color: #262626 !important;
                    border-bottom: 2px solid #f0f0f0 !important;
                }
                
                .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #f5f5f5 !important;
                }
                
                .ant-btn-primary {
                    box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
                }
                
                .ant-btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(5, 145, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default AnnouncementsTable;