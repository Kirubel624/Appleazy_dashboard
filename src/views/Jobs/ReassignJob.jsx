import {
  Avatar,
  DatePicker,
  Form,
  Input,
  message,
  Pagination,
  Progress,
  Select,
  Tag,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import dayjs from "dayjs";
import { ClipLoader, ScaleLoader } from "react-spinners";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import AssistantCard from "../../components/AssistantCard";
import { useSearchParams } from "react-router-dom";

const ReassignJob = ({
  reassignModal,
  setEditModal,
  fetchJobs,
  selectedJob,
  id,
  subscriptionId,
  setReassignModal,
}) => {
  const statusColors = {
    ongoing: "orange",
    completed: "green",
    reassigned: "red",
  };
  const [isExpanded, setIsExpanded] = useState(false);
  // const [loading, setLoading] = useState(false);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const [loading, setLoading] = useState(false);
  const [reassignOption, setReassignOption] = useState("penalty");
  const [assign, setAssign] = useState(false);
  const [query, setQuery] = useState({
    page: 1,
    limit: 6,
  });
  const [searchText, setSearchText] = useState();
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const [form] = useForm();
  const fetchJob = async () => {
    const data = { ...selectedJob, dueDate: dayjs(selectedJob?.dueDate) };
    form.setFieldsValue(data);
  };
  const [assistants, setAssistants] = useState([]);
  const fetchAssistants = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/assistant/getAllAssistantsWithOngoingAssignments?page=${query?.page}&limit=${query?.limit}&searchText=${searchText}`
        // ?page=${page}&limit=${limit}
      );
      console.log(res, "response of fetch assistatns");
      setAssistants(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  console.log(selectedJob, "sleected jobbbbb");
  const handleReassignment = async (
    reassignmentOption,
    reason,
    reasonDescription,
    assistantId
  ) => {
    setLoading(true);
    if (!reason || !reasonDescription) {
      message.info("Please enter all required values.");
      return;
    }
    const data = {
      id: selectedJob.id,
      oldAssistantId: selectedJob?.assistantId,
      newAssistantId: assistantId,
      clientId: selectedJob?.clientId,
      reassignmentOption,
      reason,
      reasonDescription,
    };
    console.log(data, "passed values");
    try {
      const res = await api.patch(`/assignment/reassign`, data);
      console.log(res, "resposne of update");
      if (res.status === 201) {
        message.success("Job reassigned successfully!");
        setLoading(false);
        setReassignModal(false);
        setAssign(false);
        // setSelectedJob(null);
        fetchJobs();
      }
    } catch (error) {
      console.log(error, "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(selectedJob, "inside use effect.......................");
    // // console.log(fetchJob(), "resut.......////////////////////////////////");
    // fetchJob();
    fetchAssistants();
  }, [id, searchText, query]);
  const onShowSizeChange = (current, pageSize) => {
    // console.log(current, pageSize);
    handlePagination(current, pageSize);
  };
  const handlePagination = async (page, pageSize) => {
    setSearchParams({ page: page, limit: pageSize });
    setQuery((prev) => ({ ...prev, page, limit: pageSize }));
  };
  return (
    <div>
      <button
        onClick={toggleExpand}
        className="flex items-center justify-between w-full mb-6 text-left focus:outline-none">
        <span className="text-base font-medium text-gray-900">
          Assignment information
        </span>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {isExpanded && (
        <div className="bg-white border[1px] flex flex-col justify- h- border-gray-200 shadow- px-4 pb-4 rounded ">
          <div className="flex items-start justify-between mt-">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedJob?.Subscription?.SubscriptionPricing?.tier}
              </h2>
              <p className="text-sm text-gray-600">
                {selectedJob?.Subscription?.SubscriptionPricing?.type}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start mb-4">
            <div className="flex items-center w-full flex-wrap rounded justify-between border-[1px]  p-1">
              {/* Client Profile */}
              <div
                id="job-profile"
                onClick={() => setOpenProfile(true)}
                className="flex items-center hover:cursor-pointer space-x-3 bg-white p-4 rounded">
                <div className="flex items-center">
                  <Avatar
                    size={42}
                    style={{ border: "0.1px solid #d8d8d8" }}
                    className="w-8 h-8 rounded-full  mr-4"
                    src={
                      selectedJob?.client?.Profile?.profileImage ||
                      `https://robohash.org/${selectedJob?.client?.Profile?.profileImage}`
                    }
                    alt="Assistant's Profile Picture"
                  />
                  <div className="flex flex-col">
                    <span className="font-sans text-sm font-medium">
                      {selectedJob?.client?.name?.split(" ")[0]}
                    </span>
                    <span className="text-xs text-gray-500">Client</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              {/* <div className="bg-gray-200 w-[2px] h-[50px]"></div> */}

              {/* Assistant Profile */}
              <div
                id="assistant-profile"
                className="flex items-center hover:cursor-pointer space-x-3 justify-between bg-white p-4 rounded">
                <div className="flex items-center">
                  <Avatar
                    style={{ border: "0.1px solid #d8d8d8" }}
                    size={42}
                    className="w-8 h-8 rounded-full border-[1px] mr-4"
                    src={
                      selectedJob?.assistant?.Assistant?.profileImage ||
                      `https://robohash.org/${selectedJob?.assistant?.username}`
                    }
                    alt="Assistant's Profile Picture"
                  />
                  <div className="flex flex-col">
                    <span className="font-sans text-sm font-medium">
                      {selectedJob?.assistant?.name?.split(" ")[0]}
                    </span>
                    <span className="text-xs text-gray-500">Assistant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-xl font-medium font-">
              {selectedJob.applicationsTotal} Job applications
            </p>

            <Tag
              className=" capitalize"
              color={statusColors[selectedJob?.status]}
              key={selectedJob.status}>
              {selectedJob?.status}
            </Tag>
          </div>
          {!selectedJob.hasBeenCompleted && (
            <div className="">
              Estimated to be completed by{" "}
              {dayjs(selectedJob?.dueDate).format("MMMM DD YYYY")}
            </div>
          )}
          <div className="my-3">
            <div className=" items-center">
              <Tooltip
                title={`Completion(Dark green): ${Number(
                  selectedJob?.completionPercentage
                ).toFixed(2)}% Expected(Light green): ${Number(
                  selectedJob?.elapsedPercentage
                ).toFixed(2)}%`}>
                <p>Completion percentage</p>
                <Progress
                  trailColor="#F0F0F0"
                  strokeColor={"#8efeca"}
                  percent={selectedJob?.elapsedPercentage}
                  success={{
                    percent: Number(selectedJob?.completionPercentage).toFixed(
                      2
                    ),
                    strokeColor: "#168A53",
                  }}
                  status="active"
                />
              </Tooltip>

              {/* {!selectedJob.hasBeenCompleted && (
            <>
              {" "}
              <p>Expected percentage</p>
              <Progress
                trailColor="#F0F0F0"
                strokeColor={"#8efeca"}
                percent={Number(selectedJob?.elapsedPercentage).toFixed(2)}
                status="active"
              />
            </>
          )} */}
            </div>

            {/* {selectedJob.onTrackMessage} */}
            {selectedJob.progressMessage}
          </div>
        </div>
      )}
      <div className="flex md:flex-row flex-col items-start md:items-center justify-between mb-3 lg:w-[60%] md:w-[80%] w-full">
        <Input
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search"
          value={searchText}
          allowClear
          style={{ borderRadius: "10px 10px  10px 10px" }}
          className=" drop-shadow-sm rounded-r md:mb-0 mb-4 "
        />
        <Pagination
          total={total}
          defaultPageSize={6}
          defaultCurrent={1}
          pageSizeOptions={["6", "10", "20"]}
          showSizeChanger={true}
          onChange={onShowSizeChange}
        />
      </div>
      <div className="h-[400px] overflow-y-scroll px-4">
        {!loading ? (
          <div
            className="
    mb-6 grid lg:grid-cols-3 md:grid-cols-2 border- border-red-900 w-full gap-4
      ">
            {assistants.map((data) => (
              <AssistantCard
                data={data}
                handleReassignment={handleReassignment}
                reassignOption={reassignOption}
                setReassignOption={setReassignOption}
                selectedJob={selectedJob}
                loading={loading}
                setLoading={setLoading}
                assign={assign}
                setAssign={setAssign}
              />
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col pt-10 border-red-900 items-center justify-center">
            <ScaleLoader
              color="#168a53"
              loading={loading}
              //  cssOverride={override}
              className=" rounded-full"
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReassignJob;
