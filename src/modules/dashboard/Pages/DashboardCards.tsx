import { Card, Col, Row } from "antd";
import dayjs from "dayjs";
import { FaComputer } from "react-icons/fa6";
import { LuUsers2, LuTicket, LuClock, LuWrench } from "react-icons/lu";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { useSelector } from "react-redux";
import { useGetMeQuery } from "../../../app/api/userApi";
import { RootState } from "../../../app/store/store";
import {
  useGetAllDashboardQuery,
  useGetAllCountEmployeeQuery,
  useGetDashboardAssetDataForAdminQuery,
  useGetDashboardDistributedAssetDataForAdminQuery,
} from "../api/dashboardEndPoints";
import {
  useGetSupportLoansQuery,
  useGetRepairsQuery,
} from "../../assets/api/assetsEndPoint";
import ApexPieChart from "../components/ApexPieChart";
import GraphChartV2 from "../components/GraphChartV2";
import CategoryPieChart from "../components/CategoryPieChat";
import TicketPieChart from "../components/TicketPieChart";
import AnnouncementSlider from "../components/AnnouncementSlider";
import SupportSummaryTile from "../components/SupportSummaryTile";
import KpiStrip, { TKpi } from "../components/KpiStrip";
import DashboardHero from "../components/DashboardHero";
import "../components/dashboard-ui.css";

/**
 * Defined at MODULE scope, not inside DashboardCards. When these lived inside
 * the component, every re-render (each of the ~6 queries resolving in waves)
 * created a fresh component identity, so React remounted every card and the CSS
 * entrance animation replayed — which looked like the dashboard "reloading"
 * two or three times on load.
 */
const InfoRow = ({ k, v }: { k: string; v?: React.ReactNode }) => (
  <div className="dinfo__row">
    <span className="dinfo__key">{k}</span>
    <span className="dinfo__val">{v || "—"}</span>
  </div>
);

const ChartCard = ({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <div className="dsec dfade" style={{ animationDelay: `${delay}ms` }}>
    <Card size="small" className="dash-card" title={title}>
      {children}
    </Card>
  </div>
);

const DashboardCards = () => {
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  // Admin-only data — skipped for employees (role 3), who neither render it nor
  // have permission for these endpoints, so they don't fire forbidden calls.
  const isEmployee = roleId === 3;
  const { data: asset } = useGetDashboardAssetDataForAdminQuery(
    {},
    { skip: isEmployee }
  );
  const { data: distributedAsset } =
    useGetDashboardDistributedAssetDataForAdminQuery({}, { skip: isEmployee });
  const { data } = useGetAllDashboardQuery(undefined, { skip: isEmployee });
  const { data: countData } = useGetAllCountEmployeeQuery();
  const { data: profile } = useGetMeQuery();
  const { data: support } = useGetSupportLoansQuery(undefined, {
    skip: isEmployee,
  });
  const { data: repairs } = useGetRepairsQuery(undefined, {
    skip: isEmployee,
  });
  const {
    employee_id,
    department,
    designation,
    email,
    contact_no,
    joining_date,
    unit_name,
    status,
    role_id,
  } = profile?.data || {};

  // Data expressions preserved verbatim.
  const totalAsset =
    role_id === 2 ? asset?.data?.user_count || 0 : data?.data?.total_asset || 0;
  const totalDisbursed =
    role_id === 2
      ? distributedAsset?.data?.employee_assign_asset_count || 0
      : data?.data?.total_assign_asset || 0;
  const supportTotal = Number(support?.summary?.total) || 0;
  const repairTotal = Number(repairs?.summary?.total) || 0;

  const adminKpis: TKpi[] = [
    {
      to: "/assets/list",
      tone: "violet",
      label: "Total Asset",
      value: totalAsset,
      icon: <FaComputer />,
    },
    {
      to: "/employee/list",
      tone: "amber",
      label: "Total Employee",
      value: data?.data?.total_employee || 0,
      icon: <LuUsers2 />,
    },
    {
      to: "/assets/distributed",
      tone: "green",
      label: "Disbursements",
      value: totalDisbursed,
      icon: <MdOutlineAssignmentTurnedIn />,
    },
    {
      to: "/assets/support",
      tone: "blue",
      label: "On Support",
      value: supportTotal,
      icon: <LuClock />,
    },
    {
      to: "/assets/under-repair",
      tone: "amber",
      label: "Under Repair",
      value: repairTotal,
      icon: <LuWrench />,
    },
  ];

  const employeeKpis: TKpi[] = [
    {
      to: "/tickets/list",
      tone: "blue",
      label: "My Tickets",
      value: countData?.data?.total_ticket || 0,
      icon: <LuTicket />,
    },
    {
      to: "/employee/distributed",
      tone: "green",
      label: "My Assets",
      value: countData?.data?.total_asset || 0,
      icon: <MdOutlineAssignmentTurnedIn />,
    },
    {
      to: "/employee/employee-list",
      tone: "amber",
      label: "Address Book",
      value: countData?.data?.total_user || 0,
      icon: <LuUsers2 />,
    },
  ];

  return (
    <div className="dash">
      <DashboardHero />

      {roleId !== 3 ? (
        /* ===================== Admin / Super Admin / Unit Super Admin ===================== */
        <>
          {/* Compact metric strip */}
          <div style={{ marginTop: 14 }}>
            <KpiStrip items={adminKpis} />
          </div>

          {/* Big charts get the room. On Support takes the prominent
              top-right slot beside the trend chart. */}
          <Row style={{ marginTop: 16 }} gutter={[16, 16]}>
            <Col xs={24} lg={15}>
              <ChartCard title="Stock vs Disbursement" delay={260}>
                <GraphChartV2 />
              </ChartCard>
            </Col>
            <Col xs={24} lg={9}>
              <ChartCard title="Assets by Category" delay={320}>
                <CategoryPieChart />
              </ChartCard>
            </Col>

            {/* Secondary band: on support · ticket status · announcements */}
            <Col xs={24} md={12} lg={8}>
              <div className="dsec dfade" style={{ animationDelay: "380ms" }}>
                <SupportSummaryTile compact />
              </div>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <ChartCard title="Ticket Status" delay={440}>
                <TicketPieChart />
              </ChartCard>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <ChartCard title="📢 Announcements" delay={500}>
                <AnnouncementSlider />
              </ChartCard>
            </Col>
          </Row>
        </>
      ) : (
        /* ===================== Employee ===================== */
        <>
          <div style={{ marginTop: 14 }}>
            <KpiStrip items={employeeKpis} />
          </div>

          <Row style={{ marginTop: 16 }} gutter={[16, 16]}>
            <Col xs={24} md={12} lg={9}>
              <ChartCard title="Available Blood Group" delay={260}>
                <ApexPieChart />
              </ChartCard>
            </Col>
            <Col xs={24} md={12} lg={15}>
              <ChartCard title="📢 Announcements" delay={320}>
                <AnnouncementSlider />
              </ChartCard>
            </Col>

            <Col xs={24}>
              <div className="dfade" style={{ animationDelay: "380ms" }}>
                <div className="dinfo">
                  <div className="dinfo__grid">
                    <div>
                      <div className="dinfo__group-title">Your Information</div>
                      <InfoRow k="Employee ID" v={employee_id} />
                      <InfoRow k="Designation" v={designation} />
                      <InfoRow k="Department" v={department} />
                      <InfoRow
                        k="Joining Date"
                        v={
                          joining_date && dayjs(joining_date).isValid()
                            ? dayjs(joining_date).format("DD MMM YYYY")
                            : "—"
                        }
                      />
                    </div>
                    <div>
                      <div className="dinfo__group-title">Contact Details</div>
                      <InfoRow k="Phone" v={contact_no} />
                      <InfoRow k="Email" v={email} />
                      <InfoRow k="Unit Name" v={unit_name} />
                      <InfoRow
                        k="Status"
                        v={
                          <span
                            className={
                              status === 1
                                ? "dinfo__status--on"
                                : "dinfo__status--off"
                            }
                          >
                            {status === 1 ? "Active" : "Inactive"}
                          </span>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DashboardCards;
