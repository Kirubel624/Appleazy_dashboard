import React, { useEffect, useRef, useState } from "react";
import CommonTable from "../../components/commons/CommonTable";
import {
  MoreOutlined,
  ReloadOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
} from "antd";
import styled from "styled-components";
import CommonModal from "../../components/commons/CommonModel";

import assistantsService from "./AssistantsService";
import AssistantsEdit from "./AssistantsEdit";
import { NavLink, useSearchParams } from "react-router-dom";
// import {
//   HeaderStyle,
//   SearchInputStyle,
// } from "../../components/commons/CommonStyles";
import CommonDeleteModal from "../../components/commons/CommonDeleteModal";
import { useDispatch, useSelector } from "react-redux";
import {
  searchAssistants,
  updateAssistantsState,
  assistantsSearchText,
} from "./AssistantsRedux";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import AssistantsService from "./AssistantsService";

const AssistantsList = ({ collapsed }) => {
  const api = useAPIPrivate();

  const [assistantsData, setAssistantsData] = useState([]);
  const [total, setTotal] = useState();

  const searchText = useSelector(assistantsSearchText);
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
    dispatch(updateAssistantsState({ page: page, limit: limit }));
    searchData();
  }, []);

  async function searchData() {
    try {
      setLoading(true);
      const { payload } = await dispatch(searchAssistants(api));
      console.log("setAssistantsData one:", payload);

      setAssistantsData(payload.data);
      setTotal(payload.total);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  console.log("setAssistantsData", assistantsData);
  const searchHandler = (e) => {
    const { value } = e.target;
    const [page, limit] = getPaginationInfo();
    dispatch(
      updateAssistantsState({ page: page, limit: limit, searchText: value })
    );
    clearTimeout(delayTimerRef.current);
    delayTimerRef.current = setTimeout(() => {
      searchData();
    }, 500);
  };

  const handlePagination = async (page, pageSize) => {
    setSearchParams({ page: page, limit: pageSize });
    dispatch(updateAssistantsState({ page: page, limit: pageSize }));

    searchData();
  };

  const tableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    dispatch(updateAssistantsState({ sort: field, order: order }));

    searchData();
  };

  const handleReload = () => {
    const [page, limit] = getPaginationInfo();

    setSearchParams({ page: 1, limit: 5 });
    dispatch(
      updateAssistantsState({
        page: 1,
        limit: 5,
        sort: "",
        order: "",
        searchText: "",
      })
    );
    searchData();
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const data = await assistantsService.deleteAssistant(modeID);
      setIsDeleteModalOpen(false);

      searchData();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const onClick = ({ key }, record) => {
    if (key == "edit") {
      setIsModalOpen(true);
    } else if (key === "delete") {
      setIsDeleteModalOpen(true);
    }
  };

  const items = [
    {
      key: "edit",
      label: <Button type="text">Edit</Button>,
    },
    {
      key: "delete",
      label: <Button type="text"> Delete</Button>,
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com">
          3rd menu item
        </a>
      ),
    },
  ];

  const columns = [
    {
      title: "Profile",
      dataIndex: "profileImage",
      render: (text, recored) => {
        return (
          <img width={50} className="border rounded-full " src={text} alt="" />
        );
      },
      sorter: true,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      sorter: true,
    },

    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: true,
    },

    {
      title: "Experience",
      dataIndex: "experience",
      sorter: true,
      render: (text, rec) => {
        return (
          <Popconfirm
            title="experience"
            description={text}
            // onConfirm={confirm}
            // onCancel={cancel}
            showCancel={false} // This removes the cancel button
            okButtonProps={{ style: { display: "none" } }}>
            <Button download className="text-blue-500">
              Experience
            </Button>
          </Popconfirm>
        );
      },
    },

    {
      title: "Skills",
      dataIndex: "skills",
      sorter: true,
      render: (text, rec) => {
        return (
          <Popconfirm
            title="Skills"
            description={text}
            // onConfirm={confirm}
            // onCancel={cancel}
            showCancel={false} // This removes the cancel button
            okButtonProps={{ style: { display: "none" } }}>
            <Button download className="text-blue-500">
              Skills
            </Button>
          </Popconfirm>
        );
      },
    },

    {
      title: "Resume",
      dataIndex: "resume",
      render: (text, rec) => {
        return (
          <a href={text} download className="text-blue-500">
            Click resume
          </a>
        );
      },
      sorter: true,
    },

    {
      title: "Availability",
      dataIndex: "availability",
      sorter: true,
    },

    {
      title: "Training Status",
      dataIndex: "trainingStatus",
      sorter: true,
    },

    {
      title: "Completed Jobs",
      dataIndex: "completedJobs",
      sorter: true,
    },
    {
      title: "Jobs",
      dataIndex: "status",
      fixed: collapsed ? null : "right",
      render: (text, recored) => {
        console.log(recored, "recored");
        return (
          <div>
            <NavLink
              style={{ color: "#2f1dca" }}
              state={recored}
              to={`/assistants/jobs/${recored.UserId}`}>
              View Detail
            </NavLink>
          </div>
        );
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      fixed: collapsed ? null : "right",
      render: (text, recored) => {
        return (
          <div>
            <Select
              defaultValue={text}
              onChange={(info) => handleStatus(info, recored.id)}
              className="border-gray-400 min-w-[120px]"
              placeholder="select your availability">
              <Option value="not_sumbited">Not Submit</Option>
              <Option value="sumbited">Submited</Option>
              <Option value="failed">Failed</Option>

              <Option value="passed">Passed</Option>
            </Select>
          </div>
        );
      },
    },
    {
      title: "Exercises",
      fixed: collapsed ? null : "right",

      dataIndex: "completedJobs",
      // sorter: true,
      render: (text, recored) => {
        return (
          <div>
            <NavLink
              style={{ color: "#2f1dca" }}
              state={recored}
              to={`/assistants/${recored.id}`}>
              View Detail
            </NavLink>
          </div>
        );
      },
    },
    {
      title: "Action",
      fixed: collapsed ? null : "right",

      // dataIndex: "completedJobs",
      // sorter: true,
      render: (text, recored) => {
        return (
          <div>
            {recored.User?.isDeleted ? (
              <Button
                onClick={() => handleRestore(recored.User?.id)}
                type="primary"
                style={{ backgroundColor: "#168A53" }}
                className="bg-green-600 hover:bg-green-700">
                Restore
              </Button>
            ) : (
              <Button
                onClick={() => {
                  console.log(recored, "recored");
                  setSelectedAssistant(recored?.User?.id);
                  setDeleteModal(true);
                }}
                style={{ backgroundColor: "#FF4500" }}
                type="primary"
                className="hover:bg-red-700">
                Delete
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  const handleDelete2 = async (id) => {
    try {
      // setLoading(true);
      const response = await api.patch(
        `/user/delete-restore/${selectedAssistant}`,
        {
          isDeleted: true,
        }
      );
      if (response.status === 200) {
        message.success(response.data.message);
        searchData();
      }
      setDeleteModal(false);
      setLoading(false);
      setSelectedAssistant(null);
    } catch (error) {
      setLoading;
      console.log(error);
      message.error("Failed to delete user");
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      // setLoading(true);
      const response = await api.patch(`/user/delete-restore/${id}`, {
        isDeleted: false,
      });
      if (response.status === 200) {
        message.success(response.data.message);
        searchData();
      }
      setDeleteModal(false);
      setLoading(false);
      setSelectedAssistant(null);
    } catch (error) {
      setLoading;
      console.log(error);
      message.error("Failed to delete user");
      setLoading(false);
    }
  };

  const handleStatus = async (value, id) => {
    console.log("-------------)))");
    console.log("=====", value, id);
    // alert(":;");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("status", value);

      const data = await AssistantsService.updateAssistant(formData, id, api);
      searchData();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  return (
    <div
      className={`${
        collapsed ? "ml-[32px] mr-0 sm:[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}>
      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleOutlined className="text-red-500 text-xl mr-2" />
            <span className="text-lg font-semibold">Confirm Delete</span>
          </div>
        }
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        footer={null}
        centered>
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this assistant? This action cannot
            be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => setDeleteModal(false)}
              className="hover:bg-gray-100">
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              onClick={handleDelete2}
              loading={loading}
              className="bg-red-500 hover:bg-red-600">
              Delete Assistant
            </Button>
          </div>
        </div>
      </Modal>
      {isModalOpen ? (
        <CommonModal
          width={1000}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}>
          <AssistantsEdit
            assistantsData={assistantsData}
            searchData={searchData}
            setMode={setModeID}
            mode={modeID}
            isModelOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </CommonModal>
      ) : (
        ""
      )}

      {isDeleteModalOpen ? (
        <CommonDeleteModal
          setIsModalOpen={setIsDeleteModalOpen}
          handleDelete={handleDelete}
          loading={loading}
          isModalOpen={isDeleteModalOpen}>
          <h1 className=" text-2xl">Are you sure?</h1>
        </CommonDeleteModal>
      ) : (
        ""
      )}

      <span className="flex md:flex-row flex-col justify-between items-start md:items-end borde border-rose-700">
        <div className="flex flex-col p-6 md:w-[45vw] w-full">
          <h1 className="text-2xl font-bold pb-4">Assistants</h1>
          <div className="flex">
            <Input
              onChange={searchHandler}
              placeholder="Search"
              value={searchText}
              allowClear
              style={{ borderRadius: "10px 10px  10px 10px", width: "30rem" }}
              className=" drop-shadow-sm rounded-r mr-4 h-9"
            />
            {/* <div className="hover:border-[#4096FF] transition-all delay-75 ease-in hover:border border-y-[0.5px] py-[0.15rem] border-r-[0.5px] rounded-r-[8px] border-[#CCCCCC] searchSelect">
              <Select
                onChange={(val) => {
                  searchData();
                }}
                bordered={false}
                //   style={ borderRadius: "0px 8px 8px 0px" }
                className=""
                placeholder="Select item category"
              >
                <Option value={"All"}>all</Option>
                <Option value={"spare_part"}>Spare part</Option>
                <Option value={"lubricant"}>Lubricants</Option>
              </Select>
            </div> */}
          </div>
        </div>
        <span className="flex ml-6 mb-6 md:mr-6">
          <button
            onClick={handleReload}
            className="
             border border-[#168A53] py-2 px-3
             text-[#168A53] rounded mr-4 flex items-center justify-center">
            <ReloadOutlined className=" boder boder-red-900" />
          </button>

          {/* <button
            className="px-4  py-2 border border-[#168A53] 
            text-white bg-[#168A53] rounded"
            onClick={() => {
              setIsModalOpen(true);
              setModeID("");
            }}
          >
            <span className="flex flex-row">
              <PlusOutlined />
              <p className="pl-2">Add Item</p>
            </span>
          </button> */}
        </span>
      </span>

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

export default AssistantsList;
