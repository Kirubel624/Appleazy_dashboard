import React, { useEffect, useRef, useState } from "react";
import CommonTable from "../../components/commons/CommonTable";
import { MoreOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Select } from "antd";
import styled from "styled-components";
import CommonModal from "../../components/commons/CommonModel";

import usersService from "./UsersService";
import UsersEdit from "./UsersEdit";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import CommonDeleteModal from "../../components/commons/CommonDeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers, updateUsersState, usersSearchText } from "./UsersRedux";
import useAPIPrivate from "../../hooks/useAPIPrivate";

const UsersList = ({ collapsed }) => {
  const api = useAPIPrivate();
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean); // removes empty strings
  console.log("pathSegments", pathSegments);
  const lastSegment = pathSegments[0];

  console.log(lastSegment, "lastSegment");
  const [usersData, setUsersData] = useState([]);

  const [total, setTotal] = useState();

  const searchText = useSelector(usersSearchText);
  const [loading, setLoading] = useState();
  const [usersSelection, setUsersSelection] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [columns, setColumns] = useState([
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
      title: "Name",
      dataIndex: "name",
      render: (text, recored) => {
        return <p>{text}</p>;
      },
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
      title: "Code",
      dataIndex: "agentCode",
      sorter: true,
      render: (text, record) => {
        return <p>{text ? text : "-"}</p>;
      },
    },
  ]);

  useEffect(() => {
    const x = columns.find((data) => data.title == "Action");
    console.log(x, lastSegment == "agent" && !x);
    if (lastSegment == "agent" && !x) {
      setColumns([
        ...columns,
        lastSegment == "agent" && {
          title: "Action",
          fixed: collapsed ? null : "right",

          render: (text, recored) => {
            return (
              <div>
                <Button
                  onClick={async () => {
                    console.log(recored, "recored profle");
                    try {
                      const data = await usersService.updateAgendCode(
                        recored.id,
                        api
                      );
                      searchData();
                    } catch (error) {
                      console.log(error, "recored profle");
                    }
                  }}
                  type="primary"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Genrate New Code
                </Button>
              </div>
            );
          },
        },
      ]);
    } else if (lastSegment != "agent" && x) {
      const f = columns.filter((data) => data.title != "Action");
      setColumns(f);
    }
  }, [lastSegment]);

  const [modeID, setModeID] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const delayTimerRef = useRef(null);
  const dispatch = useDispatch();

  const getPaginationInfo = () => {
    return [searchParams.get("page") || 1, searchParams.get("limit") || 5];
  };

  useEffect(() => {
    const [page, limit] = getPaginationInfo();
    dispatch(updateUsersState({ page: page, limit: limit }));
    // setSearchParams({ ...Object.fromEntries(searchParams), 'searchText': e.target.value })
    searchData();
  }, [lastSegment]);

  async function searchData() {
    try {
      setLoading(true);
      const { payload } = await dispatch(
        searchUsers({ api, name: lastSegment })
      );
      setUsersData(payload.data);
      setTotal(payload.total);
      console.log(payload);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  const searchHandler = (e) => {
    const { value } = e.target;
    const [page, limit] = getPaginationInfo();

    // setSearchParams({ page: page, limit: limit })
    dispatch(updateUsersState({ page: page, limit: limit, searchText: value }));
    clearTimeout(delayTimerRef.current);
    delayTimerRef.current = setTimeout(() => {
      searchData();
    }, 500);
  };

  const handlePagination = async (page, pageSize) => {
    // permmission exmple

    // if (!(await authService.checkPermmision('users', 'read'))) {
    //     return message.error('You have not a permmission');
    // }

    setSearchParams({ page: page, limit: pageSize });
    dispatch(updateUsersState({ page: page, limit: pageSize }));

    searchData();
  };

  const tableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    dispatch(updateUsersState({ sort: field, order: order }));

    searchData();
  };

  const handleReload = () => {
    const [page, limit] = getPaginationInfo();

    setSearchParams({ page: 1, limit: 5 });
    dispatch(
      updateUsersState({
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
      const data = await usersService.deleteUser(modeID, api);
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

  return (
    <div
      className={`${
        collapsed ? "ml-[32px] mr-0 sm:[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}
    >
      {" "}
      {isModalOpen ? (
        <CommonModal
          width={1000}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        >
          <UsersEdit
            usersData={usersData}
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
          <h1 className="text-2xl font-bold pb-4">
            {lastSegment == "agent" ? "Agents" : "Users"}
          </h1>
          <div className="flex">
            <Input
              onChange={searchHandler}
              placeholder="Search"
              value={searchText}
              allowClear
              style={{ borderRadius: "10px 10px  10px 10px", width: "30rem" }}
              className=" drop-shadow-sm rounded-r mr-4 h-9"
            />
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
        data={usersData}
        columns={columns}
        setSelection={setUsersSelection}
        handlePagination={handlePagination}
        total={total}
        loadding={loading}
        tableChange={tableChange}
      />
    </div>
  );
};

export default UsersList;
