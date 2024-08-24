import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Menu,
  MenuProps,
  Popover,
  Space,
  Typography,
} from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useCurrentParam from "../../hooks/useCurrentParam";
import { useGetMeQuery } from "../../app/api/userApi";
import { IUser } from "../../auth/types/loginTypes";
import { setLogout } from "../../app/features/userSlice";
import { useAppDispatch } from "../../app/store/store";

type Props = {};
type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const ProfileSection = (props: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    isLoading,
    data: { profileData },
  } = useGetMeQuery(undefined, {
    selectFromResult: (cache) => {
      const data = cache.data?.data;
      let profileData: IUser = {} as IUser;
      if (data) {
        profileData = data;
      }
      return { ...cache, data: { profileData } };
    },
  });
  const { currentSelection, handleClick } = useCurrentParam();
  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };
  const menuItems: MenuItem[] = [
    getItem(
      <Link to="/setting/profile">Profile</Link>,
      "/setting/profile",
      <UserOutlined />
    ),
    getItem(
      <Button
        style={{}}
        onClick={() => handleLogout()}
        icon={<LogoutOutlined />}
      >
        Logout
      </Button>,
      "1"
    ),
  ];

  return (
    <Popover
      content={
        <Menu
          onClick={handleClick}
          selectedKeys={[currentSelection]}
          items={menuItems}
          defaultChecked={true}
        />
      }
    >
      <Space>
        <Avatar
          shape="square"
          size={"large"}
          style={{
            color: "white",
            backgroundColor: "#0088FE",
            fontSize: "16px",
          }}
        >
          {profileData?.name.slice(0, 1)}
        </Avatar>
        <Typography.Text strong>{profileData?.name}</Typography.Text>
      </Space>
    </Popover>
  );
};

export default ProfileSection;
