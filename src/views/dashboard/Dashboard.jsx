import React, { useEffect, useState } from "react";
import Icon, {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  BarChartOutlined,
  LeftOutlined,
  RightOutlined,
  LogoutOutlined,
  BookOutlined,
  CheckSquareOutlined,
  CopyOutlined,
  MessageOutlined,
  UsergroupAddOutlined,
  TransactionOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Drawer,
  Dropdown,
  Layout,
  Menu,
  message,
  Modal,
  Popover,
  Space,
  theme,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfileAsync, logout } from "../auth/authReducer";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import {
  getNotificationsAsync,
  markNotificationsAsReadAsync,
} from "./notificationReducer";
import { useSocket } from "../../hooks/useSocket";
import { IoCheckmarkDone } from "react-icons/io5";
import AllNotifications from "./AllNotifications";
import { IoIosArrowDown, IoIosNotificationsOutline } from "react-icons/io";
import Notifications from "./Notifications";
import { RiCoupon2Line } from "react-icons/ri";
import { VscFeedback } from "react-icons/vsc";
import { GrAnnounce } from "react-icons/gr";
import { TfiWrite } from "react-icons/tfi";
import { BsPersonGear } from "react-icons/bs";
import { GrTransaction } from "react-icons/gr";
import { IoBookOutline } from "react-icons/io5";
import { IoChatbubblesOutline } from "react-icons/io5";
import { BiBookContent } from "react-icons/bi";
import { IoBriefcaseOutline } from "react-icons/io5";
import { FaRegHourglass } from "react-icons/fa";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const Dashboard = ({ children, collapsed, setCollapsed }) => {
  const api = useAPIPrivate();

  const location = useLocation();
  const { user, profile } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState();
  const navigate = useNavigate();
  const [link, setLink] = useState("");
  const notifications = useSocket(user?.id);
  const [viewSider, setViewSidebar] = useState(false);

  const unreadNotifications =
    (notifications?.length > 0 &&
      notifications?.filter((notification) => !notification.isRead)) ||
    [];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = async () => {
    try {
      const res = await api.get("/assistant/generateReferralCode");
      console.log(res.data);
      setLink(res.data?.link);
    } catch (error) {
      console.log(error);
    }
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onClick = (e) => {
    setActiveKey(e.key);
    //console.log(e.key, "value");
    navigate(e.key);
    // if (isMobile) {
    //   setCollapsed(true);
    // }
  };
  const fetchProfile = async () => {
    const res = await dispatch(getProfileAsync({ id: user?.id, api }));
    console.log(res, "response of fetch profiel");
  };
  useEffect(() => {
    fetchProfile();
    console.log(user, "user proifiolehjb");
  }, []);
  const items = [
    {
      key: "1",
      label: <Link to="/profilesettings">Profile</Link>,
    },
    {
      key: "3",
      label: <Link to="/change-password">Change Password</Link>,
    },
    {
      key: "2",
      label: <button onClick={() => dispatch(logout())}>Logout</button>,
      icon: (
        <LogoutOutlined
          onClick={() => {
            dispatch(logout());
          }}
          className="text-red-900"
        />
      ),
    },
  ];
  const menuItems = [
    getItem(
      "User Management",
      null,
      <Icon component={() => <BsPersonGear />} />,
      [
        getItem("Clients", "/clients", <UserOutlined />),
        getItem("Assistants", "/assistants", <UsergroupAddOutlined />),
      ]
    ),
    getItem("Jobs", null, <Icon component={() => <IoBriefcaseOutline />} />, [
      getItem("Assigned", "/jobs", <UserOutlined />),
      getItem(
        "Unassigned",
        "/unassigned-jobs",
        <Icon component={() => <FaRegHourglass />} />
      ),
    ]),

    getItem("Financial", null, <Icon component={() => <GrTransaction />} />, [
      getItem("Transactions", "/transactions", <TransactionOutlined />),
      getItem(
        "Coupons",
        "/coupons",
        <Icon component={() => <RiCoupon2Line />} />
      ),
    ]),

    getItem("Course", null, <Icon component={() => <IoBookOutline />} />, [
      getItem("Training", "/training", <BookOutlined />),
      getItem("Exercise", "/exercise", <CheckSquareOutlined />),
    ]),

    getItem(
      "Communication",
      null,
      <Icon component={() => <IoChatbubblesOutline />} />,
      [
        getItem("Chat", "/chat", <MessageOutlined />),
        getItem(
          "Feedback",
          "/feedbacks",
          <Icon component={() => <VscFeedback />} />
        ),
      ]
    ),

    getItem("Content", null, <Icon component={() => <BiBookContent />} />, [
      getItem(
        "Announcement",
        "/announcement",
        <Icon component={() => <GrAnnounce />} />
      ),
      getItem("Blog", "/blog", <Icon component={() => <TfiWrite />} />),
    ]),

    getItem(
      <p onClick={showModal} className="bg-green-700 rounded-full text-center">
        Signup Link
      </p>,
      "#"
    ),
  ];

  const handleCopy = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Text copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy text!");
      });
  };

  const fetchNotifications = async () => {
    try {
      console.log("inside fetch notificaitons");
      const { payload } = await dispatch(
        getNotificationsAsync({ id: user?.id })
      );
      console.log(payload, "repsonse of fetch notificaitons using redux");
      // const res = await axios.get(
      //   `http://localhost:8000/api/v1/notification/user/${user?.id}`
      // );
      // console.log("res of fetch notificaitons", res);
      // setNotifications(res?.data);
    } catch (error) {
      console.log(error, "erororroororooro");
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  const handleMarkAllAsRead = async () => {
    try {
      const res = await dispatch(
        markNotificationsAsReadAsync({ id: user?.id })
      );
      console.log(
        res.payload.status,
        "response of mark all notifications as read"
      );

      if (res?.payload?.status === 404) {
        message.info("There are no unread notifications.");
      } else {
        fetchNotifications();
      }
    } catch (error) {
      console.log(error, "erorororororoor");
    }
  };

  const items2 = [
    {
      key: "/users",
      label: "User",
    },
    {
      //   key: 'access_controls',
      //   label: 'Access Controls',
      // },
      // {
      //   key: 'groups',
      //   label: 'Group',
      // },
      // {
      key: "/roles",
      label: "Role",
    },
    {
      key: "/permissions",
      label: "Permission",
    },
    {
      key: "/settings",
      label: "Setting",
    },
  ];
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}>
      <Modal
        title="Referral"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <div className="flex justify-between ">
          <p>{link}</p>
          <CopyOutlined onClick={handleCopy} style={{ cursor: "pointer" }} />
        </div>
      </Modal>
      <Sider
        collapsible
        // width={20}
        // className="border border-red-900 flex items-center justify-center"
        style={{
          height: "100vh",
          position: "fixed",
          // inset: 0,
          overflow: "auto",
          background: "black",
          borderRight: "1px solid #E6EFF5",
          // display: collapsed && "none",
          zIndex: 110,
        }}
        trigger={null}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}>
        <div className="flex flex-col justify-between borde border-red-900 h-full">
          <div>
            <div
              className="bg-black my-2  text-black p-5  borde-2 rounded-full
             flex-col flex items-start  justify-start w-">
              {collapsed ? (
                <>
                  <div className="m- bg-rd-400">
                    <img
                      className="w-[5rem] h-[3rem] z-[9999] borde border-red-900 p-5 bg-whit"
                      src="https://appleazy.nyc3.cdn.digitaloceanspaces.com/web-content/Appleazy_Original_Logo_omjalx%20(1).svg"
                    />
                  </div>
                </>
              ) : (
                <Link
                  to="/"
                  className="borde border-red-900 w-[90%] flex items-center justify-center">
                  <img
                    className="flex justify-center   p- borde border-red-900 items-center"
                    src="https://appleazy.nyc3.cdn.digitaloceanspaces.com/web-content/Appleazy_Original_Logo_omjalx%20(1).svg"
                    width={96}
                    height={96}
                  />
                </Link>
              )}{" "}
            </div>
            <Menu
              className="borde px-1 border-red-900  h-full bg-black"
              theme="dark"
              defaultSelectedKeys={location.pathname}
              activeKey={location.pathname}
              selectedKeys={[location.pathname]}
              mode="inline"
              items={menuItems}
              onClick={onClick}
            />
          </div>
          <div className="text-white borde border-emerald-700">
            <button
              onClick={() => {
                setCollapsed(!collapsed);
                console.log("button clicked");
              }}
              className="flex bg-gray-800 items-center justify-center border border-gray-800 rounded w-full py-4">
              {collapsed ? <RightOutlined /> : <LeftOutlined />}
            </button>
          </div>
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #ffffff",
            position: "sticky",
            top: 0,
            zIndex: 100,
            width: "100%",
            // overflowY: "auto",
          }}>
          <div className="flex flex-row boder boder-red-900 items-center justify-end px-4">
            <Popover
              // autoAdjustOverflow
              // zIndex={999}
              className=" z-[9999]"
              placement="bottom"
              content={
                <div
                  className=" max-h-[300px] z-[9999] sm:max-h-[470px]"
                  style={{
                    // maxHeight: "550px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}>
                  <Notifications setViewSidebar={setViewSidebar} />
                </div>
              }
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              // open
              trigger={["hover", "click"]}>
              <Badge count={unreadNotifications?.length} offset={[-18, 5]}>
                <div className="bg-white rounded-full border-gray-200 border-[0.1px] p-2 mr-4 shadow-sm">
                  <IoIosNotificationsOutline className="w-5 h-5" />
                </div>
              </Badge>
            </Popover>

            {user?.isSystemAdmin ? (
              <div className="max-h-[50px] flex items-center bg-white px-4 rounded-lg ">
                <Dropdown
                  onOpenChange={() => console.log("onOpenChange")}
                  menu={{
                    items: items2,
                    onClick,
                    selectable: true,
                    defaultSelectedKeys: ["3"],
                  }}
                  trigger={["click"]}>
                  <span className="header__right">
                    {/* <WrenchScrewdriverIcon className="h-5 w-5 text-gray-700" /> */}
                    {/* <IoIosArrowDown className="h-5 w-5 text-gray-700" /> */}

                    <Space>
                      <p className="text-black">{"System Admin"}</p>
                      <DownOutlined />
                    </Space>

                    {/* */}
                  </span>
                </Dropdown>
              </div>
            ) : (
              ""
            )}

            <Dropdown
              menu={{
                items,
              }}
              placement="bottomLeft">
              <Avatar
                shape="square"
                src={
                  profile?.profileImage ||
                  `https://robohash.org/${profile?.username}`
                }
                alt="profileimg"
                size="default"
                className="border border-[#E6EFF5] mt mr-2"
              />
            </Dropdown>
            <p className=" whitespace-nowrap">Welcome, {profile?.username}</p>
          </div>
        </Header>
        <Content
          style={{
            margin: "0 ",
            background: "#edf0ff",
          }}>
          {children}
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}>
          APPLEAZY ©{new Date().getFullYear()}
        </Footer>
      </Layout>
      <Drawer
        width={500}
        closable
        destroyOnClose
        title={
          <div className="flex items-center justify-between">
            <p>Notifications</p>{" "}
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center justify-between gap-1">
              <IoCheckmarkDone className="text-[#168A53]" />
              <p className="text-[#168A53]">Mark all as read</p>
            </button>
          </div>
        }
        placement="right"
        open={viewSider}
        onClose={() => setViewSidebar(false)}>
        <AllNotifications setViewSidebar={setViewSidebar} />
      </Drawer>
    </Layout>
  );
};
export default Dashboard;
