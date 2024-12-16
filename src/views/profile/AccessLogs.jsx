import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  Input,
  Button,
  Alert,
  Tag,
  DatePicker,
  Pagination,
  Modal,
  Radio,
  Dropdown,
  Popover,
  message,
} from "antd";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import { useSearchParams } from "react-router-dom";
import { LuRefreshCcw } from "react-icons/lu";
import { FaGear } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import { IoCalendarClearOutline } from "react-icons/io5";
const { RangePicker } = DatePicker;

const AccessLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const apiPrivate = useAPIPrivate();
  const [searchParams, setSearchParams] = useSearchParams();
  const delayTimerRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedOption, setSelectedOption] = useState("unauthorized");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const showDetails = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };
  // Fetch logs
  const fetchLogs = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiPrivate.get("/logger/db", { params });
      setLogs(response.data || []);
    } catch (err) {
      setError("Error fetching logs");
    } finally {
      setLoading(false);
    }
  };
  const fetchFileLogs = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiPrivate.get("/logger/file", { params });
      setLogs(response.data || []);
    } catch (err) {
      if (err.response.status === 404) {
        setLogs([]);
        setError("No logs found for the specified parameters.");
      } else {
        setError("Error fetching logs");
      }
      // console.log(err, "errorororororoo404040040404");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (selectedOption === "unauthorized") {
      fetchLogs({ limit: 5, page: 1 });
    } else {
      const formattedDate = selectedDate
        ? dayjs(selectedDate).format("YYYY-MM-DD")
        : "";
      fetchFileLogs({ date: formattedDate });
    }
  }, [selectedOption]);

  const handleSearch = () => {
    clearTimeout(delayTimerRef.current);
    delayTimerRef.current = setTimeout(() => {
      if (selectedOption === "unauthorized") {
        fetchLogs({
          search,
          page: 1,
          limit: pageSize,
        });
      } else {
        const formattedDate = selectedDate
          ? dayjs(selectedDate).format("YYYY-MM-DD")
          : "";
        fetchFileLogs({
          date: formattedDate,
          page: 1,
          limit: pageSize,
          search,
        });
      }
    }, 500);
  };

  const handleTableChange = (pagination) => {};

  const handleDateRangeSubmit = () => {
    if (dateRange[0] && dateRange[1]) {
      fetchLogs({
        startDate: dayjs(dateRange[0]).format("YYYY-MM-DD"),
        endDate: dayjs(dateRange[1]).format("YYYY-MM-DD"),
        limit: pageSize,
        offset: 0,
      });
    }
  };

  const columns = [
    {
      dataIndex: "key",
      title: "#",
      render: (text, record, index) => index + 1,
      width: 50,
    },

    {
      title: "Role",
      dataIndex: "userRole",
      key: "role",
      render: (role) => (
        <span className="text-gray-600">
          {role || <Tag color="orange">N/A</Tag>}
        </span>
      ),
    },

    // {
    //   title: "User Agent",
    //   dataIndex: "userAgent",
    //   key: "userAgent",
    //   render: (agent) => (
    //     <span className="text-gray-600 truncate" title={agent}>
    //       {agent || <Tag color="orange">N/A</Tag>}
    //     </span>
    //   ),
    // },
    {
      title: "Status Code",
      dataIndex: "responseStatusCode",
      key: "status",
      render: (status) => (
        <Tag color={status === 200 ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Method",
      dataIndex: "httpMethod",
      key: "method",
      render: (method) => (
        <Tag
          color={
            method === "GET" ? "blue" : method === "POST" ? "green" : "red"
          }>
          {method}
        </Tag>
      ),
    },
    {
      title: "Route",
      dataIndex: "routeAccessed",
      key: "route",
      render: (route) => (
        <span className="text-gray-700 font-medium">{route}</span>
      ),
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      render: (userId) => (
        <span className="text-gray-600">
          {userId || <Tag color="orange">N/A</Tag>}
        </span>
      ),
    },

    // {
    //   title: "Response Time (ms)",
    //   dataIndex: "responseTimeMs",
    //   key: "responseTime",
    //   render: (time) => (
    //     <span className={time > 1000 ? "text-red-500" : "text-green-500"}>
    //       {time || "N/A"}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Auth Status",
    //   dataIndex: "authStatus",
    //   key: "authStatus",
    //   render: (status) => (
    //     <Tag color={status === "authorized" ? "green" : "red"}>{status}</Tag>
    //   ),
    // },
    // {
    //   title: "Error",
    //   dataIndex: "error",
    //   key: "error",
    //   render: (error) => (
    //     <span className="text-red-600">
    //       {error || <Tag color="green">None</Tag>}
    //     </span>
    //   ),
    // },
    {
      title: "IP Address",
      dataIndex: "remoteIp",
      key: "ip",
      render: (ip) => (
        <span className="text-gray-700 font-medium">{ip || "N/A"}</span>
      ),
    },
    // {
    //   title: "Timestamp",
    //   dataIndex: "timestamp",
    //   key: "timestamp",
    //   render: (timestamp) => (
    //     <span className="text-gray-500">
    //       {new Date(timestamp).toLocaleString("en-US", {
    //         month: "short",
    //         day: "2-digit",
    //         year: "numeric",
    //         hour: "2-digit",
    //         minute: "2-digit",
    //         second: "2-digit",
    //         hour12: true,
    //       })}
    //     </span>
    //   ),
    //   width: 250,
    // },
    {
      title: "Details",
      key: "details",
      render: (_, record) => (
        <button
          onClick={() => showDetails(record)}
          className="bg-[#ffffff] border-[1px] border-gray-500 px-3 py-1 rounded">
          View
        </button>
      ),
    },
  ];
  const handlePagination = async (page, pageSize) => {
    setSearchParams({ page: page, limit: pageSize });
    if (selectedOption === "unauthorized") {
      fetchLogs({
        search,
        page,
        limit: pageSize,
      });
    } else {
      fetchFileLogs({
        search,
        page,
        limit: pageSize,
        date: selectedDate.format("YYYY-MM-DD"),
      });
    }
  };
  const onShowSizeChange = (current, pageSize) => {
    // console.log(current, pageSize);
    handlePagination(current, pageSize);
  };
  const handleDateSearch = () => {
    clearTimeout(delayTimerRef.current);
    delayTimerRef.current = setTimeout(() => {
      fetchFileLogs({
        date: selectedDate.format("YYYY-MM-DD"),
        page: 1,
        limit: pageSize,
        search: search,
      });
    }, 500);
    hide();
  };
  const contentCalendar = (
    <div className="flex flex-col">
      <DatePicker
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        className="mb-4"
      />
      <button
        className="bg-[#ffffff] border-[1px] border-gray-500 px-3 py-1 rounded mr-2"
        onClick={handleDateSearch}>
        Submit
      </button>
    </div>
  );
  const contentCalendarRange = (
    <div>
      <RangePicker
        onChange={(dates) => setDateRange(dates)}
        className="w-full"
      />
    </div>
  );
  const items = [
    {
      key: "1",
      label: (
        <div className="p-2">
          <Radio.Group
            onChange={(e) => setSelectedOption(e.target.value)}
            value={selectedOption}
            className="flex flex-col space-y-2">
            <Radio value="unauthorized" className="text-gray-700">
              Unauthorized Logs
            </Radio>
            <Radio value="allLogs" className="text-gray-700">
              All Logs
            </Radio>
          </Radio.Group>
        </div>
      ),
    },
  ];
  const calendar = [];
  return (
    <motion.div
      className="container mx-auto p-6 bg-white shadow-lg rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <Modal
        title="Log Details"
        open={isModalVisible}
        onCancel={closeModal}
        onClose={closeModal}
        footer={null}>
        {selectedRecord && (
          <div className="p-4">
            <p>
              <strong>IP Address:</strong> {selectedRecord.remoteIp || "N/A"}
            </p>
            <p>
              <strong>Origin:</strong> {selectedRecord.origin || "N/A"}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(selectedRecord.timestamp).toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </p>
            <p>
              <strong>Method:</strong> {selectedRecord.httpMethod || "N/A"}
            </p>
            <p>
              <strong>Route Accessed:</strong>{" "}
              {selectedRecord.routeAccessed || "N/A"}
            </p>
            <p>
              <strong>Status Code:</strong> {selectedRecord.responseStatusCode}
            </p>
            <p>
              <strong>Auth Status:</strong> {selectedRecord.authStatus || "N/A"}
            </p>
            <p>
              <strong>User ID:</strong> {selectedRecord.userId || "N/A"}
            </p>
            <p>
              <strong>User Role:</strong> {selectedRecord.userRole || "N/A"}
            </p>
            <p>
              <strong>Session ID:</strong> {selectedRecord.sessionId || "N/A"}
            </p>
            <p>
              <strong>Response Time (ms):</strong>{" "}
              {selectedRecord.responseTimeMs || "N/A"}
            </p>
            <p>
              <strong>User Agent:</strong> {selectedRecord.userAgent || "N/A"}
            </p>
            <p>
              <strong>Query Params:</strong>{" "}
              {JSON.stringify(selectedRecord.queryParams || {})}
            </p>
            <p>
              <strong>Body Payload:</strong>{" "}
              {JSON.stringify(selectedRecord.bodyPayload || {})}
            </p>
            <p>
              <strong>Error:</strong> {selectedRecord.error || "N/A"}
            </p>
          </div>
        )}
      </Modal>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Logs</h2>

      {/* Search Bar */}
      <div className="flex sm:flex-row flex-col sm:items-center justify-between mb-4 sm:space-x-4 w-full">
        <div className="flex items-center w-full">
          {/* change this to a popover */}
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomLeft"
            trigger={["click"]}>
            <div className="p-2 rounded border-[1px] border-gray-500 mr-2 cursor-pointer flex items-center justify-center">
              <FaGear className="tex" />
            </div>
          </Dropdown>
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={handleSearch}
            className="w-full"
          />
        </div>
        <div className="flex items-center sm:mt-0 mt-4">
          <button
            className="bg-[#ffffff] border-[1px] border-gray-500 px-3 py-1 rounded mr-2"
            onClick={handleSearch}>
            Search
          </button>
          <button
            onClick={() => {
              selectedOption === "unauthorized"
                ? fetchLogs({ search, page: 1, limit: 5 })
                : fetchFileLogs({
                    search,
                    date: selectedDate.format("YYYY-MM-DD"),
                    page: 1,
                    limit: 5,
                  });
            }}
            className="bg-white p-2 rounded border-[1px] border-gray-500 mr-2">
            <LuRefreshCcw />
          </button>
          {selectedOption !== "unauthorized" && (
            <Popover
              placement="rightBottom"
              // title={text}
              content={contentCalendar}
              trigger="click"
              open={open}
              onOpenChange={handleOpenChange}
              // arrow={mergedArrow}
            >
              <div className="p-2 border-[1px] border-gray-500 mr-2 cursor-pointer flex items-center rounded justify-center">
                <IoCalendarClearOutline />
              </div>
            </Popover>
          )}
        </div>
      </div>

      {/* <div className="mb-4">
        <RangePicker
          onChange={(dates) => setDateRange(dates)}
          className="w-full"
        />
        <Button
          className="mt-2 bg-[#168A53] px-3 py-1 rounded text-white"
          onClick={handleDateRangeSubmit}
          disabled={!dateRange[0] || !dateRange[1]}>
          Filter by Date
        </Button>
      </div> */}

      {loading && <Alert message="Loading logs..." type="info" showIcon />}
      {error && <Alert message={error} type="error" showIcon />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <Table
          columns={columns}
          dataSource={logs?.logs}
          scroll={{
            x: 900,
          }}
          rowKey={(record) => record.id}
          pagination={false}
          onChange={handleTableChange}
          bordered
        />
        {
          <div className="flex justify-end mt-[40px] mb-[40px] mx-[15px] ">
            <Pagination
              total={logs?.pagination?.total}
              defaultPageSize={5}
              defaultCurrent={1}
              pageSizeOptions={["5", "10", "20"]}
              showSizeChanger={true}
              onChange={onShowSizeChange}
            />
          </div>
        }
      </motion.div>
    </motion.div>
  );
};

export default AccessLogs;
