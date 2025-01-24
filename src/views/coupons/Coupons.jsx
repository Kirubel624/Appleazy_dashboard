import React, { useEffect, useState } from "react";
import CouponCard from "../../components/commons/CouponCard";
import { Input, message, Modal } from "antd";
import useAPIPrivate from "../../hooks/useAPIPrivate";
import AddEditCoupons from "./AddEditCoupons";
import { IoIosAdd } from "react-icons/io";

const Coupons = ({ collapsed, setCollapsed }) => {
  const apiPrivate = useAPIPrivate();
  const [coupons, setCoupons] = useState([]);
  const [visible, setVisible] = useState(false);
  // const [del;, setVisible] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState();

  const fetchCoupons = async () => {
    const res = await apiPrivate.get("/coupon");
    console.log(res, "repons of get ocupons");
    setCoupons(res?.data);
  };
  useEffect(() => {
    fetchCoupons();
  }, []);
  useEffect(() => {
    console.log(selectedCoupon, "selected changed");
  }, [selectedCoupon]);
  const onDelete = async (couponId) => {
    console.log(selectedCoupon, "selected deleted");
    if (couponId) {
      const res = await apiPrivate.delete(`coupon/${couponId}`);
      console.log(res, "response of delete coupon");
      if (res?.status === 204) {
        message.success("Coupon deleted successfully");
        fetchCoupons();
      }
    } else {
      console.log("no id");
    }
  };
  const showConfirm = (couponId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this coupon?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await onDelete(couponId);
          console.log("Deleted successfully");
        } catch (error) {
          console.error("Failed to delete:", error);
        }
      },
      onCancel: () => {
        // console.log("Deletion cancelled");
      },
    });
  };
  return (
    <div
      className={`${
        collapsed ? "ml-[32px] mr-0 sm:[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}>
      {/* <Modal */}
      <AddEditCoupons
        setSelectedCoupon={setSelectedCoupon}
        data={selectedCoupon}
        visible={visible}
        setVisible={setVisible}
        fetchCoupons={fetchCoupons}
      />
      <div className="flex flex-col p-6  w-full">
        <h1 className="text-2xl font-bold pb-4">Coupons</h1>
        <div className="flex items-center justify-between w-full">
          <Input
            // onChange={searchHandler}
            placeholder="Search"
            // value={searchText}
            allowClear
            style={{ borderRadius: "10px 10px  10px 10px", width: "30rem" }}
            className=" drop-shadow-sm rounded-r mr-4 h-9"
          />
          <button
            className="h-9 whitespace-nowrap flex items-center bg-[#248A53] px-3 rounded-lg text-white mr-3"
            onClick={() => {
              setVisible(true);
            }}>
            <IoIosAdd className="w-5 mr-2 text-white h-5" /> Add coupon
          </button>
        </div>
      </div>
      <div
        className="grid lg:grid-cols-3
             md:grid-cols-2 border- border-red-900 gap-4 w-full p-6">
        {coupons?.map((coupon) => (
          <CouponCard
            coupon={coupon}
            setSelectedCoupon={setSelectedCoupon}
            setVisible={setVisible}
            showConfirm={showConfirm}
          />
        ))}
      </div>
    </div>
  );
};

export default Coupons;
