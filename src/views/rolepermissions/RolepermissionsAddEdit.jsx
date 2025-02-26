
    
import React, { useEffect, useState } from 'react'
import { Button, Divider, Dropdown, Form, Input, InputNumber, Select, Spin, Switch,DatePicker } from 'antd';
import styled from 'styled-components';
import { ButtonStyle, FlexStyle, FormStyle } from '../../components/commons/CommonStyles';
import rolepermissionsService from './RolepermissionsService';
import CommonModal from '../../components/commons/CommonModel';
import RolepermissionsPick from './RolepermissionsPick';
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
    
    
    
    const RolepermissionsEdit = ({setIsModalOpen,isModelOpen,mode,setMode,rolepermissionsData,searchData}) => {
      const [rolepermissionsData2, setRolepermissionsData2] = useState([])

      const [form] = Form.useForm();
      const [switch2,setSwitch2] = useState("")
      const [loading,setLoading] = useState("")
      const [rolepermissionPick,setRolepermissionPick] = useState(false)


    
    useEffect(()=>{
        const featchData = async()=>{
        try{

            const data = await rolepermissionsService.getRolepermission(mode);
            form.setFieldsValue({ rolepermission: {...data,updatedAt:dayjs(data.updatedAt)} });
            
    
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

    const rolepermissionPickHandler=(data)=>{
        console.log('rolepermissionPickHandler',data)
        
        setRolepermissionPick(false)
        
    }


    const onAdd = async(e)=>{
      e.preventDefault();
        try{

        setLoading(true);

        const data = await rolepermissionsService.rolepermissionsDo({method:'add_list_to_rolepermission',payload:{data:rolepermissionsData2}})
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

        const data = await rolepermissionsService.updateRolepermission(datas.rolepermission,mode)
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
      setRolepermissionsData2([{...form.getFieldsValue()?.rolepermission,_id:new Date().getTime()},...rolepermissionsData2])
      handleReset()
    }
    
    
    const onClick = ({ key }, record) => {
      if (key == 'edit') {
        console.log("========",record)

        form.setFieldsValue({rolepermission:record})
        const data = rolepermissionsData2.filter((rolepermission)=>rolepermission._id !== record._id)
        setRolepermissionsData2(data)

      } else if (key === 'delete') {
        console.log("========",record)
          const data = rolepermissionsData2.filter((rolepermission)=>rolepermission._id !== record._id)
          setRolepermissionsData2(data)
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
                title: 'role',
                dataIndex: 'role',

            },
             
            {
                title: 'permission',
                dataIndex: 'permission',

            },
             
            {
                title: 'create',
                dataIndex: 'create',
                render: (text, recored) => {
                    return recored.create ? <p>true</p> : <p>false</p>
                },
            },
             
            {
                title: 'read',
                dataIndex: 'read',
                render: (text, recored) => {
                    return recored.read ? <p>true</p> : <p>false</p>
                },
            },
             
            {
                title: 'update',
                dataIndex: 'update',
                render: (text, recored) => {
                    return recored.update ? <p>true</p> : <p>false</p>
                },
            },
             
            {
                title: 'delete',
                dataIndex: 'delete',
                render: (text, recored) => {
                    return recored.delete ? <p>true</p> : <p>false</p>
                },
            },
             
            {
                title: 'date',
                dataIndex: 'date',

            },
            
         
         ];
    
    
  
  
  
    return (
    <div>
      {/*******  picks **********/}
      {rolepermissionPick ? <CommonModal
        width={700}
        isModalOpen={rolepermissionPick}
        setIsModalOpen={setRolepermissionPick}
      >
        <RolepermissionsPick
          setIsModalOpen={setRolepermissionPick}
          selectHandler={rolepermissionPickHandler}
        />
      </CommonModal> : ""}


      {loading ? <SpinStyle>
        <Spin style={{ color: "#fff" }} size="large" />
      </SpinStyle> : ""}
      <button onClick={() => setRolepermissionPick(true)}>hhhhhh</button>
      
      
      
    <FormStyle
        form={form}
        layout="vertical"
        name="nest-messages"
        onFinish={onFinish}
        onError={() => {} }

        validateMessages={validateMessages}
      >
      
      

        
            <Form.Item
            className=' flex-1'
            name={['rolepermission', 'role']}
            label="role"
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
            name={['rolepermission', 'permission']}
            label="permission"
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
            
                <Form.Item name={['rolepermission', 'create']} label="create" >
                    <Switch checked={switch2} onChange={(value)=>setSwitch2(value)} style={{background:switch2?'blue':'gray'}} />
                </Form.Item>
            
                <Form.Item name={['rolepermission', 'read']} label="read" >
                    <Switch checked={switch2} onChange={(value)=>setSwitch2(value)} style={{background:switch2?'blue':'gray'}} />
                </Form.Item>
            
                <Form.Item name={['rolepermission', 'update']} label="update" >
                    <Switch checked={switch2} onChange={(value)=>setSwitch2(value)} style={{background:switch2?'blue':'gray'}} />
                </Form.Item>
            
                <Form.Item name={['rolepermission', 'delete']} label="delete" >
                    <Switch checked={switch2} onChange={(value)=>setSwitch2(value)} style={{background:switch2?'blue':'gray'}} />
                </Form.Item>
            
                <Form.Item name={['rolepermission', 'date']}  label="date">
            <DatePicker format={'YYYY/MM/DD'} />
        </Form.Item>
            
      
      
    {rolepermissionsData2.length>0 && <CommonTable
                    rowSelectionType={"checkbox"}
                    data={rolepermissionsData2}
                    columns={columns}
                    total={rolepermissionsData2.lenght}
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

          {!mode&&<button disabled={rolepermissionsData2.length==0} onClick={onAdd} className={rolepermissionsData2.length>0?"":'disable'} type='submit'  >
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



export default RolepermissionsEdit
    
    