import {
  AppstoreOutlined,
  EyeOutlined,
  SearchOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Segmented, Select, Tag, Typography } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { LuUsers2 } from "react-icons/lu";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
  useGetEmployeesQuery,
  useGetDepartmentsQuery,
} from "../api/employeeEndPoint";
import ActionIconButton from "../components/ActionIconButton";
import AddressBookGrid from "../components/AddressBookGrid";
import AddressBookList from "../components/AddressBookList";
import EmployeeDetails from "./EmployeeDetails";
import { IEmployee, IEmployeeParams } from "../types/employeeTypes";
import { BRAND_GRADIENT } from "../utils/avatar";
import { BLOOD_GROUPS, UNIT_NAMES } from "../utils/units";

const { Option } = Select;
const { Text } = Typography;

const PAGE_SIZE_OPTIONS = ["50", "100", "200", "300", "500"];

const EmployeeListForEmployeePanel = () => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    pageSize: "50",
  });
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "50";
  const skipValue = (Number(page) - 1) * Number(pageSize);

  const [filter, setFilter] = useState<IEmployeeParams>({
    limit: Number(pageSize),
    offset: skipValue,
  });

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      limit: Number(pageSize),
      offset: skipValue,
    }));
  }, [page, pageSize, skipValue]);

  const { data, isLoading, isFetching } = useGetEmployeesQuery({ ...filter });
  const { data: deptRes } = useGetDepartmentsQuery();
  const departments = deptRes?.data || [];

  const total = data ? Number(data?.total) : 0;
  const employees: IEmployee[] = data?.data?.length ? data.data : [];

  const handlePageChange = (current: number, size: number) => {
    setSearchParams({ page: String(current), pageSize: String(size) });
    setFilter((prev) => ({
      ...prev,
      offset: (current - 1) * size,
      limit: size,
    }));
  };

  const showDetails = (record: IEmployee) => {
    dispatch(
      setCommonModal({
        title: "Employee Details",
        content: <EmployeeDetails employee={record} />,
        show: true,
        width: 740,
      })
    );
  };

  const renderCardActions = (record: IEmployee) => (
    <ActionIconButton
      title="View details"
      tone="blue"
      icon={<EyeOutlined />}
      onClick={() => showDetails(record)}
    />
  );

  return (
    <Card
      style={{
        boxShadow: "0 1px 2px rgba(16,24,40,.06)",
        borderRadius: 14,
        marginBottom: "1rem",
      }}
      styles={{ body: { paddingTop: 16 } }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: BRAND_GRADIENT,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(23,117,187,.3)",
            }}
          >
            <LuUsers2 size={20} />
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>Address Book</span>
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
              {total} {total === 1 ? "contact" : "contacts"}
            </Text>
          </span>
        </div>
      }
    >
      {/* Toolbar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Segmented
            size="large"
            value={viewMode}
            onChange={(v) => setViewMode(v as "grid" | "list")}
            options={[
              { value: "grid", label: "Grid", icon: <AppstoreOutlined /> },
              { value: "list", label: "List", icon: <TableOutlined /> },
            ]}
          />
          <Input
            allowClear
            size="large"
            value={filter.key}
            prefix={<SearchOutlined style={{ color: "#98A2B3" }} />}
            onChange={(e) => setFilter({ ...filter, key: e.target.value, offset: 0 })}
            placeholder="Search by name, ID, phone or email…"
            style={{
              flex: 1,
              minWidth: 240,
              maxWidth: 420,
              borderRadius: 11,
              background: "#F9FAFB",
            }}
          />
          <Select
            allowClear
            showSearch
            size="large"
            value={filter.unit_name || undefined}
            style={{ minWidth: 190 }}
            onChange={(e) => setFilter({ ...filter, unit_name: e, offset: 0 })}
            placeholder="All Units"
            optionFilterProp="children"
          >
            {UNIT_NAMES.map((unit) => (
              <Option key={unit} value={unit}>
                {unit}
              </Option>
            ))}
          </Select>
          <Select
            allowClear
            showSearch
            size="large"
            value={filter.department || undefined}
            style={{ minWidth: 200 }}
            onChange={(e) => setFilter({ ...filter, department: e, offset: 0 })}
            placeholder="All Departments"
            optionFilterProp="children"
          >
            {departments.map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>
          <Select
            allowClear
            size="large"
            value={filter.blood_group || undefined}
            style={{ minWidth: 170 }}
            onChange={(e) => setFilter({ ...filter, blood_group: e, offset: 0 })}
            placeholder="Blood Group"
          >
            {BLOOD_GROUPS.map((bg) => (
              <Option key={bg} value={bg}>
                {bg}
              </Option>
            ))}
          </Select>
        </div>

        {(filter.unit_name || filter.department || filter.blood_group) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid #F2F4F7",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                color: "#98A2B3",
              }}
            >
              Active
            </span>
            {filter.unit_name && (
              <Tag
                closable
                color="blue"
                onClose={(e) => {
                  e.preventDefault();
                  setFilter({ ...filter, unit_name: undefined, offset: 0 });
                }}
                style={{ borderRadius: 8, padding: "3px 8px", margin: 0 }}
              >
                Unit: {filter.unit_name}
              </Tag>
            )}
            {filter.department && (
              <Tag
                closable
                color="geekblue"
                onClose={(e) => {
                  e.preventDefault();
                  setFilter({ ...filter, department: undefined, offset: 0 });
                }}
                style={{ borderRadius: 8, padding: "3px 8px", margin: 0 }}
              >
                Dept: {filter.department}
              </Tag>
            )}
            {filter.blood_group && (
              <Tag
                closable
                color="volcano"
                onClose={(e) => {
                  e.preventDefault();
                  setFilter({ ...filter, blood_group: undefined, offset: 0 });
                }}
                style={{ borderRadius: 8, padding: "3px 8px", margin: 0 }}
              >
                Blood: {filter.blood_group}
              </Tag>
            )}
            <Button
              type="link"
              size="small"
              onClick={() => setFilter({ limit: filter.limit, offset: 0 })}
              style={{ padding: 0 }}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {viewMode === "grid" ? (
            <AddressBookGrid
              data={employees}
              loading={isLoading || isFetching}
              page={Number(page)}
              pageSize={Number(pageSize)}
              total={total}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageChange={handlePageChange}
              onView={showDetails}
              renderActions={renderCardActions}
            />
          ) : (
            <AddressBookList
              data={employees}
              loading={isLoading || isFetching}
              page={Number(page)}
              pageSize={Number(pageSize)}
              total={total}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageChange={handlePageChange}
              onView={showDetails}
              renderActions={renderCardActions}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

export default EmployeeListForEmployeePanel;
