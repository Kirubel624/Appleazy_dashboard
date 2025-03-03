import React, { useEffect, useState } from "react";

const StatCard = ({
  statusname,
  statusamount,
  logo,
  logobg,
  className,
  bgColor = "bg-white",
  cardStyle = `py-6 px-6  `,
}) => {
  const [logoBg, setLogoBg] = useState("bg-white");
  useEffect(() => {
    if (logoBg === "blue") {
      setLogoBg("bg-[#E7EDFF]");
    }
  }, [logobg]);
  return (
    <div
      className={`${bgColor} rounded-lg flex justify-between  border-green-500 lg:inline-block ${className}`}>
      <div className={`flex justify-between items-start w-full ${cardStyle}`}>
        <div className="flex flex-col items-start justify-start  border-red-900">
          <p className="font-medium text-2xl">{statusamount}</p>
          <p className="text-[#718EBF]">{statusname}</p>
        </div>
        {logo}
      </div>
    </div>
  );
};

export default StatCard;
