
    import React, { useEffect, useState } from 'react'
    import { Button, Form, Input, InputNumber, Select, Spin, Switch,DatePicker,Divider } from 'antd';
    import styled from 'styled-components';
    import { ButtonStyle, FlexStyle, FormStyle } from '../../components/commons/CommonStyles';
    import assistantsService from './AssistantsService';
    import CommonModal from '../../components/commons/CommonModel';
    import AssistantsPick from './AssistantsPick';
    import dayjs from 'dayjs';
    
    const { Option } = Select;

    const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
    };
    
    const AssistantsEdit = ({setIsModalOpen,isModelOpen,mode,setMode,assistantsData,searchData}) => {
    const [form] = Form.useForm();
    const [switch2,setSwitch2] = useState("")
    const [loading,setLoading] = useState("")
    const [assistantPick,setAssistantPick] = useState(false)


    
    useEffect(()=>{
        const featchData = async()=>{
        try{

            const data = await assistantsService.getAssistant(mode);
            form.setFieldsValue({ assistant: {...data,updatedAt:dayjs(data.updatedAt)} });
            
    
        }catch(err){
        }
        }
        if (mode==''){
        
        } else{
        
        featchData()
        }
    },[])


    const handleReset = () => {
        form.resetFields(); // Reset form fields
    }; 

    const assistantPickHandler=(data)=>{
        console.log('assistantPickHandler',data)
        
        setAssistantPick(false)
        
    }


    const onAdd = async(datas)=>{
        try{

        setLoading(true);

        const data = await assistantsService.createAssistant(datas.assistant)
        setIsModalOpen(false)
        searchData()

        setLoading(false);

        }catch(err){
        setLoading(false);
        }
    } 

    const onUpdate = async(datas)=>{
        
        try{

        setLoading(true);

        const data = await assistantsService.updateAssistant(datas.assistant,mode)
        searchData()
        setIsModalOpen(false)
        setLoading(false);

        }catch(err){
        setLoading(false);
        }
    } 
    

    const onFinish = (values) => {
        mode == ''? onAdd(values):onUpdate(values)
    };
    
    
    
        return (
    <div>
      {/*******  picks **********/}
      {assistantPick ? <CommonModal
        width={700}
        isModalOpen={assistantPick}
        setIsModalOpen={setAssistantPick}
      >
        <AssistantsPick
          setIsModalOpen={setAssistantPick}
          selectHandler={assistantPickHandler}
        />
      </CommonModal> : ""}


      {loading ? <SpinStyle>
        <Spin style={{ color: "#fff" }} size="large" />
      </SpinStyle> : ""}
      <button onClick={() => setAssistantPick(true)}>hhhhhh</button>
      
      
    <FormStyle
        form={form}
        layout="vertical"
        name="nest-messages"
        onFinish={onFinish}
        onError={() => { } }

        validateMessages={validateMessages}
      >
      

    
            <Form.Item
            className=' flex-1'
            name={['assistant', 'profileimage']}
            label="profileimage"
            rules={[
                {
                required: true,
                },
            ]}
            >
            <Input  
            className='border-gray-400 py-2'
            />
            </Form.Item>
            
            <Form.Item
            className=' flex-1'
            name={['assistant', 'experience']}
            label="experience"
            rules={[
                {
                required: true,
                },
            ]}
            >
            <Input  
            className='border-gray-400 py-2'
            />
            </Form.Item>
            
            <Form.Item
            className=' flex-1'
            name={['assistant', 'skills']}
            label="skills"
            rules={[
                {
                required: true,
                },
            ]}
            >
            <Input  
            className='border-gray-400 py-2'
            />
            </Form.Item>
            
            <Form.Item
            className=' flex-1'
            name={['assistant', 'firstname']}
            label="firstname"
            rules={[
                {
                required: true,
                },
            ]}
            >
            <Input  
            className='border-gray-400 py-2'
            />
            </Form.Item>
            
            <Form.Item
            className=' flex-1'
            name={['assistant', 'lastname']}
            label="lastname"
            rules={[
                {
                required: true,
                },
            ]}
            >
            <Input  
            className='border-gray-400 py-2'
            />
            </Form.Item>
            
            <Form.Item
            className=' flex-1'
            name={['assistant', 'resume']}
            label="resume"
            rules={[
                {
                required: true,
                },
            ]}
            >
            <Input  
            className='border-gray-400 py-2'
            />
            </Form.Item>
            
                <Form.Item
            name={['assistant', 'availability']}
            label="availability"
            className=' flex-1'
            rules={[
              {
                required: true,
                message: 'Please select availability!',
              },
            ]}
          >
            <Select
              className='border-gray-400 '
              placeholder="select your availability">
              <Option value="value1">Value1</Option>
              <Option value="value2">Value2</Option>
            </Select>
          </Form.Item>
            
                <Form.Item
            name={['assistant', 'trainingstatus']}
            label="trainingstatus"
            className=' flex-1'
            rules={[
              {
                required: true,
                message: 'Please select trainingstatus!',
              },
            ]}
          >
            <Select
              className='border-gray-400 '
              placeholder="select your trainingstatus">
              <Option value="value1">Value1</Option>
              <Option value="value2">Value2</Option>
            </Select>
          </Form.Item>
            
            <Form.Item
      
            name={['assistant', 'completedjobs']}
            label="completedjobs"
            rules={[
            {
                type: 'number',
                min: 0,
                max: 99,
            },

            ]}
            
            >
            <InputNumber 
            className='border-gray-400 py-1'
            style={{
                minWidth:150
            }} 
            />
            </Form.Item>
                    
                <Form.Item name={['assistant', 'ispassed']} label="ispassed" >
                    <Switch checked={switch2} onChange={(value)=>setSwitch2(value)} style={{background:switch2?'blue':'gray'}} />
                </Form.Item>
            
      
      <ButtonStyle>
          <button onClick={() => setIsModalOpen(false)} >
            cancel
          </button>
          <button type="submit" >
            Submit
          </button>
        </ButtonStyle>
      </FormStyle>
      
    
      </div>
  )
      
      
      
    
   }  
   
   
  const SpinStyle = styled.div`
  /* border: 1px solid; */
  width: 50px;
  height:  50px;
  background-color: rgba(0,0,0,0.2);
  z-index: 100;
  display: flex;
  border-radius:  120px;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 40%;

  .ant-spin-dot .ant-spin-dot-spin {
    background-color: red; 
  }
 


`



export default AssistantsEdit
    