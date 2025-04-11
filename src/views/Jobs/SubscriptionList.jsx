import { Button, Empty, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import SubscriptionsCard from "../../components/commons/SubscriptionsCard";
import api from "../../utils/api";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import AssignJob from "./AssignJob";

const SubscriptionList = ({ collapsed, setCollapsed }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const apiPrivate = useAPIPrivate();
  const [assignModal, setAssignModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await apiPrivate.get("/subscription");
      setSubscriptions(res.data.data);
      console.log(res.data.data, "res of subcruiotonakdfjka");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubscriptions();
  }, []);
  const handleDelete = async () => {
    console.log(selectedJob, "asiodfjioejfiojseioaf");
    const res = await apiPrivate.delete(`/subscription/${selectedJob.id}`);
    message.success("Assignment deleted successfully");
    setDeleteModal(false);
    await fetchSubscriptions();
  };
  return (
    <div
      className={`${
        collapsed ? "mr-0 ml-[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}>
      <Modal
        title="Assign job"
        destroyOnClose
        className="mt-[-50px]"
        open={assignModal}
        onClose={() => setAssignModal(false)}
        onCancel={() => setAssignModal(false)}
        footer={null}
        width={800}>
        <AssignJob
          assignModal={assignModal}
          setAssignModal={setAssignModal}
          fetchJobs={fetchSubscriptions}
          id={selectedJob.id}
          selectedJob={selectedJob}
          subscriptionId={selectedJob?.subscriptionId}
          setSelectedJob={setSelectedJob}
        />
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
        <p>Are you sure you want to delete this subscription?</p>
      </Modal>
      {!loading && subscriptions.length > 0 ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 border- border-red-900 gap-4 w-full">
          {subscriptions?.map((data) => (
            <SubscriptionsCard
              {...data}
              setAssignModal={setAssignModal}
              assignModal={assignModal}
              setSelectedJob={setSelectedJob}
              data={data}
              setDeleteModal={setDeleteModal}
            />
          ))}
          {/* <JobCard {...jobData} /> */}
        </div>
      ) : !loading && subscriptions.length === 0 ? (
        <div className="w-full flex h-[30vh] flex-col justify-center items-center">
          <Empty description={false} />
          <p className="font-medium">
            There are currently no active unassigned subscriptions.
          </p>
        </div>
      ) : (
        <div
          className="borde flex items-center
             justify-center h-[30vh] w-full border-red-900">
          <ScaleLoader
            color="#168A53"
            loading={loading}
            //  cssOverride={override}
            className=" rounded-full"
            size={25}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;
