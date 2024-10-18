import { Table } from "antd";
import React from "react";
import Card from "../../components/common/Card";
import { FileExcelOutlined } from "@ant-design/icons";
import { FaFileAlt } from "react-icons/fa";
import { GiCardExchange } from "react-icons/gi";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
const Home = ({ collapsed, setCollapsed }) => {
  return (
    <div
      className={`${
        collapsed ? "ml-[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10`}
    >
      {/* <p></p> */}
      <h1 className="font-medium font-sans text-2xl pb-6">Home</h1>
      <div className="flex flex-wrap">
        <Card statusname="No of applications" statusamount="200" />
        <Card statusname="Response rate" statusamount="80%" />
        <Card statusname="Response rate" statusamount="80%" />
        <Card statusname="Response rate" statusamount="80%" />
        <Card statusname="Response rate" statusamount="80%" />
        <Card statusname="Response rate" statusamount="80%" />
        <Card statusname="Response rate" statusamount="80%" />

        {/* <Card
          statusname="Interview rate"
          statusamount="60%"
          logo={
            <div className=" bg-[#8efeca] p-4 rounded-full mr-3">
              <IoMdPerson className="w-7 h-7" />
            </div>
          }
          logobg=""
          className=""
          cardStyle="py-6 px-6 "
        />
        <Card
          statusname="Offer rate"
          statusamount="20%"
          logo={
            <div className=" bg-[#8efeca] p-4 rounded-full mr-3">
              <MdAttachMoney className="w-7 h-7" />
            </div>
          }
          logobg=""
          className=""
          cardStyle="py-6 px-6 "
        /> */}
      </div>
    </div>
  );
};

export default Home;
