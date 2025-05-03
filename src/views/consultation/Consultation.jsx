import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Select, Modal, notification, message } from "antd";
import { AiOutlineEdit } from "react-icons/ai";
import axios from "axios";
import api, { apiPrivate } from "../../utils/api";

const { Option } = Select;

const statusColors = {
  pending: "orange",
  completed: "green",
  canceled: "red",
};

const ConsultationList = ({ collapsed, setCollapsed }) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState("pending");
  const [modalVisible, setModalVisible] = useState(false);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const res = await apiPrivate.get("/consultation");
      console.log(res, "respon of get ocnsultaitons");
      setConsultations(res.data.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load consultations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const openStatusModal = (record) => {
    setSelected(record);
    setNewStatus(record.status);
    setModalVisible(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await api.patch(`/consultation/${selected.id}`, {
        status: newStatus,
      });
      message.success(`Consultation status updated to "${newStatus}"`);
      setModalVisible(false);
      fetchConsultations();
    } catch (error) {
      console.error(error);
      message.error("Failed to update status.");
    }
  };
  const formatPreferredTime = (input) => {
    const [dateStr, timeRange] = input.split(" | ");
    const date = new Date(dateStr);

    const options = { month: "short", day: "2-digit", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    return `${formattedDate} | ${timeRange}`;
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium">{text}</span>,
      //   width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      //   width: 180,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      //   width: 150,
    },
    {
      title: "Time Slot",
      dataIndex: "preferredTime",
      key: "preferredTime",
      width: 180,
      render: (text) => <p className="">{formatPreferredTime(text)}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <button
          type="primary"
          className="flex items-center bg-[#168A53] py-2 px-3 rounded text-white"
          onClick={() => openStatusModal(record)}>
          <AiOutlineEdit className="mr-2" />
          Update
        </button>
      ),
    },
  ];

  return (
    <div
      className={`${
        collapsed ? "ml-[32px] mr-0 sm:[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}
      //   className="p-6 bg-white rounded shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4">Consultation Requests</h2>
      <Table
        columns={columns}
        dataSource={consultations}
        loading={loading}
        rowkey={(record) => record.id}
        scroll={{
          x: 700,
        }}
      />

      <Modal
        title="Update Consultation Status"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
        footer={null}
        okText="Update">
        <div className="flex flex-col gap-3">
          <p>
            Selected: <b>{selected?.name}</b>
          </p>
          <Select value={newStatus} onChange={setNewStatus}>
            <Option value="pending">Pending</Option>
            <Option value="completed">Completed</Option>
            <Option value="canceled">Canceled</Option>
          </Select>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleStatusUpdate}
            className="flex items-center bg-[#168A53] py-2 px-3 rounded
           text-white">
            Update
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ConsultationList;
