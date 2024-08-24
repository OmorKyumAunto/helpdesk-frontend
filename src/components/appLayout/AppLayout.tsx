/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  FullscreenOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Typography,
  Popover,
  MenuProps,
  Grid,
  Image,
  Avatar,
} from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Footer } from "antd/es/layout/layout";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../app/store/store";
import { setLogout } from "../../app/features/userSlice";
import { menuItems } from "./AppLayoutData";
// import LiveTime from "../Time/LiveTime";
import userIcon from "../../assets//user.png";
import { globalTheme, setTheme } from "../../app/slice/themeSlice";
import { useSelector } from "react-redux";
// import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import logo from "../../assets/logo.png";
import DateTimeWidget from "./DateTimeWidget";
import { useGetMeQuery } from "../../app/api/userApi";
// import Notification from "../notification/Notification";
const { useBreakpoint } = Grid;

const { Header, Sider, Content } = Layout;
export const AppLayout = () => {
  const { data: profile } = useGetMeQuery();
  const [collapsed, setCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<string>("");
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [openKeys, setOpenKeys] = useState<Array<string>>([]);
  const location = useLocation();
  const gridBreak = useBreakpoint();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(setLogout());
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

  const rootSubmenuKeys = menuItems(profile?.data).map(
    (item: any) => item?.key
  );
  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const handleClick: MenuProps["onClick"] = (e) => {
    setCurrentSelection(e.key);
  };

  interface DataObject {
    children?: DataObject[] | null;
    icon: string;
    key: string;
    label: any;
  }
  function findObjectWithKey(
    data: DataObject[],
    path: {
      pathname: string;
      state?: string;
    },
    parentIndices: string[] = []
  ): string[] | null {
    for (let i = 0; i < data.length; i++) {
      if (data[i] === null) {
        continue;
      }
      const object = data[i];
      if (object.key === path.pathname || object.key === path?.state) {
        return [...parentIndices, object.key];
      }
      if (object.children && Array.isArray(object.children)) {
        const childIndices = findObjectWithKey(object.children, path, [
          ...parentIndices,
          object.key,
        ]);
        if (childIndices) {
          return childIndices;
        }
      }
    }
    return null;
  }

  useEffect(() => {
    const indices = findObjectWithKey(
      menuItems(profile?.data) as DataObject[],
      {
        pathname: location.pathname,
        state: location.state,
      }
    );
    if (indices) {
      setOpenKeys(indices);
      setCurrentSelection(indices[indices.length - 1]);
    }
  }, [location.pathname]);

  //   for full screen
  const handleFullscreenToggle = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const enterFullscreen = () => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };
  // const themeGlobal = useSelector(globalTheme);

  // const handleDarkTheme = () => {
  //   dispatch(setTheme(theme.darkAlgorithm));
  // };
  // const handleLightTheme = () => {
  //   dispatch(setTheme(theme.defaultAlgorithm));
  // };
  const grid = useBreakpoint();
  useEffect(() => {
    if (grid.xs) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [grid.xs]);
  const content = (
    <div>
      <Link to="/setting/profile">
        <Button color="primary" icon={<UserOutlined />}>
          Profile
        </Button>
      </Link>
      <br />
      <Link to="/login">
        <Button
          danger
          style={{ marginTop: "10px" }}
          color="primary"
          icon={<LogoutOutlined />}
          onClick={() => handleLogout()}
        >
          Logout
        </Button>
      </Link>
    </div>
  );

  const handleResizeStart = (e: any) => {
    e.preventDefault();
    const startX = e.clientX;

    const handleResizeDrag = (e: any) => {
      const newWidth = sidebarWidth + (e.clientX - startX);
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
    } else {
      setCollapsed(false);
    }
  }, [gridBreak.xs]);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={sidebarWidth}
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        style={{
          overflow: "auto",
          height: "100vh",
          background: colorBgContainer,
          // width: "80%",
          position: "sticky",
          top: 0,
          left: 0,
          display: `${
            grid.xs && !collapsed ? "block" : grid.md ? "block" : "none"
          }`,
        }}
      >
        <div>
          {collapsed ? (
            <div className="flex justify-center mt-2">
              <Image
                height={40}
                preview={false}
                src={logo}
                alt="DBI Group Logo"
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <Image
                height={120}
                preview={false}
                src={logo}
                alt="DBI Group Logo"
              />
            </div>
          )}
        </div>
        {!collapsed && (
          <div
            style={{
              backgroundColor: "#e6e6e6",
              textAlign: "center",
            }}
          >
            <Typography.Title level={4} style={{ padding: "10px 0" }}>
              <Avatar src={userIcon} /> Hello {profile?.data?.name}
            </Typography.Title>
          </div>
        )}
        <div className="resize-handle" onMouseDown={handleResizeStart} />
        <Menu
          mode="inline"
          items={menuItems(profile?.data)}
          style={{ marginTop: "15px" }}
          selectedKeys={[currentSelection]}
          openKeys={openKeys}
          defaultSelectedKeys={["/"]}
          onOpenChange={onOpenChange}
          onClick={handleClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#1775BB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />

            {/* <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Button
                type="primary"
                style={{ border: "none" }}
                onClick={() => navigate(-1)}
                size="small"
                icon={<LeftOutlined />}
              />
              <Button
                onClick={() => navigate(1)}
                size="small"
                style={{ border: "none" }}
                icon={<RightOutlined />}
                type="primary"
              />
            </div> */}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              padding: "10px",
            }}
          >
            {/* {!grid.xs && (
              <div>
                <p
                  style={{
                    color: "white",
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  Hello {profile?.data?.name}
                </p>
              </div>
            )} */}

            {/* notifications  */}
            {/* {!grid.xs && (
              <Button
                icon={<FullscreenOutlined />}
                type="dashed"
                onClick={handleFullscreenToggle}
              />
            )} */}
            {/* <div>
              {themeGlobal.theme === theme.defaultAlgorithm ? (
                <Button
                  onClick={() => {
                    handleDarkTheme();
                  }}
                  icon={<BsFillMoonStarsFill />}
                  type="dashed"
                />
              ) : (
                <Button
                  onClick={() => {
                    handleLightTheme();
                  }}
                  icon={<BsFillSunFill />}
                  type="dashed"
                />
              )}
            </div> */}

            {/* <Popover content={content}>
              <Button
                icon={<UserOutlined />}
                type="dashed"
                style={{
                  marginRight: "20px",
                }}
              />
            </Popover> */}
            <Link to="/login">
              <Button
                danger
                style={{ marginTop: "10px" }}
                color="primary"
                icon={<LogoutOutlined />}
                onClick={() => handleLogout()}
              >
                Logout
              </Button>
            </Link>
          </div>
        </Header>

        <Content
          style={{
            margin: "12px 12px",
            // padding: 18,
            // minHeight: 280,
            // background: "rgb(255, 255, 255",
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>

        <Footer
          style={{
            textAlign: "center",
            padding: 8,
            margin: 0,
            fontSize: 13,
            color: "#343a40",
            background: "rgba(240, 242, 245, 1)",
          }}
        >
          <strong>
            Copyright © {new Date().getFullYear()} DBL Group. All Rights
            Reserved.
          </strong>
        </Footer>
      </Layout>
    </Layout>
  );
};
