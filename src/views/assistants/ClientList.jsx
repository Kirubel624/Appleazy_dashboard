import React, { useEffect, useRef, useState } from "react";
import CommonTable from "../../components/commons/CommonTable";
import {
  MoreOutlined,
  ReloadOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input, message, Modal, Select } from "antd";
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
  searchAssistants2,
} from "./AssistantsRedux";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import ReactQuill from "react-quill";

const emailTemplates = [
  {
    id: 1,
    title: "Welcome Email",
    subject: "Welcome to Appleazy! 🎉 Enjoy 15 Free Applications",
    body: `Thank you for signing up for Appleazy! As one of the first 200 people, you get 15 free applications to jumpstart your job search.`,
  },
  {
    id: 2,
    title: "Completion Email",
    subject: "Your Applications Are Complete! 🎉 Here's a Special Gift",
    body: `Your applications are complete! As a thank-you, enjoy an exclusive coupon for 25 additional applications.`,
  },
];
const ClientList = ({ collapsed }) => {
  const api = useAPIPrivate();

  const [assistantsData, setAssistantsData] = useState([]);
  const [total, setTotal] = useState();
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");

  const searchText = useSelector(assistantsSearchText);
  const [loading, setLoading] = useState();
  const [assistantsSelection, setAssistantsSelection] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [promostionModal, setPromostionModal] = useState(false);
  const [senEmailModel, setSenEmailModel] = useState(false);

  const [modeID, setModeID] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const delayTimerRef = useRef(null);
  const dispatch = useDispatch();

  const getPaginationInfo = () => {
    return [searchParams.get("page") || 1, searchParams.get("limit") || 5];
  };

  useEffect(() => {
    const [page, limit] = getPaginationInfo();
    dispatch(updateAssistantsState({ page: page, limit: limit }));
    // setSearchParams({ ...Object.fromEntries(searchParams), 'searchText': e.target.value })
    searchData();
  }, []);

  async function searchData() {
    try {
      setLoading(true);
      const { payload } = await dispatch(searchAssistants2(api));
      console.log("setClientData one:", payload);

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

    // setSearchParams({ page: page, limit: limit })
    dispatch(
      updateAssistantsState({ page: page, limit: limit, searchText: value })
    );
    clearTimeout(delayTimerRef.current);
    delayTimerRef.current = setTimeout(() => {
      searchData();
    }, 500);
  };

  const handlePagination = async (page, pageSize) => {
    // permmission exmple

    // if (!(await authService.checkPermmision('assistants', 'read'))) {
    //     return message.error('You have not a permmission');
    // }

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

  const handlePromostion = async () => {
    try {
      console.log(selectedClient);
      setLoading(true);
      const response = await api.post(`/user/createSubscription`, {
        email: selectedClient.email,
        userId: selectedClient.id,

        profile: selectedClient.Profile,
      });

      setPromostionModal(false);

      searchData();
      message.success("send successfully!");

      setLoading(false);
    } catch (err) {
      message.error("send fialed");
      console.log("eerr", err);

      setLoading(false);
    }
  };
  const handleSend = async () => {
    try {
      if (!selectedTemplate) {
        return;
      }
      setLoading(true);
      const response = await api.post(`/user/sendEmail`, {
        email: selectedClient.email,
        username: selectedClient.username,

        template: selectedTemplate?.id,
      });
      setSenEmailModel(false);
      setValue("");
      setTitle("");

      searchData();
      message.success("Email send successfully!");

      setLoading(false);
    } catch (err) {
      message.error("Email send fialed");
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
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },

    {
      title: "Username",
      dataIndex: "username",
      sorter: true,
    },

    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      sorter: true,
      render: (text, recored) => {
        return (
          <div>
            <p>{formatDate(text)}</p>
          </div>
        );
      },
    },
    {
      title: "Profile Created",
      dataIndex: "accounStatus",
      sorter: true,
      render: (text, recored) => {
        return (
          <div>
            {recored?.completedSteps?.completed ? (
              <p className="bg-[#dcfce7] text-center rounded-md py-[2px] px-10 text-[#4ade80] border border-[#4ade80]">
                Created
              </p>
            ) : (
              <p className="bg-[#fee2e2] text-center rounded-md py-[2px] px-10 text-[#ef4444] border border-[#ef4444]">
                Not Created
              </p>
            )}
          </div>
        );
      },
    },
    {
      title: "Send Email",
      fixed: collapsed ? null : "right",

      render: (text, recored) => {
        return (
          <div>
            <Button
              onClick={() => {
                console.log(recored, "recored profle");
                setSelectedAssistant(recored?.id);
                setSelectedClient(recored);
                setSenEmailModel(true);
              }}
              type="primary"
              className="bg-green-600 hover:bg-green-700">
              Send
            </Button>
          </div>
        );
      },
    },
    {
      title: "Promotion",
      fixed: collapsed ? null : "right",

      // dataIndex: "completedJobs",
      // sorter: true,
      render: (text, recored) => {
        return (
          <div>
            {recored.isPromotion_received ? (
              <p className="border py-1 px-3 rounded-lg text-center bg-slate-200 ">
                Sent
              </p>
            ) : (
              <Button
                onClick={() => {
                  console.log(recored, "recored profle");
                  setSelectedAssistant(recored?.id);
                  setSelectedClient(recored);
                  setPromostionModal(true);
                }}
                disabled={!recored?.completedSteps?.completed}
                type="primary"
                className="bg-green-600 hover:bg-green-700">
                Send free Aplications
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: "Delete User",
      fixed: collapsed ? null : "right",

      // dataIndex: "completedJobs",
      // sorter: true,
      render: (text, recored) => {
        return (
          <div>
            {recored.isDeleted ? (
              <Button
                onClick={() => handleRestore(recored?.id)}
                type="primary"
                style={{ backgroundColor: "#168A53" }}
                className="bg-green-600 hover:bg-green-700">
                Restore
              </Button>
            ) : (
              <Button
                onClick={() => {
                  console.log(recored, "recored");
                  setSelectedAssistant(recored?.id);
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
    console.log(value, id);
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("status", value);

      const data = await assistantsService.updateAssistant(formData, id);
      searchData();
      setLoading(false);
    } catch (err) {
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
              Delete Cleint
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

      {promostionModal ? (
        <CommonModal
          title={"Send Free Applicatoin"}
          width={700}
          isModalOpen={promostionModal}
          setIsModalOpen={setPromostionModal}>
          <p className="text-lg">
            Are you sure you want to send 10 free applications?
          </p>
          <button
            onClick={() => setPromostionModal(false)}
            className="border-red-600  text-red-600 border rounded-md  mx-4 my-4 py-1 px-4 hover:bg-red-600 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handlePromostion}
            className="border-green-600 text-green-600 border rounded-md  mx-4 my-4 py-1 px-4 hover:bg-green-600 hover:text-white">
            Send
          </button>
        </CommonModal>
      ) : (
        ""
      )}

      {senEmailModel ? (
        <CommonModal
          title={"Send Email"}
          width={700}
          isModalOpen={senEmailModel}
          setIsModalOpen={setSenEmailModel}>
          {/* <p>Subject</p>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          /> */}
          {/* <div className=" py-4"></div>

          <p>Body</p>
          <ReactQuill
            className="h-[200px]"
            theme="snow"
            value={value}
            onChange={setValue}
          /> */}
          <h1 className="text-xl mt-4 ">Select an Email Template</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emailTemplates.map((template) => (
              <div
                key={template.id}
                className={`cursor-pointer border-2 rounded-lg p-4 shadow-md ${
                  selectedClient.emailTemplate
                    .split(",")
                    .includes(template.id.toString())
                    ? "border-green-500 bg-green-50"
                    : selectedTemplate?.id === template.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedTemplate(template)}>
                {JSON.stringify()}
                <h2 className="text-lg font-semibold">{template.title}</h2>
                <p className="text-sm text-gray-600 mt-2">{template.subject}</p>
                <p className="text-xs text-gray-500 mt-1">{template.body}</p>
              </div>
            ))}
          </div>
          <div className=" py-3"></div>
          <button
            onClick={() => setSenEmailModel(false)}
            className="border-red-600  text-red-600 border rounded-md  mx-4 my-4 py-1 px-4 hover:bg-red-600 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="border-green-600 text-green-600 border rounded-md  mx-4 my-4 py-1 px-4 hover:bg-green-600 hover:text-white">
            Send
          </button>
        </CommonModal>
      ) : (
        ""
      )}

      <span className="flex md:flex-row flex-col justify-between items-start md:items-end borde border-rose-700">
        <div className="flex flex-col p-6 md:w-[45vw] w-full">
          <h1 className="text-2xl font-bold pb-4">Clients</h1>
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
function formatDate(isoString) {
  const date = new Date(isoString);

  // Options for formatting
  const options = {
    weekday: "long", // Full day name (e.g., "Wednesday")
    year: "numeric",
    month: "long", // Full month name (e.g., "October")
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short", // Include timezone abbreviation
  };

  return date.toLocaleDateString("en-US", options);
}

export default ClientList;
