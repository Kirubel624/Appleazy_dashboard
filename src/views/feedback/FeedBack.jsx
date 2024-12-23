import React, { useEffect, useRef, useState } from "react";
import CommonTable from "../../components/commons/CommonTable";
import {
  MoreOutlined,
  ReloadOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input, message, Modal, Select } from "antd";

import { NavLink, useSearchParams } from "react-router-dom";
// import {
//   HeaderStyle,
//   SearchInputStyle,
// } from "../../components/commons/CommonStyles";
import CommonDeleteModal from "../../components/commons/CommonDeleteModal";
import { useDispatch, useSelector } from "react-redux";

import useAPIPrivate from "../../hooks/useAPIPrivate";

const FeedBack = ({ collapsed }) => {
  const api = useAPIPrivate();

  const [assistantsData, setAssistantsData] = useState([]);
  const [total, setTotal] = useState();

  const [loading, setLoading] = useState();
  const [assistantsSelection, setAssistantsSelection] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [modeID, setModeID] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const delayTimerRef = useRef(null);
  const dispatch = useDispatch();

  const getPaginationInfo = () => {
    return [searchParams.get("page") || 1, searchParams.get("limit") || 5];
  };

  useEffect(() => {
    const [page, limit] = getPaginationInfo();
    searchData();
  }, []);

  async function searchData() {
    try {
      setLoading(true);
      const res = await api.get("/feedback");
      console.log("setAssistantsData one:", res);
      setAssistantsData(res.data);
      setTotal(res.data?.length);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  const handlePagination = async (page, pageSize) => {
    // permmission exmple

    // if (!(await authService.checkPermmision('assistants', 'read'))) {
    //     return message.error('You have not a permmission');
    // }

    setSearchParams({ page: page, limit: pageSize });

    searchData();
  };

  const tableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;

    searchData();
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "contactEmail",
      // sorter: true,
    },
    {
      title: "Subject",
      dataIndex: ["properties", "subject"],
      // sorter: true,
    },

    {
      title: "Content",
      dataIndex: ["properties", "content"],
      // sorter: true,
    },
  ];

  return (
    <div
      className={`${
        collapsed ? "ml-[32px] mr-0 sm:[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}
    >
      <p className="text-2xl mx-6 py-7">FeedBack</p>
      <CommonTable
        rowSelectionType={"checkbox"}
        data={assistantsData}
        columns={columns}
        setSelection={setAssistantsSelection}
        handlePagination={handlePagination}
        total={total}
        loadding={loading}
        tableChange={tableChange}
        scroll={{
          x: "max-content",
        }}
      />
    </div>
  );
};

export default FeedBack;
