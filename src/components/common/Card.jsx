import React, { useEffect, useState } from "react";

const Card = ({ statusname, statusamount, logo }) => {
  return (
    <div className={` border-2  w-[370px] mx-5 my-8 rounded shadow-2xl`}>
      <p className="border-b p-2 text-xl">Job1</p>
      <div className={`flex justify-start items-center`}>
        <div className="p-2 text-lg flex flex-col items-start justify-start borer borer-red-900">
          <p className="py-2 text-[#435677]"> Client name: {" Marshal"}</p>
          <p className=" py-2 text-[#435677] font-medium text-xl">
            No of Application: {statusamount}
          </p>
          <p className=" py-2 text-[#435677] font-medium text-xl">
            Time: in 3 days
          </p>
          <div className="mt-4 flex  justify-between w-[350px]">
            <button className="bg-sky-600 text-white py-1 px-5 rounded">
              More
            </button>
            <button className="bg-slate-800 text-white py-1 px-5 rounded">
              Dashboard
            </button>
            <button className="bg-[#168A53] text-white py-1 px-5 rounded">
              Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
