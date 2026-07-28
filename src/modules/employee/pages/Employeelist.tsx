import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  SearchOutlined,
  TableOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Input,
  Popconfirm,
  Segmented,
  Select,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { LuUsers2 } from "react-icons/lu";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { RootState } from "../../../app/store/store";
import { useGetMeQuery } from "../../../app/api/userApi";
import { CreateButton } from "../../../common/CommonButton";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
  useGetDepartmentsQuery,
  useUpdateEmployeeStatusMutation,
} from "../api/employeeEndPoint";
import ActionIconButton from "../components/ActionIconButton";
import AddressBookGrid from "../components/AddressBookGrid";
import AddressBookList from "../components/AddressBookList";
import CreateEmployee from "../components/CreateEmployee";
import UpdateEmployee from "../components/UpdateEmployee";
import EmployeeDetails from "./EmployeeDetails";
import EmployeeFileUpdate from "./EmployeeFileUpdate";
import { IEmployee, IEmployeeParams } from "../types/employeeTypes";
import { BRAND_GRADIENT } from "../utils/avatar";
import { BLOOD_GROUPS, UNIT_NAMES } from "../utils/units";

const { Option } = Select;
const { Text } = Typography;

const PAGE_SIZE_OPTIONS = ["50", "100", "200", "300", "500", "1000", "3000"];

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const { data: profile } = useGetMeQuery();
  const employeeID = profile?.data?.employee_id;
  const canManage = employeeID !== "Assetteam";

  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [updateStatus] = useUpdateEmployeeStatusMutation();

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

  const showCreate = () => {
    dispatch(
      setCommonModal({
        title: "Create Employee",
        content: <CreateEmployee />,
        show: true,
        width: 678,
      })
    );
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

  const showUpdate = (record: IEmployee) => {
    dispatch(
      setCommonModal({
        title: "Update Employee",
        content: <UpdateEmployee employee={record} />,
        show: true,
        width: 678,
      })
    );
  };

  // Shared action buttons used by both the grid cards and the list rows.
  const renderCardActions = (record: IEmployee) => (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <ActionIconButton
        title="View details"
        tone="blue"
        icon={<EyeOutlined />}
        onClick={() => showDetails(record)}
      />
      {canManage && (
        <>
          <ActionIconButton
            title="Edit"
            tone="violet"
            icon={<EditOutlined />}
            onClick={() => showUpdate(record)}
          />
          <Tooltip title={record.status === 1 ? "Active" : "Inactive"}>
            <Switch
              size="small"
              checked={record.status === 1}
              style={{ background: record.status === 1 ? "#16A34A" : "#cbd5e1" }}
              onClick={(_, e) => e.stopPropagation()}
              onChange={() =>
                // Endpoint consumes the id directly in the URL despite the
                // `{ id: number }` type annotation, so pass the raw id.
                updateStatus(record.id as unknown as { id: number })
              }
            />
          </Tooltip>
        </>
      )}
      {roleId === 1 && (
        <Popconfirm
          title="Delete the employee"
          description="Are you sure to delete this employee?"
          onConfirm={() => record?.id && deleteEmployee(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <ActionIconButton title="Delete" tone="red" icon={<DeleteOutlined />} />
        </Popconfirm>
      )}
    </div>
  );

  const excelData = employees.length
    ? employees.map(
        ({
          employee_id,
          name,
          department,
          designation,
          email,
          contact_no,
          joining_date,
          unit_name,
          licenses,
          blood_group,
          business_type,
          line_of_business,
          grade,
          pabx,
        }: any) => ({
          "Employee ID": employee_id,
          "Employee Name": name,
          Department: department,
          Designation: designation,
          Email: email,
          "Contact No": contact_no,
          "Blood Group": blood_group,
          "Date of Joining": dayjs(joining_date).format("DD-MM-YYYY"),
          Location: unit_name,
          Licenses: licenses,
          "Business Type": business_type,
          "Line of Business": line_of_business,
          Grade: grade,
          PABX: pabx,
        })
      )
    : [];

  // Active filter chips (excludes the free-text search box).
  const activeFilters = (
    [
      filter.unit_name && { key: "unit_name", label: `Unit: ${filter.unit_name}`, color: "blue" },
      filter.department && { key: "department", label: `Dept: ${filter.department}`, color: "geekblue" },
      filter.status && {
        key: "status",
        label: `Status: ${filter.status === 1 ? "Active" : "Inactive"}`,
        color: "green",
      },
      filter.employee_type && {
        key: "employee_type",
        label: `Type: ${filter.employee_type === "management" ? "Management" : "Non-Management"}`,
        color: "geekblue",
      },
      filter.blood_group && { key: "blood_group", label: `Blood: ${filter.blood_group}`, color: "volcano" },
    ].filter(Boolean) as { key: string; label: string; color: string }[]
  );

  const removeFilter = (key: string) =>
    setFilter((prev) => ({ ...prev, [key]: undefined, offset: 0 }));

  const clearAllFilters = () =>
    setFilter((prev) => ({ limit: prev.limit, offset: 0 }));

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
          <Dropdown
            trigger={["click"]}
            dropdownRender={() => (
              <div
                style={{
                  padding: 16,
                  background: "#fff",
                  borderRadius: 12,
                  width: 230,
                  border: "1px solid #f0f0f0",
                  boxShadow: "0 12px 32px rgba(16,24,40,.14)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[
                  { label: "Status", node: (
                    <Select
                      allowClear
                      style={{ width: "100%" }}
                      value={filter.status ?? undefined}
                      onChange={(e) => setFilter({ ...filter, status: e, offset: 0 })}
                      placeholder="Any status"
                    >
                      <Option value={1}>Active</Option>
                      <Option value={2}>Inactive</Option>
                    </Select>
                  ) },
                  { label: "Employee Type", node: (
                    <Select
                      allowClear
                      style={{ width: "100%" }}
                      value={filter.employee_type || undefined}
                      onChange={(e) => setFilter({ ...filter, employee_type: e, offset: 0 })}
                      placeholder="Any type"
                    >
                      <Option value={"management"}>Management</Option>
                      <Option value={"non-management"}>Non Management</Option>
                    </Select>
                  ) },
                  { label: "Blood Group", node: (
                    <Select
                      allowClear
                      style={{ width: "100%" }}
                      value={filter.blood_group || undefined}
                      onChange={(e) => setFilter({ ...filter, blood_group: e, offset: 0 })}
                      placeholder="Any blood group"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <Option key={bg} value={bg}>
                          {bg}
                        </Option>
                      ))}
                    </Select>
                  ) },
                ].map((f) => (
                  <div key={f.label}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: 0.4,
                        textTransform: "uppercase",
                        color: "#98A2B3",
                        marginBottom: 6,
                      }}
                    >
                      {f.label}
                    </div>
                    {f.node}
                  </div>
                ))}
              </div>
            )}
          >
            <Badge count={activeFilters.length} size="small" color="#1775BB">
              <Button
                size="large"
                icon={<FilterOutlined />}
                style={{
                  borderRadius: 11,
                  ...(activeFilters.length
                    ? { background: "#EFF5FB", borderColor: "#BBD3EC", color: "#1775BB" }
                    : {}),
                }}
              >
                Filters
              </Button>
            </Badge>
          </Dropdown>

          <div style={{ flex: 1 }} />

          <ExcelDownload
            excelName={"employee_list"}
            excelTableHead={[
              "Employee ID",
              "Employee Name",
              "Department",
              "Designation",
              "Email",
              "Contact No",
              "Blood Group",
              "Date of Joining",
              "Location",
              "Business Type",
              "Line of Business",
              "Grade",
              "PABX",
            ]}
            excelData={excelData}
          />
          {canManage && (
            <>
              <CreateButton
                name="Upload"
                onClick={() => {
                  dispatch(
                    setCommonModal({
                      title: "Upload Employee",
                      content: <EmployeeFileUpdate />,
                      show: true,
                      width: 400,
                    })
                  );
                }}
              />
              <CreateButton name="Create" onClick={showCreate} />
            </>
          )}
        </div>

        {activeFilters.length > 0 && (
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
            {activeFilters.map((f) => (
              <Tag
                key={f.key}
                closable
                color={f.color}
                onClose={(e) => {
                  e.preventDefault();
                  removeFilter(f.key);
                }}
                style={{ borderRadius: 8, padding: "3px 8px", margin: 0 }}
              >
                {f.label}
              </Tag>
            ))}
            <Button type="link" size="small" onClick={clearAllFilters} style={{ padding: 0 }}>
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

export default EmployeeList;
