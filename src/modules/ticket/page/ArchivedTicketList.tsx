import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Empty,
    Grid,
    Image,
    Input,
    Pagination,
    Row,
    Select,
    Space,
    Tag,
    Tooltip,
} from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
import { useGetMeQuery } from "../../../app/api/userApi";
import { imageURLNew } from "../../../app/slice/baseQuery";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
    EditOutlined,
    FilterOutlined,

} from "@ant-design/icons";
import { TiArrowLoop } from "react-icons/ti";
import { BsFillPeopleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import {
    useGetArchivedTicketSuperAdminWiseQuery,
    useGetAdminArchivedTicketQuery, useGetEmployeeWiseArchivedQuery
} from "../api/ticketEndpoint";
import { IAdminTicketList } from "../types/ticketTypes";
import { formatTimeDifference } from "../utils/timeFormat";
import UpdateTicketPriority from "../components/UpdateTicketPriority";
dayjs.extend(relativeTime);
import CountdownTimer from "../components/Countdown"
const { Option } = Select;
const ArchivedTicketList = ({
    ticketValue,
    ticketPriorityValue,
}: {
    ticketValue: string;
    ticketPriorityValue: string;
}) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const skipValue = (page - 1) * pageSize;
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const { sm } = Grid.useBreakpoint();
    const [filter, setFilter] = useState<{
        key?: string;
        priority?: string;
        status?: string;
        limit: number;
        offset: number;
    }>({
        limit: Number(pageSize),
        offset: skipValue,
    });
    const dispatch = useDispatch();
    //   const { data, isLoading } = useGetArchivedTicketSuperAdminWiseQuery({
    //     ...filter,
    //   });
    const params = { ...filter };
    const { data: { data: profile } = {} } = useGetMeQuery();
    const roleId = profile?.role_id;


    const superAdminQuery = useGetArchivedTicketSuperAdminWiseQuery(params, {
        skip: !(roleId === 1 || roleId === 4),
    });

    const adminQuery = useGetAdminArchivedTicketQuery(params, {
        // If your real hook is: useGetAdminArchivedTicketQuery, use that instead
        skip: roleId !== 2,
    });

    const employeeQuery = useGetEmployeeWiseArchivedQuery(params, {
        // If your real hook is: useGetEmployeeWiseArchivedQuery, use that instead
        skip: roleId !== 3,
    });

    const activeQuery =
        roleId === 1 || roleId === 4
            ? superAdminQuery
            : roleId === 2
                ? adminQuery
                : roleId === 3
                    ? employeeQuery
                    : { data: undefined, isLoading: false };


    const { data, isLoading } = activeQuery;

    const handleExpand = (id: number): void => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    const handlePaginationChange = (current: number, size: number) => {
        setPage(current);
        setPageSize(size);
        setFilter({ ...filter, offset: (current - 1) * size, limit: size });
    };

    const handleCardClick = (e: React.MouseEvent, id: number): void => {
        const target = e.target as HTMLElement;
        if (
            target.tagName === "BUTTON" ||
            target.tagName === "TEXTAREA" ||
            target.closest("button") ||
            target.closest("textarea")
        ) {
            e.stopPropagation();
            return;
        }
        handleExpand(id);
    };

    useEffect(() => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            status: ticketValue || prevFilter.status,
            priority: ticketPriorityValue || prevFilter.priority,
            offset: 0,
        }));
    }, [ticketValue, ticketPriorityValue]);

    return (
        <Card
            loading={isLoading}
            style={{ width: "100%" }}
            title="Archived Ticket List"
            extra={
                <Space direction={!sm ? "vertical" : "horizontal"}>
                    <Input
                        prefix={<SearchOutlined />}
                        style={{ width: "160px" }}
                        onChange={(e) =>
                            setFilter({ ...filter, key: e.target.value, offset: 0 })
                        }
                        placeholder="Search..."
                    />
                    <Select
                        allowClear
                        defaultValue={ticketPriorityValue}
                        style={{ width: "160px" }}
                        onChange={(e) => setFilter({ ...filter, priority: e, offset: 0 })}
                        placeholder="Select Priority"
                    >
                        <Option value="">All</Option>
                        <Option value="low">Low</Option>
                        <Option value="medium">Medium</Option>
                        <Option value="high">High</Option>
                        <Option value="urgent">Urgent</Option>
                    </Select>
                </Space>
            }
        >
            {data?.data?.length ? (
                <>
                    {data?.data?.map((ticket: IAdminTicketList, index: number) => {
                        const cardId = ticket.ticket_table_id ?? ticket.id;
                        const isPDF = ticket?.attachment?.endsWith(".pdf");
                        return (
                            <Card
                                key={cardId}
                                style={{
                                    marginBottom: "1rem",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                    overflow: "hidden",
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                    cursor: "pointer",
                                    backgroundColor: "#fff",
                                }}
                                hoverable
                                onClick={(e) => handleCardClick(e, cardId)}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <div>
                                        <h3 style={{ display: "flex", alignItems: "center", color: "#1890ff" }}>
                                            <span>{`Ticket ID: ${ticket.ticket_id}`}</span>
                                            <Space
                                                size="small"
                                                style={{
                                                    marginLeft: 10,
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {ticket.is_re_raise === 1 && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            backgroundColor: "#fff7e6",
                                                            color: "#fa8c16",
                                                            border: "1px solid #ffd591",
                                                            borderRadius: "6px",
                                                            padding: "2px 8px",
                                                            fontSize: "13px",
                                                            fontWeight: 500,
                                                            lineHeight: "16px",
                                                            height: "22px",
                                                        }}
                                                    >
                                                        <TiArrowLoop size={16} style={{ marginRight: 4 }} />
                                                        Re-Raised
                                                    </div>
                                                )}
                                                {ticket.is_on_behalf === 1 && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            backgroundColor: "#f9f0ff",
                                                            color: "#722ed1",
                                                            border: "1px solid #d3adf7",
                                                            borderRadius: "6px",
                                                            padding: "2px 8px",
                                                            fontSize: "13px",
                                                            fontWeight: 500,
                                                            lineHeight: "16px",
                                                            height: "22px",
                                                        }}
                                                    >
                                                        <BsFillPeopleFill size={15} style={{ marginRight: 4 }} />
                                                        On Behalf
                                                    </div>
                                                )}
                                            </Space>


                                        </h3>
                                        <h3
                                            style={{ color: "#000000" }}
                                        >{`Title : ${ticket.subject}`}</h3>
                                        <strong>
                                            {/* Ticket Owner / On Behalf logic */}
                                            {roleId !== 3 && (
                                                <>
                                                    {ticket.is_on_behalf === 1 ? (
                                                        <>
                                                            <Tooltip
                                                                title={
                                                                    <div>
                                                                        <p><strong>Name:</strong> {ticket.ticket_created_employee_name}</p>
                                                                        <p><strong>ID:</strong> {ticket.ticket_created_employee_id}</p>
                                                                        <p><strong>Designation:</strong> {ticket.created_employee_designation}</p>
                                                                        <p><strong>Department:</strong> {ticket.created_employee_department}</p>
                                                                        <p><strong>Phone No:</strong> {ticket.created_employee_contact_no}</p>
                                                                        <p><strong>Unit:</strong> {ticket.created_employee_unit_name}</p>
                                                                    </div>
                                                                }
                                                            >
                                                                <span>
                                                                    Ticket Owner: {ticket.ticket_created_employee_name} (
                                                                    {ticket.ticket_created_employee_id})
                                                                </span>
                                                            </Tooltip>

                                                            <br />

                                                            <strong>
                                                                On Behalf Created By: {ticket.on_behalf_created_name} (
                                                                {ticket.on_behalf_created_employee_id})
                                                            </strong>
                                                        </>
                                                    ) : (
                                                        <Tooltip
                                                            title={
                                                                <div>
                                                                    <p><strong>Name:</strong> {ticket.ticket_created_employee_name}</p>
                                                                    <p><strong>ID:</strong> {ticket.ticket_created_employee_id}</p>
                                                                    <p><strong>Designation:</strong> {ticket.created_employee_designation}</p>
                                                                    <p><strong>Department:</strong> {ticket.created_employee_department}</p>
                                                                    <p><strong>Phone No:</strong> {ticket.created_employee_contact_no}</p>
                                                                    <p><strong>Unit:</strong> {ticket.created_employee_unit_name}</p>
                                                                </div>
                                                            }
                                                        >
                                                            <span>
                                                                Ticket Owner: {ticket.ticket_created_employee_name} (
                                                                {ticket.ticket_created_employee_id})
                                                            </span>
                                                        </Tooltip>
                                                    )}
                                                </>
                                            )}

                                            {/* Role 3 special case */}
                                            {roleId === 3 && ticket.is_on_behalf === 1 && (
                                                <strong>
                                                    On Behalf Created By: {ticket.on_behalf_created_name} (
                                                    {ticket.on_behalf_created_employee_id})
                                                </strong>
                                            )}


                                            <div>
                                                {ticket.ticket_status === "solved" && (
                                                    <Tooltip
                                                        title={
                                                            <div>
                                                                <p>
                                                                    <strong>Name:</strong>{" "}
                                                                    {ticket.ticket_solved_employee_name}
                                                                </p>
                                                                <p>
                                                                    <strong>ID:</strong>{" "}
                                                                    {ticket.ticket_solved_employee_id}
                                                                </p>
                                                                <p>
                                                                    <strong>Designation:</strong>{" "}
                                                                    {ticket.solved_employee_designation}
                                                                </p>

                                                                <p>
                                                                    <strong>Phone No:</strong>{" "}
                                                                    {ticket.solved_employee_contact_no}
                                                                </p>
                                                                <p>
                                                                    <strong>Unit:</strong>{" "}
                                                                    {ticket.solved_employee_unit_name}
                                                                </p>
                                                            </div>
                                                        }
                                                    >
                                                        <span>
                                                            Solved By: {ticket.ticket_solved_employee_name} (
                                                            {ticket.ticket_solved_employee_id})
                                                        </span>
                                                    </Tooltip>
                                                )}
                                            </div>
                                            <div>
                                                {ticket.ticket_status === "inprogress" && (
                                                    <Tooltip
                                                        title={
                                                            <div>
                                                                <p>
                                                                    <strong>Name:</strong>{" "}
                                                                    {ticket.action_by_name || "N/A"}
                                                                </p>
                                                                <p>
                                                                    <strong>ID:</strong>{" "}
                                                                    {ticket.action_by_employee_id || "N/A"}
                                                                </p>
                                                                <p>
                                                                    <strong>Designation:</strong>{" "}
                                                                    {ticket.action_by_designation || "N/A"}
                                                                </p>

                                                                <p>
                                                                    <strong>Phone No:</strong>{" "}
                                                                    {ticket.action_by_contact_no || "N/A"}
                                                                </p>
                                                                <p>
                                                                    <strong>Unit:</strong>{" "}
                                                                    {ticket.action_by_unit_name || "N/A"}
                                                                </p>
                                                            </div>
                                                        }
                                                    >
                                                        <span>
                                                            Last Updated By:{" "}
                                                            {ticket.action_by_name || "Unknown"} (
                                                            {ticket.action_by_employee_id || "Unknown"})
                                                        </span>
                                                    </Tooltip>
                                                )}

                                                {ticket.ticket_status === "unsolved" && (
                                                    <Tooltip
                                                        title={
                                                            <div>
                                                                <p>
                                                                    <strong>No Action has Taken Yet</strong>
                                                                </p>
                                                            </div>
                                                        }
                                                    >
                                                        <span>Last Update: No Action has Taken</span>
                                                    </Tooltip>
                                                )}

                                                {ticket.ticket_status === "forward" && (
                                                    <Tooltip
                                                        title={
                                                            <div>
                                                                <p>
                                                                    <strong>Name:</strong>{" "}
                                                                    {ticket.action_by_name || "N/A"}
                                                                </p>
                                                                <p>
                                                                    <strong>ID:</strong>{" "}
                                                                    {ticket.action_by_employee_id || "N/A"}
                                                                </p>
                                                                <p>
                                                                    <strong>Designation:</strong>{" "}
                                                                    {ticket.action_by_designation || "N/A"}
                                                                </p>
                                                                <p>
                                                                    <strong>Department:</strong>{" "}
                                                                    {ticket.action_by_department || "N/A"}
                                                                </p>
                                                                <p>
                                                                    <strong>Email:</strong>{" "}
                                                                    {ticket.action_by_email || "N/A"}
                                                                </p>
                                                                <p>
                                                                    <strong>Phone No:</strong>{" "}
                                                                    {ticket.action_by_contact_no || "N/A"}
                                                                </p>
                                                                <p>
                                                                    <strong>Unit:</strong>{" "}
                                                                    {ticket.action_by_unit_name || "N/A"}
                                                                </p>
                                                            </div>
                                                        }
                                                    >
                                                        <span>
                                                            Last Updated By:{" "}
                                                            {ticket.action_by_name || "Unknown"} (
                                                            {ticket.action_by_employee_id || "Unknown"})
                                                        </span>
                                                    </Tooltip>

                                                )}
                                            </div>
                                            <Space>
                                                {ticket.ticket_status === "unsolved" && (
                                                    <Tag color="red-inverse">UNSOLVED</Tag>
                                                )}
                                                {ticket.ticket_status === "solved" && (
                                                    <Tag color="green-inverse">SOLVED</Tag>
                                                )}
                                                {ticket.ticket_status === "forward" && (
                                                    <Tag color="pink-inverse">FORWARD</Tag>
                                                )}
                                                {ticket.ticket_status === "inprogress" && (
                                                    <Tag color="blue-inverse">IN PROGRESS</Tag>
                                                )}
                                            </Space>

                                        </strong>
                                    </div>

                                    <div>
                                        <CountdownTimer
                                            ticketCreatedAt={ticket.ticket_created_at}
                                            ticketUpdatedAt={ticket.ticket_updated_at}
                                            responseTimeValue={ticket.response_time_value}
                                            responseTimeUnit={ticket.response_time_unit}
                                            resolveTimeValue={ticket.resolve_time_value}
                                            resolveTimeUnit={ticket.resolve_time_unit}
                                            ticketStatus={ticket.ticket_status}
                                        />
                                    </div>
                                </div>
                                <Divider style={{ margin: "6px 0px 12px" }} />
                                <Row gutter={12}>
                                    <Col xs={12} sm={12} md={8} lg={3}>
                                        <div
                                            style={{
                                                textAlign: "left",
                                                fontSize: "15px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <p style={{ color: "gray" }}>Asset</p>
                                            <p>{ticket.asset_name || "N/A"}</p>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={12} md={8} lg={4}>
                                        <div
                                            style={{
                                                textAlign: "left",
                                                fontSize: "15px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <p style={{ color: "gray" }}>Serial Number</p>
                                            <p>{ticket.asset_serial_number || "N/A"}</p>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={12} md={8} lg={3}>
                                        <div
                                            style={{
                                                textAlign: "left",
                                                fontSize: "15px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <p style={{ color: "gray" }}>Priority</p>
                                            <>
                                                {ticket.priority === "urgent" && (
                                                    <Tag color="red-inverse">URGENT</Tag>
                                                )}
                                                {ticket.priority === "high" && (
                                                    <Tag color="pink-inverse">HIGH</Tag>
                                                )}
                                                {ticket.priority === "medium" && (
                                                    <Tag color="blue-inverse">MEDIUM</Tag>
                                                )}
                                                {ticket.priority === "low" && (
                                                    <Tag color="green-inverse">LOW</Tag>
                                                )}
                                            </>
                                            {ticket?.ticket_status === "unsolved" && (
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                    onClick={() => {
                                                        dispatch(
                                                            setCommonModal({
                                                                title: "Update Ticket Priority",
                                                                content: <UpdateTicketPriority single={ticket} />,
                                                                show: true,
                                                            })
                                                        );
                                                    }}
                                                >
                                                    <EditOutlined />
                                                </Button>
                                            )}

                                        </div>
                                    </Col>

                                    <Col xs={12} sm={12} md={8} lg={4}>
                                        <div
                                            style={{
                                                textAlign: "left",
                                                fontSize: "15px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <p style={{ color: "gray" }}>Category</p>
                                            <p>{ticket.ticket_category_title}</p>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={12} md={8} lg={3}>
                                        <div
                                            style={{
                                                textAlign: "left",
                                                fontSize: "15px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <p style={{ color: "gray" }}>Unit Name</p>
                                            <p>{ticket.seating_unit_name || ticket.asset_unit_title || "Not Updated"}</p>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={12} md={8} lg={7}>
                                        <div
                                            style={{
                                                textAlign: "left",
                                                fontSize: "15px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <p style={{ color: "gray" }}>Location</p>
                                            <p>
                                                {ticket.complex_name && ticket.seating_location_name
                                                    ? `${ticket.complex_name} - ${ticket.seating_location_name}`
                                                    : ticket.complex_name || ticket.seating_location_name || "Not Updated"}
                                            </p>
                                        </div>
                                    </Col>

                                </Row>
                                <div>
                                    {expandedCard === cardId && (
                                        <div
                                            style={{
                                                marginTop: "1rem",
                                                backgroundColor: "#f9f9f9",
                                                padding: "1rem",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            <Descriptions
                                                bordered
                                                size="small"
                                                column={{ sm: 1, md: 2 }}
                                                labelStyle={{
                                                    fontWeight: "bold",
                                                    backgroundColor: "#e6f2ff",
                                                    color: "#000000",
                                                }}
                                                contentStyle={{ backgroundColor: "#ffffff" }}
                                                items={[
                                                    ...(ticket.ticket_status === "forward"
                                                        ? [
                                                            {
                                                                key: "0",
                                                                label: "Forward Details",
                                                                children: ticket.forward_details || "N/A",
                                                                span: 4,
                                                            },
                                                            {
                                                                key: "0-1",
                                                                label: "Forward Remarks",
                                                                children: ticket.forward_remarks || "N/A",
                                                                span: 4,
                                                            },
                                                            {
                                                                key: "0-2",
                                                                label: "Forward Date",
                                                                children: ticket.forward_date
                                                                    ? dayjs(ticket.forward_date).format(
                                                                        "DD MMM YYYY h:mm A"
                                                                    )
                                                                    : "N/A",
                                                                span: 4,
                                                            },
                                                        ]
                                                        : []),
                                                    {
                                                        key: "1",
                                                        label: "CC Person",
                                                        children: ticket.cc ? ticket.cc : "N/A",
                                                        span: 2,
                                                    },
                                                    {
                                                        key: "2",
                                                        label: "Assign Date",
                                                        children: dayjs(ticket.ticket_created_at).format(
                                                            "DD MMM YYYY h:mm A"
                                                        ),
                                                        span: 2,
                                                    },
                                                    {
                                                        key: "3",
                                                        label: "Last Updated at",
                                                        children: dayjs(ticket.ticket_created_at).isSame(
                                                            dayjs(ticket.ticket_updated_at)
                                                        )
                                                            ? "Not Updated Yet"
                                                            : `${dayjs(ticket.ticket_updated_at).format(
                                                                "DD MMM YYYY h:mm A"
                                                            )} (${dayjs(
                                                                ticket.ticket_updated_at
                                                            ).fromNow()})`,
                                                        span: 2,
                                                    },
                                                    ...(ticket.ticket_status === "solved"
                                                        ? [
                                                            {
                                                                key: "4",
                                                                label: "Time Taken",
                                                                children: formatTimeDifference(
                                                                    dayjs(ticket.ticket_created_at),
                                                                    dayjs(ticket.ticket_updated_at)
                                                                ),
                                                            },
                                                        ]
                                                        : []),
                                                ]}
                                            />

                                            <Divider />
                                            <Descriptions bordered layout="vertical" size="small">
                                                <Descriptions.Item
                                                    style={{ backgroundColor: "#ffffff" }}
                                                    labelStyle={{
                                                        fontWeight: "bold",
                                                        color: "#000000",
                                                    }}
                                                    label="Attachment"
                                                    key="1"
                                                >
                                                    <div
                                                        style={{ maxWidth: "50px", textAlign: "center" }}
                                                    >
                                                        {ticket?.attachment ? (
                                                            isPDF ? (
                                                                <a
                                                                    href={
                                                                        ticket.attachment.startsWith("https")
                                                                            ? ticket.attachment
                                                                            : `${imageURLNew}/uploads/${ticket.attachment.includes("ticket\\")
                                                                                ? ticket.attachment.split(
                                                                                    "ticket\\"
                                                                                )[1]
                                                                                : ticket.attachment
                                                                            }`
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <Button
                                                                        size="small"
                                                                        style={{
                                                                            fontSize: "8px",
                                                                            padding: "0 5px",
                                                                        }}
                                                                    >
                                                                        PDF
                                                                    </Button>
                                                                </a>
                                                            ) : (
                                                                <a>
                                                                    <Image
                                                                        src={`${imageURLNew}/uploads/${ticket.attachment.includes("ticket\\")
                                                                            ? ticket.attachment.split("ticket\\")[1]
                                                                            : ticket.attachment
                                                                            }`}
                                                                        alt="attachment"
                                                                        width={40}
                                                                        style={{ maxHeight: "40px" }}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                </a>
                                                            )
                                                        ) : (
                                                            <span>No File</span>
                                                        )}
                                                    </div>
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    style={{ backgroundColor: "#ffffff" }}
                                                    labelStyle={{
                                                        fontWeight: "bold",
                                                        color: "#000000",
                                                    }}
                                                    label="Message"
                                                    key="2"
                                                >
                                                    <div
                                                        style={{
                                                            minWidth: "500px",
                                                            wordWrap: "break-word",
                                                            whiteSpace: "pre-wrap",
                                                        }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: ticket.description,
                                                        }}
                                                    />
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </>
            ) : (
                <Card>
                    <Empty />
                </Card>
            )}
            <Pagination
                size="small"
                align="end"
                pageSizeOptions={["10", "20", "30", "50", "100"]}
                current={page}
                pageSize={pageSize}
                total={data?.total || 0}
                showTotal={(total) => `Total ${total}`}
                onChange={handlePaginationChange}
                showSizeChanger
            />
        </Card>
    );
};

export default ArchivedTicketList;
