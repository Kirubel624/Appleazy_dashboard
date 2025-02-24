import React, { useEffect, useRef, useState } from "react";
import CommonTable from "../../components/commons/CommonTable";
import {
  MoreOutlined,
  ReloadOutlined,
  PlusOutlined,
  DownOutlined,
  PrinterOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input, Popover, Select } from "antd";
import styled from "styled-components";
import CommonModal from "../../components/commons/CommonModel";

import userService from "./UsersService";
import UsersEdit from "./UsersEdit";
import { NavLink, useSearchParams } from "react-router-dom";
import { SearchInputStyle } from "../../components/commons/CommonStyles";
import CommonDeleteModal from "../../components/commons/CommonDeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers, updateUsersState, usersSearchText } from "./UsersRedux";
import { useTranslation } from "react-i18next";

const UsersList = () => {
  const [usersData, setUsersData] = useState([]);
  const [total, setTotal] = useState();
  const { t } = useTranslation();
  const searchText = useSelector(usersSearchText);
  const [loading, setLoading] = useState();
  const [usersSelection, setUsersSelection] = useState([]);
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
    dispatch(updateUsersState({ page: page, limit: limit }));
    // setSearchParams({ ...Object.fromEntries(searchParams), 'searchText': e.target.value })
    searchData();
  }, []);

  async function searchData() {
    try {
      setLoading(true);
      const { payload } = await dispatch(searchUsers());
      setUsersData(payload.data);
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
      const data = await userService.deleteUser(modeID);
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
      title: t("Action"),
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
      title: t("Username"),
      dataIndex: "username",
      render: (text, recored) => {
        return <p>{text}</p>;
      },
      sorter: true,
    },

    {
      title: t("Email"),
      dataIndex: "email",
      sorter: true,
    },
    {
      title: t("Type"),
      dataIndex: "type",
    },
    {
      title: t("isSystemAdmin"),
      dataIndex: "isSystemAdmin",
      render: (text, recored) => {
        return recored.isSystemAdmin ? <p>true</p> : <p>false</p>;
      },
    },
    {
      title: t("Phone_Number"),
      dataIndex: "phoneNumber",
    },
    {
      title: t("Gender"),
      dataIndex: "gender",
    },
    {
      title: t("Location"),
      dataIndex: "location",
    },
    {
      title: t("Sector"),
      dataIndex: "status",
      render: (text, record) => {
        return <p>{record?.sector?.name}</p>;
      },
    },

    {
      title: t("State"),
      dataIndex: "status",
      render: (text, record) => {
        return <p>{record?.state?.name}</p>;
      },
    },
    {
      title: t("Zone"),
      dataIndex: "status",
      render: (text, record) => {
        return <p>{record?.zone?.name}</p>;
      },
    },
    {
      title: t("Woreda"),
      dataIndex: "status",
      render: (text, record) => {
        return <p>{record?.wereda?.name}</p>;
      },
    },
  ];

  return (
    <div>
      {isModalOpen ? (
        <CommonModal
          width={1000}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        >
          <UsersEdit
            searchData={searchData}
            usersData={usersData}
            setUsersData={setUsersData}
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

      {/* <HeaderStyle>
                <div className='header_left'>
                    <p>Users</p>
                </div>

                <Button onClick={handleReload} size='large' >
                    <ReloadOutlined size={25} style={{ color: 'white', fontSize: 20 }} />
                </Button>


                <div className='header_right'>
                    <Button onClick={() => {
                        setModeID('')
                        setIsModalOpen(true)
                    }} size='large' >Add</Button>

                </div>


            </HeaderStyle> */}

      <span className="flex md:flex-row flex-col justify-between items-start md:items-end borde border-rose-700">
        <div className="flex flex-col p-6 md:w-[45vw] w-full">
          <h1 className="text-2xl font-bold pb-4">{t("Users")}</h1>
          <div className="flex">
            {/* <Popover
              placement="bottomLeft"
              // title={text}
              content={<FilterItems />}
              arrow={false}
              trigger="click"
            >
              <button className="py-2 px-5 drop-shadow-sm rounded-l border-[1px] border-[#D9D9D9]">
                <div className="flex">
                  <AdjustmentsHorizontalIcon className="w-5 border-" />
                  <p className="ml-2">Filter</p>
                </div>
              </button>
            </Popover> */}

            {/* <Button text="{} "
                style=""/>  */}

            <Input
              onChange={searchHandler}
              placeholder={t("Search")}
              value={searchText}
              allowClear
              // style={{ borderRadius: "0px 0px 0px 0px" }}
              className=" drop-shadow-sm py-3  rounded-xl "
            />
            {/* <div className="hover:border-[#4096FF] transition-all delay-75 ease-in hover:border border-y-[0.5px] py-[0.15rem] border-r-[0.5px] rounded-r-[8px] border-[#CCCCCC] searchSelect">
              <Select
                onChange={(val) => {
                  dispatch(updateStoresState({ category: val }));
                  searchData();
                }}
                bordered={false}
                //   style={{ borderRadius: "0px 8px 8px 0px" }}
                className=""
                placeholder={t("Select item category")} 
              >
                <Option value={""}>All</Option>
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
             border border-[#1D9BF0] py-2 px-3
             text-[#1D9BF0] rounded mr-4 flex items-center justify-center"
          >
            <ReloadOutlined className=" boder boder-red-900" />
          </button>

          <button
            className="px-4  py-2 border border-[#1D9BF0] 
            text-white bg-[#1D9BF0] rounded"
            onClick={() => {
              setIsModalOpen(true);
              setModeID("");
            }}
          >
            {" "}
            <span className="flex flex-row">
              <PlusOutlined />
              <p className="pl-2">{t("add")}</p>
            </span>
          </button>
        </span>
      </span>

      {/* <div className="flex flex-row gap-6">
        <SearchInputStyle>
          <Input
            onChange={searchHandler}
            placeholder="Search"
            value={searchText}
            allowClear
          />
        </SearchInputStyle>
      </div> */}

      <CommonTable
        rowSelectionType={"checkbox"}
        data={usersData}
        columns={columns}
        setSelection={setUsersSelection}
        handlePagination={handlePagination}
        total={total}
        loadding={loading}
        tableChange={tableChange}
        scroll={{
          x: "full",
        }}
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

export default UsersList;
