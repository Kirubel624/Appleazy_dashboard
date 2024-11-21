import React, { useEffect, useState } from "react";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import { Table } from "antd";
const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiPrivate = useAPIPrivate();
  // Fetch settings from the backend
  const fetchSettings = async () => {
    try {
      const response = await apiPrivate.get("/settings");
      setSettings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setLoading(false);
    }
  };
  const columns = [
    {
      key: "type",
      dataIndex: "type",
      title: "Platform",
      render: (_, record) => <div></div>,
    },
    {
      key: "maintenanceMsg",
      dataIndex: "maintenanceMsg",
      title: "Maintenance Message",
    },
    {
      key: "maintenanceMode",
      dataIndex: "maintenanceMode",
      title: "Maintenance Mode",
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
