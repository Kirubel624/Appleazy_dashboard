import React, { useEffect, useState } from "react";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import AddAnnouncements from "./AddAnnouncements";
import BlogsCard from "../../components/commons/BlogsCard";
import { Empty, Input, message, Modal, Pagination, Spin } from "antd";
import { IoIosAdd } from "react-icons/io";
import EditAnnouncements from "./EditAnnouncements";
import useDebounce from "../../hooks/useDecounce";
import { useSelector } from "react-redux";
import { ClipLoader, ScaleLoader } from "react-spinners";

const Announcements = ({ collapsed, setCollapsed }) => {
  const api = useAPIPrivate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedAnnouncements, setSelectedAnnouncements] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [searchText, setSearchText] = useState("");
  const { user, accessToken } = useSelector((state) => state.auth);

  const debouncedSearchText = useDebounce(searchText, 500);
  const fetchAnnouncements = async (page = 1, limit = 10, search = "") => {
    try {
      setLoading(true);
      const res = await api.get(
        `/announcement?page=${page}&limit=${limit}&search=${search}`
      );
      console.log(":::", res.data);
      setAnnouncements(res?.data?.announcements);
      setTotalAnnouncements(res?.data?.totalItems);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnnouncements(currentPage, pageSize, debouncedSearchText);
  }, [currentPage, pageSize, debouncedSearchText]);

  const onDelete = async (id) => {
    const res = await api.delete(`/announcement/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(res, "response of delete");
    if (res.status === 200) {
      message.success("Announcements deleted successfully");
      fetchAnnouncements(currentPage, pageSize, searchText);
    } else {
      message.error("Error deleting announcements");
    }
  };
  const onEdit = () => {
    setIsModalVisible(true);
  };
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page); // Update current page
  };
  return (
    <div
      className={`${
        collapsed ? "ml-[32px] mr-0 sm:[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}
    >
      {" "}
      <AddAnnouncements
        fetchAnnouncements={fetchAnnouncements}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
      <Modal
        width={800}
        title="Edit Announcements"
        open={isEditModalVisible}
        // onOk={handleOk}
        footer={null}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <EditAnnouncements
          setSelectedAnnouncements={setSelectedAnnouncements}
          selectedAnnouncements={selectedAnnouncements}
          fetchAnnouncements={fetchAnnouncements}
          setIsEditModalVisible={setIsEditModalVisible}
          isEditModalVisible={isEditModalVisible}
        />
      </Modal>
      <div className="flex items-center w-full justify-between">
        <Input
          onChange={handleSearch}
          placeholder="Search"
          value={searchText}
          allowClear
          // className=""
          style={{ borderRadius: "10px 10px  10px 10px", width: "30rem" }}
          className=" drop-shadow-sm rounded-r mr-4 h-9"
        />
        <button
          className="h-9 whitespace-nowrap flex items-center bg-[#248A53] px-3 rounded-lg text-white mr-3"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          <IoIosAdd className="w-5 mr-2 text-white h-5" /> Add announcements
        </button>
      </div>
      <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 sm:mt-10 mt-6 borde borde-red-900">
        {!loading &&
          (announcements && announcements.length == 0 ? (
            <div
              className={`${
                collapsed ? "ml-[32px] mr-0 sm:[80px]" : "ml-[200px]"
              } flex justify-center items-center transition-all ease-in mt-10 pl-10 mr-10`}
            >
              <Empty />
            </div>
          ) : (
            announcements?.map((data) => (
              <div key={data._id}>
                <BlogsCard
                  blogsItem={data}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  setSelectedBlogs={setSelectedAnnouncements}
                  selectedBlogs={selectedAnnouncements}
                  setIsEditModalVisible={setIsEditModalVisible}
                />
              </div>
            ))
          ))}
      </div>
      <div className="flex justify-end">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalAnnouncements}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={[5, 10, 20, 50]} // Options for items per page
          onShowSizeChange={(current, size) => {
            setPageSize(size);
            setCurrentPage(1); // Reset to first page when page size changes
          }}
          className="mt-4"
        />
      </div>
      <div className="w-full flex items-center justify-center">
        <ScaleLoader
          color="#248A53"
          loading={loading}
          //  cssOverride={override}
          className=" rounded-full"
          size={25}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
};

export default Announcements;
