
    
import React, { useEffect, useState } from 'react'
import { Button, Divider, Dropdown, Form, Input, InputNumber, Select, Spin, Switch,DatePicker } from 'antd';
import styled from 'styled-components';
import { ButtonStyle, FlexStyle, FormStyle } from '../../components/commons/CommonStyles';
import group_usersService from './Group_usersService';
import CommonModal from '../../components/commons/CommonModel';
import Group_usersPick from './Group_usersPick';
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
    
    
    
    const Group_usersEdit = ({setIsModalOpen,isModelOpen,mode,setMode,group_usersData,searchData}) => {
      const [group_usersData2, setGroup_usersData2] = useState([])

      const [form] = Form.useForm();
      const [switch2,setSwitch2] = useState("")
      const [loading,setLoading] = useState("")
      const [group_userPick,setGroup_userPick] = useState(false)


    
    useEffect(()=>{
        const featchData = async()=>{
        try{

            const data = await group_usersService.getGroup_user(mode);
            form.setFieldsValue({ group_user: {...data,updatedAt:dayjs(data.updatedAt)} });
            
    
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

    const group_userPickHandler=(data)=>{
        console.log('group_userPickHandler',data)
        
        setGroup_userPick(false)
        
    }


    const onAdd = async(e)=>{
      e.preventDefault();
        try{

        setLoading(true);

        const data = await group_usersService.group_usersDo({method:'add_list_to_group_user',payload:{data:group_usersData2}})
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

        const data = await group_usersService.updateGroup_user(datas.group_user,mode)
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
      setGroup_usersData2([{...form.getFieldsValue()?.group_user,_id:new Date().getTime()},...group_usersData2])
      handleReset()
    }
    
    
    const onClick = ({ key }, record) => {
      if (key == 'edit') {
        console.log("========",record)

        form.setFieldsValue({group_user:record})
        const data = group_usersData2.filter((group_user)=>group_user._id !== record._id)
        setGroup_usersData2(data)

      } else if (key === 'delete') {
        console.log("========",record)
          const data = group_usersData2.filter((group_user)=>group_user._id !== record._id)
          setGroup_usersData2(data)
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
                title: 'fullname',
                dataIndex: 'fullname',

            },
             
            {
                title: 'username',
                dataIndex: 'username',

            },
             
            {
                title: 'email',
                dataIndex: 'email',

            },
             
            {
                title: 'issystemadmin',
                dataIndex: 'issystemadmin',
                render: (text, recored) => {
                    return recored.issystemadmin ? <p>true</p> : <p>false</p>
                },
            },
            
         
         ];
    
    
  
  
  
    return (
    <div>
      {/*******  picks **********/}
      {group_userPick ? <CommonModal
        width={700}
        isModalOpen={group_userPick}
        setIsModalOpen={setGroup_userPick}
      >
        <Group_usersPick
          setIsModalOpen={setGroup_userPick}
          selectHandler={group_userPickHandler}
        />
      </CommonModal> : ""}


      {loading ? <SpinStyle>
        <Spin style={{ color: "#fff" }} size="large" />
      </SpinStyle> : ""}
      <button onClick={() => setGroup_userPick(true)}>hhhhhh</button>
      
      
      
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
            name={['group_user', 'fullname']}
            label="fullname"
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
            name={['group_user', 'username']}
            label="username"
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
            name={['group_user', 'email']}
            label="email"
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
            
                <Form.Item name={['group_user', 'issystemadmin']} label="issystemadmin" >
                    <Switch checked={switch2} onChange={(value)=>setSwitch2(value)} style={{background:switch2?'blue':'gray'}} />
                </Form.Item>
            
      
      
    {group_usersData2.length>0 && <CommonTable
                    rowSelectionType={"checkbox"}
                    data={group_usersData2}
                    columns={columns}
                    total={group_usersData2.lenght}
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

          {!mode&&<button disabled={group_usersData2.length==0} onClick={onAdd} className={group_usersData2.length>0?"":'disable'} type='submit'  >
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



export default Group_usersEdit
    
    