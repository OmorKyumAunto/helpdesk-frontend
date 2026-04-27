import { Tag } from "antd";
import { useGetSingleSuperAdminTaskQuery, useGetSingleTaskQuery } from "../api/taskEndpoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import dayjs from "dayjs";
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  TagOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import styled, { keyframes } from "styled-components";

/* ── Animation ───────────────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Layout ──────────────────────────────────────────────────────── */
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: ${fadeUp} 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

/* ── Banner ──────────────────────────────────────────────────────── */
const Banner = styled.div<{ status: string }>`
  border-radius: 14px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  border: 1.5px solid;
  background: ${({ status }) =>
    status === "complete" ? "#d1fae5" : status === "inprogress" ? "#dbeafe" : "#fee2e2"};
  border-color: ${({ status }) =>
    status === "complete" ? "#6ee7b7" : status === "inprogress" ? "#93c5fd" : "#fca5a5"};
  @media (max-width: 576px) { padding: 14px 16px; border-radius: 12px; }
`;

const BannerTitle = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
  @media (max-width: 576px) { font-size: 15px; }
`;

const BannerSub = styled.div`
  font-size: 12px;
  color: #475569;
  font-weight: 500;
  margin-top: 3px;
`;

const Pill = styled.div<{ status: string }>`
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: #fff;
  border: 1.5px solid;
  white-space: nowrap;
  color: ${({ status }) =>
    status === "complete" ? "#065f46" : status === "inprogress" ? "#1e40af" : "#991b1b"};
  border-color: ${({ status }) =>
    status === "complete" ? "#059669" : status === "inprogress" ? "#2563eb" : "#dc2626"};
`;

/* ── Card ────────────────────────────────────────────────────────── */
const Card = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
`;

const CardHead = styled.div`
  padding: 11px 18px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  .anticon { font-size: 13px; color: #2563eb; }
  @media (max-width: 576px) { padding: 10px 14px; }
`;

const CardLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.7px;
`;

const CardBody = styled.div<{ tight?: boolean }>`
  padding: ${({ tight }) => (tight ? "14px 18px" : "18px")};
  @media (max-width: 576px) {
    padding: ${({ tight }) => (tight ? "12px 14px" : "14px")};
  }
`;

/* ── Fields ──────────────────────────────────────────────────────── */
const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  @media (max-width: 400px) { grid-template-columns: 1fr; gap: 12px; }
`;

const FieldLbl = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 5px;
`;

const FieldVal = styled.div`
  font-size: 13px;
  color: #0f172a;
  font-weight: 500;
  line-height: 1.4;
`;

/* ── Description ─────────────────────────────────────────────────── */
const DescBox = styled.div`
  font-size: 13px;
  color: #1e293b;
  line-height: 1.85;
  background: #f1f5f9;
  border-radius: 0 10px 10px 0;
  padding: 14px 16px;
  border-left: 3px solid #2563eb;
  font-weight: 400;
`;

/* ── Tags ────────────────────────────────────────────────────────── */
const TagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

/* ── Timeline ────────────────────────────────────────────────────── */
const TlItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 0;
  &:not(:last-child) { border-bottom: 1px dashed #e2e8f0; }
  &:first-child { padding-top: 0; }
  &:last-child  { padding-bottom: 0; }
`;

const TlDot = styled.div<{ color: "blue" | "green" | "red" }>`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ color }) =>
    color === "green" ? "#dcfce7" : color === "red" ? "#fee2e2" : "#dbeafe"};
  .anticon {
    font-size: 14px;
    color: ${({ color }) =>
      color === "green" ? "#15803d" : color === "red" ? "#b91c1c" : "#1d4ed8"};
  }
`;

const TlLbl = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 4px;
`;

const TlVal = styled.div`
  font-size: 12px;
  color: #0f172a;
  font-weight: 500;
  line-height: 1.45;
`;

/* ── Admin ───────────────────────────────────────────────────────── */
const AdminRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  background: #f1f5f9;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
`;

const AvatarCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1d4ed8, #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  .anticon { font-size: 18px; color: #fff; }
`;

const AdminName = styled.div`
  font-size: 14px;
  color: #0f172a;
  font-weight: 600;
`;

const AdminId = styled.div`
  font-size: 12px;
  color: #475569;
  font-weight: 500;
  margin-top: 3px;
`;

/* ── Component ───────────────────────────────────────────────────── */
const SingleTask = ({
  id,
  user_name,
  user_employee_id,
}: {
  id: number;
  user_name?: string;
  user_employee_id?: string;
}) => {
  const { data: profile } = useGetMeQuery();
  const roleID = profile?.data?.role_id;
  const { data } = useGetSingleTaskQuery(id || 0);
  const { data: superAdminData } = useGetSingleSuperAdminTaskQuery(id);
  const singleData = roleID === 1 ? superAdminData?.data : data?.data;

  const {
    category_title, task_code, task_status, start_time,
    sub_list_details, start_date, description,
    task_start_date, task_start_time, task_end_date, task_end_time,
  } = singleData || {};

  const fmt = (dateStr?: string, timeStr?: string) => {
    if (!dateStr || !timeStr) return "N/A";
    const date = dayjs(dateStr).add(6, "hours");
    return dayjs(`${date.format("YYYY-MM-DD")}T${timeStr}`).format("DD MMM YYYY hh:mm A");
  };

  const status = task_status || "incomplete";
  const hasSubcats = sub_list_details?.some((i) => i.is_checked === 1);

  return (
    <Wrap>
      {/* Banner */}
      <Banner status={status}>
        <div>
          <BannerTitle>{category_title || "—"}</BannerTitle>
          <BannerSub>Task ID #{task_code || "—"}</BannerSub>
        </div>
        <Pill status={status}>{status}</Pill>
      </Banner>

      <Grid>
        {/* Left */}
        <Col>
          <Card>
            <CardHead><CalendarOutlined /><CardLabel>Task details</CardLabel></CardHead>
            <CardBody>
              <FieldGrid>
                <div><FieldLbl>Task code</FieldLbl><FieldVal>#{task_code || "N/A"}</FieldVal></div>
                <div><FieldLbl>Category</FieldLbl><FieldVal>{category_title || "N/A"}</FieldVal></div>
                <div><FieldLbl>Approx. start</FieldLbl><FieldVal>{fmt(start_date, start_time)}</FieldVal></div>
                {task_start_date && task_start_time && (
                  <div><FieldLbl>Started at</FieldLbl><FieldVal>{fmt(task_start_date, task_start_time)}</FieldVal></div>
                )}
                {task_end_date && task_end_time && (
                  <div><FieldLbl>Ended at</FieldLbl><FieldVal>{fmt(task_end_date, task_end_time)}</FieldVal></div>
                )}
              </FieldGrid>
            </CardBody>
          </Card>

          {hasSubcats && (
            <Card>
              <CardHead><TagOutlined /><CardLabel>Subcategories</CardLabel></CardHead>
              <CardBody>
                <TagsWrap>
                  {sub_list_details!
                    .filter((i) => i.is_checked === 1)
                    .map((i, idx) => (
                      <Tag key={idx} color="geekblue"
                        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, margin: 0, fontWeight: 600 }}>
                        {Array.isArray(i.title) ? i.title.join(", ") : i.title}
                      </Tag>
                    ))}
                </TagsWrap>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHead><FileTextOutlined /><CardLabel>Description</CardLabel></CardHead>
            <CardBody>
              <DescBox>{description || "No description provided."}</DescBox>
            </CardBody>
          </Card>
        </Col>

        {/* Right */}
        <Col>
          <Card>
            <CardHead><ClockCircleOutlined /><CardLabel>Timeline</CardLabel></CardHead>
            <CardBody tight>
              <TlItem>
                <TlDot color="blue"><ClockCircleOutlined /></TlDot>
                <div><TlLbl>Should start</TlLbl><TlVal>{fmt(start_date, start_time)}</TlVal></div>
              </TlItem>
              {task_start_date && task_start_time && (
                <TlItem>
                  <TlDot color="green"><CheckCircleOutlined /></TlDot>
                  <div><TlLbl>Task started</TlLbl><TlVal>{fmt(task_start_date, task_start_time)}</TlVal></div>
                </TlItem>
              )}
              {task_end_date && task_end_time && (
                <TlItem>
                  <TlDot color="red"><CloseCircleOutlined /></TlDot>
                  <div><TlLbl>Task ended</TlLbl><TlVal>{fmt(task_end_date, task_end_time)}</TlVal></div>
                </TlItem>
              )}
            </CardBody>
          </Card>

          {roleID === 1 && (
            <Card>
              <CardHead><UserOutlined /><CardLabel>Assigned admin</CardLabel></CardHead>
              <CardBody>
                <AdminRow>
                  <AvatarCircle><UserOutlined /></AvatarCircle>
                  <div>
                    <AdminName>{user_name || "N/A"}</AdminName>
                    <AdminId>ID: {user_employee_id || "N/A"}</AdminId>
                  </div>
                </AdminRow>
              </CardBody>
            </Card>
          )}
        </Col>
      </Grid>
    </Wrap>
  );
};

export default SingleTask;