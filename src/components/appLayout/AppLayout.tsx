/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { BiSolidFilePdf } from "react-icons/bi";
import { PiYoutubeLogoFill } from "react-icons/pi";
import { FaBookOpen } from "react-icons/fa";
import {
  Button,
  Grid,
  Image,
  Layout,
  Menu,
  Dropdown,
  MenuProps,
  Popover,
  theme,
  Avatar,
  Badge,
  Input,
  Tooltip,
  Typography,
  Space,
  Drawer,
} from "antd";
import { Footer } from "antd/es/layout/layout";
import { useEffect, useState, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { setLogout } from "../../app/features/userSlice";
import { RootState, useAppDispatch } from "../../app/store/store";
import { menuItems } from "./AppLayoutData";
import { useSelector } from "react-redux";
import { api } from "../../app/api/api";
import { useGetMeQuery } from "../../app/api/userApi";
import logo from "../../assets/logo.png";
import { roleID } from "../../utils/helper";

const { useBreakpoint } = Grid;
const { Header, Sider, Content } = Layout;
const { Text } = Typography;

// Professional light theme with hover animations and softer design
const professionalStyles = {
  sidebar: {
    background: "linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)",
    borderRight: "1px solid #e2e8f0",
    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.03)",
  },
  header: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
    backdropFilter: "blur(10px)",
  },
  menuItem: {
    borderRadius: "10px",
    margin: "3px 12px",
    fontSize: "13px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  logoContainer: {
    padding: "10px 15px",
    borderBottom: "1px solid #f1f5f9",
    marginBottom: "12px",
    background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
  },
  userSection: {
    padding: "16px",
    background: "linear-gradient(135deg, #f1f5f9 0%, #f8fafc 100%)",
    margin: "12px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    transition: "all 0.3s ease",
  },
  headerButton: {
    border: "1px solid #e2e8f0",
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    color: "#475569",
    borderRadius: "10px",
    height: "2.5rem", // Use rem for scalability
    minWidth: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
    transform: "scale(1)",
  },
  profileButton: {
    background: "#ffffff",
    color: "#000000",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    height: "2.5rem",
    padding: "0 14px",
    fontSize: "0.8125rem",
    fontWeight: 600,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    transform: "scale(1)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  profileButtonHover: {
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  headerButtonHover: {
    transform: "scale(1.08)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.06)",
  },
  quickActionButton: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    height: "2.5rem",
    padding: "0 1.25rem",
    fontSize: "0.8125rem",
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative" as "relative",
    overflow: "hidden",
  },
  taskButton: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
  },
};

export const AppLayout = () => {
  const { data: profile } = useGetMeQuery();
  const [collapsed, setCollapsed] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<string>("");
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [openKeys, setOpenKeys] = useState<Array<string>>([]);
  const [drawerVisible, setDrawerVisible] = useState(false); // New state for mobile drawer
  const location = useLocation();
  const gridBreak = useBreakpoint();
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const memoizedMenuItems = useMemo(
    () => menuItems(profile?.data, roleId as number),
    [profile?.data, roleId]
  );

  const helpMenu = (
    <Menu
      style={{
        borderRadius: "8px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e5e7eb",
        fontSize: "0.875rem",
      }}
    >
      <Menu.Item key="1" icon={<BiSolidFilePdf color="#E03C31" size={20} />}>
        <a
          href="https://www.dropbox.com/scl/fi/xezlzy76ejnszoj7zah9a/System-Overview.pdf?rlkey=j16ellbggvjv4g6hpdhz63ksb&st=5weqe9nj&raw=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          System Overview
        </a>
      </Menu.Item>
      <Menu.Item key="2" icon={<BiSolidFilePdf color="#E03C31" size={20} />}>
        <a
          href="https://www.dropbox.com/scl/fi/qohmr0km29jnbdjmbtxrl/Ticket-Raise-Process.pdf?rlkey=qnfg48axugbctmuh24o1qiwse&st=cx5r02qk&raw=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ticketing Guide
        </a>
      </Menu.Item>
      <Menu.Item key="3" icon={<BiSolidFilePdf color="#E03C31" size={20} />}>
        <a
          href="https://www.dropbox.com/scl/fi/2oqld6escz4faz61e363n/Profile-Update.pdf?rlkey=qn4vrnmxq3cy8uhg3y2sh5jqo&st=l8rjrhe1&raw=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Profile Update
        </a>
      </Menu.Item>
    </Menu>
  );

  const handleLogout = () => {
    dispatch(setLogout());
    dispatch(api.util.resetApiState());
    navigate("/login");
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const index = location.pathname.indexOf(
      "/",
      location.pathname.indexOf("/", location.pathname.indexOf("/") + 1) + 1
    );
    const result =
      index !== -1 ? location.pathname.substring(0, index) : location.pathname;
    setCurrentSelection(result);
    const modulePath = location.pathname.split("/")[1];
    setOpenKeys([modulePath]);
  }, [location]);

  const rootSubmenuKeys = memoizedMenuItems.map((item: any) => item?.key);

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const handleClick: MenuProps["onClick"] = (e) => {
    setCurrentSelection("");
    setTimeout(() => {
      setCurrentSelection(e.key);
      if (gridBreak.xs) setDrawerVisible(false); // Close drawer on mobile after selection
    }, 0);
  };

  interface DataObject {
    children?: DataObject[] | null;
    icon: string;
    key: string;
    label: any;
  }

  function findObjectWithKey(
    data: DataObject[],
    path: { pathname: string; state?: string },
    parentIndices: string[] = []
  ): string[] | null {
    for (let i = 0; i < data.length; i++) {
      if (data[i] === null) continue;
      const object = data[i];
      if (object.key === path.pathname || object.key === path?.state) {
        return [...parentIndices, object.key];
      }
      if (object.children && Array.isArray(object.children)) {
        const childIndices = findObjectWithKey(object.children, path, [
          ...parentIndices,
          object.key,
        ]);
        if (childIndices) return childIndices;
      }
    }
    return null;
  }

  useEffect(() => {
    const indices = findObjectWithKey(memoizedMenuItems as DataObject[], {
      pathname: location.pathname,
      state: location.state,
    });
    if (indices) {
      setOpenKeys(indices);
      setCurrentSelection(indices[indices.length - 1]);
    }
  }, [location.pathname, memoizedMenuItems]);

  const handleResizeStart = (e: any) => {
    e.preventDefault();
    const startX = e.clientX;

    const handleResizeDrag = (e: any) => {
      const newWidth = Math.max(200, Math.min(320, sidebarWidth + (e.clientX - startX)));
      setSidebarWidth(newWidth);
    };

    const handleResizeEnd = () => {
      document.removeEventListener("mousemove", handleResizeDrag);
      document.removeEventListener("mouseup", handleResizeEnd);
    };

    document.addEventListener("mousemove", handleResizeDrag);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  useEffect(() => {
    if (gridBreak.xs) {
      setCollapsed(true);
      setDrawerVisible(false);
    } else {
      setCollapsed(false);
      setDrawerVisible(false);
    }
  }, [gridBreak.xs]);

  const userMenuContent = (
    <div style={{ minWidth: "180px" }}>
      <div style={{ padding: "12px", borderBottom: "1px solid #f3f4f6" }}>
        <Space direction="vertical" size={2}>
          <Text strong style={{ fontSize: "0.875rem" }}>{profile?.data?.name}</Text>
          <Text type="secondary" style={{ fontSize: "0.75rem" }}>
            {profile?.data?.email}
          </Text>
        </Space>
      </div>
      <Menu style={{ border: "none", fontSize: "0.875rem" }}>
        <Menu.Item key="profile" icon={<UserOutlined />}>
          <Link to="/setting/profile">Profile Settings</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout" icon={<LogoutOutlined />} danger onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu>
    </div>
  );

  const quickActions = [
    {
      key: "tasks",
      label: "Task Manager",
      path: "/task/list",
      show: roleId !== 3,
    },
    {
      key: "tickets",
      label: "Ticketing System",
      path: "/tickets/list",
      show: true,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Sidebar for Desktop */}
      {!gridBreak.xs && (
        <Sider
          width={sidebarWidth}
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            ...professionalStyles.sidebar,
            overflow: "auto",
            height: "100vh",
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 100,
          }}
        >
          <div style={professionalStyles.logoContainer}>
            {collapsed ? (
              <div style={{ textAlign: "center" }}>
                <Image
                  height="3rem"
                  width="3rem"
                  preview={false}
                  src={logo}
                  alt="DBI Group Logo"
                  style={{ borderRadius: "4px", objectFit: "contain" }}
                />
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <Image
                  height="8rem"
                  width="100%"
                  preview={false}
                  src={logo}
                  alt="DBI Group Logo"
                  style={{ borderRadius: "6px", objectFit: "contain" }}
                />
              </div>
            )}
          </div>

          {!collapsed && profile?.data && (
            <div
              style={professionalStyles.userSection}
              onMouseEnter={(e) => {
                if (!gridBreak.xs) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.08)";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)";
                }
              }}
              onMouseLeave={(e) => {
                if (!gridBreak.xs) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #f1f5f9 0%, #f8fafc 100%)";
                }
              }}
            >
              <Space align="center" size={12}>
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  style={{
                    background: roleId === 3
                      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                      : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    fontSize: "0.875rem",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    border: "2px solid rgba(255, 255, 255, 0.8)",
                  }}
                />
                <div>
                  <Text
                    style={{
                      color: "#1e293b",
                      fontSize: "0.875rem",
                      display: "block",
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {profile.data.name}
                  </Text>
                  <Text
                    style={{
                      color: "#64748b",
                      fontSize: "0.75rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {roleId === 1 ? (
                      <span>
                        <span style={{ position: "relative", top: "-1.5px" }}>👑</span> Super Admin
                      </span>
                    ) : roleId === 2 ? (
                      "⚡ Admin"
                    ) : roleId === 3 ? (
                      "👤 User"
                    ) : (
                      "❓ Unknown"
                    )}
                  </Text>
                </div>
              </Space>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "3px",
              cursor: "ew-resize",
              background: "transparent",
              transition: "background 0.2s ease",
            }}
            onMouseDown={handleResizeStart}
            onMouseEnter={(e) => {
              if (!gridBreak.xs) e.currentTarget.style.background = "#e5e7eb";
            }}
            onMouseLeave={(e) => {
              if (!gridBreak.xs) e.currentTarget.style.background = "transparent";
            }}
          />

          <Menu
            mode="inline"
            items={memoizedMenuItems}
            style={{
              background: "transparent",
              border: "none",
              marginTop: "8px",
              fontSize: "0.875rem",
            }}
            selectedKeys={[currentSelection]}
            openKeys={openKeys}
            defaultSelectedKeys={["/"]}
            onOpenChange={onOpenChange}
            onClick={handleClick}
            theme="light"
            className="custom-menu"
          />
        </Sider>
      )}

      {/* Drawer for Mobile */}
      {gridBreak.xs && (
        <Drawer
          title={
            <div style={{ textAlign: "center" }}>
              <Image
                height="3rem"
                width="3rem"
                preview={false}
                src={logo}
                alt="DBI Group Logo"
                style={{ borderRadius: "4px", objectFit: "contain" }}
              />
            </div>
          }
          placement="left"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          width="80%"
          bodyStyle={{ padding: 0 }}
          zIndex={1000}
        >
          {profile?.data && (
            <div style={{ ...professionalStyles.userSection, margin: "0 12px 12px" }}>
              <Space align="center" size={12}>
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  style={{
                    background: roleId === 3
                      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                      : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    fontSize: "0.875rem",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    border: "2px solid rgba(255, 255, 255, 0.8)",
                  }}
                />
                <div>
                  <Text
                    style={{
                      color: "#1e293b",
                      fontSize: "0.875rem",
                      display: "block",
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {profile.data.name}
                  </Text>
                  <Text
                    style={{
                      color: "#64748b",
                      fontSize: "0.75rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {roleId === 1 ? (
                      <span>
                        <span style={{ position: "relative", top: "-1.5px" }}>👑</span> Super Admin
                      </span>
                    ) : roleId === 2 ? (
                      "⚡ Admin"
                    ) : roleId === 3 ? (
                      "👤 User"
                    ) : (
                      "❓ Unknown"
                    )}
                  </Text>
                </div>
              </Space>
            </div>
          )}
          <Menu
            mode="inline"
            items={memoizedMenuItems}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "0.875rem",
            }}
            selectedKeys={[currentSelection]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onClick={handleClick}
            theme="light"
            className="custom-menu"
          />
        </Drawer>
      )}

      <Layout>
        <Header
          style={{
            ...professionalStyles.header,
            padding: "0 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "3.5rem",
            position: "sticky",
            top: 0,
            zIndex: 99,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Button
              type="text"
              icon={gridBreak.xs ? <MenuUnfoldOutlined /> : collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => (gridBreak.xs ? setDrawerVisible(true) : setCollapsed(!collapsed))}
              style={{
                ...professionalStyles.headerButton,
                fontSize: "0.875rem",
                height: "2rem",
                minWidth: "2rem",
              }}
              onMouseEnter={(e) => {
                if (!gridBreak.xs) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)";
                }
              }}
              onMouseLeave={(e) => {
                if (!gridBreak.xs) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.02)";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)";
                }
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Space size={8}>
              {quickActions.map((action) =>
                action.show && (
                  <Link key={action.key} to={action.path}>
                    <Tooltip title={action.label}>
                      <Button
                        className="hover:scale-[1.05] hover:shadow-lg transition-transform duration-300 ease-in-out"
                        style={{
                          ...professionalStyles.quickActionButton,
                          height: "2rem",
                          padding: "0 0.75rem",
                          fontSize: "0.75rem",
                        }}
                        size="small"
                      >
                        {action.label}
                      </Button>
                    </Tooltip>
                  </Link>
                )
              )}
            </Space>

            <Space size={4} align="center">
              <Dropdown overlay={helpMenu} trigger={["click"]} placement="bottomRight">
                <Tooltip title="Help & Documentation">
                  <Button
                    icon={<FaBookOpen color="#2a3b4f" size={20} style={{ marginTop: "3px" }} />}
                    style={{ ...professionalStyles.headerButton, height: "2rem", minWidth: "2rem" }}
                    size="large"
                    onMouseEnter={(e) => {
                      if (!gridBreak.xs) e.currentTarget.style.transform = professionalStyles.headerButtonHover.transform;
                    }}
                    onMouseLeave={(e) => {
                      if (!gridBreak.xs) e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                </Tooltip>
              </Dropdown>

              <Tooltip title="Video Tutorials">
                <Button
                  icon={<PiYoutubeLogoFill color="#FF0000" size={25} style={{ marginTop: "3px" }} />}
                  style={{ ...professionalStyles.headerButton, height: "2rem", minWidth: "2rem" }}
                  size="large"
                  onClick={() =>
                    window.open(
                      "https://www.youtube.com/playlist?list=PL1I5_y65vLeHbVZMV3EmR_hLkKms_AWTD",
                      "_blank"
                    )
                  }
                  onMouseEnter={(e) => {
                    if (!gridBreak.xs) e.currentTarget.style.transform = professionalStyles.headerButtonHover.transform;
                  }}
                  onMouseLeave={(e) => {
                    if (!gridBreak.xs) e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </Tooltip>

              <Popover
                content={userMenuContent}
                trigger="click"
                placement="bottomRight"
                overlayStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Button
                  style={{
                    ...professionalStyles.headerButton,
                    ...professionalStyles.profileButton,
                    height: "2rem",
                    padding: "0 0.75rem",
                    fontSize: "0.75rem",
                  }}
                  onMouseEnter={(e) => {
                    if (!gridBreak.xs) Object.assign(e.currentTarget.style, professionalStyles.profileButtonHover);
                  }}
                  onMouseLeave={(e) => {
                    if (!gridBreak.xs) Object.assign(e.currentTarget.style, professionalStyles.profileButton);
                  }}
                >
                  <Avatar
                    size={24}
                    icon={<UserOutlined style={{ fontSize: "12px" }} />}
                    style={{
                      backgroundColor: roleId === 3 ? "#10b981" : "#3b82f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.625rem", // 10px fallback if needed
                    }}
                  />

                </Button>
              </Popover>
            </Space>
          </div>
        </Header>

        <Content
          style={{
            padding: gridBreak.xs ? "0.5rem" : "1rem",
            minHeight: 280,
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
            border: "1px solid #e5e7eb",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>

        <Footer
          style={{
            textAlign: "center",
            padding: gridBreak.xs ? "0.5rem 1rem" : "0.75rem 1rem",
            fontSize: gridBreak.xs ? "0.625rem" : "0.75rem",
            color: "#6b7280",
            background: "#ffffff",
          }}
        >
          <Text type="secondary" style={{ fontSize: gridBreak.xs ? "0.625rem" : "0.75rem" }}>
            © {new Date().getFullYear()} DBL Group. All Rights Reserved.
          </Text>
        </Footer>
      </Layout>

      <style>{`
        .custom-menu .ant-menu-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border-radius: 10px !important;
          margin: 3px 12px !important;
          font-size: ${gridBreak.xs ? "0.75rem" : "0.875rem"} !important;
        }

        .custom-menu .ant-menu-item:hover {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%) !important;
          transform: ${gridBreak.xs ? "none" : "translateX(4px)"} !important;
          box-shadow: ${gridBreak.xs ? "none" : "0 4px 12px rgba(0, 0, 0, 0.08)"} !important;
        }

        .custom-menu .ant-menu-item-selected {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
          border-right: 3px solid #3b82f6 !important;
          transform: ${gridBreak.xs ? "none" : "translateX(6px)"} !important;
          box-shadow: ${gridBreak.xs ? "none" : "0 4px 16px rgba(59, 130, 246, 0.2)"} !important;
        }

        .custom-menu .ant-menu-submenu-title:hover {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%) !important;
          transform: ${gridBreak.xs ? "none" : "translateX(2px)"} !important;
        }

        @media (max-width: 576px) {
          .ant-menu-item, .ant-menu-submenu-title {
            padding: 0.5rem !important;
          }
          .ant-menu-item-icon {
            font-size: 1rem !important;
          }
          .ant-menu-title-content {
            font-size: 0.75rem !important;
          }
        }

        @media (max-width: 360px) {
          .ant-menu-item, .ant-menu-submenu-title {
            padding: 0.4rem !important;
          }
          .ant-menu-item-icon {
            font-size: 0.875rem !important;
          }
          .ant-menu-title-content {
            font-size: 0.6875rem !important;
          }
        }
      `}</style>
    </Layout>
  );
};