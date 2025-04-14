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
import useAPIPrivate from "../../hooks/useAPIPrivate";

const AssignJob = ({
  reassignModal,
  setEditModal,
  fetchJobs,
  selectedJob,
  id,
  subscriptionId,
  setAssignModal,
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
  const apiPrivate = useAPIPrivate();
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
  const handleAssignment = async (assistantId) => {
    const data = {
      clientId: selectedJob?.userId,
      assistantId,
      subscriptionId: selectedJob.id,
    };
    try {
      const res = await apiPrivate.post("/assignment", data);
      console.log(res, "responseiofseiojfiosejiof");
      if (res.status === 201) {
        message.success("Job assigned successfully!");
        setLoading(false);
        setAssignModal(false);
        // setSelectedJob(null);
        fetchJobs();
      }
    } catch (error) {
      console.log(error, "dawwwwwwwwwwwwwwwwwwwwww");
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
      <div className="flex flex-col items-start mb-3 lg:w-[60%] md:w-[80%] w-full">
        <Input
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search"
          value={searchText}
          allowClear
          style={{ borderRadius: "10px 10px  10px 10px" }}
          className=" drop-shadow-sm rounded-r md:mb-0  "
        />
        <Pagination
          className="my-4"
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
                type="subscription"
                data={data}
                handleReassignment={handleReassignment}
                handleAssignment={handleAssignment}
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

export default AssignJob;
