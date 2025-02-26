import React, { useEffect, useRef, useState } from "react";
import CommonTable from "../../components/commons/CommonTable";
import { MoreOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input } from "antd";
import styled from "styled-components";
import CommonModal from "../../components/commons/CommonModel";

import group_usersService from "./Group_usersService";
import Group_usersEdit from "./Group_usersEdit";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { SearchInputStyle } from "../../components/commons/CommonStyles";
import CommonDeleteModal from "../../components/commons/CommonDeleteModal";
import { useDispatch, useSelector } from "react-redux";
import {
  searchGroup_users,
  updateGroup_usersState,
  group_usersSearchText,
} from "./Group_usersRedux";
import UsersPick from "../users/UsersPick";

const Group_usersList = ({ collapsed }) => {
  const [group_usersData, setGroup_usersData] = useState([]);
  const [total, setTotal] = useState();
  const [userPick, setUserPick] = useState(false);
  const [userPickData, setUserPickData] = useState([]);

  const searchText = useSelector(group_usersSearchText);
  const [loading, setLoading] = useState();
  const [group_usersSelection, setGroup_usersSelection] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [modeID, setModeID] = useState("");
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const delayTimerRef = useRef(null);
  const dispatch = useDispatch();

  const getPaginationInfo = () => {
    return [searchParams.get("page") || 1, searchParams.get("limit") || 5];
  };

  useEffect(() => {
    const [page, limit] = getPaginationInfo();
    dispatch(updateGroup_usersState({ page: page, limit: limit }));
    // setSearchParams({ ...Object.fromEntries(searchParams), 'searchText': e.target.value })
    searchData();
  }, []);

  const userPickHandler = async (data) => {
    setUserPickData(data);
    console.log("data:::::", data);
    try {
      setLoading(true);
      const res = await group_usersService.group_userDo({
        method: "add_users_to_group",
        payload: { data: data },
        id,
      });

      searchData();

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }

    setUserPick(false);
  };

  async function searchData() {
    try {
      setLoading(true);
      const { payload } = await dispatch(searchGroup_users({ id }));

      console.log(payload);
      setGroup_usersData(payload.data);
      setTotal(payload.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  const searchHandler = (e) => {
    const { value } = e.target;
    const [page, limit] = getPaginationInfo();

    // setSearchParams({ page: page, limit: limit })
    dispatch(
      updateGroup_usersState({ page: page, limit: limit, searchText: value })
    );
    clearTimeout(delayTimerRef.current);
    delayTimerRef.current = setTimeout(() => {
      searchData();
    }, 500);
  };

  const handlePagination = async (page, pageSize) => {
    // permmission exmple

    // if (!(await authService.checkPermmision('group_users', 'read'))) {
    //     return message.error('You have not a permmission');
    // }

    setSearchParams({ page: page, limit: pageSize });
    dispatch(updateGroup_usersState({ page: page, limit: pageSize }));

    searchData();
  };

  const tableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    dispatch(updateGroup_usersState({ sort: field, order: order }));

    searchData();
  };

  const handleReload = () => {
    const [page, limit] = getPaginationInfo();

    setSearchParams({ page: 1, limit: 5 });
    dispatch(
      updateGroup_usersState({
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
      const data = await group_usersService.deleteGroup_user(modeID);
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
                setModeID(recored._id);
              }}
            ></Button>
          </Dropdown>
        );
      },
    },

    {
      title: "fullName",
      dataIndex: "fullName",
      render: (text, recored) => {
        return (
          <NavLink
            style={{ color: "#2f1dca" }}
            state={recored}
            to={`${recored._id}`}
          >
            {text}
          </NavLink>
        );
      },
      sorter: true,
    },

    {
      title: "username",
      dataIndex: "username",
      sorter: true,
    },

    {
      title: "email",
      dataIndex: "email",
      sorter: true,
    },

    {
      title: "issystemadmin",
      dataIndex: "issystemadmin",
      render: (text, recored) => {
        return recored.issystemadmin ? <p>true</p> : <p>false</p>;
      },
    },
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
          <Group_usersEdit
            group_usersData={group_usersData}
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
      {userPick ? (
        <CommonModal
          width={700}
          isModalOpen={userPick}
          setIsModalOpen={setUserPick}
        >
          <UsersPick
            type="checkbox"
            setIsModalOpen={setUserPick}
            selectHandler={userPickHandler}
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

      {/* <HeaderStyle>
                    <div className='header_left'>
                        <p>Group_users</p>
                    </div>

                    <Button onClick={handleReload} size='large' >
                        <ReloadOutlined size={25} style={{ color: 'white', fontSize: 20 }} />
                    </Button>


                    <div className='header_right'>
                        <Button onClick={() => {
                            setModeID('')
                            setUserPick(true)
                        }} size='large' >Add</Button>

                    </div>

                </HeaderStyle>

               
                <div className='flex flex-row gap-6'>
                    <SearchInputStyle>
                        <Input onChange={searchHandler}
                            placeholder="Search"
                            value={searchText}
                            allowClear />
                    </SearchInputStyle>


                </div> */}

      <span className="flex md:flex-row flex-col justify-between items-start md:items-end borde border-rose-700">
        <div className="flex flex-col p-6 md:w-[45vw] w-full">
          <h1 className="text-2xl font-bold pb-4">Group Users</h1>
          <div className="flex">
            <Input
              onChange={searchHandler}
              placeholder="Search"
              value={searchText}
              allowClear
              // style={{ borderRadius: "0px 0px 0px 0px" }}
              className=" drop-shadow-sm py-3  rounded-xl "
            />
          </div>
        </div>
        <span className="flex ml-6 mb-6 md:mr-6">
          <button
            onClick={handleReload}
            className="
             border border-[#1D9BF0] py-2 px-3
             text-[#1D9BF0] rounded mr-4 flex items-center justify-center"
          >
            <ReloadOutlined className=" boder boder-red-900" />
          </button>

          <button
            className="px-4  py-2 border border-[#1D9BF0] 
            text-white bg-[#1D9BF0] rounded"
            onClick={() => {
              setModeID("");
              setUserPick(true);
            }}
          >
            {" "}
            <span className="flex flex-row">
              <PlusOutlined />
              <p className="pl-2">Add Item</p>
            </span>
          </button>
        </span>
      </span>
      <CommonTable
        rowSelectionType={"checkbox"}
        data={group_usersData}
        columns={columns}
        setSelection={setGroup_usersSelection}
        handlePagination={handlePagination}
        total={total}
        loadding={loading}
        tableChange={tableChange}
      />
    </div>
  );
};

const HeaderStyle = styled.div`
  display: flex;
  margin: 0;
  padding: 20px;
  margin-bottom: 40px;
  position: sticky;
  top: 0px;
  z-index: 100;
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(217, 217, 217, 1) 0%,
    rgba(0, 0, 0, 1) 100%,
    rgba(0, 212, 255, 1) 100%
  );
  .header_left {
    p {
      color: 1e2987;
      font-size: 20px;
    }
  }

  button {
    margin-left: 15px;
  }
  .header_right {
    button {
      margin-left: 15px;
      background: #096e30;
      padding: 7px 30px !important;
      color: wheat;
    }
    button:hover {
      color: white;
    }
  }
`;

export default Group_usersList;
