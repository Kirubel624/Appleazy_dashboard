import React, { useEffect, useState } from "react";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import { Button, Switch, Table, Input, message, Modal } from "antd";
import { useSelector } from "react-redux";
import { FaExternalLinkAlt } from "react-icons/fa";

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState({
    website: false,
    dashboard: false,
    assistantDashboard: false,
  });
  const [editingMsg, setEditingMsg] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const apiPrivate = useAPIPrivate();
  const { accessToken } = useSelector((state) => state.auth);

  // Fetch settings from the backend
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await apiPrivate.get("/settings");
      const settingsWithUrls = response?.data?.settings?.map((item) => {
        let customUrl = "";
        let imgUrl = "";
        switch (item.type) {
          case "website":
            customUrl = "https://www.appleazy.com";
            imgUrl =
              "https://appleazy.nyc3.cdn.digitaloceanspaces.com/web-content/appleazywebsite.PNG";
            break;
          case "dashboard":
            customUrl = "https://dashboard.appleazy.com";
            imgUrl =
              "https://appleazy.nyc3.cdn.digitaloceanspaces.com/web-content/appleazydashboard.PNG";
            break;
          case "assistantDashboard":
            customUrl = "https://assistant.appleazy.com";
            imgUrl =
              "https://appleazy.nyc3.cdn.digitaloceanspaces.com/web-content/appleazyassistant.PNG";
            break;
          default:
            customUrl = "#";
            imgUrl = "#";
        }
        return {
          ...item,
          url: customUrl,
          img: imgUrl,
        };
      });
      setSettings(settingsWithUrls);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setLoading(false);
    }
  };

  const handleToggleMaintenance = (value, record) => {
    if (record.type === "website") {
      setLoadingToggle({ ...loadingToggle, website: true });
    } else if (record.type === "dashboard") {
      setLoadingToggle({ ...loadingToggle, dashboard: true });
    } else {
      setLoadingToggle({ ...loadingToggle, assistantDashboard: true });
    }
    if (value) {
      Modal.confirm({
        title: "Warning",
        content:
          "Turning on the maintenance mode will put the website into maintenance. Users will not be able to access the features until it's turned back off.",
        onOk: () => {
          updateMaintenanceMode(value, record);
        },
        onCancel: () => {
          if (record.type === "website") {
            setLoadingToggle({ ...loadingToggle, website: false });
          } else if (record.type === "dashboard") {
            setLoadingToggle({ ...loadingToggle, dashboard: false });
          } else {
            setLoadingToggle({ ...loadingToggle, assistantDashboard: false });
          }
          //   setLoadingToggle(false);
        },
      });
    } else {
      updateMaintenanceMode(value, record);
    }
  };

  const updateMaintenanceMode = async (value, record) => {
    try {
      await apiPrivate.patch(`/settings/toggle`, {
        type: record.type,
        status: value,
      });
      message.success("Maintenance mode updated successfully.");
      fetchSettings();
    } catch (error) {
      console.error("Error updating maintenance mode:", error);
      message.error("Error updating maintenance mode.");
    } finally {
      if (record.type === "website") {
        setLoadingToggle({ ...loadingToggle, website: false });
      } else if (record.type === "dashboard") {
        setLoadingToggle({ ...loadingToggle, dashboard: false });
      } else {
        setLoadingToggle({ ...loadingToggle, assistantDashboard: false });
      }
    }
  };

  const handleSaveMessage = async (record) => {
    try {
      await apiPrivate.patch(`/settings/toggle`, {
        type: record.type,
        message: newMsg,
      });
      message.success("Maintenance message updated successfully.");
      setEditingMsg(null);
      fetchSettings();
    } catch (error) {
      console.error("Error updating maintenance message:", error);
      message.error("Error updating maintenance message.");
    }
  };

  const columns = [
    {
      key: "type",
      dataIndex: "type",
      title: "Platform",
      render: (_, record) => (
        <div className="relative w-[6rem]">
          <img
            src={record?.img}
            className="w-full h-full object-cover transition-opacity duration-300"
            alt="website preview"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-0 hover:opacity-50 transition-opacity duration-300">
            <div className="absolute top-2 right-2 opacity-100 bg-white rounded-full p-[0.4rem]">
              <a href={record?.url} target="_blank" rel="noopener noreferrer">
                <FaExternalLinkAlt className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "maintenanceMsg",
      dataIndex: "maintenanceMsg",
      title: "Maintenance Message",
      render: (_, record) =>
        editingMsg === record.id ? (
          <Input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onBlur={() => handleSaveMessage(record)}
            onPressEnter={() => handleSaveMessage(record)}
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer"
            onClick={() => {
              setEditingMsg(record.id);
              setNewMsg(record.maintenanceMsg);
            }}>
            {record.maintenanceMsg}
          </span>
        ),
    },
    {
      key: "maintenanceMode",
      dataIndex: "maintenanceMode",
      title: "Maintenance Mode",
      render: (_, record) => (
        <Switch
          loading={loadingToggle[record.type] || false}
          checkedChildren="ON"
          unCheckedChildren="OFF"
          checked={record?.maintenanceMode}
          onChange={(value) => handleToggleMaintenance(value, record)}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div>
      <Table loading={loading} columns={columns} dataSource={settings} />
    </div>
  );
};

export default Settings;
