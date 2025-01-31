import { Image, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

const AnnouncementsDetail = () => {
  const [announcements, setAnnouncements] = useState();
  const location = useLocation();
  useEffect(() => {
    setAnnouncements(location.state);
  }, [location]);
  return (
    <div
      className={`${
        collapsed ? "ml-[32px] mr-0 sm:[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}
    >
      {" "}
      <div class="relative overflow-hidden rounded-xl mb-8">
        <div class="relative overflow-hidden rounded-xl">
          <div className="image-container">
            <Image
              height={250}
              className="object-cover"
              src={announcements?.image}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col"></div>
      <div className="flex items-center justify-between">
        <p class="mt- mb-8 text-gray-600 ext-gray-300">
          {announcements?.author?.fullName}
        </p>
        <p class="mt- mb-8 text-gray-600 ext-gray-300">
          {dayjs(announcements?.createdAt).format("ddd MMMM DD YYYY")}
        </p>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        {announcements?.title}
      </h2>
      <div
        className="text-gray-600 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: announcements?.content }}
      />
    </div>
  );
};

export default AnnouncementsDetail;
