import { Avatar } from "antd";
import { format, parseISO } from "date-fns";
import { formatDate } from "../../utils/dateFormatter";
import React from "react";

const formatTimestamp = (timestamp) => {
  const date = parseISO(timestamp);

  return format(date, "h:mm a");
};
const Message2 = ({ chat }) => {
  return (
    <div>
      <div
        className={`flex gap-4 items-center ${
          chat?.isMe && !chat?.isAdmin && "justify-end mr-3"
        }`}
      >
        <div className="flex items-end my-4">
          <>
            {chat?.isAdmin ? (
              <>
                <div className="flex gap-2 mb-">
                  <div className="bg-[#075985] flex items-center justify-center ml-1 mr-1 rounded-full w-8 h-8 text-white">
                    N
                  </div>
                </div>
              </>
            ) : (
              <>
                {!chat?.isMe && (
                  <div className="flex gap-2 mb-">
                    <div className="bg-[#168A53] flex items-center justify-center ml-1 mr-1 rounded-full w-8 h-8 text-white">
                      {chat?.ChatFrom?.name[0]}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
          <div>
            <div
              className={`flex items-end ${
                chat.isMe && !chat.isAdmin ? "justify-end" : ""
              }  `}
            >
              <div className="borde border-red-900">
                {chat.isAdmin ? (
                  <div className="border-[0.1px] border-[#075985] text-white  pl-2 pt-1 pb-2 pr-2  rounded-t-xl rounded-br-xl rounded-bl ">
                    <p className="font-semibold text-[#075985]">
                      {" "}
                      Natnael (Founder)
                    </p>
                    <div className="flex items- justify-between items-end gap-4 bordr border-red-900">
                      <p className={` max-w-[400px] mb- text-black`}>
                        {chat.message}
                      </p>
                      <div className={`${"flex justify-end text-end   "} `}>
                        <p className="text-end text-xs ml-3 mb-[-4px]  text-[#BBBBBB]">
                          {formatTimestamp(chat?.createdAt)}
                        </p>
                      </div>
                    </div>{" "}
                  </div>
                ) : (
                  <div
                    className={`border max-w-[400px] mb-  border-[#168A53]
                px-4 py-2 rounded-xl ${
                  chat?.isMe
                    ? "bg-[#168A53] text-white rounded-t-xl rounded-bl-xl rounded-br"
                    : "text-[#168A53]  rounded-t-xl rounded-br-xl rounded-bl"
                }`}
                  >
                    <div className="flex items- justify-between items-end gap-4 bordr border-red-900">
                      <div>
                        {chat?.isMe || chat?.isAdmin ? (
                          <>
                            <p className="font-black">{chat?.ChatFrom?.name}</p>

                            <p>{chat.message}</p>
                          </>
                        ) : (
                          <>
                            <p className="font-semibold">
                              {chat?.ChatFrom?.name}
                            </p>
                            <p>{chat.message}</p>
                          </>
                        )}
                      </div>
                      <div
                        className={`${
                          chat?.isMe && !chat?.isAdmin && "flex justify-end"
                        } `}
                      >
                        <div className={`${"flex justify-end text-end   "} `}>
                          <p className="text-end text-xs ml-3 mb-[-4px]  text-[#dadada]">
                            {formatTimestamp(chat?.createdAt)}
                          </p>
                        </div>
                      </div>{" "}
                    </div>
                  </div>
                )}
              </div>

              {chat.isMe && !chat.isAdmin && (
                <div className="bg-[#168A53] flex items-center justify-center ml-1 rounded-full w-8 h-8 text-white">
                  {chat?.ChatFrom?.name[0]}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const groupMessagesByDate = (messages) => {
  const groupedMessages = [];

  let currentDate = null;
  let currentGroup = [];

  console.log("0000::", messages);
  messages?.forEach((message) => {
    const messageDate = new Date(message.createdAt);
    const formattedDate = format(messageDate, "MMM dd, yyyy");

    if (formattedDate !== currentDate) {
      if (currentGroup.length > 0) {
        groupedMessages.push({ date: currentDate, messages: currentGroup });
      }

      currentDate = formattedDate;
      currentGroup = [message];
    } else {
      currentGroup.push(message);
    }
  });

  if (currentGroup.length > 0) {
    groupedMessages.push({ date: currentDate, messages: currentGroup });
  }

  return groupedMessages;
};

const Message = ({ chats }) => {
  console.log("++++++))::", chats);
  const groupedMessages = groupMessagesByDate(chats);

  return (
    <div>
      {groupedMessages.map((group) => (
        <div key={group.date}>
          <div className="date-header flex items-center justify-center text-center my-4  inline- text-white">
            {/* Show date header */}
            <p className="bg-gray-200 px-4 py-[0.1rem] text-gray-600 rounded-full">
              {group.date}
            </p>
          </div>
          {group.messages.map((chat) => (
            <Message2 key={chat.id} chat={chat} />
          ))}
        </div>
      ))}
    </div>
  );
};

// const Message = ({ chat }) => {
//   console.log("chatach:::", chat);
//   return (
//     <div>
//       <div className={`flex gap-4 items-center ${chat?.isMe && "justify-end"}`}>
//         <div className="my-4">
//           <>
//             {chat?.isAdmin ? (
//               <>
//                 <div className="flex gap-2 mb-1">
//                   <Avatar size={20} style={{ backgroundColor: "#075985" }}>
//                     N
//                   </Avatar>{" "}
//                   <p> Natnael (Founder)</p>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="flex gap-2 mb-1">
//                   <Avatar size={20} style={{ backgroundColor: "#168A53" }}>
//                     {chat?.ChatFrom?.name[0]}
//                   </Avatar>{" "}
//                   <p>{chat?.ChatFrom?.name}</p>
//                 </div>
//               </>
//             )}
//           </>
//           <p
//             className={`border max-w-[400px] mb-2  border-[#168A53]  px-4 py-2 rounded-xl ${
//               chat?.isAdmin
//                 ? "bg-[#075985] text-white"
//                 : chat?.isMe
//                 ? "bg-[#168A53] text-white"
//                 : "text-[#168A53]"
//             }`}
//           >
//             {chat.message}
//           </p>
//           <div
//             className={`${chat?.isMe && !chat?.isAdmin && "flex justify-end"} `}
//           >
//             <p>{formatDate(chat?.createdAt)}</p>
//           </div>{" "}
//         </div>
//       </div>
//     </div>
//   );
// };

export default Message;
