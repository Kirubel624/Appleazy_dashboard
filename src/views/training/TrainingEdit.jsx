import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Switch,
  DatePicker,
  Divider,
  Upload,
  message,
} from "antd";
import styled from "styled-components";
import {
  ButtonStyle,
  FlexStyle,
  FormStyle,
} from "../../components/commons/CommonStyles";
import trainingService from "./TrainingService";
import CommonModal from "../../components/commons/CommonModel";
import TrainingPick from "./TrainingPick";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";

const { Option } = Select;
const { TextArea } = Input;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const TrainingEdit = ({
  setIsModalOpen,
  isModelOpen,
  mode,
  setMode,
  trainingData,
  searchData,
}) => {
  const [form] = Form.useForm();
  const [switch2, setSwitch2] = useState("");
  const [loading, setLoading] = useState("");
  const [traininPick, setTraininPick] = useState(false);
  const dispatch = useDispatch();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [type, setType] = useState("Video");
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setType(value);
  };

  const beforeUpload = (file) => {
    console.log("file type: ", file.type);
    const isJpgOrPng = file.type.startsWith("image");
    if (!isJpgOrPng) {
      message.error("You can only upload image file!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error("Image must smaller than 10MB!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const beforeUploadVideo = (file) => {
    // console.log("file type: ", file.type);
    // const isJpgOrPng = file.type.startsWith("image");
    // console.log(isJpgOrPng);
    // if (!isJpgOrPng) {
    //   message.error("You can only upload image file!");
    //   return Upload.LIST_IGNORE;
    // }
    // const isLt2M = file.size / 1024 / 1024 < 10;
    // if (!isLt2M) {
    //   message.error("Image must smaller than 10MB!");
    //   return Upload.LIST_IGNORE;
    // }
    return false;
  };

  const beforeUploadDocument = (file) => {
    // console.log("file type: ", file.type);
    // const isJpgOrPng = file.type.startsWith("image");
    // if (!isJpgOrPng) {
    //   message.error("You can only upload image file!");
    //   return Upload.LIST_IGNORE;
    // }
    // const isLt2M = file.size / 1024 / 1024 < 10;
    // if (!isLt2M) {
    //   message.error("Image must smaller than 10MB!");
    //   return Upload.LIST_IGNORE;
    // }
    return false;
  };

  const [fileList, setFileList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [documentList, setDocumentList] = useState([]);

  const onChangeImages = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log(newFileList);
  };
  const onChangeVedios = ({ fileList: newFileList }) => {
    setVideoList(newFileList);
    console.log(newFileList);
  };
  const onChangeDocuments = ({ fileList: newFileList }) => {
    setDocumentList(newFileList);
    console.log(newFileList);
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  useEffect(() => {
    const featchData = async () => {
      try {
        const data = await trainingService.getTrainin(mode);
        form.setFieldsValue({
          ...data,
          updatedAt: dayjs(data.updatedAt),
        });
        const initialimageList =
          data.image &&
          data.image.map((imgUrl, index) => ({
            uid: index, // unique identifier for each file
            name: `image-${index}`, // name for each file
            status: "done", // image is already uploaded, so mark as done
            url: imgUrl, // actual URL of the image
          }));
        const initialVedioList =
          data.video &&
          data.video.map((imgUrl, index) => ({
            uid: index, // unique identifier for each file
            name: `image-${index}`, // name for each file
            status: "done", // image is already uploaded, so mark as done
            url: imgUrl, // actual URL of the image
          }));
        const initialfilesList =
          data.files &&
          data.files.map((imgUrl, index) => ({
            uid: index, // unique identifier for each file
            name: `image-${index}`, // name for each file
            status: "done", // image is already uploaded, so mark as done
            url: imgUrl, // actual URL of the image
          }));
        setFileList(initialimageList || []);
        setVideoList(initialVedioList || []);
        setDocumentList(initialfilesList || []);
      } catch (err) {}
    };
    if (mode == "") {
    } else {
      featchData();
    }
  }, []);

  const handleReset = () => {
    form.resetFields(); // Reset form fields
  };

  const traininPickHandler = (data) => {
    console.log("traininPickHandler", data);

    setTraininPick(false);
  };

  const onAdd = async (datas) => {
    try {
      // e.preventDefault();
      const formData = new FormData();
      formData.append("title", datas.title);
      formData.append("description", datas.description);
      formData.append("trainingType", datas.trainingType);
      formData.append("otehr_content", datas.otehr_content);

      setLoading(true);

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      // Append files for videos
      videoList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("videos", file.originFileObj);
        }
      });

      // Append files for documents
      documentList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("documents", file.originFileObj);
        }
      });

      // Debugging: Log formData keys and values to verify
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // dispatch(getUserGroup());
      // dispatch(createGroup(formData)).then((res) => {
      //   if (res.type == "group/createGroup/fulfilled") {
      //     navigate("/social_media/groupjoined");
      //   }
      //   setLoading(false);
      // });

      const data = await trainingService.createTrainin(formData);
      setIsModalOpen(false);
      searchData();

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const onUpdate = async (datas) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", datas.title);
      formData.append("description", datas.description);
      formData.append("trainingType", datas.trainingType);
      formData.append("otehr_content", datas.otehr_content);

      setLoading(true);

      console.log("imagefile list: ", fileList);

      fileList.forEach((file) => {
        console.log("imagefile: ", file);

        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      // Append files for videos
      videoList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("videos", file.originFileObj);
        }
      });

      // Append files for documents
      documentList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("documents", file.originFileObj);
        }
      });

      const data = await trainingService.updateTrainin(formData, mode);
      searchData();
      setIsModalOpen(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    console.log(values);
    mode == "" ? onAdd(values) : onUpdate(values);
  };

  return (
    <div>
      {/*******  picks **********/}
      {/* {JSON.stringify(fileList)} */}
      {traininPick ? (
        <CommonModal
          width={700}
          isModalOpen={traininPick}
          setIsModalOpen={setTraininPick}
        >
          <TrainingPick
            setIsModalOpen={setTraininPick}
            selectHandler={traininPickHandler}
          />
        </CommonModal>
      ) : (
        ""
      )}

      {loading ? (
        <SpinStyle>
          <Spin style={{ color: "#fff" }} size="large" />
        </SpinStyle>
      ) : (
        ""
      )}
      {/* <button onClick={() => setTraininPick(true)}>hhhhhh</button> */}

      <FormStyle
        form={form}
        layout="vertical"
        name="nest-messages"
        onFinish={onFinish}
        onError={() => {}}
        validateMessages={validateMessages}
      >
        <div className="flex gap-5">
          <Form.Item
            label="Title"
            name="title"
            className="w-full"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Training type"
            name="trainingType"
            className="w-full"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Select
              className="w-full"
              defaultValue="Vedio"
              onChange={handleChange}
              options={[
                {
                  label: "Video",
                  value: "Video",
                },
                {
                  label: "Document",
                  value: "Document",
                },
                {
                  label: "Image",
                  value: "Image",
                },
              ]}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Description "
          name="description"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>
        {/* <Form.Item
          label="Description for image"
          name="otehr_content"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item> */}

        <div className="flex gap-20">
          {type == "Image" && (
            <div className="my-5">
              <p className=" mb-4"> Images</p>
              <Upload
                //   action="http://localhost:5173"
                listType="picture-card"
                fileList={fileList}
                onChange={onChangeImages}
                onPreview={handlePreview}
                action={null}
                beforeUpload={beforeUpload}
              >
                {fileList.length < 1 && "+ Upload"}
              </Upload>

              {previewImage && (
                <Image
                  wrapperStyle={{
                    display: "none",
                  }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </div>
          )}
          {type == "Video" && (
            <div className="my-5">
              <p className=" mb-4"> Videos</p>
              <Upload
                //   action="http://localhost:5173"
                listType="picture-card"
                fileList={videoList}
                onChange={onChangeVedios}
                onPreview={handlePreview}
                action={null}
                beforeUpload={beforeUploadVideo}
              >
                {videoList.length < 1 && "+ Upload"}
              </Upload>
            </div>
          )}

          {type == "Document" && (
            <div className="my-5">
              <p className=" mb-4"> Ducuments</p>
              <Upload
                //   action="http://localhost:5173"
                listType="picture-card"
                fileList={documentList}
                onChange={onChangeDocuments}
                onPreview={handlePreview}
                action={null}
                beforeUpload={beforeUploadDocument}
              >
                {documentList.length < 1 && "+ Upload"}
              </Upload>
            </div>
          )}
        </div>
        <ButtonStyle>
          <button onClick={() => setIsModalOpen(false)}>cancel</button>
          <button type="submit">Submit</button>
        </ButtonStyle>
      </FormStyle>
    </div>
  );
};

const SpinStyle = styled.div`
  /* border: 1px solid; */
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 100;
  display: flex;
  border-radius: 120px;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 40%;

  .ant-spin-dot .ant-spin-dot-spin {
    background-color: red;
  }
`;

export default TrainingEdit;
