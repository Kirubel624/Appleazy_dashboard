import { Input, Space, Table, Tag } from "antd";
import React, { useState } from "react";
import CustomModal from "../../utils/CustomModal";
import TrainingEdit from "./TrainingEdit";
// import { createStyles } from "antd-style";
// const useStyle = createStyles(({ css, token }) => {
//   const { antCls } = token;
//   return {
//     customTable: css`
//       ${antCls}-table {
//         ${antCls}-table-container {
//           ${antCls}-table-body,
//           ${antCls}-table-content {
//             scrollbar-width: thin;
//             scrollbar-color: unset;
//           }
//         }
//       }
//     `,
//   };
// });
const TrainingPage = ({ collapsed, setCollapsed }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(true);
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Training Type",
      dataIndex: "trainingType",
      key: "trainingType",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Content",
      dataIndex: "otehr_content",
      key: "otehr_content",
    },
    // {
    //   title: "Tags",
    //   key: "tags",
    //   dataIndex: "tags",
    //   render: (_, { tags }) => (
    //     <>
    //       {tags.map((tag) => {
    //         let color = tag.length > 5 ? "geekblue" : "green";
    //         if (tag === "loser") {
    //           color = "volcano";
    //         }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Update</a>

          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
  ];
  return (
    <div
      className={`${
        collapsed ? "ml-[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}
    >
      <CustomModal
        width={"90%"}
        centered={false}
        setIsModalOpen={setIsEditModalOpen}
        isModalOpen={isEditModalOpen}
        title={"Add Traing"}
      >
        <TrainingEdit />
      </CustomModal>
      <div className=" flex justify-between">
        <div>
          <Input placeholder="search here" />
        </div>
        <div>
          <button className="bg-[#168953]  text-white py-2 px-7 rounded-lg mb-4">
            Add Traing
          </button>
        </div>
      </div>
      <div className="">
        <Table
          scroll={{
            x: "max-content",
          }}
          columns={columns}
          dataSource={data}
        />
      </div>
    </div>
  );
};

export default TrainingPage;
