import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  Input,
  message,
  Modal,
  Pagination,
  Table,
  Tag,
} from "antd";
import * as XLSX from "xlsx";
import React, { useEffect, useRef, useState } from "react";
import Card from "../../components/common/Card";
import {
  FileExcelOutlined,
  DownOutlined,
  CaretDownFilled,
  CaretUpFilled,
  EditOutlined,
  PrinterOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { FaFileAlt } from "react-icons/fa";
import { GiCardExchange } from "react-icons/gi";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { IoIosArrowForward, IoMdDownload, IoMdPerson } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { CiImport } from "react-icons/ci";
import { IoIosAdd } from "react-icons/io";
import AddJob from "./AddJob";
import { useDispatch, useSelector } from "react-redux";
import {
  createJobAsync,
  deleteAsync,
  getJobsAsync,
  updateJobQueryState,
} from "./jobReducer";
import EditJob from "./EditJob";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { BarLoader, ClipLoader } from "react-spinners";
import dayjs from "dayjs";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import AssistantProfile from "./AssistantProfile";
import { getSubscriptionAsync } from "./subscriptionReducer";
import EditSubscriptionProfile from "./EditSubscriptionProfile";
import useAPIPrivate from "../../hooks/useAPIPrivate";

const Jobs = ({ collapsed, setCollapsed }) => {
  const { state } = useLocation();
  const { id, clientId } = useParams();
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const [assistantProfileloading, setAssistantProfileLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assistantloading, setAssistantLoading] = useState(false);
  const [addloading, setAddLoading] = useState(false);
  const [assignmentInfo, setAssignmentInfo] = useState();
  const [subscriptionProfile, setSubscriptionProfile] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [importedView, setImportedView] = useState(false);
  const dispatch = useDispatch();
  const apiPrivate = useAPIPrivate();
  const { user } = useSelector((state) => state.auth);
  const { jobs, jobQuery } = useSelector((state) => state.job);
  const [jobData, setJobData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const delayTimerRef = useRef(null);
  const searchText = jobQuery?.searchText;
  // const [loading, setLoading] = useState(false);
  console.log(state, "state.................................");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
  });
  const handlePaginationChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
  };
  useEffect(() => {
    console.log(
      id,
      "subsciritpnm...................'''''''''''''''''''''''''''''"
    );
  }, [id]);
  const items = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined className="text-blue-500" />,
    },

    {
      key: "archive",
      label: "Delete",
      icon: <DeleteOutlined className="text-red-400" />,
    },
  ];
  const onClick = ({ key }, record, username) => {
    if (key == "edit") {
      console.log("inside key triiger of edit..........");
      setJobId(record?.id);
      setEditModal(true);
      console.log(record?.id);
    } else if (key === "archive") {
      setJobId(record?.id);
      setDeleteModal(true);
    }
  };
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const { payload } = await dispatch(
        deleteAsync({ id: jobId, apiPrivate })
      );
      console.log(payload, "res of delete");
      if (payload?.status === 204) {
        message.success("Job deleted successfully");
        fetchJobs();
      }
      // else {
      //   message.info("Cannot delete applied jobs");
      // }
    } catch (error) {
      // console.log(error, "error");
    } finally {
      setDeleteModal(false);
    }

    setDeleteLoading(false);
  };
  const columns = [
    {
      title: "#",
      dataIndex: "#",
      key: "#",
      render: (text, record, index) => index + 1,
      //   fixed: "left",
      width: 40,
    },
    {
      title: "Date added",
      dataIndex: "date",
      key: "date",
      render: (text, record, index) => dayjs(record?.date).format("DD-MM-YYYY"),
      width: 140,
      sorter: true,
    },
    {
      title: "Job title",
      dataIndex: "jobTitle",
      key: "jobTitle",
      sorter: true,
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      sorter: true,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: true,
    },
    {
      title: "Min pay",
      dataIndex: "minPay",
      key: "minPay",
      sorter: true,
      width: 100,
    },
    {
      title: "Max pay",
      dataIndex: "maxPay",
      key: "maxPay",
      sorter: true,
      width: 100,
    },
    {
      title: "Job Setting",
      dataIndex: "jobSetting",
      key: "jobSetting",
      sorter: true,
      width: 100,
    },
    {
      title: "Job Type",
      dataIndex: "jobType",
      key: "jobType",
      sorter: true,
      width: 100,
    },
    {
      title: "Application status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (_, record) => {
        const statusColors = {
          "pending application": "orange",
          applied: "blue",
          "pending response": "gold",
          acknowledged: "green",
          "no response": "gray",
          interview: "purple",
          offer: "cyan",
          rejected: "red",
        };
        return (
          <>
            <Tag
              className=" capitalize"
              color={statusColors[record.status]}
              key={record.status}
            >
              {record?.status}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (text, record, index) => (
        <a
          href={record?.link}
          className=" text-blue-500 underline"
          target="_blank"
        >
          link
        </a>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: (value) => onClick(value, record, clientId),
          }}
        >
          <button className="bg-[#f0f0f0] py-2 px-4 flex items-center justify-center  border-gray-200 rounded ">
            Action <DownOutlined width={10} className="text-[0.65rem]" />
          </button>
        </Dropdown>
      ),
      fixed: "right",
      width: 120,
    },
  ];
  const columnsImported = [
    {
      title: "Job title",
      dataIndex: "jobTitle",
      key: "jobTitle",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Pay",
      dataIndex: "pay",
      key: "pay",
    },
    {
      title: "Application status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Dropdown
    //       menu={{
    //         items,
    //         // onClick: (value) => onClickImported(value, record, user?.id),
    //       }}>
    //       <button className="bg-[#f0f0f0] py-2 px-4 flex items-center justify-center border border-gray-200 rounded ">
    //         Action <DownOutlined width={10} className="text-[0.65rem]" />
    //       </button>
    //     </Dropdown>
    //   ),
    //   fixed: "right",
    //   width: 120,
    // },
  ];
  const getPaginationInfo = () => {
    return [searchParams.get("page") || 1, searchParams.get("limit") || 5];
  };
  const fetchJobs = async () => {
    setLoading(true);
    console.log(id, "id of jobs");
    const res = await dispatch(getJobsAsync({ id: id, apiPrivate }));
    console.log(res, "response of get jobs//////////");
    // setJobData(res?.payload);
    setLoading(false);
  };
  const isOnTrack = async (
    totalApplications,
    completedApplications,
    dueDate
  ) => {
    const workHoursPerDay = 4;
    const timePerApp = 20;
    const currentDate = new Date();
    const dueDateTime = new Date(dueDate);
    const timeDifference = dueDateTime - currentDate;
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    const remainingApps = totalApplications - completedApplications;
    const appsPerDayNeeded = remainingApps / daysLeft;

    const timeNeededPerDay = appsPerDayNeeded * timePerApp;

    let error = null;

    if (timeNeededPerDay > workHoursPerDay * 60) {
      const hoursNeeded = (timeNeededPerDay / 60).toFixed(2);
      error = `Not on track to complete: ${hoursNeeded} hours/day required (max: ${workHoursPerDay} hours/day)`;
    }

    if (error) {
      return { status: "error", messages: error };
    } else {
      return {
        status: "success",
        message: `On track to complete: Time needed to complete the remaining jobs is within ${workHoursPerDay} hours/day`,
      };
    }
  };

  const fetchAssignmentInfo = async () => {
    setAssistantLoading(true);

    try {
      const res = await api.get(
        `/assignment/info?subscriptionId=${id}&clientId=${clientId}`
      );
      console.log(res, "assignment info ???????????????????????????????????");
      const onTrackResult = await isOnTrack(
        res?.data?.data?.applicationsTotal,
        res?.data?.data?.applicationsTotal -
          res?.data?.data?.remainingApplications,
        res?.data?.data?.dueDate
      );

      const x = {
        ...res?.data?.data,
        username: res?.data?.data?.assistant.username,
        fullName:
          res?.data?.data?.assistant?.Assistant?.firstName +
          " " +
          res?.data?.data?.assistant?.Assistant?.lastName,
        profileImage: res?.data?.data?.assistant?.Assistant?.profileImage,
        experience: res?.data?.data?.assistant?.Assistant?.experience,
        completionPercentage:
          ((res?.data?.data?.applicationsTotal -
            res?.data?.data?.remainingApplications) /
            res?.data?.data?.applicationsTotal) *
          100,
        onTrackMessage: onTrackResult?.message, // Attach the on track message
        skills: res?.data?.data?.assistant?.Assistant?.skills?.split(" "),
        rating: 4.7,
        feedbacks: [
          "Great assistant, helped me secure multiple interviews!",
          "Very responsive and professional, highly recommend.",
        ],
      };
      console.log("============================= assapro: ", x);

      setAssignmentInfo(x);
      console.log(res, ":res of assing ment fetch");
    } catch (error) {
      console.log(error, "error of fetching assistant");
      setAssignmentInfo(null);
    } finally {
      setAssistantLoading(false);
    }
  };
  const fetchSubscriptionInfo = async () => {
    const { payload } = await dispatch(
      getSubscriptionAsync({ id, userId: clientId, apiPrivate })
    );
    console.log(payload, "res of fetch subscription info");
    setSubscriptionProfile(payload);
  };
  useEffect(() => {
    const [page, limit] = getPaginationInfo();
    dispatch(updateJobQueryState({ page: page, limit: limit }));
    fetchJobs();
    fetchAssignmentInfo();
    fetchSubscriptionInfo();
  }, []);
  const searchHandler = async (e) => {
    const { value } = e.target;
    const [page, limit] = getPaginationInfo();
    setSearchParams({ page: page, limit: limit });
    await dispatch(
      updateJobQueryState({ page: 1, limit: limit, searchText: value })
    );
    console.log(searchText, "search text in purchase");

    clearTimeout(delayTimerRef.current);
    delayTimerRef.current = setTimeout(() => {
      fetchJobs();
    }, 500);
  };
  const tableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    console.log(field, order, "field and order");
    dispatch(updateJobQueryState({ sort: field, order: order }));

    fetchJobs();
  };
  // useEffect(() => {
  //   console.log(jobs, "jobs..............redux..............");
  // }, [jobs]);
  const [excelData, setExcelData] = useState([]);
  const fileInputRef = useRef(null);

  // Function to handle file upload and parsing
  const handleFileUpload = (e) => {
    console.log("File upload triggered");
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("Selected file:", file);

    const reader = new FileReader();

    reader.onload = (event) => {
      console.log("File read complete:", event);

      const arrayBuffer = event.target.result;
      const data = new Uint8Array(arrayBuffer);
      const binaryString = data.reduce(
        (acc, byte) => acc + String.fromCharCode(byte),
        ""
      );

      const workbook = XLSX.read(binaryString, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(sheet);

      console.log("Parsed Data:", parsedData);

      const formattedData = parsedData.map((row) => ({
        jobTitle: row["Job title"] || "",
        company: row["Company"] || "",
        location: row["Location"] || "",
        pay: row["Pay"] || "",
        status: row["Application status"] || "",
        link: row["Link"] || "",
        date: new Date().toISOString(),
        description: row["Description"] || "",
        userId: clientId,
        subscriptionId: id,
        jobRequestId: null,
      }));
      console.log(formattedData, "formattedData");
      setExcelData(formattedData);
      if (formattedData.length > 0) {
        setImportedView(true);
      } else {
        message.info("No data available in selected excel sheet");
      }
      console.log("Formatted data:", formattedData);
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsArrayBuffer(file);
    e.target.value = null;
  };

  // Function to trigger file input click
  const handleButtonClick = () => {
    console.log("File input clicked");

    // if (fileInputRef.current) {
    //   fileInputRef.current.click();
    // }
  };
  const handleAdd = async (job) => {
    try {
      const { payload } = await dispatch(
        createJobAsync({ data: job, apiPrivate })
      );
      console.log(payload, "no error pay load res");
      if (payload?.status === 200) {
        // message.success("Job added successfully!");
      }
      // else if (payload?.status === 400) {
      //   message.info(
      //     "You have reached the limit of adding jobs for this subscription!"
      //   );
      // }
      // else {
      //   message.error("An error occurred");
      // }
    } catch (error) {
      // console.log(error, "errorororor");
    }
  };
  const handleAddImported = async () => {
    setAddLoading(true);

    for (let job of excelData) {
      try {
        await handleAdd(job);
      } catch (error) {
        console.error("Error adding job:", error);
      }
    }
    setImportedView(false);
    setAddLoading(false);
    setExcelData([]);
    setTimeout(() => {
      fetchJobs();
    }, 500);
  };
  const handlePagination = async (page, pageSize) => {
    setSearchParams({ page: page, limit: pageSize });
    dispatch(updateJobQueryState({ page: page, limit: pageSize }));

    fetchJobs();
  };
  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
    handlePagination(current, pageSize);
  };
  const showLoading = () => {
    setOpen(true);
    // setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      // setLoading(false);
    }, 2000);
  };
  const assistantData = {
    name: "Biruk",
    profileImage: "https://link-to-image.jpg", // Replace with actual image link or a placeholder
    completionPercentage: 70, // Replace with actual percentage
    onTrackMessage:
      "The assistant is on track to complete all applications within the given time.",
    skills: ["Time Management", "Job Hunting", "Communication"],
    rating: 4.7, // Replace with actual rating
    feedbacks: [
      "Great assistant, helped me secure multiple interviews!",
      "Very responsive and professional, highly recommend.",
    ],
  };

  return (
    <div
      className={`${
        collapsed ? "ml-[52px] mr-2 sm:[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10`}
    >
      <Modal
        title="Add a job"
        width={900}
        open={addModal}
        onCancel={() => {
          setAddModal(false);
        }}
        onClose={() => {
          setAddModal(false);
        }}
        footer={null}
      >
        <AddJob
          subscriptionId={id}
          setAddModal={setAddModal}
          fetchJobs={fetchJobs}
        />
      </Modal>
      <Modal
        title="Confirm deletion"
        // width={900}
        open={deleteModal}
        onCancel={() => {
          setDeleteModal(false);
        }}
        onClose={() => {
          setDeleteModal(false);
        }}
        footer={null}
      >
        <div>
          <p className="mb-3">Are you sure you want to delete this job?</p>
          <div className="flex items-center">
            <button
              onClick={handleDelete}
              className="h-9 self-end flex 
          items-center bg-[#168A53] px-4 mr-2 rounded-lg text-white "
            >
              {deleteLoading ? (
                <ClipLoader
                  color="#FFFFF"
                  loading={deleteLoading}
                  //  cssOverride={override}
                  className=" rounded-full"
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "Yes, Delete"
              )}
            </button>
            <button
              onClick={() => setDeleteModal(false)}
              className="h-9 self-end flex 
          items-center border border-[#168A53] px-4 text-[#168A53] rounded-lg"
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        // title="Import job"
        width={1200}
        open={importedView}
        onCancel={() => {
          setImportedView(false);
          setExcelData([]);
        }}
        onClose={() => {
          setImportedView(false);
          setExcelData([]);
        }}
        footer={null}
      >
        <div>
          <h1 className="text-xl font-medium">Import jobs</h1>
          <div className="flex items-center mt-2">
            <IoIosInformationCircleOutline className="w-5 h-5 mr-1 " />
            <p>
              If there are no changes or corrections you want to make to the
              imported file data you can click submit
            </p>
          </div>
          <Table
            rowkey={(record) => record.id}
            // loading={loading}
            className="w-[90%"
            columns={columnsImported}
            dataSource={excelData || []}
            pagination={{
              ...pagination,
              onChange: handlePaginationChange,
            }}
          />
          <button
            onClick={handleAddImported}
            className="h-9 self-end flex 
          items-center bg-[#168A53] px-4 rounded-lg text-white "
          >
            {addloading ? (
              <ClipLoader
                color="#FFFFF"
                loading={addloading}
                //  cssOverride={override}
                className=" rounded-full"
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </Modal>
      {editModal && (
        <EditJob
          editModal={editModal}
          setEditModal={setEditModal}
          id={jobId}
          setJobId={setJobId}
          fetchJobs={fetchJobs}
          subscriptionId={id}
          assignmentId={assignmentInfo?.id}
        />
      )}

      <div className="flex items-center justify-between w-[90%] mb-4">
        <h1 className="font-medium font-sans text-lg sm:text-2xl ">Jobs</h1>{" "}
        <div className="flex items-center">
          <div
            onClick={() => setOpenProfile(true)}
            className="flex items-center  mr-4 hover:cursor-pointer space-x-3 bg-white p-2 sm:p-4 rounded"
          >
            <Avatar
              className="w-8 h-8 rounded-full"
              src={
                subscriptionProfile?.User?.Profile?.profileImage ||
                `https://robohash.org/${subscriptionProfile?.User?.Profile?.profileImage}`
              }
              alt="Assistant's Profile Picture"
            />

            <div className="flex flex-col ">
              <span className="font-sans text-sm font-medium">
                {subscriptionProfile?.User?.username}
              </span>
              <span className="text-xs text-gray-500">Client profile</span>
            </div>
            <div>
              <IoIosArrowForward className=" w-4 h-4" />
            </div>
          </div>
          {/* <BarLoader
            color="#168A53"
            loading={!assistantloading}
            //  cssOverride={override}
            className=" rounded-full"
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          /> */}
        </div>
      </div>
      <div className="mb-6 flex flex-wrap gap-3 w-[90%]">
        <Card
          statusname="No of applications"
          statusamount={jobs?.stats?.totalApplications || "0"}
          logo={
            <div className=" bg-[#8efeca]  p-2 sm:p-4 rounded-full mr-3">
              <FaFileAlt className="w-4 sm:w-7  h-4 sm:h-7" />
            </div>
          }
          logobg=""
          className=""
          cardStyle="py-6 px-6 "
        />
        <Card
          statusname="Response rate"
          statusamount={jobs?.stats?.responseRate + "%" || "0"}
          logo={
            <div className=" bg-[#8efeca]  p-2 sm:p-4 rounded-full mr-3">
              <IoChatboxEllipsesSharp className="w-4 sm:w-7  h-4 sm:h-7" />
            </div>
          }
          logobg=""
          className=""
          cardStyle="py-6 px-6 "
        />
        <Card
          statusname="Interview rate"
          statusamount={jobs?.stats?.interviewRate + "%" || "0"}
          logo={
            <div className=" bg-[#8efeca]  p-2 sm:p-4 rounded-full mr-3">
              <IoMdPerson className="w-4 sm:w-7  h-4 sm:h-7" />
            </div>
          }
          logobg=""
          className=""
          cardStyle="py-6 px-6 "
        />
        <Card
          statusname="Offer rate"
          statusamount={jobs?.stats?.offerRate + "%" || "0"}
          logo={
            <div className=" bg-[#8efeca]  p-2 sm:p-4 rounded-full mr-3">
              <MdAttachMoney className="w-4 sm:w-7  h-4 sm:h-7" />
            </div>
          }
          logobg=""
          className=""
          cardStyle="py-6 px-6 "
        />
      </div>
      <div
        className="flex flex-col w-[90%] 
      items- justify-start overflow- h-[100vh]
       borde border-red-600"
      >
        {/* <p> */}
        <div className="flex  flex-wrap gap-3 items-center w-full justify-between self-end mb-2">
          <div>
            <Input
              onChange={searchHandler}
              placeholder="Search"
              value={searchText}
              allowClear
              style={{ borderRadius: "10px 10px  10px 10px" }}
              className=" drop-shadow-sm rounded-r w-96"
            />
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <a
              href="https://res.cloudinary.com/dtwmhl1oh/raw/upload/v1727859664/appleazy_template.xlsx" // Path to your template file
              download="template.xlsx" // File name for downloading
            >
              <button
                onClick={() => message.success("Check your downloads")}
                className="h-9 flex items-center bg-[#168A53] px-3 rounded-lg text-white mr-3"
              >
                <IoMdDownload className="w-5 mr-2 text-white h-5" /> Download
                template
              </button>
            </a>

            <div className="flex items-center">
              {/* Hidden file input */}
              <label htmlFor="fileInput" className="relative">
                {/* Button to trigger file selection */}
                <div className="h-9 flex items-center bg-[#168A53] px-3 rounded-lg text-white mr-3 cursor-pointer">
                  <input
                    id="fileInput"
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileUpload}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  />
                  <CiImport className="w-5 mr-2 text-white h-5" /> Import Excel
                  Sheet
                </div>
              </label>
            </div>
            <button
              onClick={() => setAddModal(true)}
              className="h-9 flex items-center bg-[#168A53] px-3 rounded-lg text-white"
            >
              <IoIosAdd className="w-5 mr-2 text-white h-5" /> Add a job
            </button>
          </div>
        </div>
        <Table
          rowkey={(record) => record.id}
          loading={loading}
          className="w-[90%  overflow-x-auto"
          columns={columns}
          onChange={tableChange}
          dataSource={jobs?.jobs || []}
          pagination={false}
        />
        {
          <div className="flex justify-end mt-[40px] mb-[40px] mx-[15px] ">
            <Pagination
              total={jobs?.pagination?.total}
              defaultPageSize={5}
              defaultCurrent={1}
              pageSizeOptions={["5", "10", "20"]}
              showSizeChanger={true}
              onChange={onShowSizeChange}
            />
          </div>
        }
        {/* </p> */}
      </div>
      <Drawer
        size="large"
        closable
        destroyOnClose
        title={<p>Assistant profile</p>}
        placement="right"
        open={open}
        // loading={assistantProfileloading}
        onClose={() => setOpen(false)}
      >
        <AssistantProfile {...assignmentInfo} />
      </Drawer>
      <Drawer
        size="large"
        closable
        destroyOnClose
        title={<p>Your profile for this job</p>}
        placement="right"
        open={openProfile}
        // loading={assistantProfileloading}
        onClose={() => setOpenProfile(false)}
      >
        <EditSubscriptionProfile
          profile2={subscriptionProfile}
          fetchSubscriptionInfo={fetchSubscriptionInfo}
        />
      </Drawer>
    </div>
  );
};

export default Jobs;
