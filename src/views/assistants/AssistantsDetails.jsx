import { Divider, Input, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../../utils/api";

const choice = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
};
const AssistantsDetail = ({ collapsed }) => {
  const { state } = useLocation();
  const [excersice, setExcersice] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    featchANnswers();
    // featchExcersice();
  }, []);
  const featchANnswers = async () => {
    // alert("ppp");
    try {
      let url = `/api/v1/assistant/getExercisesByTypeWithAssistantAnswers/${id}/${"one"}`;
      const res = await api.get(url);
      setExcersice(res.data.data);
      console.log("answer: 11111111111111111: : ", res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      className={`${
        collapsed ? "ml-[80px]" : "ml-[200px]"
      } transition-all ease-in mt-10 pl-10 mr-10`}
    >
      <DetailStyle>
        <h1>User Detail</h1>
        <Divider style={{ margin: "15px 0 25px 0" }} />
        <div className=" mr-10 bg-white p-6 rounded-2xl">
          {excersice.map(
            (exc, i) =>
              exc?.type == "choice" && (
                <div key={i}>
                  <p className="text-lg my-5">
                    {i + 1}. {exc?.question}
                  </p>
                  <div>
                    <Radio.Group
                      defaultValue={exc?.assistantAnswer}
                      className=" max-w-[700px]  flex justify-around  flex-wrap "
                      onChange={(e) => onChange(e, exc.id)}
                      // value={value}
                    >
                      {exc?.choice.split("*+*").map(
                        (c, i2) =>
                          c && (
                            <Radio disabled={true} value={choice[i2]}>
                              {choice[i2]}. {c}
                            </Radio>
                          )
                      )}
                    </Radio.Group>
                  </div>
                </div>
              )
          )}
        </div>
        <div className=" mr-10 mt-10 bg-white p-6 rounded-2xl">
          <p className="mt-10 mb-5 text-xl">Test 2</p>
          {excersice.map(
            (exc, i) =>
              exc?.type != "choice" && (
                <div key={i}>
                  <p className="text-lg my-5">
                    {i + 1}. {exc?.question}
                  </p>
                  <div className="my-5">
                    <p className=" mb-4"> Answer</p>
                    <div className="flex gap-5">
                      <Input.TextArea
                        defaultValue={exc?.assistantDescAnswer}
                        disabled={true}
                        rows={5}
                        onChange={(e) => {
                          const x = ans2.filter((a) => a.exerciceId == exc.id);
                          console.log("pppxxx", x);
                          const y = ans.map((a) => {
                            if (a.exerciceId == id) {
                              return { ...a, description: e.target.value };
                            } else {
                              return a;
                            }
                          });

                          console.log("x,y", x, y);
                          if (x.length > 0) {
                            setAns2(y);
                          } else {
                            console.log("array: ", [
                              ...ans2,
                              {
                                exerciceId: exc.id,
                                description: e.target.value,
                              },
                            ]);
                            setAns2([
                              ...ans2,
                              {
                                exerciceId: exc.id,
                                description: e.target.value,
                              },
                            ]);
                          }
                          console.log("radio checked", ans2);
                        }}
                      />
                      {/* <Upload
                      //   action="http://localhost:5173"
                      listType="picture-card"
                      fileList={documentList}
                      onChange={(info) => onChangeDocuments(info, exc?.id)}
                      onPreview={handlePreview}
                      action={null}
                      beforeUpload={beforeUploadDocument}
                    >
                      {documentList.length < 1 && "+ Upload"}
                    </Upload> */}
                    </div>
                  </div>{" "}
                </div>
              )
          )}
        </div>
        {/*     
                <div className='detail_child'>
                <p className='detail_key'>profileimage:</p>
                <p className='detail_value'>{state?.profileimage}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>experience:</p>
                <p className='detail_value'>{state?.experience}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>skills:</p>
                <p className='detail_value'>{state?.skills}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>firstname:</p>
                <p className='detail_value'>{state?.firstname}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>lastname:</p>
                <p className='detail_value'>{state?.lastname}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>resume:</p>
                <p className='detail_value'>{state?.resume}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>availability:</p>
                <p className='detail_value'>{state?.availability}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>trainingstatus:</p>
                <p className='detail_value'>{state?.trainingstatus}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>completedjobs:</p>
                <p className='detail_value'>{state?.completedjobs}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>ispassed:</p>
                <p className='detail_value'>{state?.ispassed?'true':'false'}</p>  
            </div>
             */}
      </DetailStyle>
    </div>
  );
};

const DetailStyle = styled.div`
  border: 1px lightgray;
  margin: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  h1 {
    padding: 0;
    margin: 0;
    font-size: 16px;
  }
  .detail_child {
    margin-bottom: 15px;
  }
  .detail_key {
    font-size: 20px;
    font-weight: bold;
  }
  .detail_value {
    color: #106085;
    font-size: 20px;
  }
`;

export default AssistantsDetail;
