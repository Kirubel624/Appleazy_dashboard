
    
import React, { useEffect, useState } from 'react'
import { Button, Divider, Dropdown, Form, Input, InputNumber, Select, Spin, Switch,DatePicker } from 'antd';
import styled from 'styled-components';
import { ButtonStyle, FlexStyle, FormStyle } from '../../components/commons/CommonStyles';
import exerciseService from './ExerciseService';
import CommonModal from '../../components/commons/CommonModel';
import ExercisePick from './ExercisePick';
import dayjs from 'dayjs';
import CommonTable from '../../components/commons/CommonTable';
import {
  MoreOutlined,
  ReloadOutlined
} from '@ant-design/icons';

import { NavLink } from 'react-router-dom';
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
    
    
    
    const ExerciseEdit = ({setIsModalOpen,isModelOpen,mode,setMode,exerciseData,searchData}) => {
      const [exerciseData2, setExerciseData2] = useState([])

      const [form] = Form.useForm();
      const [switch2,setSwitch2] = useState("")
      const [loading,setLoading] = useState("")
      const [exercisPick,setExercisPick] = useState(false)


    
    useEffect(()=>{
        const featchData = async()=>{
        try{

            const data = await exerciseService.getExercis(mode);
            form.setFieldsValue({ exercis: {...data,updatedAt:dayjs(data.updatedAt)} });
            
    
        }catch(err){
        }
        }
        if (mode==''){
        
        } else{
        
        featchData()
        }
    },[])


    const handleReset = () => {
        form.resetFields();
    }; 

    const exercisPickHandler=(data)=>{
        console.log('exercisPickHandler',data)
        
        setExercisPick(false)
        
    }


    const onAdd = async(e)=>{
      e.preventDefault();
        try{

        setLoading(true);

        const data = await exerciseService.exerciseDo({method:'add_list_to_exercis',payload:{data:exerciseData2}})
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

        const data = await exerciseService.updateExercis(datas.exercis,mode)
        searchData()
        setIsModalOpen(false)
        setLoading(false);

        }catch(err){
        setLoading(false);
        }
    }
    

    const onFinish = (values) => {
      console.log("===========")
        mode == ''? handleAddToList(values):onUpdate(values)
    };
    const handleAddToList = (e)=>{
      // e.preventDefault()
      setExerciseData2([{...form.getFieldsValue()?.exercis,_id:new Date().getTime()},...exerciseData2])
      handleReset()
    }
    
    
    const onClick = ({ key }, record) => {
      if (key == 'edit') {
        console.log("========",record)

        form.setFieldsValue({exercis:record})
        const data = exerciseData2.filter((exercis)=>exercis._id !== record._id)
        setExerciseData2(data)

      } else if (key === 'delete') {
        console.log("========",record)
          const data = exerciseData2.filter((exercis)=>exercis._id !== record._id)
          setExerciseData2(data)
      }
  };
    const items = [
      {
          key: 'edit',
          label: (
              <Button type="text">Edit</Button>
          ),


      },
      {
          key: 'delete',
          label: (
              <Button type="text"> Delete</Button>
          ),
      },
      {
          key: '3',
          label: (
              <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                  3rd menu item
              </a>
          ),
      },
  ];
  
     const columns = [
         
    
     
            {
                title: 'type',
                dataIndex: 'type',

            },
             
            {
                title: 'question',
                dataIndex: 'question',

            },
             
            {
                title: 'choice',
                dataIndex: 'choice',

            },
             
            {
                title: 'files',
                dataIndex: 'files',

            },
             
            {
                title: 'training_type',
                dataIndex: 'training_type',

            },
             
            {
                title: 'excercise_type',
                dataIndex: 'excercise_type',

            },
            
         
         ];
    
    
  
  
  
    return (
    <div>
      {/*******  picks **********/}
      {exercisPick ? <CommonModal
        width={700}
        isModalOpen={exercisPick}
        setIsModalOpen={setExercisPick}
      >
        <ExercisePick
          setIsModalOpen={setExercisPick}
          selectHandler={exercisPickHandler}
        />
      </CommonModal> : ""}


      {loading ? <SpinStyle>
        <Spin style={{ color: "#fff" }} size="large" />
      </SpinStyle> : ""}
      <button onClick={() => setExercisPick(true)}>hhhhhh</button>
      
      
      
    <FormStyle
        form={form}
        layout="vertical"
        name="nest-messages"
        onFinish={onFinish}
        onError={() => {} }

        validateMessages={validateMessages}
      >
      
      

        
                <Form.Item
            name={['exercis', 'type']}
            label="type"
            className=' flex-1'
            rules={[
              {
                required: true,
                message: 'Please select type!',
              },
            ]}
          >
            <Select
              className='border-gray-400 '
              placeholder="select your type">
              <Option value="value1">Value1</Option>
              <Option value="value2">Value2</Option>
            </Select>
          </Form.Item>
            
            <Form.Item
            className=' flex-1'
            name={['exercis', 'question']}
            label="question"
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
            name={['exercis', 'choice']}
            label="choice"
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
            name={['exercis', 'files']}
            label="files"
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
            name={['exercis', 'training_type']}
            label="training_type"
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
            name={['exercis', 'excercise_type']}
            label="excercise_type"
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
            
      
      
    {exerciseData2.length>0 && <CommonTable
                    rowSelectionType={"checkbox"}
                    data={exerciseData2}
                    columns={columns}
                    total={exerciseData2.lenght}
                    loadding={loading}
                    type={true}

                />}

                <Divider/>
            
      
      <ButtonStyle>
          <button onClick={() => setIsModalOpen(false)} >
            cancel
          </button>

          {mode?<button type='submit'  >
           Submit
          </button>:<button type='submit'  >
            Add List
          </button>}

          {!mode&&<button disabled={exerciseData2.length==0} onClick={onAdd} className={exerciseData2.length>0?"":'disable'} type='submit'  >
            Submit
          </button>}
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



export default ExerciseEdit
    
    