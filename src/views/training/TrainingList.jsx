import React, { useEffect, useRef, useState } from "react";
import CommonTable from "../../components/commons/CommonTable";
import { MoreOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Select, Space } from "antd";
import styled from "styled-components";
import CommonModal from "../../components/commons/CommonModel";

import trainingService from "./TrainingService";
import TrainingEdit from "./TrainingEdit";
import { NavLink, useSearchParams } from "react-router-dom";

import CommonDeleteModal from "../../components/commons/CommonDeleteModal";
import { useDispatch, useSelector } from "react-redux";
import {
  searchTraining,
  updateTrainingState,
  trainingSearchText,
} from "./TrainingRedux";

const TrainingList = ({ collapsed, setCollapsed }) => {
  const [trainingData, setTrainingData] = useState([]);
  const [total, setTotal] = useState();

  const searchText = useSelector(trainingSearchText);
  const [loading, setLoading] = useState();
  const [trainingSelection, setTrainingSelection] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [modeID, setModeID] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const delayTimerRef = useRef(null);
  const dispatch = useDispatch();

  const getPaginationInfo = () => {
    return [searchParams.get("page") || 1, searchParams.get("limit") || 5];
  };

  useEffect(() => {
    const [page, limit] = getPaginationInfo();
    dispatch(updateTrainingState({ page: page, limit: limit }));
    // setSearchParams({ ...Object.fromEntries(searchParams), 'searchText': e.target.value })
    searchData();
  }, []);

  async function searchData() {
    try {
      setLoading(true);
      const { payload } = await dispatch(searchTraining());
      setTrainingData(payload.data);
      setTotal(payload.total);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  const searchHandler = (e) => {
    const { value } = e.target;
    const [page, limit] = getPaginationInfo();

    // setSearchParams({ page: page, limit: limit })
    dispatch(
      updateTrainingState({ page: page, limit: limit, searchText: value })
    );
    clearTimeout(delayTimerRef.current);
    delayTimerRef.current = setTimeout(() => {
      searchData();
    }, 500);
  };

  const handlePagination = async (page, pageSize) => {
    // permmission exmple

    // if (!(await authService.checkPermmision('training', 'read'))) {
    //     return message.error('You have not a permmission');
    // }

    setSearchParams({ page: page, limit: pageSize });
    dispatch(updateTrainingState({ page: page, limit: pageSize }));

    searchData();
  };

  const tableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    dispatch(updateTrainingState({ sort: field, order: order }));

    searchData();
  };

  const handleReload = () => {
    const [page, limit] = getPaginationInfo();

    setSearchParams({ page: 1, limit: 5 });
    dispatch(
      updateTrainingState({
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
      const data = await trainingService.deleteTrainin(modeID);
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
    // {
    //   key: "3",
    //   label: (
    //     <a
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       href="https://www.luohanacademy.com"
    //     >
    //       3rd menu item
    //     </a>
    //   ),
    // },
  ];

  const columns = [
    {
      title: " ",
      dataIndex: "action",
      render: (_, recored) => {
        return (
          <Dropdown
            menu={{
              items,
              onClick: (value) => onClick(value, recored),
            }}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <Button
              type="text"
              icon={<MoreOutlined style={{ fontSize: 20 }} />}
              onClick={() => {
                setModeID(recored.id);
              }}
            ></Button>
          </Dropdown>
        );
      },
    },

    {
      title: "Title",
      dataIndex: "title",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Training Type",
      dataIndex: "trainingType",
      key: "trainingType",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <p>{text.substring(0, 20)}...</p>,
    },
    {
      title: "Content",
      dataIndex: "otehr_content",
      key: "otehr_content",
      render: (text) => <p>{text.substring(0, 20)}...</p>,
    },
    // {
    //   title: "Tags",
    //   key: "tags",
    //   dataIndex: "tags",
    //   render: (_, { tags }) => (
    //     <>
    //       {tags.map((tag) => {
    //         let color = tag.length > 5 ? "geekblue" : "green";
    //         if (tag === "loser") {
    //           color = "volcano";
    //         }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    // {
    //   title: "Action",
    //   key: "action",
    //   fixed: "right",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <a>Invite {record.name}</a>
    //       <a>Update</a>

    //       <a>Delete</a>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div
      className={`${
        collapsed ? "ml-[32px] mr-0 sm:[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}
    >
      {isModalOpen ? (
        <CommonModal
          width={1000}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        >
          <TrainingEdit
            trainingData={trainingData}
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
          isModalOpen={isDeleteModalOpen}
        >
          <h1 className=" text-2xl">Are you sure?</h1>
        </CommonDeleteModal>
      ) : (
        ""
      )}

      <span className="flex md:flex-row flex-col justify-between items-start md:items-end borde border-rose-700">
        <div className="flex flex-col p-6 md:w-[45vw] w-full">
          <h1 className="text-2xl font-bold pb-4">Trainings</h1>
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
                <Option value="all">All</Option>
                <Option value={"training_one"}>Training one</Option>
                <Option value={"training_two"}>Training two</Option>
                <Option value={"training_three"}>Training three</Option>
                <Option value={"training_four"}>Training four</Option>
              </Select>
            </div> */}
          </div>
        </div>

        <span className="flex ml-6 mb-6 md:mr-6">
          <button
            onClick={handleReload}
            className="
            border border-[#168A53] py-2 px-3
            text-[#168A53] rounded mr-4 flex items-center justify-center"
          >
            <ReloadOutlined className=" boder boder-red-900" />
          </button>

          <button
            className="h-9 whitespace-nowrap flex items-center bg-[#248A53] px-3 rounded-lg text-white mr-3"
            onClick={() => {
              setIsModalOpen(true);
              setModeID("");
            }}
          >
            <span className="flex flex-row">
              <PlusOutlined />
              <p className="pl-2">Add Item</p>
            </span>
          </button>
        </span>
      </span>

      <CommonTable
        rowSelectionType={"checkbox"}
        data={trainingData}
        columns={columns}
        setSelection={setTrainingSelection}
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

export default TrainingList;
