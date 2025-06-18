import { Empty, message, Spin, Tabs, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Card from "../../components/common/CardTwo";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import useAPIPrivate from "../../hooks/useAPIPrivate";

const { Title } = Typography;

const JobsHome = ({ collapsed, setCollapsed }) => {
  const [datas, setDatas] = useState([]);
  const { user, profile } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const count = useRef(0);
  const { id } = useParams();
  const apiPrivate = useAPIPrivate();

  useEffect(() => {
    if (count.current === 0) {
      fetchData();
      count.current++;
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiPrivate.get(
        `/assignment/assistant?assistantId=${id}`
      );
      setDatas(res.data?.data);
      setLoading(false);
    } catch (error) {
      message.error("Something went wrong!");
      setLoading(false);
    }
  };

  const renderJobCards = (jobs) => (
    <div className="flex flex-wrap justify-start -mx-2">
      {jobs.map((job, index) => (
        <div key={index} className=" ">
          <Card data={job} />
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-[60vh] flex justify-center items-center">
          <Spin size="large" />
        </div>
      );
    }

    if (datas?.length === 0) {
      return (
        <Empty
          description={
            <span className="text-lg">The assistant has no jobs yet</span>
          }
          className="my-16"
        />
      );
    }

    const inProgressJobs = datas.filter((job) => !job.hasBeenCompleted);
    const completedJobs = datas.filter((job) => job.hasBeenCompleted);

    const items = [
      {
        key: "1",
        label: (
          <span className="flex items-center">
            <ClockCircleOutlined className="mr-2" />
            In Progress ({inProgressJobs.length})
          </span>
        ),
        children: renderJobCards(inProgressJobs),
      },
      {
        key: "2",
        label: (
          <span className="flex items-center">
            <CheckCircleOutlined className="mr-2" />
            Completed ({completedJobs.length})
          </span>
        ),
        children: renderJobCards(completedJobs),
      },
    ];

    return (
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="job-tabs"
        size="large"
        animated={{ inkBar: true, tabPane: true }}
      />
    );
  };

  return (
    <div
      className={`${
        collapsed ? "ml-[52px] mr-0 sm:ml-[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 px-2 sm:px-4`}>
      <Title level={2} className="mb-4">
        Jobs Dashboard
      </Title>
      <div className="bg-white rounded-lg shadow-lg p-2 sm:p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default JobsHome;
