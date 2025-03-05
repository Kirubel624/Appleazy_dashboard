import React, { useEffect, useRef, useState } from "react";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import JobCard from "../../components/common/JobCard";
import StatCard from "../../components/common/StatCard";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosCheckmarkCircleOutline,
  IoMdPerson,
} from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";
import {
  IoChatboxEllipsesSharp,
  IoNewspaperOutline,
  IoNewspaperSharp,
  IoReload,
} from "react-icons/io5";
import { MdAttachMoney, MdOutlineWork } from "react-icons/md";
import { TfiReload } from "react-icons/tfi";
import { VscGraph } from "react-icons/vsc";
import { MdOutlineWorkOutline } from "react-icons/md";
import { Modal } from "antd";
import EditJobs from "./EditJob";
import ReassignJob from "./ReassignJob";
const JobsList = ({ collapsed, setCollapsed }) => {
  const apiPrivate = useAPIPrivate();
  const [jobs, setJobs] = useState();
  const [editModal, setEditModal] = useState(false);
  const [reassignModal, setReassignModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(false);
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
    try {
      const res = await apiPrivate.get(`/assignment`);
      console.log(res, "assignment info ???????????????????????????????????");

      const modifiedAssignments = await Promise.all(
        res.data.map(async (job) => {
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
            } is currently ${Math.abs(
              percentageBehind
            )}% behind the expected progress and has done ${
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
          console.log(onTrackResult.message, "on track result");
          return {
            ...job,
            onTrackMessage: onTrackResult?.message,
            progressMessage,
            elapsedPercentage,
          };
        })
      );

      console.log(modifiedAssignments, "modified assignments");
      setJobs(modifiedAssignments); // Set state after resolving promises
    } catch (error) {
      console.log(error, "error fetching assignments");
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);
  return (
    <div
      className={`${
        collapsed ? " mr-0 ml-[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}
    >
      <Modal
        title="Edit job"
        destroyOnClose
        open={editModal}
        onClose={() => setEditModal(false)}
        onCancel={() => setEditModal(false)}
        footer={null}
      >
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
        open={reassignModal}
        onClose={() => setEditModal(false)}
        onCancel={() => setEditModal(false)}
        footer={null}
      >
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
      <h1 className="font-medium font-sans text-2xl pb-6">Jobs</h1>
      <div className="mb-4 relative sm:hidden block ">
        <button
          className="absolute left-2 top-1/2 z-[10]"
          onClick={() => swiperRef.current.slidePrev()}
        >
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
          loop={true}
        >
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
          onClick={() => swiperRef.current.slideNext()}
        >
          <IoIosArrowForward className=" w-4 h-4" />
        </button>
      </div>

      <div
        id="job-cards"
        className="mb-6 sm:grid hidden lg:grid-cols-4 mdssl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4"
      >
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
      <div className="grid lg:grid-cols-3 md:grid-cols-2 border- border-red-900 gap-4 w-full">
        {jobs?.map((job) => (
          <JobCard
            data={job}
            setEditModal={setEditModal}
            setReassignModal={setReassignModal}
            setSelectedJob={setSelectedJob}
          />
        ))}
      </div>
    </div>
  );
};

export default JobsList;
