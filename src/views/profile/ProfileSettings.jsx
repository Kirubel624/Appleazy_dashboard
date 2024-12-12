import React, { useState } from "react";
import Profile from "./Profile";
import Settings from "./Settings";
import { Tabs } from "antd";

const ProfileSettings = ({ collapsed, setCollapsed }) => {
  const [selectedTab, setSelectedTab] = useState("1");
  const onChange = (key) => {
    console.log(key);
    setSelectedTab(key);
  };
  const items = [
    {
      key: "1",
      label: "Profile",
      children: <Profile collapsed={collapsed} />,
    },
    {
      key: "2",
      label: "Maintenance settings",
      children: <Settings />,
    },
    // {
    //   key: "3",
    //   label: "Tab 3",
    //   children: "Content of Tab Pane 3",
    // },
  ];
  return (
    <div
      className={`${
        collapsed ? "ml-[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 px-10`}>
      <Tabs defaultActiveKey={selectedTab} items={items} onChange={onChange} />
    </div>
  );
};

export default ProfileSettings;
