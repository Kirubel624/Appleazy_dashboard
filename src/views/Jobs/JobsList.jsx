import React, { useEffect, useRef, useState } from "react";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import JobCard from "../../components/common/JobCard";
import StatCard from "../../components/common/StatCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosCheckmarkCircleOutline,
} from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { TfiReload } from "react-icons/tfi";
import { MdOutlineWorkOutline } from "react-icons/md";
import {
  Button,
  Col,
  Input,
  message,
  Modal,
  Pagination,
  Radio,
  Row,
  Select,
} from "antd";
import EditJobs from "./EditJob";
import ReassignJob from "./ReassignJob";
import { ClipLoader, ScaleLoader } from "react-spinners";
import api from "../../utils/api";
const { Option } = Select;
const { Search } = Input;
const JobsList = ({ collapsed, setCollapsed }) => {
  const apiPrivate = useAPIPrivate();
  const [jobs, setJobs] = useState();
  const [editModal, setEditModal] = useState(false);
  const [reassignModal, setReassignModal] = useState(false);
  const [repostOption, setRepostOption] = useState("penalty");
  const [loading, setLoading] = useState(false);
  const [repostModal, setRepostModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [total, setTotal] = useState(0);

  const swiperRef = useRef();

  const isOnTrack = async (
    totalApplications,
    completedApplications,
    dueDate
  ) => {
    console.log(
      completedApplications,
      totalApplications,
      "compapapapapapapapap"
    );
    if (completedApplications === totalApplications) {
      return {
        status: "success",
        message: `Job is completed.`,
      };
    } else {
      const workHoursPerDay = 4;
      const timePerApp = 20;
      const currentDate = new Date();
      const dueDateTime = new Date(dueDate);
      const timeDifference = dueDateTime - currentDate;
      const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      console.log(timeDifference, "time difffff");
      const remainingApps = totalApplications - completedApplications;
      const appsPerDayNeeded = remainingApps / daysLeft;
      console.log(remainingApps, "remainingApps");

      const timeNeededPerDay = appsPerDayNeeded * timePerApp;
      console.log(timeNeededPerDay, "timeNeededPerDay difffff");
      console.log(workHoursPerDay * 60, "workHoursPerDay");
      let error = null;

      if (timeNeededPerDay > workHoursPerDay * 60) {
        const hoursNeeded = (timeNeededPerDay / 60).toFixed(2);
        console.log("inside not on track");
        error = `Not on track to complete: ${hoursNeeded} hours/day required (max: ${workHoursPerDay} hours/day)`;
      }

      if (error) {
        return { status: "error", message: error };
      } else {
        return {
          status: "success",
          message: `On track to complete: Time needed to complete the remaining jobs is within ${workHoursPerDay} hours/day`,
        };
      }
    }
  };
  const calculateProgress = (
    acceptedDate,
    dueDate,
    applicationsTotal,
    completedApplications,
    timePerAppMinutes
  ) => {
    const currentDate = new Date();
    const acceptedDateTime = new Date(acceptedDate);
    const dueDateTime = new Date(dueDate);

    if (isNaN(acceptedDateTime) || isNaN(dueDateTime)) {
      console.error("Invalid dates provided.");
      return {
        success: false,
        error: "Invalid dates",
      };
    }

    const totalDurationMs = dueDateTime - acceptedDateTime;
    const elapsedDurationMs = currentDate - acceptedDateTime;

    if (totalDurationMs <= 0) {
      console.error("Invalid total duration: it must be greater than zero.");
      return {
        success: false,
        error: "Invalid total duration",
      };
    }

    const elapsedMinutes = elapsedDurationMs / (1000 * 60);
    const expectedApplications = Math.floor(elapsedMinutes / timePerAppMinutes);
    const elapsedPercentage = Math.min(
      (expectedApplications / applicationsTotal) * 100,
      100
    );
    console.log(elapsedPercentage, "elapsedPercentage");

    const actualProgress =
      applicationsTotal > 0
        ? (completedApplications / applicationsTotal) * 100
        : 0;
    console.log(actualProgress, "actualProgress");

    const progressDifference = actualProgress - elapsedPercentage;
    console.log(progressDifference, "progress difference");
    return {
      progressDifference,
      elapsedPercentage,
      actualProgress,
    };
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        ...(search && { search }),
        ...(status && { status }),
      };

      const res = await apiPrivate.get(`/assignment`, { params });

      const modifiedAssignments = await Promise.all(
        res.data.data.map(async (job) => {
          const onTrackResult = await isOnTrack(
            job?.applicationsTotal,
            job?.applicationsTotal - job?.remainingApplications,
            job?.dueDate
          );
          const { progressDifference, elapsedPercentage, actualProgress } =
            calculateProgress(
              job.createdAt,
              job.dueDate,
              job.applicationsTotal,
              job.applicationsTotal - job.remainingApplications,
              20
            );
          let progressMessage = "";
          if (progressDifference < 0) {
            const percentageBehind = Math.abs(progressDifference).toFixed(2);
            progressMessage = `${
              job?.assistant?.name?.split(" ")[0]
            } is currently ${percentageBehind}% behind the expected progress and has done ${
              job?.applicationsTotal - job?.remainingApplications
            }/${job?.applicationsTotal} applications.`;
          } else if (progressDifference > 0) {
            const percentageAhead = progressDifference.toFixed(2);
            progressMessage = `${
              job?.assistant?.name?.split(" ")[0]
            } is currently ${percentageAhead}% ahead of the expected progress and has done ${
              job?.applicationsTotal - job?.remainingApplications
            }/${job?.applicationsTotal} applications.`;
          } else {
            progressMessage = `${
              job?.assistant?.name?.split(" ")[0]
            } has completed this job application task and has done ${
              job?.applicationsTotal - job?.remainingApplications
            }/${job?.applicationsTotal} applications.`;
          }

          return {
            ...job,
            onTrackMessage: onTrackResult?.message,
            progressMessage,
            elapsedPercentage,
          };
        })
      );

      setJobs(modifiedAssignments);
      setTotal(res.data.total);
    } catch (error) {
      console.log(error, "error fetching assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleRepost = async (repostOption, reassignmentOption) => {
    setLoading(true);
    const data = {
      id: selectedJob.id,
      reassignmentOption,
      repostOption,
    };
    console.log(data, "passed values");
    try {
      const res = await api.patch(`/assignment/reassign`, data);
      console.log(res, "resposne of update");
      if (res.status === 201) {
        message.success("Job reposted successfully!");
        setLoading(false);
        setRepostModal(false);
        fetchAssignments();
      }
    } catch (error) {
      console.log(error, "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(search, "pppppppppaaaaaaaaa");

    fetchAssignments();
  }, [page, search, status, pageSize]);
  const handleDelete = async () => {
    console.log(selectedJob, "asiodfjioejfiojseioaf");
    const res = await apiPrivate.delete(`/assignment/${selectedJob.id}`);
    message.success("Assignment deleted successfully");
    setDeleteModal(false);
    await fetchAssignments();
  };
  return (
    <div
      className={`${
        collapsed ? "mr-0 ml-[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}>
      <Modal
        title="Edit job"
        destroyOnClose
        open={editModal}
        onClose={() => setEditModal(false)}
        onCancel={() => setEditModal(false)}
        footer={null}>
        <EditJobs
          editModal={editModal}
          setEditModal={setEditModal}
          fetchJobs={fetchAssignments}
          id={selectedJob.id}
          selectedJob={selectedJob}
          subscriptionId={selectedJob?.subscriptionId}
          setSelectedJob={setSelectedJob}
        />
      </Modal>
      <Modal
        title="Reassign job"
        destroyOnClose
        className="mt-[-50px]"
        open={reassignModal}
        onClose={() => setReassignModal(false)}
        onCancel={() => setReassignModal(false)}
        footer={null}
        width={800}>
        <ReassignJob
          reassignModal={reassignModal}
          setReassignModal={setReassignModal}
          fetchJobs={fetchAssignments}
          id={selectedJob.id}
          selectedJob={selectedJob}
          subscriptionId={selectedJob?.subscriptionId}
          setSelectedJob={setSelectedJob}
        />
      </Modal>
      <Modal
        title="Repost job"
        destroyOnClose
        // className="mt-[-50px]"
        open={repostModal}
        onClose={() => setRepostModal(false)}
        onCancel={() => setRepostModal(false)}
        footer={null}
        // width={800}
      >
        <Radio.Group
          onChange={(e) => setRepostOption(e.target.value)}
          value={repostOption}
          className="flex flex-col gap-3">
          <Radio value="penalty">
            <span className="font-medium">Repost with penalty</span> – The
            assistant's maximum rating will decrease, and this will count as a
            failed job.
          </Radio>
          <Radio value="no_penalty">
            <span className="font-medium">Repost without penalty</span> – The
            assistant will not receive any penalty, and the subscription will be
            reposted. They will still be paid for completed jobs.
          </Radio>
          <Radio value="no_record">
            <span className="font-medium">No record</span> – The assignment will
            be deleted, and the assistant will not have a record of it as a
            failed job. (Recommended for jobs where the assistant hasn't started
            applying yet.)
          </Radio>
        </Radio.Group>
        <button
          onClick={() => handleRepost(repostOption, "repost")}
          className="bg-[#168A53] mt-4 text-sm text-white py-2 px-5 font- ">
          {loading ? (
            <ClipLoader
              color="#FFFFF"
              loading={loading}
              //  cssOverride={override}
              className=" rounded-full"
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            "Continue"
          )}
        </button>
      </Modal>
      <Modal
        title="Confirm Delete"
        open={deleteModal}
        onOk={handleDelete}
        onCancel={() => setDeleteModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={handleDelete}
            style={{ backgroundColor: "#FF4D4F", borderColor: "#FF4D4F" }}>
            Delete
          </Button>,
        ]}
        confirmLoading={false}>
        <p>Are you sure you want to delete this assignment?</p>
      </Modal>
      <h1 className="font-medium font-sans text-2xl pb-6">Jobs</h1>
      <div className="mb-4 relative sm:hidden block ">
        <button
          className="absolute left-2 top-1/2 z-[10]"
          onClick={() => swiperRef.current.slidePrev()}>
          <IoIosArrowBack className=" w-4 h-4" />
        </button>
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          scrollbar={{ draggable: true }}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          loop={true}>
          <SwiperSlide>
            <div className="">
              <StatCard
                statusname="Total No of Jobs"
                statusamount={"0" || "0"}
                logo={
                  <div className=" border-[1px rounded-full p-[0.6rem] bg-[#6BD96B] bg-opacity-20">
                    <MdOutlineWorkOutline className="w-6 h-6" />
                  </div>
                }
                logobg=""
                className=""
                cardStyle="py-6 sm:px-6 px-10  text-[#6BD96B] "
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <StatCard
                statusname="Ongoing Jobs"
                statusamount={"0"}
                logo={
                  <div className=" border-[1px rounded-full p-[0.6rem] bg-[#6BD96B] bg-opacity-20">
                    <TfiReload className="w-6 h-6" />
                  </div>
                }
                logobg=""
                className=""
                cardStyle="py-6 sm:px-6 px-10  text-[#6BD96B] "
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <StatCard
                statusname="Completed Jobs"
                statusamount={"0"}
                logo={
                  <div className=" border-[1px rounded-full p-[0.6rem] bg-[#6BD96B] bg-opacity-20">
                    <IoIosCheckmarkCircleOutline className="w-7 h-7" />
                  </div>
                }
                logobg=""
                className=""
                cardStyle="py-6 sm:px-6 px-10  text-[#6BD96B] "
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <StatCard
                statusname="Reassigned Jobs"
                statusamount={"0"}
                logo={
                  <div className=" border-[1px rounded-full p-[0.6rem] bg-[#6BD96B] bg-opacity-20 ">
                    <IoReload className="w-6 h-6" />
                  </div>
                }
                logobg=""
                className=""
                cardStyle="py-6 sm:px-6 px-10  text-[#6BD96B] "
              />
            </div>
          </SwiperSlide>
        </Swiper>
        <button
          className="absolute right-2 top-1/2 z-[10]"
          onClick={() => swiperRef.current.slideNext()}>
          <IoIosArrowForward className=" w-4 h-4" />
        </button>
      </div>

      <div
        id="job-cards"
        className="mb-6 sm:grid hidden lg:grid-cols-4 mdssl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        <StatCard
          statusname="Total No of Jobs"
          statusamount={"0" || "0"}
          logo={
            <div className=" border-[1px rounded-full p-[0.6rem] bg-[#6BD96B] bg-opacity-20">
              <MdOutlineWorkOutline className="w-6 h-6 text-[#6BD96B]" />
            </div>
          }
          logobg=""
          className=""
          cardStyle="py-6 px-6 "
        />
        <StatCard
          statusname="Ongoing Jobs"
          statusamount={"0"}
          logo={
            <div className=" border-[1px rounded-full p-[0.6rem] bg-[#6BD96B] bg-opacity-20">
              <TfiReload className="w-6 h-6 text-[#6BD96B]" />
            </div>
          }
          logobg=""
          className=""
          cardStyle="py-6 px-6 "
        />
        <StatCard
          statusname="Completed Jobs"
          statusamount={"0"}
          logo={
            <div className=" border-[1px rounded-full p-[0.6rem] bg-[#6BD96B] bg-opacity-20">
              <IoIosCheckmarkCircleOutline className="w-7 h-7 text-[#6BD96B]" />
            </div>
          }
          logobg=""
          className=""
          cardStyle="py-6 px-6 "
        />
        <StatCard
          statusname="Reassigned Jobs"
          statusamount={"0"}
          logo={
            <div className=" border-[1px rounded-full p-[0.6rem] bg-[#6BD96B] bg-opacity-20">
              <IoReload className="w-6 h-6 text-[#6BD96B]" />
            </div>
          }
          logobg=""
          className=""
          cardStyle="py-6 px-6 "
        />
      </div>
      <div>
        <div className="mb-6 flex items-center w-full">
          <div className="mr-2">
            <Search
              enterButton={
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#168A53",
                    borderColor: "#168A53",
                  }}>
                  Search
                </Button>
              }
              // enterButton="Go"
              className=" lg:w-[500px] w-full"
              placeholder="Search assistant or client"
              onSearch={(value) => {
                setPage(1);
                setSearch(value);
                console.log(value, "object");
              }}
              // enterButton
              allowClear
            />
          </div>
          <div>
            <Select
              placeholder="Filter by Status"
              onChange={(value) => {
                setPage(1);
                setStatus(value);
              }}
              allowClear
              style={{ width: "100%" }}>
              <Option value="pending">Pending</Option>
              <Option value="ongoing">In Progress</Option>
              <Option value="reassigned">Reassigned</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </div>
        </div>
        <div className="mb-6">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50", "100"]}
            onChange={(pageNum, pageSize) => {
              setPage(pageNum);
              setPageSize(pageSize);
            }}
            style={{ marginTop: 20, textAlign: "center" }}
          />
        </div>
      </div>
      {!loading ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 border- border-red-900 gap-4 w-full">
          {jobs?.map((job) => (
            <JobCard
              data={job}
              setEditModal={setEditModal}
              setReassignModal={setReassignModal}
              setRepostModal={setRepostModal}
              setDeleteModal={setDeleteModal}
              setSelectedJob={setSelectedJob}
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
  );
};

export default JobsList;
