import { Empty, Pagination, Skeleton } from "antd";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { IEmployee } from "../types/employeeTypes";
import { LINE } from "../utils/avatar";
import EmployeeContactCard from "./EmployeeContactCard";

type TProps = {
  data: IEmployee[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: string[];
  onPageChange: (page: number, pageSize: number) => void;
  renderActions?: (employee: IEmployee) => ReactNode;
  onView?: (employee: IEmployee) => void;
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(258px, 1fr))",
  gap: 14,
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.02 } },
};

const SkeletonCard = () => (
  <div
    style={{
      border: `1px solid ${LINE}`,
      borderRadius: 12,
      background: "#fff",
      padding: 16,
      height: 232,
    }}
  >
    <Skeleton avatar active paragraph={{ rows: 5 }} />
  </div>
);

const AddressBookGrid = ({
  data,
  loading,
  page,
  pageSize,
  total,
  pageSizeOptions = ["50", "100", "200", "300", "500"],
  onPageChange,
  renderActions,
  onView,
}: TProps) => {
  if (loading) {
    return (
      <div style={gridStyle}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return <Empty style={{ padding: "56px 0" }} description="No employees found" />;
  }

  return (
    <>
      <motion.div
        key={`${page}-${pageSize}`}
        style={gridStyle}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {data.map((employee) => (
          <EmployeeContactCard
            key={employee.id}
            employee={employee}
            actions={renderActions?.(employee)}
            onView={onView ? () => onView(employee) : undefined}
          />
        ))}
      </motion.div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          pageSizeOptions={pageSizeOptions}
          onChange={onPageChange}
          showTotal={(t) => `Total ${t}`}
        />
      </div>
    </>
  );
};

export default AddressBookGrid;
