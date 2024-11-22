import React, { useEffect, useRef, useState } from "react";
import CommonTable from "../../components/commons/CommonTable";
import { MoreOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Select, Tag } from "antd";
import CommonModal from "../../components/commons/CommonModel";

import { NavLink, useSearchParams } from "react-router-dom";
// import {
//   HeaderStyle,
//   SearchInputStyle,
// } from "../../components/commons/CommonStyles";
import CommonDeleteModal from "../../components/commons/CommonDeleteModal";
import { useDispatch, useSelector } from "react-redux";
import useAPIPrivate from "../../hooks/useAPIPrivate";

const TransactionsList = ({ collapsed }) => {
  const api = useAPIPrivate();
  const [transactionsData, setTransactionsData] = useState([]);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState();
  const [transactionsSelection, setTransactionsSelection] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [modeID, setModeID] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const delayTimerRef = useRef(null);
  const dispatch = useDispatch();

  const getPaginationInfo = () => {
    return [searchParams.get("page") || 1, searchParams.get("limit") || 5];
  };

  async function searchData() {
    try {
      // setTransactionsData(payload.data);
      // setTotal(payload.total);
      // setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  useEffect(() => {
    searchData2();
  }, []);
  async function searchData2(value = "") {
    try {
      const res2 = await api.get("/transaction?search=" + value);
      console.log("res2,:", res2);
      setTransactionsData(res2.data);
    } catch (err) {
      setLoading(false);
    }
  }

  console.log("setTransactionsData", transactionsData);
  const searchHandler = (e) => {
    const { value } = e.target;
    const [page, limit] = getPaginationInfo();
    setSearchText(value);
    // setSearchParams({ page: page, limit: limit })

    clearTimeout(delayTimerRef.current);
    delayTimerRef.current = setTimeout(() => {
      searchData2(value);
    }, 500);
  };

  const handlePagination = async (page, pageSize) => {
    // permmission exmple

    // if (!(await authService.checkPermmision('transactions', 'read'))) {
    //     return message.error('You have not a permmission');
    // }

    setSearchParams({ page: page, limit: pageSize });

    searchData();
  };

  const tableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;

    searchData();
  };

  const handleReload = () => {
    const [page, limit] = getPaginationInfo();

    setSearchParams({ page: 1, limit: 5 });

    searchData();
  };

  const handleDelete = async () => {};

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
          href="https://www.luohanacademy.com"
        >
          3rd menu item
        </a>
      ),
    },
  ];

  const columns = [
    // {
    //   title: " ",
    //   dataIndex: "action",
    //   render: (_, recored) => {
    //     return (
    //       <Dropdown
    //         menu={{
    //           items,
    //           onClick: (value) => onClick(value, recored),
    //         }}
    //         trigger={["click"]}
    //         placement="bottomLeft"
    //       >
    //         <Button
    //           type="text"
    //           icon={<MoreOutlined style={{ fontSize: 20 }} />}
    //           onClick={() => {
    //             setModeID(recored._id);
    //           }}
    //         ></Button>
    //       </Dropdown>
    //     );
    //   },
    // },

    {
      title: "Profile",
      dataIndex: "profileImage",
      render: (text, recored) => {
        return (
          <p>
            {recored?.User?.Assistant?.firstName +
              " " +
              recored?.User?.Assistant?.lastName}
          </p>
        );
      },
      sorter: true,
    },

    {
      title: "amount",
      dataIndex: "amount",
      sorter: true,
    },

    {
      title: "paymentGateway",
      dataIndex: "paymentGateway",
      sorter: true,
    },

    {
      title: "verificationStatus",
      dataIndex: "verificationStatus",
      sorter: true,
      render: (text, record) => {
        return text == "verified" ? (
          <Tag color="green">{text}</Tag>
        ) : text == "pending" ? (
          <Tag color="orange">{text}</Tag>
        ) : (
          <Tag color="red">{text}</Tag>
        );
      },
    },
    {
      title: "Note",
      dataIndex: "description",
      sorter: true,
    },

    // {
    //   title: "Last Name",
    //   dataIndex: "lastName",
    //   sorter: true,
    // },

    // {
    //   title: "Resume",
    //   dataIndex: "resume",
    //   render: (text, rec) => {
    //     return (
    //       <a href={text} download className="text-blue-500">
    //         Clink resume
    //       </a>
    //     );
    //   },
    //   sorter: true,
    // },

    // {
    //   title: "Availability",
    //   dataIndex: "availability",
    //   sorter: true,
    // },

    // {
    //   title: "Training Status",
    //   dataIndex: "trainingStatus",
    //   sorter: true,
    // },

    // {
    //   title: "Completed Jobs",
    //   dataIndex: "completedJobs",
    //   sorter: true,
    // },

    {
      title: "Change Status",
      dataIndex: "verificationStatus",
      fixed: "right",
      render: (text, recored) => {
        return (
          <div>
            <Select
              defaultValue={text}
              onChange={(info) => handleStatus(info, recored.id)}
              className="border-gray-400 min-w-[120px]"
              placeholder="select your availability"
            >
              <Option value="pending">Pending</Option>
              <Option value="verified">Verified</Option>
              <Option value="failed">Failed</Option>
            </Select>
          </div>
        );
      },
    },
    // {
    //   title: "Completed Jobs",
    //   fixed: "right",

    //   dataIndex: "completedJobs",
    //   // sorter: true,
    //   render: (text, recored) => {
    //     return (
    //       <div>
    //         <NavLink
    //           style={{ color: "#2f1dca" }}
    //           state={recored}
    //           to={`${recored.id}`}
    //         >
    //           View Detail
    //         </NavLink>
    //       </div>
    //     );
    //   },
    // },
  ];

  const handleStatus = async (value, id) => {
    console.log(value, id);
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("status", value);

      const data = await api.patch("/transaction/" + id, {
        verificationStatus: value,
      });
      searchData2();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <div
      className={`${
        collapsed ? "ml-[32px] mr-0 sm:[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}
    >
      <span className="flex md:flex-row flex-col justify-between items-start md:items-end borde border-rose-700">
        <div className="flex flex-col p-6 md:w-[45vw] w-full">
          <h1 className="text-2xl font-bold pb-4">Transactions</h1>
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
             text-[#168A53] rounded mr-4 flex items-center justify-center"
          >
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
        data={transactionsData}
        columns={columns}
        setSelection={setTransactionsSelection}
        handlePagination={handlePagination}
        total={total}
        type={true}
        loadding={loading}
        tableChange={tableChange}
        scroll={{
          x: "max-content",
        }}
      />
    </div>
  );
};

export default TransactionsList;
