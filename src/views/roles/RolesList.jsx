import React, { useEffect, useRef, useState } from "react";
import CommonTable from "../../components/commons/CommonTable";
import { MoreOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Input,
  Select,
  Modal,
  Checkbox,
  Collapse,
  message,
} from "antd";
import styled from "styled-components";
import CommonModal from "../../components/commons/CommonModel";

import rolesService from "./RolesService";
import RolesEdit from "./RolesEdit";
import { NavLink, useSearchParams } from "react-router-dom";
import { SearchInputStyle } from "../../components/commons/CommonStyles";
import CommonDeleteModal from "../../components/commons/CommonDeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { searchRoles, updateRolesState, rolesSearchText } from "./RolesRedux";
import permissionsService from "../permissions/PermissionsService";
import RolepermissionsService from "../rolepermissions/RolepermissionsService";
import useAPIPrivate from "../../hooks/useAPIPrivate";

const { Panel } = Collapse;

const RolesList = ({ collapsed }) => {
  const api = useAPIPrivate();

  const [rolesData, setRolesData] = useState([]);
  const [total, setTotal] = useState();
  const [permissions, setPermissions] = useState([]);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const searchText = useSelector(rolesSearchText);
  const [loading, setLoading] = useState();
  const [rolesSelection, setRolesSelection] = useState([]);
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
    dispatch(updateRolesState({ page: page, limit: limit }));
    searchData();
  }, []);

  async function searchData() {
    try {
      setLoading(true);
      const { payload } = await dispatch(searchRoles(api));
      setRolesData(payload.data);
      setTotal(payload.total);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  const searchHandler = (e) => {
    const { value } = e.target;
    const [page, limit] = getPaginationInfo();

    dispatch(updateRolesState({ page: page, limit: limit, searchText: value }));
    clearTimeout(delayTimerRef.current);
    delayTimerRef.current = setTimeout(() => {
      searchData();
    }, 500);
  };

  const handlePagination = async (page, pageSize) => {
    setSearchParams({ page: page, limit: pageSize });
    dispatch(updateRolesState({ page: page, limit: pageSize }));

    searchData();
  };

  const tableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    dispatch(updateRolesState({ sort: field, order: order }));

    searchData();
  };

  const handleReload = () => {
    const [page, limit] = getPaginationInfo();

    setSearchParams({ page: 1, limit: 5 });
    dispatch(
      updateRolesState({
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
      const data = await rolesService.deleteRole(modeID);
      setIsDeleteModalOpen(false);

      searchData();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchPermissions = async (roleId) => {
    try {
      const response = await permissionsService.searchPermission({
        page: 1,
        limit: 1000,
      });
      const response2 = await RolepermissionsService.getRolePermissions(roleId);
      console.log("response2 =============", response2);
      setSelectedPermissions(response2);
      setPermissions(response.data);
      setIsPermissionModalOpen(true);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const onClick = ({ key }, record) => {
    if (key === "edit") {
      setIsModalOpen(true);
    } else if (key === "delete") {
      setIsDeleteModalOpen(true);
    } else if (key === "addPermission") {
      setSelectedRoleId(record.id);
      fetchPermissions(record.id);
    }
  };

  const items = [
    {
      key: "edit",
      label: <Button type="text">Edit</Button>,
    },
    {
      key: "delete",
      label: <Button type="text">Delete</Button>,
    },
    {
      key: "addPermission",
      label: <Button type="text">Add Permission</Button>,
    },
  ];

  const columns = [
    {
      title: " ",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <Dropdown
            menu={{
              items,
              onClick: (value) => onClick(value, record),
            }}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <Button
              type="text"
              icon={<MoreOutlined style={{ fontSize: 20 }} />}
              onClick={() => {
                setModeID(record.id);
              }}
            ></Button>
          </Dropdown>
        );
      },
    },
    {
      title: "role_name",
      dataIndex: "role_name",
      render: (text, record) => {
        return (
          <NavLink
            style={{ color: "#2f1dca" }}
            state={record}
            to={`${record.id}`}
          >
            {text}
          </NavLink>
        );
      },
      sorter: true,
    },
  ];

  const handlePermissionChange = (permissionId, action, checked) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionId]: {
        ...prev[permissionId],
        [action]: checked,
      },
    }));
    console.log("selectedPermissions", selectedPermissions);
  };

  const handleSelectAllForPermission = (permissionId, checked) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionId]: {
        create: checked,
        delete: checked,
        update: checked,
        read: checked,
        readOnly: checked,
      },
    }));
    console.log("selectedPermissions", selectedPermissions);
  };

  const handleSavePermissions = async () => {
    try {
      setLoading(true);
      // Prepare the data to be sent to the server
      const permissionsToSave = Object.entries(selectedPermissions).map(
        ([permissionId, actions]) => ({
          permissionId,
          actions: Object.entries(actions)
            .filter(([_, isSelected]) => isSelected)
            .map(([action, _]) => action),
        })
      );
      console.log("permissionsToSave", permissionsToSave);
      console.log("selectedRoleId", selectedRoleId);

      // Call the API to save the permissions
      // await rolesService.updateRolePermissions(
      //   selectedRoleId,
      //   permissionsToSave
      // );
      const data = await RolepermissionsService.rolepermissionDo({
        method: "add_multiple_rolepermission",
        payload: {
          selectedRoleId,
          permissionsToSave,
        },
        id: selectedRoleId,
      });

      setSelectedPermissions({});
      setIsPermissionModalOpen(false);
      searchData(); // Refresh the roles data
    } catch (error) {
      console.error("Error saving permissions:", error);
      message.error("Failed to update permissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        collapsed ? "ml-[32px] mr-0 sm:[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}
    >
      {isModalOpen && (
        <CommonModal
          width={1000}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        >
          <RolesEdit
            rolesData={rolesData}
            searchData={searchData}
            setMode={setModeID}
            mode={modeID}
            isModelOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </CommonModal>
      )}

      {isDeleteModalOpen && (
        <CommonDeleteModal
          setIsModalOpen={setIsDeleteModalOpen}
          handleDelete={handleDelete}
          loading={loading}
          isModalOpen={isDeleteModalOpen}
        >
          <h1 className="text-2xl">Are you sure?</h1>
        </CommonDeleteModal>
      )}

      {isPermissionModalOpen && (
        <Modal
          title="Manage Permissions"
          visible={isPermissionModalOpen}
          onCancel={() => setIsPermissionModalOpen(false)}
          width={800}
          footer={[
            <Button
              key="cancel"
              onClick={() => setIsPermissionModalOpen(false)}
            >
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={handleSavePermissions}
              loading={loading}
            >
              Save
            </Button>,
          ]}
        >
          <Collapse accordion>
            {permissions.map((permission) => (
              <Panel
                header={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{permission.perm_name}</span>
                    <Checkbox
                      onChange={(e) =>
                        handleSelectAllForPermission(
                          permission.id,
                          e.target.checked
                        )
                      }
                      checked={
                        selectedPermissions[permission.id]?.create &&
                        selectedPermissions[permission.id]?.delete &&
                        selectedPermissions[permission.id]?.update &&
                        selectedPermissions[permission.id]?.read &&
                        selectedPermissions[permission.id]?.readOnly
                      }
                    >
                      Select All
                    </Checkbox>
                  </div>
                }
                key={permission.id}
              >
                <div className="permission-group">
                  <div className="permission-actions">
                    <Checkbox
                      checked={selectedPermissions[permission.id]?.create}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.id,
                          "create",
                          e.target.checked
                        )
                      }
                    >
                      Create
                    </Checkbox>
                    <Checkbox
                      checked={selectedPermissions[permission.id]?.delete}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.id,
                          "delete",
                          e.target.checked
                        )
                      }
                    >
                      Delete
                    </Checkbox>
                    <Checkbox
                      checked={selectedPermissions[permission.id]?.update}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.id,
                          "update",
                          e.target.checked
                        )
                      }
                    >
                      Update
                    </Checkbox>
                    <Checkbox
                      checked={selectedPermissions[permission.id]?.read}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.id,
                          "read",
                          e.target.checked
                        )
                      }
                    >
                      Read
                    </Checkbox>
                    <Checkbox
                      checked={selectedPermissions[permission.id]?.readOnly}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.id,
                          "readOnly",
                          e.target.checked
                        )
                      }
                    >
                      Read Only
                    </Checkbox>
                  </div>
                </div>
              </Panel>
            ))}
          </Collapse>
        </Modal>
      )}

      <span className="flex md:flex-row flex-col justify-between items-start md:items-end borde border-rose-700">
        <div className="flex flex-col p-6 md:w-[45vw] w-full">
          <h1 className="text-2xl font-bold pb-4">Roles</h1>
          <div className="flex">
            <Input
              onChange={searchHandler}
              placeholder="Search"
              value={searchText}
              allowClear
              className="drop-shadow-sm py-3 rounded-xl"
            />
          </div>
        </div>
        <span className="flex ml-6 mb-6 md:mr-6">
          <button
            onClick={handleReload}
            className="border border-[#1D9BF0] py-2 px-3 text-[#1D9BF0] rounded mr-4 flex items-center justify-center"
          >
            <ReloadOutlined className="boder boder-red-900" />
          </button>

          <button
            className="px-4 py-2 border border-[#1D9BF0] text-white bg-[#1D9BF0] rounded"
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
        data={rolesData}
        columns={columns}
        setSelection={setRolesSelection}
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

export default RolesList;
