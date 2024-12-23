import React, { useEffect, useState } from "react";
import {
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
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Dropdown,
  Layout,
  Menu,
  message,
  Modal,
  theme,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfileAsync, logout } from "../auth/authReducer";
import useAPIPrivate from "../../hooks/useAPIPrivate";
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
    const res = await dispatch(getProfileAsync(user?.id));
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
    getItem("Clients", "/clients", <BookOutlined />),

    getItem("Assistants", "/assistants", <BookOutlined />),
    getItem("Transactions", "/transactions", <CheckSquareOutlined />),

    getItem("Training", "/training", <BookOutlined />),
    getItem("Exercise", "/exercise", <CheckSquareOutlined />),
    getItem("Blog", "/blog", <CheckSquareOutlined />),
    getItem("FeedBacks", "/feedbacks", <CheckSquareOutlined />),

    getItem("Coupons", "/coupons", <CheckSquareOutlined />),
    getItem(
      <p
        onClick={showModal}
        className="bg-green-700 rounded-full text-center  ">
        Signup Link
      </p>,
      "#"
      // <CheckSquareOutlined />
    ),

    // getItem("Job board", "/job_board", <InfoCircleOutlined />),

    // getItem("History", "/histry", <BarChartOutlined />),
  ];
  const handleCopy = () => {
    navigator.clipboard
      .writeText(link) // Copy the text to clipboard
      .then(() => {
        message.success("Text copied to clipboard!"); // Show success message
      })
      .catch(() => {
        message.error("Failed to copy text!"); // Show error message if copying fails
      });
  };
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
                      src="https://res.cloudinary.com/dtwmhl1oh/image/upload/v1723188879/Appleazy_Original_Logo_omjalx.svg"
                    />
                  </div>
                  {/* <Link
                    to="/"
                    className="sm:hidden border border-red-900 p-5 relative inline-block group justify-center
                    
                    items-center w-full">
                    awdaw
                    <img
                      className="sm:hidden flex justify-center p-5 m-5 border border-red-900 items-center"
                      src="https://res.cloudinary.com/dtwmhl1oh/image/upload/v1723189681/Applezy_q7mb0r.svg"
                      width={32}
                      height={32}
                    />
                  </Link> */}
                </>
              ) : (
                <Link
                  to="/"
                  className="borde border-red-900 w-[90%] flex items-center justify-center">
                  <img
                    className="flex justify-center   p- borde border-red-900 items-center"
                    src="https://res.cloudinary.com/dtwmhl1oh/image/upload/v1723188879/Appleazy_Original_Logo_omjalx.svg"
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
          <div className="flex flex-row boder boder-red-900 justify-end px-4">
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
                className="border border-[#E6EFF5] mt-4 mr-2"
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
    </Layout>
  );
};
export default Dashboard;
